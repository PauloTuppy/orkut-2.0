// src/pages/OrkutProfile.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WindowFrame from '../components/WindowFrame';
import './OrkutProfile.css';

interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: string;
}

interface Community {
  id: number;
  name: string;
  members: number;
  category: string;
  icon: string;
}

interface Scrap {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export default function OrkutProfile() {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(1000);

  const user = {
    name: 'Paulo Tuppy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paulo',
    age: 28,
    location: 'São Paulo, Brasil 🇧🇷',
    relationship: 'Solteiro',
    profession: 'Desenvolvedor Full Stack',
    about: 'Apaixonado por tecnologia e nostalgia! Criando o Orkut 2.0 com muito carinho. Saudades dos tempos dourados da internet brasileira! 💜',
    friends: 150,
    fans: 89,
    views: 2847,
    rating: 5,
    karma: 98
  };

  const friends: Friend[] = [
    { id: 1, name: 'João Silva', avatar: '👨‍💻', status: 'online' },
    { id: 2, name: 'Maria Santos', avatar: '👩‍🎨', status: 'online' },
    { id: 3, name: 'Pedro Costa', avatar: '👨‍💼', status: 'away', lastSeen: '5 min' },
    { id: 4, name: 'Ana Lima', avatar: '👩‍💻', status: 'offline', lastSeen: '2h' },
    { id: 5, name: 'Carlos Mendes', avatar: '👨‍🔧', status: 'online' },
    { id: 6, name: 'Juliana Rocha', avatar: '👩‍⚕️', status: 'away', lastSeen: '15 min' },
    { id: 7, name: 'Roberto Alves', avatar: '👨‍🎓', status: 'offline', lastSeen: '1d' },
    { id: 8, name: 'Fernanda Cruz', avatar: '👩‍🍳', status: 'online' }
  ];

  const communities: Community[] = [
    { id: 1, name: 'Eu odeio acordar cedo', members: 2847593, category: 'Humor', icon: '😴' },
    { id: 2, name: 'Desenvolvedores JavaScript', members: 45892, category: 'Tecnologia', icon: '💻' },
    { id: 3, name: 'Saudades do Orkut', members: 1847392, category: 'Nostalgia', icon: '💜' },
    { id: 4, name: 'Gamers Brasileiros', members: 892847, category: 'Games', icon: '🎮' },
    { id: 5, name: 'React Developers', members: 67483, category: 'Tecnologia', icon: '⚛️' },
    { id: 6, name: 'MSN Messenger Forever', members: 394857, category: 'Nostalgia', icon: '💬' }
  ];

  const scraps: Scrap[] = [
    {
      id: 1,
      author: 'Maria Santos',
      avatar: '👩‍🎨',
      content: 'Parabéns pelo Orkut 2.0! Ficou incrível! Já estou com saudades dos scraps! 💜',
      timestamp: '2 horas atrás',
      likes: 15
    },
    {
      id: 2,
      author: 'João Silva',
      avatar: '👨‍💻',
      content: 'Cara, que nostalgia! Lembra quando a gente ficava horas no Orkut? Bons tempos! 😊',
      timestamp: '5 horas atrás',
      likes: 23
    },
    {
      id: 3,
      author: 'Pedro Costa',
      avatar: '👨‍💼',
      content: 'O chat MSN está perfeito! Conseguiu capturar toda a essência nostálgica! 🪟',
      timestamp: '1 dia atrás',
      likes: 31
    }
  ];

  const openWindow = (windowType: string) => {
    setActiveWindow(windowType);
    setMaxZIndex(prev => prev + 1);
  };

  const closeWindow = () => {
    setActiveWindow(null);
  };

