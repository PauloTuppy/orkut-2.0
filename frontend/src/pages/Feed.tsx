import { useState } from 'react';
import { Search, Filter, Bookmark, Share2, ExternalLink, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeedItem {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  source: string;
  category: string;
  timestamp: string;
  likes: number;
  saved: boolean;
  hasAISummary: boolean;
}

const FEED_ITEMS: FeedItem[] = [
  {
    id: '1',
    title: 'Inteligência Artificial Revoluciona o Desenvolvimento',
    description: 'Como a IA está mudando a forma como desenvolvemos software',
    content: 'A inteligência artificial está transformando radicalmente o desenvolvimento de software...',
    image: '🤖',
    source: 'TechCrunch',
    category: 'Tech',
    timestamp: '2h atrás',
    likes: 345,
    saved: false,
    hasAISummary: true
  },
  {
    id: '2',
    title: 'Brasil Campeão em Inovação de Startups',
    description: 'Ecossistema de startups brasileiro cresce 150% em 2024',
    content: 'O Brasil se consolida como um dos principais hubs de inovação...',
    image: '🚀',
    source: 'Exame',
    category: 'Negócios',
    timestamp: '4h atrás',
    likes: 812,
    saved: false,
    hasAISummary: false
  },
  {
    id: '3',
    title: 'Novo Protocolo de Segurança em Blockchain',
    description: 'Inovação promete revolucionar a criptografia',
    content: 'Um novo protocolo de segurança baseado em blockchain...',
    image: '🔐',
    source: 'CoinDesk',
    category: 'Cripto',
    timestamp: '6h atrás',
    likes: 567,
    saved: false,
    hasAISummary: true
  }
];

export default function Feed() {
  const [items, setItems] = useState(FEED_ITEMS);
  const [filter, setFilter] = useState('todos');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'magazine'>('list');

  const toggleSave = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, saved: !item.saved } : item
      )
    );
  };

  const filteredItems = items.filter(
    (item) => filter === 'todos' || (filter === 'saved' && item.saved)
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">📰 Feed RSS</h1>

        {/* Search and Filters */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orkut-blue"
            />
          </div>
          <button className="bg-orkut-blue text-white px-4 py-2 rounded-lg hover:bg-orkut-blue-dark transition flex items-center space-x-2">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* View Modes */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {(['list', 'grid', 'magazine'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded text-sm transition ${
                  viewMode === mode
                    ? 'bg-orkut-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {mode === 'list' && '☰'}
                {mode === 'grid' && '⊞'}
                {mode === 'magazine' && '▦'}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            {['todos', 'saved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded text-sm transition ${
                  filter === f
                    ? 'bg-orkut-pink text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f === 'todos' ? 'Tudo' : 'Salvos'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Feed Items */}
      <div
        className={
          viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'
        }
      >
        {filteredItems.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {/* Image */}
            <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-6xl relative">
              {item.image}
              {item.hasAISummary && (
                <div className="absolute top-2 right-2 bg-orkut-pink text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>IA</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-semibold text-orkut-blue bg-blue-50 px-2 py-1 rounded">
                  {item.category}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {item.timestamp}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-orkut-blue cursor-pointer">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>

              {item.hasAISummary && (
                <div className="bg-blue-50 border-l-4 border-orkut-blue p-3 mb-4 rounded">
                  <p className="text-xs text-gray-700">
                    <strong>Resumo IA:</strong> {item.content.substring(0, 80)}
                    ...
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-xs text-gray-500">{item.source}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSave(item.id)}
                    className={`p-1 rounded hover:bg-gray-100 transition ${
                      item.saved ? 'text-orkut-pink' : 'text-gray-400'
                    }`}
                  >
                    <Bookmark
                      className="w-4 h-4"
                      fill={item.saved ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <a
                    href="#"
                    className="text-orkut-blue hover:text-orkut-blue-dark p-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
