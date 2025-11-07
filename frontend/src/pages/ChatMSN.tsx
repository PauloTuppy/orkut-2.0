
import { useState } from 'react';
import WindowFrame from '../components/WindowFrame';
import './ChatMSN.css';

interface Contact {
  name: string;
  status: 'online' | 'away' | 'offline';
}

interface ChatWindow {
  contact: Contact;
  messages: { sender: string; text: string; timestamp: string }[];
}

const initialContacts: Contact[] = [
  { name: 'João Silva', status: 'online' },
  { name: 'Maria Santos', status: 'online' },
  { name: 'Pedro Costa', status: 'away' },
  { name: 'Ana Silva', status: 'offline' },
];

export default function ChatMSN() {
  const [contacts] = useState<Contact[]>(initialContacts);
  const [chatWindows, setChatWindows] = useState<ChatWindow[]>([]);

  const handleStartChat = (contact: Contact) => {
    if (chatWindows.find(w => w.contact.name === contact.name)) return;

    const newWindow: ChatWindow = {
      contact,
      messages: [
        { sender: contact.name, text: 'Oi!', timestamp: '10:30' },
      ],
    };
    setChatWindows([...chatWindows, newWindow]);
  };

  const handleCloseChat = (contactName: string) => {
    setChatWindows(chatWindows.filter(w => w.contact.name !== contactName));
  };

  const handleSendMessage = (contactName: string, message: string) => {
    const newWindows = chatWindows.map(w => {
      if (w.contact.name === contactName) {
        return {
          ...w,
          messages: [
            ...w.messages,
            { sender: 'Você', text: message, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ],
        };
      }
      return w;
    });
    setChatWindows(newWindows);
  };

  return (
    <div className="chat-msn-container">
      <WindowFrame title="Contatos" initialX={50} initialY={50} initialWidth={250} initialHeight={400}>
        <div className="contact-list">
          {['online', 'away', 'offline'].map(status => (
            <div key={status}>
              <p className="status-header">{status.charAt(0).toUpperCase() + status.slice(1)} ({contacts.filter(c => c.status === status).length})</p>
              {contacts.filter(c => c.status === status).map(contact => (
                <div key={contact.name} className={`contact-item status-${contact.status}`} onClick={() => handleStartChat(contact)}>
                  <span className="status-icon"></span> {contact.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </WindowFrame>

      {chatWindows.map((win, index) => (
        <WindowFrame
          key={win.contact.name}
          title={win.contact.name}
          initialX={350 + index * 50}
          initialY={100 + index * 50}
          initialWidth={400}
          initialHeight={300}
          onClose={() => handleCloseChat(win.contact.name)}
        >
          <div className="chat-window">
            <div className="messages">
              {win.messages.map((msg, i) => (
                <p key={i} className={msg.sender === 'Você' ? 'sent' : 'received'}>
                  <span className="timestamp">[{msg.timestamp}]</span> {msg.sender}: {msg.text}
                </p>
              ))}
            </div>
            <div className="input-area">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    handleSendMessage(win.contact.name, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input.value) {
                  handleSendMessage(win.contact.name, input.value);
                  input.value = '';
                }
              }}>Enviar</button>
            </div>
          </div>
        </WindowFrame>
      ))}
    </div>
  );
}
