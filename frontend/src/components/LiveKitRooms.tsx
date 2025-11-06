// frontend/src/components/LiveKitRooms.tsx
import React, { useState, useEffect } from 'react';
import aiService, { Room } from '../services/aiService';

const LiveKitRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const roomList = await aiService.getRooms();
      setRooms(roomList);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      alert('Digite um nome para a sala');
      return;
    }

    setLoading(true);
    try {
      await aiService.createRoom(newRoomName);
      setNewRoomName('');
      await loadRooms();
      alert('Sala criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      alert('Erro ao criar sala');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomName: string) => {
    setLoading(true);
    try {
      const userName = localStorage.getItem('username') || 'Usuário';
      const { token, url } = await aiService.getRoomToken(roomName, userName);
      
      console.log('Token:', token);
      console.log('URL:', url);
      
      setJoinedRoom(roomName);
      alert(`Conectado à sala ${roomName}!\nToken: ${token.substring(0, 20)}...`);
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      alert('Erro ao entrar na sala');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🎧 Audio Rooms</h1>
        <p className="opacity-90">Salas de voz em tempo real com LiveKit</p>
      </div>

      {/* Create Room */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">➕ Criar Nova Sala</h2>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Nome da sala (ex: Desenvolvimento, Games, Música)"
          />
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
          >
            Criar
          </button>
        </div>
      </div>

      {/* Rooms List */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">🎙️ Salas Ativas</h2>
          <button
            onClick={loadRooms}
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            🔄 Atualizar
          </button>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">Nenhuma sala ativa</p>
            <p className="text-sm">Crie uma sala para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 transition-all ${
                  joinedRoom === room.name
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {room.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      👥 {room.participants} participantes
                    </p>
                  </div>
                  {room.active !== false && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Ativa
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleJoinRoom(room.name)}
                  disabled={loading || joinedRoom === room.name}
                  className={`w-full py-2 rounded-lg font-semibold transition ${
                    joinedRoom === room.name
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } disabled:opacity-50`}
                >
                  {joinedRoom === room.name ? '✓ Conectado' : '🎧 Entrar'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Room Info */}
      {joinedRoom && (
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border-l-4 border-green-500">
          <h3 className="font-bold text-lg text-gray-800 mb-2">
            🎙️ Você está em: {joinedRoom}
          </h3>
          <p className="text-gray-600 mb-4">
            Sala de voz ativa. Use o microfone para conversar.
          </p>
          <button
            onClick={() => setJoinedRoom(null)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
          >
            Sair da Sala
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveKitRooms;
