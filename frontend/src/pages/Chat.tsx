import { useState } from 'react';
import { Send, Smile, Paperclip, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  statusMessage: string;
  lastMessage?: string;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

const CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'João Silva',
    avatar: '👤',
    status: 'online',
    statusMessage: 'Estudando para prova 📚',
    lastMessage: 'Viu a nova comunidade?'
  },
  {
    id: '2',
    name: 'Maria Santos',
    avatar: '👩',
    status: 'online',
    statusMessage: 'Ouvindo música 🎵',
    lastMessage: 'Que legal!'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    avatar: '👨',
    status: 'away',
    statusMessage: 'Volto logo!',
    lastMessage: 'Até mais!'
  },
  {
    id: '4',
    name: 'Ana Souza',
    avatar: '👧',
    status: 'offline',
    statusMessage: '',
    lastMessage: 'Bora jogar?'
  }
];

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
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
    },
    {
      id: '3',
      sender: 'them',
      text: 'Viu a nova comunidade de jogos?',
      time: '14:32'
    }
  ]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'online':
        return 'bg-msn-green';
      case 'away':
        return 'bg-msn-yellow';
      case 'offline':
        return 'bg-msn-red';
    }
  };

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Contacts List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-72 bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="msn-gradient p-4">
          <h2 className="text-white font-bold mb-4">Contatos</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-white w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded bg-green-500 text-white placeholder-green-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredContacts.map((contact, index) => (
            <motion.button
              key={contact.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-3 rounded-lg text-left transition ${
                selectedContact.id === contact.id
                  ? 'bg-msn-green bg-opacity-20'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orkut-blue to-orkut-pink flex items-center justify-center text-lg">
                    {contact.avatar}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                      contact.status
                    )}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900">
                    {contact.name}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {contact.statusMessage}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      >
        {/* Chat Header */}
        <div className="msn-gradient p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-lg">
                {selectedContact.avatar}
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                  selectedContact.status
                )}`}
              />
            </div>
            <div>
              <h3 className="text-white font-bold">{selectedContact.name}</h3>
              <p className="text-green-100 text-sm">
                {selectedContact.statusMessage}
              </p>
            </div>
          </div>
          <button className="text-white hover:bg-green-700 p-2 rounded">
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                    ? 'bg-msn-green text-white'
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
        </div>

        {/* Input */}
        <div className="border-t p-4 flex items-center space-x-2 bg-white">
          <button className="text-gray-500 hover:text-msn-green">
            <Smile className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-msn-green">
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
    </div>
  );
}
