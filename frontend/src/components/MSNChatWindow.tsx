import { Send, Smile, Paperclip, X, Minus, Square } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface Contact {
  name: string;
  status: string;
}

interface MSNChatWindowProps {
  contact: Contact;
  onClose: () => void;
}

export function MSNChatWindow({ contact, onClose }: MSNChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'them',
      text: 'Olá! Como vai?',
      time: '14:30'
    },
    {
      id: '2',
      sender: 'me',
      text: 'Tudo bem, e você?',
      time: '14:31'
    }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, {
      id: Date.now().toString(),
      sender: 'me',
      text: input,
      time: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }]);
    setInput('');
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border-2 border-msn-green overflow-hidden z-50"
    >
      {/* Header */}
      <div className="msn-gradient p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg">
            👤
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">
              {contact.name}
            </h4>
            <p className="text-green-100 text-xs">{contact.status}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="text-white hover:bg-green-700 p-1 rounded">
            <Minus className="w-4 h-4" />
          </button>
          <button className="text-white hover:bg-green-700 p-1 rounded">
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-500 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'me' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === 'me'
                  ? 'bg-orkut-blue text-white'
                  : 'bg-white text-gray-800 border'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <p className="text-xs text-gray-500 italic">
          {contact.name} está digitando...
        </p>
      </div>

      {/* Input */}
      <div className="border-t p-3 flex items-center space-x-2">
        <button className="text-gray-500 hover:text-gray-700">
          <Smile className="w-5 h-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escreva sua mensagem..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-msn-green"
        />
        <button
          onClick={sendMessage}
          className="bg-msn-green text-white p-2 rounded-lg hover:bg-green-600"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
