
import { useState, useEffect, useRef } from 'react';
import WindowFrame from '../components/WindowFrame';
import './ChatMSN.css';

interface Contact {
  name: string;
  status: 'online' | 'away' | 'offline';
  statusMessage: string;
  avatar: string;
}

interface Message {
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface ChatWindow {
  contact: Contact;
  messages: Message[];
  isTyping: boolean;
}

const initialContacts: Contact[] = [
  { name: 'João Silva', status: 'online', statusMessage: 'Estudando para prova 📚', avatar: '👤' },
  { name: 'Maria Santos', status: 'online', statusMessage: 'Ouvindo música 🎵', avatar: '👩' },
  { name: 'Pedro Costa', status: 'away', statusMessage: 'Volto logo!', avatar: '👨' },
  { name: 'Ana Souza', status: 'offline', statusMessage: '', avatar: '👧' },
];

// Respostas automáticas para cada contato
const autoResponses: Record<string, string[]> = {
  'João Silva': [
    'Sim! Vi sim, parece muito legal! 🎮',
    'Você já entrou nela?',
    'Vou dar uma olhada depois da prova',
    'Valeu pela dica!',
    'E aí, como estão os estudos?'
  ],
  'Maria Santos': [
    'Oi! Tudo ótimo! 🎵',
    'Estou ouvindo aquela playlist nova',
    'Você viu o novo álbum que saiu?',
    'Muito bom mesmo!',
    'Vamos marcar de ouvir juntos?'
  ],
  'Pedro Costa': [
    'Opa! Tudo certo?',
    'Desculpa a demora, estava ocupado',
    'Volto já!',
    'Me manda mensagem que eu respondo depois',
    'Falamos mais tarde!'
  ],
  'Ana Souza': [
    'Oi! Desculpa, estava offline',
    'Acabei de voltar',
    'Como posso ajudar?',
    'Tudo bem por aí?',
    'Vamos conversar!'
  ]
};

export default function ChatMSN() {
  const [contacts] = useState<Contact[]>(initialContacts);
  const [chatWindows, setChatWindows] = useState<ChatWindow[]>([]);
  const responseCounters = useRef<Record<string, number>>({});

  // Inicializar com uma conversa já aberta com João Silva
  useEffect(() => {
    const joaoSilva = initialContacts.find(c => c.name === 'João Silva');
    if (joaoSilva) {
      const initialWindow: ChatWindow = {
        contact: joaoSilva,
        messages: [
          { sender: 'João Silva', text: 'Olá! Como vai?', timestamp: '14:30', isMe: false },
          { sender: 'Vinicius Junior', text: 'Tudo bem, e você?', timestamp: '14:31', isMe: true },
          { sender: 'João Silva', text: 'Viu a nova comunidade de jogos?', timestamp: '14:32', isMe: false },
        ],
        isTyping: false
      };
      setChatWindows([initialWindow]);
      responseCounters.current['João Silva'] = 0;
    }
  }, []);

  const handleStartChat = (contact: Contact) => {
    if (chatWindows.find(w => w.contact.name === contact.name)) return;

    const initialMessages: Message[] = [];
    
    // Mensagens iniciais baseadas no contato
    if (contact.name === 'Maria Santos') {
      initialMessages.push(
        { sender: 'Maria Santos', text: 'Oi Vini! 🎵', timestamp: getCurrentTime(), isMe: false },
        { sender: 'Maria Santos', text: 'Você ouviu a nova música que eu postei?', timestamp: getCurrentTime(), isMe: false }
      );
    } else if (contact.name === 'Pedro Costa') {
      initialMessages.push(
        { sender: 'Pedro Costa', text: 'E aí, cara!', timestamp: getCurrentTime(), isMe: false },
        { sender: 'Pedro Costa', text: 'Desculpa a demora para responder', timestamp: getCurrentTime(), isMe: false }
      );
    } else if (contact.name === 'Ana Souza') {
      initialMessages.push(
        { sender: 'Ana Souza', text: 'Oi! Acabei de voltar', timestamp: getCurrentTime(), isMe: false },
        { sender: 'Ana Souza', text: 'Como você está?', timestamp: getCurrentTime(), isMe: false }
      );
    } else {
      initialMessages.push(
        { sender: contact.name, text: 'Oi!', timestamp: getCurrentTime(), isMe: false }
      );
    }

    const newWindow: ChatWindow = {
      contact,
      messages: initialMessages,
      isTyping: false
    };
    
    setChatWindows([...chatWindows, newWindow]);
    responseCounters.current[contact.name] = 0;
  };

  const handleCloseChat = (contactName: string) => {
    setChatWindows(chatWindows.filter(w => w.contact.name !== contactName));
    delete responseCounters.current[contactName];
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const simulateTyping = (contactName: string) => {
    setChatWindows(prev => prev.map(w => 
      w.contact.name === contactName ? { ...w, isTyping: true } : w
    ));

    setTimeout(() => {
      setChatWindows(prev => prev.map(w => 
        w.contact.name === contactName ? { ...w, isTyping: false } : w
      ));
      
      // Enviar resposta automática
      sendAutoResponse(contactName);
    }, 1500 + Math.random() * 2000); // 1.5-3.5 segundos
  };

  const sendAutoResponse = (contactName: string) => {
    const responses = autoResponses[contactName] || ['Entendi!', 'Legal!', 'Verdade!'];
    const counter = responseCounters.current[contactName] || 0;
    const response = responses[counter % responses.length];
    
    responseCounters.current[contactName] = counter + 1;

    const newMessage: Message = {
      sender: contactName,
      text: response,
      timestamp: getCurrentTime(),
      isMe: false
    };

    setChatWindows(prev => prev.map(w => {
      if (w.contact.name === contactName) {
        return {
          ...w,
          messages: [...w.messages, newMessage]
        };
      }
      return w;
    }));
  };

  const handleSendMessage = (contactName: string, message: string) => {
    const newMessage: Message = {
      sender: 'Vinicius Junior',
      text: message,
      timestamp: getCurrentTime(),
      isMe: true
    };

    setChatWindows(prev => prev.map(w => {
      if (w.contact.name === contactName) {
        return {
          ...w,
          messages: [...w.messages, newMessage]
        };
      }
      return w;
    }));

    // Simular resposta automática após um delay
    setTimeout(() => {
      simulateTyping(contactName);
    }, 500 + Math.random() * 1000);
  };



  return (
    <div className="chat-msn-container">
      {/* Lista de Contatos */}
      <WindowFrame 
        title="Contatos" 
        initialX={50} 
        initialY={50} 
        initialWidth={280} 
        initialHeight={450}
      >
        <div className="contact-list">
          <div className="msn-header">
            <div className="user-info">
              <div className="user-avatar">⚽</div>
              <div className="user-details">
                <div className="user-name">Vinicius Junior</div>
                <div className="user-status">🟢 Online</div>
              </div>
            </div>
          </div>

          {['online', 'away', 'offline'].map(status => {
            const statusContacts = contacts.filter(c => c.status === status);
            if (statusContacts.length === 0) return null;
            
            return (
              <div key={status} className="status-group">
                <div className="status-header">
                  <span className={`status-indicator status-${status}`}></span>
                  {status === 'online' ? 'Online' : status === 'away' ? 'Ausente' : 'Offline'} ({statusContacts.length})
                </div>
                {statusContacts.map(contact => (
                  <div 
                    key={contact.name} 
                    className={`contact-item status-${contact.status}`} 
                    onClick={() => handleStartChat(contact)}
                    title={`Clique para conversar com ${contact.name}`}
                  >
                    <div className="contact-avatar">{contact.avatar}</div>
                    <div className="contact-info">
                      <div className="contact-name">{contact.name}</div>
                      {contact.statusMessage && (
                        <div className="contact-status-msg">{contact.statusMessage}</div>
                      )}
                    </div>
                    <div className={`contact-status-dot status-${contact.status}`}></div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </WindowFrame>

      {/* Janelas de Chat */}
      {chatWindows.map((win, index) => (
        <WindowFrame
          key={win.contact.name}
          title={`${win.contact.name} - ${win.contact.statusMessage || 'Conversa'}`}
          initialX={350 + index * 30}
          initialY={100 + index * 30}
          initialWidth={420}
          initialHeight={350}
          onClose={() => handleCloseChat(win.contact.name)}
        >
          <div className="chat-window">
            {/* Header da Conversa */}
            <div className="chat-header">
              <div className="chat-contact-info">
                <div className="chat-avatar">{win.contact.avatar}</div>
                <div className="chat-details">
                  <div className="chat-name">{win.contact.name}</div>
                  <div className={`chat-status status-${win.contact.status}`}>
                    {win.contact.status === 'online' ? '🟢 Online' : 
                     win.contact.status === 'away' ? '🟡 Ausente' : '🔴 Offline'}
                  </div>
                </div>
              </div>
            </div>

            {/* Área de Mensagens */}
            <div className="messages-area">
              {win.messages.map((msg, i) => (
                <div key={i} className={`message ${msg.isMe ? 'message-sent' : 'message-received'}`}>
                  <div className="message-content">
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
              
              {win.isTyping && (
                <div className="typing-indicator">
                  <div className="typing-avatar">{win.contact.avatar}</div>
                  <div className="typing-text">
                    <span>{win.contact.name} está digitando</span>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Área de Input */}
            <div className="input-area">
              <div className="input-toolbar">
                <button className="toolbar-btn" title="Emoticons">😊</button>
                <button className="toolbar-btn" title="Anexar arquivo">📎</button>
                <button className="toolbar-btn" title="Enviar arquivo">📁</button>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  placeholder={`Enviar uma mensagem para ${win.contact.name}...`}
                  className="message-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleSendMessage(win.contact.name, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button 
                  className="send-button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value.trim()) {
                      handleSendMessage(win.contact.name, input.value);
                      input.value = '';
                    }
                  }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </WindowFrame>
      ))}
    </div>
  );
}
