import { useState } from 'react';
import { Search, Plus, X, Users, Calendar, MessageCircle, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Community {
  id: string;
  name: string;
  icon: string;
  members: number;
  color: string;
  description: string;
  category: string;
  createdAt: string;
  creator: string;
  isJoined: boolean;
  posts: CommunityPost[];
}

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export default function Communities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    category: 'geral',
    icon: '🏘️',
    color: '#3498DB'
  });

  const [communities, setCommunities] = useState<Community[]>([
    { 
      id: '1', 
      name: 'Gamers BR', 
      icon: '🎮', 
      members: 15000, 
      color: '#FF6B6B',
      description: 'A maior comunidade de gamers do Brasil! Discuta jogos, compartilhe dicas e encontre parceiros para jogar.',
      category: 'Games',
      createdAt: '2024-01-15',
      creator: 'João Silva',
      isJoined: true,
      posts: [
        {
          id: 'p1',
          author: { name: 'Pedro Gamer', avatar: '🎮' },
          content: 'Alguém jogando o novo FIFA? Quero formar um time!',
          timestamp: '2h atrás',
          likes: 23,
          comments: 8,
          liked: false
        },
        {
          id: 'p2',
          author: { name: 'Ana Costa', avatar: '👩‍💻' },
          content: 'Acabei de zerar Cyberpunk 2077! Que jogo incrível! 🚀',
          timestamp: '5h atrás',
          likes: 45,
          comments: 12,
          liked: true
        }
      ]
    },
    { 
      id: '2', 
      name: 'Devs Brasil', 
      icon: '💻', 
      members: 8000, 
      color: '#4ECDC4',
      description: 'Comunidade de desenvolvedores brasileiros. Compartilhe conhecimento, tire dúvidas e networking.',
      category: 'Tecnologia',
      createdAt: '2024-02-01',
      creator: 'Maria Santos',
      isJoined: false,
      posts: [
        {
          id: 'p3',
          author: { name: 'Carlos Dev', avatar: '👨‍💻' },
          content: 'Alguém já testou o novo React 19? Que mudanças vocês notaram?',
          timestamp: '1h atrás',
          likes: 67,
          comments: 23,
          liked: false
        }
      ]
    },
    { 
      id: '3', 
      name: 'Music Lovers', 
      icon: '🎵', 
      members: 20000, 
      color: '#95E1D3',
      description: 'Para os apaixonados por música! Descubra novos artistas, compartilhe playlists e discuta sobre música.',
      category: 'Música',
      createdAt: '2023-12-10',
      creator: 'Juliana Rocha',
      isJoined: true,
      posts: [
        {
          id: 'p4',
          author: { name: 'Roberto Músico', avatar: '🎸' },
          content: 'Acabou de sair o novo álbum do Coldplay! Alguém já ouviu?',
          timestamp: '3h atrás',
          likes: 89,
          comments: 34,
          liked: true
        }
      ]
    },
    { 
      id: '4', 
      name: 'Futebol', 
      icon: '⚽', 
      members: 50000, 
      color: '#3498DB',
      description: 'A paixão nacional! Discuta sobre times, jogadores, campeonatos e tudo sobre futebol.',
      category: 'Esportes',
      createdAt: '2023-11-20',
      creator: 'Vinicius Junior',
      isJoined: true,
      posts: [
        {
          id: 'p5',
          author: { name: 'Vinicius Junior', avatar: '⚽' },
          content: 'Que jogo incrível hoje! O Real Madrid está voando! Hala Madrid! 🏆',
          timestamp: '1h atrás',
          likes: 234,
          comments: 67,
          liked: false
        }
      ]
    }
  ]);

  const filteredCommunities = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'minhas') {
      return matchesSearch && c.isJoined;
    }
    if (filter === 'trending') {
      return matchesSearch && c.members > 10000;
    }
    return matchesSearch;
  });

  const createCommunity = () => {
    if (!newCommunity.name.trim() || !newCommunity.description.trim()) {
      alert('Preencha nome e descrição da comunidade');
      return;
    }

    const community: Community = {
      id: `c${Date.now()}`,
      name: newCommunity.name,
      icon: newCommunity.icon,
      members: 1,
      color: newCommunity.color,
      description: newCommunity.description,
      category: newCommunity.category,
      createdAt: new Date().toISOString().split('T')[0],
      creator: 'Vinicius Junior',
      isJoined: true,
      posts: []
    };

    setCommunities([community, ...communities]);
    setNewCommunity({
      name: '',
      description: '',
      category: 'geral',
      icon: '🏘️',
      color: '#3498DB'
    });
    setShowCreateModal(false);
    alert('Comunidade criada com sucesso! 🎉');
  };

  const joinCommunity = (communityId: string) => {
    setCommunities(communities.map(c => {
      if (c.id === communityId) {
        return {
          ...c,
          isJoined: !c.isJoined,
          members: c.isJoined ? c.members - 1 : c.members + 1
        };
      }
      return c;
    }));
  };

  const togglePostLike = (communityId: string, postId: string) => {
    setCommunities(communities.map(c => {
      if (c.id === communityId) {
        return {
          ...c,
          posts: c.posts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                liked: !p.liked,
                likes: p.liked ? p.likes - 1 : p.likes + 1
              };
            }
            return p;
          })
        };
      }
      return c;
    }));
  };

  const iconOptions = ['🏘️', '🎮', '💻', '🎵', '📚', '🍕', '🎬', '⚽', '🎨', '🚀', '💡', '🌟', '🔥', '💎', '🎯', '🌈'];
  const colorOptions = ['#3498DB', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E'];

  return (
    <div className="py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Comunidades</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-orkut-blue text-white px-6 py-2 rounded-lg hover:bg-orkut-blue-dark transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Comunidade</span>
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

      {/* Communities Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {filteredCommunities.map((community) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer group"
              onClick={() => setSelectedCommunity(community)}
            >
              <div
                className="h-32 rounded-t-lg flex items-center justify-center text-6xl relative"
                style={{ backgroundColor: community.color }}
              >
                {community.icon}
                {community.isJoined && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Membro
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orkut-blue">
                  {community.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Users className="w-4 h-4 mr-1" />
                  {community.members.toLocaleString()} membros
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {community.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Community Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Criar Nova Comunidade
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Icon and Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ícone e Cor
                  </label>
                  <div className="flex items-center space-x-4 mb-3">
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: newCommunity.color }}
                    >
                      {newCommunity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-8 gap-1 mb-2">
                        {iconOptions.map((icon) => (
                          <button
                            key={icon}
                            onClick={() => setNewCommunity({ ...newCommunity, icon })}
                            className={`w-8 h-8 rounded flex items-center justify-center text-lg hover:bg-gray-100 transition ${
                              newCommunity.icon === icon ? 'bg-orkut-blue text-white' : ''
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                      <div className="flex space-x-1">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewCommunity({ ...newCommunity, color })}
                            className={`w-6 h-6 rounded-full border-2 ${
                              newCommunity.color === color ? 'border-gray-800' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Comunidade
                  </label>
                  <input
                    type="text"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                    placeholder="Ex: Desenvolvedores React"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orkut-blue"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                    placeholder="Descreva o propósito da sua comunidade..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orkut-blue"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={newCommunity.category}
                    onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orkut-blue"
                  >
                    <option value="geral">Geral</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="games">Games</option>
                    <option value="musica">Música</option>
                    <option value="esportes">Esportes</option>
                    <option value="entretenimento">Entretenimento</option>
                    <option value="educacao">Educação</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={createCommunity}
                    disabled={!newCommunity.name.trim() || !newCommunity.description.trim()}
                    className="flex-1 px-4 py-2 bg-orkut-blue text-white rounded-lg hover:bg-orkut-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Criar Comunidade
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Details Modal */}
      <AnimatePresence>
        {selectedCommunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCommunity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="p-6 text-white relative"
                style={{ backgroundColor: selectedCommunity.color }}
              >
                <button
                  onClick={() => setSelectedCommunity(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{selectedCommunity.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCommunity.name}</h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm opacity-90">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {selectedCommunity.members.toLocaleString()} membros
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Criada em {new Date(selectedCommunity.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Sobre a Comunidade</h3>
                  <p className="text-gray-700">{selectedCommunity.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                    <span>Categoria: {selectedCommunity.category}</span>
                    <span>Criador: {selectedCommunity.creator}</span>
                  </div>
                </div>

                {/* Join Button */}
                <div className="mb-6">
                  <button
                    onClick={() => joinCommunity(selectedCommunity.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      selectedCommunity.isJoined
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-orkut-blue text-white hover:bg-orkut-blue-dark'
                    }`}
                  >
                    {selectedCommunity.isJoined ? '✓ Membro da Comunidade' : 'Participar da Comunidade'}
                  </button>
                </div>

                {/* Recent Posts */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Posts Recentes</h3>
                  {selectedCommunity.posts.length > 0 ? (
                    <div className="space-y-4">
                      {selectedCommunity.posts.map((post) => (
                        <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orkut-blue to-orkut-pink flex items-center justify-center text-sm">
                              {post.author.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-gray-900">
                                {post.author.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {post.timestamp}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-800 mb-3">{post.content}</p>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => togglePostLike(selectedCommunity.id, post.id)}
                              className={`flex items-center space-x-1 text-sm transition ${
                                post.liked ? 'text-orkut-pink' : 'text-gray-600 hover:text-orkut-pink'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orkut-blue transition">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orkut-blue transition">
                              <Share2 className="w-4 h-4" />
                              <span>Compartilhar</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Nenhum post ainda</p>
                      <p className="text-sm">Seja o primeiro a postar nesta comunidade!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