  return (
    <div className="orkut-profile-container">
      {/* Desktop Background */}
      <div className="desktop-wallpaper">
        {/* Desktop Icons */}
        <div className="desktop-icons">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="desktop-icon"
            onClick={() => openWindow('profile')}
          >
            <div className="icon-image">👤</div>
            <span className="icon-label">Meu Perfil</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="desktop-icon"
            onClick={() => openWindow('friends')}
          >
            <div className="icon-image">👥</div>
            <span className="icon-label">Amigos</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="desktop-icon"
            onClick={() => openWindow('communities')}
          >
            <div className="icon-image">🏘️</div>
            <span className="icon-label">Comunidades</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="desktop-icon"
            onClick={() => openWindow('scraps')}
          >
            <div className="icon-image">📝</div>
            <span className="icon-label">Scraps</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="desktop-icon"
            onClick={() => openWindow('msn')}
          >
            <div className="icon-image">💬</div>
            <span className="icon-label">MSN Chat</span>
          </motion.div>
        </div>

        {/* Taskbar */}
        <div className="taskbar">
          <div className="start-button">
            <span className="start-icon">🪟</span>
            <span>Iniciar</span>
          </div>
          
          <div className="taskbar-items">
            {activeWindow && (
              <div className="taskbar-item active">
                <span className="taskbar-icon">
                  {activeWindow === 'profile' && '👤'}
                  {activeWindow === 'friends' && '👥'}
                  {activeWindow === 'communities' && '🏘️'}
                  {activeWindow === 'scraps' && '📝'}
                  {activeWindow === 'msn' && '💬'}
                </span>
                <span className="taskbar-text">
                  {activeWindow === 'profile' && 'Meu Perfil'}
                  {activeWindow === 'friends' && 'Amigos'}
                  {activeWindow === 'communities' && 'Comunidades'}
                  {activeWindow === 'scraps' && 'Scraps'}
                  {activeWindow === 'msn' && 'MSN Chat'}
                </span>
              </div>
            )}
          </div>

          <div className="system-tray">
            <span className="tray-time">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Windows */}
      <AnimatePresence>
        {activeWindow === 'profile' && (
          <WindowFrame
            title="Meu Perfil - Orkut"
            icon="👤"
            initialX={100}
            initialY={50}
            initialWidth={600}
            initialHeight={500}
            onClose={closeWindow}
            zIndex={maxZIndex}
          >
            <div className="profile-content">
              <div className="profile-header">
                <img src={user.avatar} alt={user.name} className="profile-avatar" />
                <div className="profile-info">
                  <h2 className="profile-name">{user.name}</h2>
                  <p className="profile-location">{user.location}</p>
                  <div className="profile-stats">
                    <span>👥 {user.friends} amigos</span>
                    <span>⭐ {user.fans} fãs</span>
                    <span>👁️ {user.views} visitas</span>
                  </div>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-row">
                  <strong>Idade:</strong> {user.age} anos
                </div>
                <div className="detail-row">
                  <strong>Relacionamento:</strong> {user.relationship}
                </div>
                <div className="detail-row">
                  <strong>Profissão:</strong> {user.profession}
                </div>
                <div className="detail-row">
                  <strong>Sobre mim:</strong>
                  <p>{user.about}</p>
                </div>
              </div>

              <div className="profile-rating">
                <div className="rating-item">
                  <span>Confiável:</span>
                  <div className="stars">{'⭐'.repeat(user.rating)}</div>
                </div>
                <div className="rating-item">
                  <span>Legal:</span>
                  <div className="stars">{'⭐'.repeat(user.rating)}</div>
                </div>
                <div className="rating-item">
                  <span>Sexy:</span>
                  <div className="stars">{'⭐'.repeat(user.rating)}</div>
                </div>
              </div>
            </div>
          </WindowFrame>
        )}

        {activeWindow === 'friends' && (
          <WindowFrame
            title="Amigos - Orkut"
            icon="👥"
            initialX={150}
            initialY={80}
            initialWidth={500}
            initialHeight={400}
            onClose={closeWindow}
            zIndex={maxZIndex}
          >
            <div className="friends-content">
              <div className="friends-header">
                <h3>Meus Amigos ({friends.length})</h3>
              </div>
              
              <div className="friends-list">
                {friends.map(friend => (
                  <motion.div
                    key={friend.id}
                    whileHover={{ backgroundColor: '#e0e0e0' }}
                    className="friend-item"
                  >
                    <div className="friend-avatar">{friend.avatar}</div>
                    <div className="friend-info">
                      <div className="friend-name">{friend.name}</div>
                      <div className={`friend-status ${friend.status}`}>
                        {friend.status === 'online' && '🟢 Online'}
                        {friend.status === 'away' && `🟡 Ausente ${friend.lastSeen ? `(${friend.lastSeen})` : ''}`}
                        {friend.status === 'offline' && `⚫ Offline ${friend.lastSeen ? `(${friend.lastSeen})` : ''}`}
                      </div>
                    </div>
                    <button className="friend-action">💬</button>
                  </motion.div>
                ))}
              </div>
            </div>
          </WindowFrame>
        )}

