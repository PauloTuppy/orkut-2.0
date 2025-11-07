import { useState, useRef } from 'react';
import { Upload, Mic, Square, Play, Pause, Trash2, Download, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioFile {
  id: string;
  name: string;
  duration: number;
  size: number;
  url: string;
  type: 'upload' | 'recording';
  createdAt: Date;
}

interface AudioUploaderProps {
  roomId: string;
  onClose: () => void;
}

export default function AudioUploader({ roomId, onClose }: AudioUploaderProps) {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Iniciar gravação
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newAudio: AudioFile = {
          id: Date.now().toString(),
          name: `Gravação ${new Date().toLocaleTimeString()}`,
          duration: recordingTime,
          size: audioBlob.size,
          url: audioUrl,
          type: 'recording',
          createdAt: new Date()
        };

        setAudioFiles(prev => [newAudio, ...prev]);
        setRecordingTime(0);
        
        // Parar todas as tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Contador de tempo
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      alert('Erro ao acessar microfone. Verifique as permissões.');
    }
  };

  // Parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // Upload de arquivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar tipo
    if (!file.type.startsWith('audio/')) {
      alert('Por favor, selecione apenas arquivos de áudio');
      return;
    }

    // Verificar tamanho (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Arquivo muito grande! Máximo: 100MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular upload com progresso
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'audio');
      formData.append('description', `Áudio da sala ${roomId}`);

      // Simular progresso
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      // Upload real para o backend
      const response = await fetch('http://localhost:8000/api/ai/p2p/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro no upload');
      }

      const result = await response.json();

      // Criar objeto de áudio
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      audio.onloadedmetadata = () => {
        const newAudio: AudioFile = {
          id: result.file_id || Date.now().toString(),
          name: file.name,
          duration: Math.floor(audio.duration),
          size: file.size,
          url: URL.createObjectURL(file),
          type: 'upload',
          createdAt: new Date()
        };

        setAudioFiles(prev => [newAudio, ...prev]);
      };

      alert('✅ Áudio enviado com sucesso!');

    } catch (error) {
      console.error('Erro no upload:', error);
      alert('❌ Erro ao enviar áudio');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Reproduzir/pausar áudio
  const togglePlay = (audio: AudioFile) => {
    if (playingId === audio.id) {
      audioPlayerRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      
      const player = new Audio(audio.url);
      audioPlayerRef.current = player;
      
      player.onended = () => {
        setPlayingId(null);
      };
      
      player.play();
      setPlayingId(audio.id);
    }
  };

  // Deletar áudio
  const deleteAudio = (id: string) => {
    if (playingId === id) {
      audioPlayerRef.current?.pause();
      setPlayingId(null);
    }
    setAudioFiles(prev => prev.filter(a => a.id !== id));
  };

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Formatar tamanho
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">🎙️ Gerenciar Áudios</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="opacity-90">Grave ou faça upload de diálogos e podcasts</p>
        </div>

        {/* Actions */}
        <div className="p-6 border-b space-y-4">
          {/* Recording */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
              <div>
                <p className="font-semibold text-gray-900">
                  {isRecording ? 'Gravando...' : 'Gravar Áudio'}
                </p>
                {isRecording && (
                  <p className="text-sm text-gray-600">
                    {formatTime(recordingTime)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-2 rounded-lg font-semibold transition flex items-center space-x-2 ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5" />
                  <span>Parar</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Gravar</span>
                </>
              )}
            </button>
          </div>

          {/* Upload */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Upload de Arquivo</p>
              <p className="text-sm text-gray-600">MP3, WAV, OGG (máx 100MB)</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              <span>Selecionar</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Enviando áudio...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Audio List */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="font-bold text-gray-900 mb-4">
            📚 Biblioteca ({audioFiles.length} áudios)
          </h3>

          {audioFiles.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Mic className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhum áudio ainda</p>
              <p className="text-sm">Grave ou faça upload para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {audioFiles.map((audio) => (
                <motion.div
                  key={audio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => togglePlay(audio)}
                        className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition"
                      >
                        {playingId === audio.id ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{audio.name}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>{formatTime(audio.duration)}</span>
                          <span>•</span>
                          <span>{formatSize(audio.size)}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            audio.type === 'recording'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {audio.type === 'recording' ? '🎙️ Gravação' : '📁 Upload'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={audio.url}
                        download={audio.name}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => deleteAudio(audio.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Deletar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Waveform visual (simulado) */}
                  {playingId === audio.id && (
                    <div className="mt-3 flex items-center space-x-1 h-8">
                      {[...Array(50)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            height: [
                              Math.random() * 20 + 10,
                              Math.random() * 30 + 5,
                              Math.random() * 20 + 10
                            ]
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.02
                          }}
                          className="flex-1 bg-purple-500 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>💡 Dica: Grave diálogos ou faça upload de podcasts</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
