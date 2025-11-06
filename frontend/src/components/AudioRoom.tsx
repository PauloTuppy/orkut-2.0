import { Mic, MicOff, Hand, LogOut, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Speaker {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
  isMuted: boolean;
}

interface AudioRoomProps {
  title: string;
  speakers: Speaker[];
  audienceCount: number;
}

export function AudioRoom({ title, speakers, audienceCount }: AudioRoomProps) {
  return (
    <div className="bg-clubhouse-bg text-white rounded-lg shadow-2xl p-6">
      {/* Room Title */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Volume2 className="w-5 h-5 text-green-400" />
          <span className="text-sm text-gray-400">AO VIVO</span>
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-400 text-sm mt-1">
          {audienceCount} pessoas ouvindo
        </p>
      </div>

      {/* Speakers */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">
          PALESTRANTES
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {speakers.map((speaker) => (
            <motion.div
              key={speaker.id}
              animate={{
                scale: speaker.isSpeaking ? 1.05 : 1,
              }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                    speaker.isSpeaking
                      ? 'border-green-400'
                      : 'border-gray-600'
                  }`}
                >
                  <img
                    src={speaker.avatar}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    speaker.isMuted
                      ? 'bg-red-500'
                      : 'bg-green-500'
                  }`}
                >
                  {speaker.isMuted ? (
                    <MicOff className="w-3 h-3 text-white" />
                  ) : (
                    <Mic className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm mt-2 text-center">
                {speaker.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audience */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">
          PLATÉIA ({audienceCount} pessoas)
        </h3>
        <div className="flex flex-wrap gap-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden"
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                alt="Audience member"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center space-x-4">
        <button className="flex items-center space-x-2 px-6 py-3 bg-clubhouse-card hover:bg-gray-700 rounded-full transition">
          <Hand className="w-5 h-5" />
          <span>Levantar mão</span>
        </button>
        <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-full transition">
          <Mic className="w-5 h-5" />
          <span>Entrar no palco</span>
        </button>
        <button className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full transition">
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
