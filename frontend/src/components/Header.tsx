import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Home, Users, MessageCircle, Radio, LogOut, Brain, Mic, Video } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };
  
  return (
    <header className="orkut-gradient text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/">
              <h1 className="text-2xl font-bold cursor-pointer hover:text-orkut-pink transition">
                Orkut 2.0
              </h1>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 hover:text-orkut-pink transition ${
                  isActive('/') ? 'text-orkut-pink' : ''
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Início</span>
              </Link>
              <Link 
                to="/profile" 
                className={`flex items-center space-x-2 hover:text-orkut-pink transition ${
                  isActive('/profile') ? 'text-orkut-pink' : ''
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Perfil</span>
              </Link>
              <Link 
                to="/communities" 
                className={`flex items-center space-x-2 hover:text-orkut-pink transition ${
                  isActive('/communities') ? 'text-orkut-pink' : ''
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Comunidades</span>
              </Link>
              <Link 
                to="/chat" 
                className={`flex items-center space-x-2 hover:text-orkut-pink transition ${
                  isActive('/chat') ? 'text-orkut-pink' : ''
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </Link>
              <Link 
                to="/chat-msn" 
                className={`flex items-center space-x-2 hover:text-orkut-pink transition ${
                  isActive('/chat-msn') ? 'text-orkut-pink' : ''
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>MSN</span>
              </Link>
              <Link 
                to="/feed" 
                className={`flex items-center space-x-2 hover:text-orkut-pink transition ${
                  isActive('/feed') ? 'text-orkut-pink' : ''
                }`}
              >
                <Radio className="w-5 h-5" />
                <span>Feed</span>
              </Link>
              <Link 
                to="/audio" 
                className={`flex items-center space-x-2 hover:text-orkut-pink transition ${
                  isActive('/audio') ? 'text-orkut-pink' : ''
                }`}
              >
                <Radio className="w-5 h-5" />
                <span>Áudio</span>
              </Link>
              <Link 
                to="/p2p" 
                className={`flex items-center space-x-2 hover:text-orkut-pink transition ${
                  isActive('/p2p') ? 'text-orkut-pink' : ''
                }`}
              >
                <Users className="w-5 h-5" />
                <span>P2P</span>
              </Link>
              
              {/* AI Features Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:text-orkut-pink transition">
                  <Brain className="w-5 h-5" />
                  <span>AI</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <div className="absolute top-full left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link 
                    to="/gist-memory" 
                    className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-100 rounded-t-lg"
                  >
                    <Brain className="w-4 h-4" />
                    <span>Gist Memory</span>
                  </Link>
                  <Link 
                    to="/voice-chat" 
                    className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-100"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Voice Chat</span>
                  </Link>
                  <Link 
                    to="/livekit-rooms" 
                    className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-100 rounded-b-lg"
                  >
                    <Video className="w-4 h-4" />
                    <span>LiveKit Rooms</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          {/* Search & Profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-white/20 rounded-lg px-4 py-2">
              <Search className="w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent border-none outline-none text-white placeholder-white/70 w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-white/20 rounded-lg transition">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orkut-pink rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <button className="flex items-center space-x-2 hover:bg-white/20 rounded-lg px-3 py-2 transition">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                👤
              </div>
              <span className="hidden md:block">Paulo Tuppy</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:bg-white/20 rounded-lg px-3 py-2 transition"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:block">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
