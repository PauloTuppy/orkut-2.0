// src/components/MSNChatSimulator.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WindowFrame from './WindowFrame';
import './MSNChatSimulator.css';

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  typing?: boolean;
}

interface Message {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  avatar: string;
  isUser: boolean;
  isTyping?: boolean;
}

interface ChatWindow {
  contact: Contact;
  messages: Message[];
  isTyping: boolean;
  zIndex: number;
}

const DEMO_RESPONSES = [
  "Oi! Tudo bem? 😊",
  "Que legal esse Orkut 2.0!",
  "As janelas flutuantes são nostálgicas demais! 🪟",
  "Lembra quando a gente ficava horas no MSN?",
  "Saudades dos emoticons clássicos! :P",
  "Vou compartilhar isso com todo mundo!",
  "Ficou igual ao MSN original! 💜",
  "Que nostalgia boa! 😍",
  "Parabéns pelo projeto!",
  "Quando vai ter os nudges? 😂"
];

export default function MSNChatSimulator() {
  const [contacts] = useState<Contact[]>([
    { id: 1, name: 'João Silva', avatar: '👨‍💻', status: 'online' },
    { id: 2, name: 'Maria Santos', avatar: '👩‍🎨', status: 'online' },
    { id: 3, name: 'Pedro Costa', avatar: '👨‍💼', status: 'away' },
    { id: 4, name: 'Ana Lima', avatar: '👩‍💻', status: 'online' },
    { id: 5, name: 'Carlos Mendes', avatar: '👨‍🔧', status: 'away' },
    { id: 6, name: 'Juliana Rocha', avatar: '👩‍⚕️', status: 'offline' }
  ]);

  const [openChats, setOpenChats] = useState<ChatWindow[]>([]);
  const [newMessages, setNewMessages] = useState<{ [key: number]: string }>({});
  const [maxZIndex, setMaxZIndex] = useState(1000);


  const messagesEndRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const typingTimeouts = useRef<{ [key: number]: number }>({});

  const scrollToBottom = (contactId: number) => {
    setTimeout(() => {
      messagesEndRefs.current[contactId]?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getRandomResponse = () => {
    return DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
  };

  const simulateTyping = (contactId: number) => {
    setOpenChats(prev => prev.map(chat =>
      chat.contact.id === contactId
        ? { ...chat, isTyping: true }
        : chat
    ));

    // Clear existing timeout
    if (typingTimeouts.current[contactId]) {
      clearTimeout(typingTimeouts.current[contactId]);
    }

    // Set new timeout for response
    typingTimeouts.current[contactId] = setTimeout(() => {
      const response = getRandomResponse();
      const newMsg: Message = {
        id: Date.now(),
        author: contacts.find(c => c.id === contactId)?.name || 'Contato',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: contacts.find(c => c.id === contactId)?.avatar || '👤',
        isUser: false
      };

      setOpenChats(prev => prev.map(chat =>
        chat.contact.id === contactId
          ? { 
              ...chat, 
              messages: [...chat.messages, newMsg],
              isTyping: false 
            }
          : chat
      ));

      scrollToBottom(contactId);
    }, 1500 + Math.random() * 2000); // 1.5-3.5 seconds
  };

  const handleStartChat = (contact: Contact) => {
    const existingChat = openChats.find(c => c.contact.id === contact.id);
    
    if (!existingChat) {
      const newZIndex = maxZIndex + 1;
      setMaxZIndex(newZIndex);
      
      const initialMessage: Message = {
        id: 1,
        author: contact.name,
        text: contact.status === 'online' ? 'Oi! Tudo bem?' : 'Oi! Acabei de voltar!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: contact.avatar,
        isUser: false
      };
      
      setOpenChats(prev => [...prev, {
        contact,
        messages: [initialMessage],
        isTyping: false,
        zIndex: newZIndex
      }]);
    } else {
      bringToFront(contact.id);
    }
  };

  const bringToFront = (contactId: number) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    setOpenChats(prev => prev.map(chat =>
      chat.contact.id === contactId
        ? { ...chat, zIndex: newZIndex }
        : chat
    ));
  };

  const handleCloseChat = (contactId: number) => {
    setOpenChats(prev => prev.filter(c => c.contact.id !== contactId));
    const { [contactId]: _, ...rest } = newMessages;
    setNewMessages(rest);
    
    // Clear typing timeout
    if (typingTimeouts.current[contactId]) {
      clearTimeout(typingTimeouts.current[contactId]);
      delete typingTimeouts.current[contactId];
    }
  };

  const handleSendMessage = (contactId: number) => {
    const message = newMessages[contactId]?.trim();
    if (!message) return;

    const newMsg: Message = {
      id: Date.now(),
      author: 'Você',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '👤',
      isUser: true
    };

    setOpenChats(prev => prev.map(chat => {
      if (chat.contact.id === contactId) {
        return { ...chat, messages: [...chat.messages, newMsg] };
      }
      return chat;
    }));

    setNewMessages(prev => ({ ...prev, [contactId]: '' }));
    scrollToBottom(contactId);

    // Simulate response if contact is online
    const contact = contacts.find(c => c.id === contactId);
    if (contact?.status === 'online') {
      simulateTyping(contactId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, contactId: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(contactId);
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(typingTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  return (
    <div className="msn-chat-simulator">
      {/* Contacts Window */}
      <WindowFrame
        title="MSN Messenger - Contatos"
        icon="👥"
        initialX={20}
        initialY={20}
        initialWidth={220}
        initialHeight={450}
        minimizable={true}
        maximizable={false}
        zIndex={999}
        onFocus={() => {}}
      >
        <div className="msn-contacts-window">
          <div className="msn-user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-name">Paulo Tuppy</div>
              <div className="user-status">🟢 Online</div>
            </div>
          </div>

          <div className="contacts-groups">
            {/* Online */}
            <div className="contact-group">
              <div className="group-header">
                🟢 Online ({contacts.filter(c => c.status === 'online').length})
              </div>
              {contacts.filter(c => c.status === 'online').map(contact => (
                <motion.div
                  key={contact.id}
                  whileHover={{ backgroundColor: '#316AC5', color: 'white' }}
                  className="contact-item"
                  onClick={() => handleStartChat(contact)}
                >
                  <span className="contact-avatar">{contact.avatar}</span>
                  <span className="contact-name">{contact.name}</span>
                  <span className="status-indicator online" />
                </motion.div>
              ))}
            </div>

            {/* Away */}
            <div className="contact-group">
              <div className="group-header">
                🟡 Ausente ({contacts.filter(c => c.status === 'away').length})
              </div>
              {contacts.filter(c => c.status === 'away').map(contact => (
                <motion.div
                  key={contact.id}
                  whileHover={{ backgroundColor: '#316AC5', color: 'white' }}
                  className="contact-item"
                  onClick={() => handleStartChat(contact)}
                >
                  <span className="contact-avatar">{contact.avatar}</span>
                  <span className="contact-name">{contact.name}</span>
                  <span className="status-indicator away" />
                </motion.div>
              ))}
            </div>

            {/* Offline */}
            <div className="contact-group">
              <div className="group-header">
                ⚫ Offline ({contacts.filter(c => c.status === 'offline').length})
              </div>
              {contacts.filter(c => c.status === 'offline').map(contact => (
                <motion.div
                  key={contact.id}
                  whileHover={{ backgroundColor: '#316AC5', color: 'white' }}
                  className="contact-item offline"
                  onClick={() => handleStartChat(contact)}
                >
                  <span className="contact-avatar">{contact.avatar}</span>
                  <span className="contact-name">{contact.name}</span>
                  <span className="status-indicator offline-dot" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </WindowFrame>

      {/* Chat Windows */}
      <AnimatePresence>
        {openChats.map((chat, index) => (
          <WindowFrame
            key={chat.contact.id}
            title={`Conversa com ${chat.contact.name}`}
            icon={chat.contact.avatar}
            initialX={260 + index * 30}
            initialY={20 + index * 30}
            initialWidth={420}
            initialHeight={500}
            onClose={() => handleCloseChat(chat.contact.id)}
            minimizable={true}
            maximizable={true}
            zIndex={chat.zIndex}
            onFocus={() => bringToFront(chat.contact.id)}
          >
            <div className="msn-chat-window">
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-contact-info">
                  <span className="chat-avatar">{chat.contact.avatar}</span>
                  <div className="chat-contact-details">
                    <div className="chat-contact-name">{chat.contact.name}</div>
                    <div className={`chat-contact-status ${chat.contact.status}`}>
                      {chat.contact.status === 'online' && '🟢 Online'}
                      {chat.contact.status === 'away' && '🟡 Ausente'}
                      {chat.contact.status === 'offline' && '⚫ Offline'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="chat-messages-area">
                {chat.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`chat-message ${msg.isUser ? 'user' : 'other'}`}
                  >
                    <div className="message-avatar">{msg.avatar}</div>
                    <div className="message-bubble">
                      <div className="message-header">
                        <span className="message-author">{msg.author}</span>
                        <span className="message-time">{msg.timestamp}</span>
                      </div>
                      <div className="message-text">{msg.text}</div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {chat.isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="typing-indicator"
                  >
                    <div className="message-avatar">{chat.contact.avatar}</div>
                    <div className="typing-bubble">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={el => messagesEndRefs.current[chat.contact.id] = el} />
              </div>

              {/* Input Area */}
              <div className="chat-input-area">
                <div className="input-toolbar">
                  <button className="toolbar-btn" title="Emoticons">😊</button>
                  <button className="toolbar-btn" title="Enviar arquivo">📎</button>
                  <button className="toolbar-btn" title="Webcam">📹</button>
                  <button className="toolbar-btn" title="Jogos">🎮</button>
                </div>
                <div className="input-row">
                  <textarea
                    value={newMessages[chat.contact.id] || ''}
                    onChange={(e) => setNewMessages(prev => ({ 
                      ...prev, 
                      [chat.contact.id]: e.target.value 
                    }))}
                    onKeyPress={(e) => handleKeyPress(e, chat.contact.id)}
                    placeholder="Digite uma mensagem..."
                    className="message-input-field"
                    rows={2}
                  />
                  <button 
                    className="send-button" 
                    onClick={() => handleSendMessage(chat.contact.id)}
                    disabled={!newMessages[chat.contact.id]?.trim()}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </WindowFrame>
        ))}
      </AnimatePresence>
    </div>
  );
}