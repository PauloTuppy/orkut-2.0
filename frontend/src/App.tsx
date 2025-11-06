import { useState } from 'react';
import { Header } from './components/Header';
import { OrkutProfile } from './components/OrkutProfile';
import { CommunityGrid } from './components/CommunityGrid';
import { MSNChatWindow } from './components/MSNChatWindow';
import { MessageCircle } from 'lucide-react';

function App() {
  const [showChat, setShowChat] = useState(false);

  const mockUser = {
    name: 'Paulo Tuppy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paulo',
    friends: 150,
    fans: 80,
    views: 999,
    rating: 5
  };

  const mockCommunities = [
    { id: '1', name: 'Gamers BR', icon: '🎮', members: 15000, color: '#FF6B6B' },
    { id: '2', name: 'Devs Brasil', icon: '💻', members: 8000, color: '#4ECDC4' },
    { id: '3', name: 'Music Lovers', icon: '🎵', members: 20000, color: '#95E1D3' },
    { id: '4', name: 'Livros', icon: '📚', members: 5000, color: '#F38181' },
    { id: '5', name: 'Pizza Lovers', icon: '🍕', members: 3000, color: '#FFA07A' },
    { id: '6', name: 'Cinema', icon: '🎬', members: 12000, color: '#9B59B6' },
    { id: '7', name: 'Futebol', icon: '⚽', members: 50000, color: '#3498DB' },
    { id: '8', name: 'Design', icon: '🎨', members: 9000, color: '#E74C3C' },
  ];

  const mockContact = {
    name: 'João Silva',
    status: 'Online'
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Profile */}
          <div className="col-span-12 lg:col-span-3">
            <OrkutProfile user={mockUser} />
            
            {/* Friends Online */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Amigos Online</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-msn-green rounded-full"></div>
                  <span className="text-sm text-gray-700">João Silva</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-msn-green rounded-full"></div>
                  <span className="text-sm text-gray-700">Maria Santos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-msn-yellow rounded-full"></div>
                  <span className="text-sm text-gray-700">Pedro Costa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bem-vindo ao Orkut 2.0! 🎉
              </h2>
              <p className="text-gray-600 mb-4">
                A rede social nostálgica que você sempre quis. Conecte-se com amigos, 
                participe de comunidades, compartilhe arquivos e muito mais!
              </p>
              <div className="flex space-x-4">
                <button className="bg-orkut-blue text-white px-6 py-2 rounded-lg hover:bg-orkut-blue-dark transition">
                  Criar Post
                </button>
                <button className="bg-orkut-pink text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition">
                  Explorar Comunidades
                </button>
              </div>
            </div>

            {/* Communities Grid */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  Comunidades Populares
                </h2>
              </div>
              <CommunityGrid communities={mockCommunities} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 bg-msn-green text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* MSN Chat Window */}
      {showChat && (
        <MSNChatWindow
          contact={mockContact}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default App;
