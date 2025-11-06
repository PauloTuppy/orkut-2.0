import { useState } from 'react';
import { Mic, MicOff, PhoneOff, Hand, Plus, Search, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import VoiceAgent from '../components/VoiceAgent';

interface AudioRoom {
  id: string;
  title: string;
  description: string;
  speakers: Array<{
    id: string;
    name: string;
    avatar: string;
    isSpeaking: boolean;
  }>;
  listeners: number;
  category: string;
  joined: boolean;
}

const ROOMS: AudioRoom[] = [
  {
    id: '1',
    title: 'Desenvolvimento com IA',
    description: 'Discussão sobre como usar IA no desenvolvimento de software',
    speakers: [
      { id: '1', name: 'João', avatar: '👤', isSpeaking: true },
      { id: '2', name: 'Maria', avatar: '👩', isSpeaking: false }
    ],
    listeners: 48,
    category: 'Tech',
    joined: true
  },
  {
    id: '2',
    title: 'Música Brasileira',
    description: 'Conversa sobre os novos artistas da música brasileira',
    speakers: [{ id: '3', name: 'Ana', avatar: '👧', isSpeaking: true }],
    listeners: 23,
    category: 'Música',
    joined: false
  },
  {
    id: '3',
    title: 'Futebol ao Vivo',
    description: 'Discussão do jogo de hoje',
    speakers: [
      { id: '4', name: 'Carlos', avatar: '👨', isSpeaking: true },
      { id: '5', name: 'Pedro', avatar: '👨', isSpeaking: true }
    ],
    listeners: 156,
    category: 'Esportes',
    joined: false
  }
];

export default function AudioRooms() {
  const [rooms] = useState(ROOMS);
  const [activeRoom, setActiveRoom] = useState<AudioRoom | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [activeAgent, setActiveAgent] = useState<'sales' | 'technical' | 'pricing' | null>(null);

  return (
    <div>
      {!activeRoom ? (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                🎙️ Salas de Áudio
              </h1>
              <button className="bg-orkut-blue text-white px-6 py-2 rounded-lg hover:bg-orkut-blue-dark transition flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Criar Sala</span>
              </button>
            </div>

            {/* Voice AI Agents Section */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 mb-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🤖 Voice AI Agents</h2>
              <p className="mb-4 opacity-90">
                Talk to our AI agents powered by Cerebras + Cartesia + LiveKit
              </p>

              {activeAgent ? (
                <VoiceAgent 
                  agentType={activeAgent} 
                  onClose={() => setActiveAgent(null)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveAgent('sales')}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition text-left"
                  >
                    <div className="text-3xl mb-2">🎤</div>
                    <h3 className="font-bold mb-1">Sales Agent</h3>
                    <p className="text-sm opacity-90">Learn about features & pricing</p>
                  </button>
                  <button
                    onClick={() => setActiveAgent('technical')}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition text-left"
                  >
                    <div className="text-3xl mb-2">🔧</div>
                    <h3 className="font-bold mb-1">Technical Support</h3>
                    <p className="text-sm opacity-90">Get help with technical questions</p>
                  </button>
                  <button
                    onClick={() => setActiveAgent('pricing')}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition text-left"
                  >
                    <div className="text-3xl mb-2">💰</div>
                    <h3 className="font-bold mb-1">Pricing Specialist</h3>
                    <p className="text-sm opacity-90">Find the best plan for you</p>
                  </button>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar salas..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orkut-blue"
              />
            </div>
          </motion.div>

          {/* Rooms */}
          <div className="space-y-4">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Volume2 className="w-5 h-5 text-green-500" />
                      <span className="text-xs text-green-500 font-semibold">
                        AO VIVO
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {room.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{room.description}</p>

                    {/* Speakers Avatars */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-600">
                        Palestrantes:
                      </span>
                      {room.speakers.map((speaker) => (
                        <div key={speaker.id} className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orkut-blue to-orkut-pink flex items-center justify-center text-lg">
                            {speaker.avatar}
                          </div>
                          {speaker.isSpeaking && (
                            <div className="absolute inset-0 rounded-full border-2 border-msn-green animate-pulse" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>👥 {room.listeners} ouvindo</span>
                      <span>🏷️ {room.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveRoom(room)}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                      room.joined
                        ? 'bg-msn-green text-white hover:bg-green-600'
                        : 'bg-orkut-pink text-white hover:bg-pink-600'
                    }`}
                  >
                    Entrar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Room Interface */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-clubhouse-bg flex flex-col items-center justify-center z-50"
        >
          <div className="max-w-2xl w-full mx-auto p-6">
            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              {activeRoom.title}
            </h2>

            {/* Speakers Circle */}
            <div className="flex justify-center items-center mb-12">
              <div className="flex space-x-4">
                {activeRoom.speakers.map((speaker) => (
                  <motion.div
                    key={speaker.id}
                    animate={{
                      scale: speaker.isSpeaking ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      duration: 1,
                      repeat: speaker.isSpeaking ? Infinity : 0
                    }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4 ${
                        speaker.isSpeaking
                          ? 'border-msn-green'
                          : 'border-gray-600'
                      }`}
                    >
                      {speaker.avatar}
                    </div>
                    <p className="text-white text-sm mt-2">{speaker.name}</p>
                    {speaker.isSpeaking && (
                      <div className="flex space-x-1 mt-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [4, 8, 4] }}
                            transition={{
                              duration: 0.6,
                              delay: i * 0.1,
                              repeat: Infinity
                            }}
                            className="w-1 bg-msn-green rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Listeners Count */}
            <p className="text-gray-400 text-center mb-8">
              👥 {activeRoom.listeners} pessoas ouvindo
            </p>

            {/* Controls */}
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition ${
                  isMuted
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-msn-green text-white hover:bg-green-600'
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={() => setHasRaisedHand(!hasRaisedHand)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  hasRaisedHand
                    ? 'bg-orkut-pink text-white'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <Hand className="w-5 h-5 inline mr-2" />
                {hasRaisedHand ? 'Mão levantada' : 'Levantar mão'}
              </button>

              <button
                onClick={() => setActiveRoom(null)}
                className="p-4 rounded-full bg-msn-red text-white hover:bg-red-600 transition"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
