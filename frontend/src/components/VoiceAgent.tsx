import { useState, useEffect } from 'react';
import { LiveKitRoom, useVoiceAssistant, BarVisualizer, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';

interface VoiceAgentProps {
  agentType?: 'sales' | 'technical' | 'pricing';
  onClose?: () => void;
}

export const VoiceAgent = ({ 
  agentType = 'sales',
  onClose 
}: VoiceAgentProps) => {
  const [token, setToken] = useState<string>('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  const LIVEKIT_URL = (import.meta.env?.VITE_LIVEKIT_URL as string) || 'wss://orkut-2-0-xxxxx.livekit.cloud';

  useEffect(() => {
    // Get LiveKit token from backend
    const getToken = async () => {
      setConnecting(true);
      try {
        const response = await fetch('/api/ai/token?room_name=VoiceAgent&user_name=ViniciusJunior', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            room_name: 'VoiceAgent',
            user_name: 'ViniciusJunior',
            agentType 
          })
        });
        
        if (!response.ok) throw new Error('Failed to get token');
        
        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        setError('Failed to connect to voice agent');
        console.error(err);
      } finally {
        setConnecting(false);
      }
    };

    getToken();
  }, [agentType]);

  if (connecting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orkut-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to voice agent...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={onClose}
          className="mt-2 text-sm text-red-500 hover:text-red-700"
        >
          Close
        </button>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-orkut-blue">
          {agentType === 'sales' && '🎤 Sales Agent'}
          {agentType === 'technical' && '🔧 Technical Support'}
          {agentType === 'pricing' && '💰 Pricing Specialist'}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <LiveKitRoom
        video={false}
        audio={true}
        token={token}
        serverUrl={LIVEKIT_URL}
        connect={true}
        onConnected={() => console.log('Connected to voice agent')}
        onDisconnected={() => console.log('Disconnected from voice agent')}
      >
        <VoiceAgentUI />
      </LiveKitRoom>
    </div>
  );
};

const VoiceAgentUI: React.FC = () => {
  const { state, audioTrack } = useVoiceAssistant();
  
  // Convert state to string for display
  const stateStr = String(state || 'idle');

  return (
    <div className="space-y-4">
      <RoomAudioRenderer />
      
      <div className="bg-gradient-to-r from-orkut-blue to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className={`w-4 h-4 rounded-full ${
            state === 'listening' ? 'bg-green-400 animate-pulse' :
            state === 'thinking' ? 'bg-yellow-400 animate-pulse' :
            state === 'speaking' ? 'bg-blue-400 animate-pulse' :
            'bg-gray-400'
          }`} />
          <span className="font-medium capitalize">{stateStr}</span>
        </div>

        {audioTrack && (
          <div className="h-24 flex items-center justify-center">
            <BarVisualizer
              state={state}
              barCount={5}
              trackRef={audioTrack}
              className="w-full"
            />
          </div>
        )}

        <div className="text-center text-sm mt-4 opacity-90">
          {state === 'listening' ? '🎤 Listening...' :
           state === 'thinking' ? '🤔 Processing...' :
           state === 'speaking' ? '🗣️ Speaking...' :
           '💬 Start speaking to interact'}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Speak clearly and naturally</li>
          <li>Wait for the agent to finish speaking</li>
          <li>Ask specific questions for best results</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceAgent;
