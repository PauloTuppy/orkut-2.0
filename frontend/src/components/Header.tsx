import { Search, Bell, ChevronDown, Home, Users, MessageCircle, Radio } from 'lucide-react';

export function Header() {
  return (
    <header className="orkut-gradient text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">Orkut 2.0</h1>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="flex items-center space-x-2 hover:text-orkut-pink transition">
                <Home className="w-5 h-5" />
                <span>Início</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-orkut-pink transition">
                <Users className="w-5 h-5" />
                <span>Comunidades</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-orkut-pink transition">
                <Users className="w-5 h-5" />
                <span>Amigos</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-orkut-pink transition">
                <MessageCircle className="w-5 h-5" />
                <span>Mensagens</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-orkut-pink transition">
                <Radio className="w-5 h-5" />
                <span>Salas de Áudio</span>
              </a>
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
          </div>
        </div>
      </div>
    </header>
  );
}
