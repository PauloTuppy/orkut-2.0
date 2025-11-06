// frontend/src/components/VoiceChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import aiService, { Voice } from '../services/aiService';

const VoiceChat: React.FC = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('ink-whisper');
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      const voiceList = await aiService.getVoices();
      setVoices(voiceList);
    } catch (error) {
      console.error('Erro ao carregar vozes:', error);
    }
  };

  // ============================================================
  // Text to Speech
  // ============================================================
  const handleTextToSpeech = async () => {
    if (!text.trim()) {
      alert('Digite um texto');
      return;
    }

    setLoading(true);
    try {
      const audioBlob = await aiService.textToSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Erro no TTS:', error);
      alert('Erro ao gerar áudio');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Speech to Text
  // ============================================================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        
        setLoading(true);
        try {
          const text = await aiService.speechToText(audioFile);
          setTranscription(text);
        } catch (error) {
          console.error('Erro no STT:', error);
          alert('Erro ao transcrever áudio');
        } finally {
          setLoading(false);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Erro ao acessar microfone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🎤 Voice Chat</h1>
        <p className="opacity-90">Converse com IA usando voz</p>
      </div>

      {/* Text to Speech */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">🔊 Texto para Voz</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione a Voz
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {voices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} ({voice.language})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Digite o Texto
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
            placeholder="Digite algo para ouvir..."
          />
        </div>

        <button
          onClick={handleTextToSpeech}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? '⏳ Gerando...' : '🔊 Ouvir'}
        </button>

        <audio ref={audioRef} className="w-full mt-4" controls />
      </div>

      {/* Speech to Text */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">🎙️ Voz para Texto</h2>
        
        <div className="flex justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            className={`px-8 py-4 rounded-full font-semibold text-white transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {isRecording ? '⏹️ Parar Gravação' : '🎙️ Começar a Gravar'}
          </button>
        </div>

        {transcription && (
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm font-semibold text-blue-600 mb-1">Transcrição:</p>
            <p className="text-gray-700">{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