        {activeWindow === 'communities' && (
          <WindowFrame
            title="Comunidades - Orkut"
            icon="🏘️"
            initialX={200}
            initialY={100}
            initialWidth={550}
            initialHeight={450}
            onClose={closeWindow}
            zIndex={maxZIndex}
          >
            <div className="communities-content">
              <div className="communities-header">
                <h3>Minhas Comunidades ({communities.length})</h3>
              </div>
              
              <div className="communities-list">
                {communities.map(community => (
                  <motion.div
                    key={community.id}
                    whileHover={{ backgroundColor: '#e0e0e0' }}
                    className="community-item"
                  >
                    <div className="community-icon">{community.icon}</div>
                    <div className="community-info">
                      <div className="community-name">{community.name}</div>
                      <div className="community-stats">
                        {community.members.toLocaleString()} membros • {community.category}
                      </div>
                    </div>
                    <button className="community-action">👁️</button>
                  </motion.div>
                ))}
              </div>
            </div>
          </WindowFrame>
        )}

        {activeWindow === 'scraps' && (
          <WindowFrame
            title="Scraps - Orkut"
            icon="📝"
            initialX={120}
            initialY={120}
            initialWidth={500}
            initialHeight={400}
            onClose={closeWindow}
            zIndex={maxZIndex}
          >
            <div className="scraps-content">
              <div className="scraps-header">
                <h3>Meus Scraps ({scraps.length})</h3>
                <button className="new-scrap-btn">✍️ Novo Scrap</button>
              </div>
              
              <div className="scraps-list">
                {scraps.map(scrap => (
                  <motion.div
                    key={scrap.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="scrap-item"
                  >
                    <div className="scrap-avatar">{scrap.avatar}</div>
                    <div className="scrap-content-area">
                      <div className="scrap-header-info">
                        <strong>{scrap.author}</strong>
                        <span className="scrap-time">{scrap.timestamp}</span>
                      </div>
                      <div className="scrap-text">{scrap.content}</div>
                      <div className="scrap-actions">
                        <button className="scrap-like">👍 {scrap.likes}</button>
                        <button className="scrap-reply">💬 Responder</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </WindowFrame>
        )}

        {activeWindow === 'msn' && (
          <WindowFrame
            title="MSN Messenger - Chat Demo"
            icon="💬"
            initialX={250}
            initialY={60}
            initialWidth={600}
            initialHeight={500}
            onClose={closeWindow}
            zIndex={maxZIndex}
          >
            <div className="msn-demo-content">
              <div className="msn-demo-header">
                <h3>💬 Chat MSN Nostálgico</h3>
                <p>Simulação do chat clássico do MSN Messenger</p>
              </div>
              
              <div className="msn-demo-layout">
                <div className="msn-contacts-demo">
                  <div className="contacts-title">👥 Contatos Online</div>
                  {friends.filter(f => f.status === 'online').map(friend => (
                    <div key={friend.id} className="contact-demo-item">
                      <span className="contact-demo-avatar">{friend.avatar}</span>
                      <span className="contact-demo-name">{friend.name}</span>
                      <span className="status-dot online"></span>
                    </div>
                  ))}
                </div>
                
                <div className="msn-chat-demo">
                  <div className="chat-demo-header">
                    <span>💬 Conversa com João Silva</span>
                  </div>
                  <div className="chat-demo-messages">
                    <div className="demo-message other">
                      <span className="demo-avatar">👨‍💻</span>
                      <div className="demo-bubble">
                        <div className="demo-author">João Silva - 14:30</div>
                        <div>Oi! Viu o novo Orkut 2.0?</div>
                      </div>
                    </div>
                    <div className="demo-message user">
                      <div className="demo-bubble">
                        <div className="demo-author">Você - 14:32</div>
                        <div>Sim! Ficou incrível! 😊</div>
                      </div>
                      <span className="demo-avatar">👤</span>
                    </div>
                    <div className="demo-message other">
                      <span className="demo-avatar">👨‍💻</span>
                      <div className="demo-bubble">
                        <div className="demo-author">João Silva - 14:33</div>
                        <div>As janelas flutuantes são nostálgicas demais! 🪟</div>
                      </div>
                    </div>
                  </div>
                  <div className="chat-demo-input">
                    <input 
                      type="text" 
                      placeholder="Digite sua mensagem..." 
                      className="demo-input"
                      disabled
                    />
                    <button className="demo-send-btn">Enviar</button>
                  </div>
                </div>
              </div>
              
              <div className="msn-demo-footer">
                <p>💡 <strong>Dica:</strong> Acesse o Chat MSN completo pelo menu principal!</p>
              </div>
            </div>
          </WindowFrame>
        )}
      </AnimatePresence>
    </div>
  );
}