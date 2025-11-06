import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { CommunityGrid } from '../components/CommunityGrid';
import { motion } from 'framer-motion';

export default function Communities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('todos');

  const communities = [
    { id: '1', name: 'Gamers BR', icon: '🎮', members: 15000, color: '#FF6B6B' },
    { id: '2', name: 'Devs Brasil', icon: '💻', members: 8000, color: '#4ECDC4' },
    { id: '3', name: 'Music Lovers', icon: '🎵', members: 20000, color: '#95E1D3' },
    { id: '4', name: 'Livros', icon: '📚', members: 5000, color: '#F38181' },
    { id: '5', name: 'Pizza Lovers', icon: '🍕', members: 3000, color: '#FFA07A' },
    { id: '6', name: 'Cinema', icon: '🎬', members: 12000, color: '#9B59B6' },
    { id: '7', name: 'Futebol', icon: '⚽', members: 50000, color: '#3498DB' },
    { id: '8', name: 'Design', icon: '🎨', members: 9000, color: '#E74C3C' },
  ];

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Comunidades</h1>
          <button className="bg-orkut-blue text-white px-6 py-2 rounded-lg hover:bg-orkut-blue-dark transition flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Criar</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar comunidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orkut-blue"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-4">
          {['todos', 'minhas', 'trending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                filter === f
                  ? 'bg-orkut-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f === 'todos' && 'Todas'}
              {f === 'minhas' && 'Minhas'}
              {f === 'trending' && 'Trending'}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <CommunityGrid communities={filteredCommunities} />
      </div>
    </div>
  );
}
