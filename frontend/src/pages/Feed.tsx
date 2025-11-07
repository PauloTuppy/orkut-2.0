import { useState, useEffect } from 'react';
import { Search, Bookmark, Share2, ExternalLink, Sparkles, Clock, Plus, Rss, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import aiService from '../services/aiService';

interface FeedItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  image?: string;
  link: string;
  source: string;
  published?: string;
  author?: string;
  tags?: string[];
  category?: string;
  saved?: boolean;
  hasAISummary?: boolean;
}

interface RSSFeed {
  name: string;
  url: string;
  category: string;
  description: string;
  language: string;
  active?: boolean;
}



export default function Feed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [availableFeeds, setAvailableFeeds] = useState<RSSFeed[]>([]);
  const [activeFeeds, setActiveFeeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('todos');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'magazine'>('list');
  const [showAddFeed, setShowAddFeed] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState('');

  // Load popular feeds on component mount
  useEffect(() => {
    loadPopularFeeds();
  }, []);

  const loadPopularFeeds = async () => {
    try {
      setLoading(true);
      const response = await aiService.getPopularFeeds();
      setAvailableFeeds(response.feeds);
      
      // Auto-activate first 3 feeds
      const defaultFeeds = response.feeds.slice(0, 3).map((feed: RSSFeed) => feed.url);
      setActiveFeeds(defaultFeeds);
      
      // Load content from default feeds
      await loadFeedContent(defaultFeeds);
    } catch (error) {
      console.error('Erro ao carregar feeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeedContent = async (feedUrls: string[]) => {
    try {
      setLoading(true);
      const allItems: FeedItem[] = [];

      for (const url of feedUrls) {
        try {
          const response = await aiService.fetchRSSFeed(url, 10);
          const feedItems: FeedItem[] = response.items.map((item: any) => ({
            ...item,
            category: availableFeeds.find(f => f.url === url)?.category || 'Geral',
            saved: false,
            hasAISummary: Math.random() > 0.7 // Random AI summary for demo
          }));
          allItems.push(...feedItems);
        } catch (error) {
          console.error(`Erro ao carregar feed ${url}:`, error);
        }
      }

      // Sort by published date
      allItems.sort((a, b) => {
        const dateA = new Date(a.published || 0);
        const dateB = new Date(b.published || 0);
        return dateB.getTime() - dateA.getTime();
      });

      setItems(allItems);
    } catch (error) {
      console.error('Erro ao carregar conteúdo dos feeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await aiService.searchRSSContent(searchQuery, activeFeeds);
      const searchItems: FeedItem[] = response.results.map((item: any) => ({
        ...item,
        category: 'Busca',
        saved: false,
        hasAISummary: false
      }));
      setItems(searchItems);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomFeed = async () => {
    if (!newFeedUrl.trim()) return;

    try {
      setLoading(true);
      const response = await aiService.fetchRSSFeed(newFeedUrl, 5);
      
      const newFeed: RSSFeed = {
        name: response.feed_info.title,
        url: newFeedUrl,
        category: 'Personalizado',
        description: response.feed_info.description,
        language: response.feed_info.language || 'pt-br',
        active: true
      };

      setAvailableFeeds([...availableFeeds, newFeed]);
      setActiveFeeds([...activeFeeds, newFeedUrl]);
      setNewFeedUrl('');
      setShowAddFeed(false);

      // Reload content
      await loadFeedContent([...activeFeeds, newFeedUrl]);
    } catch (error) {
      console.error('Erro ao adicionar feed:', error);
      alert('Erro ao adicionar feed. Verifique a URL e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeed = async (feedUrl: string) => {
    const newActiveFeeds = activeFeeds.includes(feedUrl)
      ? activeFeeds.filter(url => url !== feedUrl)
      : [...activeFeeds, feedUrl];
    
    setActiveFeeds(newActiveFeeds);
    await loadFeedContent(newActiveFeeds);
  };

  const refreshFeeds = async () => {
    await loadFeedContent(activeFeeds);
  };

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar artigos em todos os feeds..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orkut-blue"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-orkut-blue text-white px-4 py-2 rounded-lg hover:bg-orkut-blue-dark transition flex items-center space-x-2 disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={refreshFeeds}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowAddFeed(!showAddFeed)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Add Custom Feed */}
        {showAddFeed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Adicionar Feed RSS</h3>
            <div className="flex space-x-2">
              <input
                type="url"
                value={newFeedUrl}
                onChange={(e) => setNewFeedUrl(e.target.value)}
                placeholder="https://exemplo.com/rss"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={addCustomFeed}
                disabled={loading || !newFeedUrl.trim()}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
              >
                Adicionar
              </button>
            </div>
          </motion.div>
        )}

        {/* Active Feeds */}
        {availableFeeds.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {availableFeeds.map((feed) => (
              <button
                key={feed.url}
                onClick={() => toggleFeed(feed.url)}
                className={`px-3 py-1 rounded-full text-sm transition flex items-center space-x-1 ${
                  activeFeeds.includes(feed.url)
                    ? 'bg-orkut-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Rss className="w-3 h-3" />
                <span>{feed.name}</span>
              </button>
            ))}
          </div>
        )}

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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-orkut-blue mx-auto mb-4" />
            <p className="text-gray-600">Carregando feeds RSS...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Rss className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum artigo encontrado</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Tente uma busca diferente ou' : 'Adicione feeds RSS para começar ou'} 
          </p>
          <button
            onClick={() => setShowAddFeed(true)}
            className="bg-orkut-blue text-white px-6 py-2 rounded-lg hover:bg-orkut-blue-dark transition"
          >
            Adicionar Feed RSS
          </button>
        </div>
      )}

      {/* Feed Items */}
      {!loading && filteredItems.length > 0 && (
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
                  {item.category || 'Geral'}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {item.published ? new Date(item.published).toLocaleDateString('pt-BR') : 'Data não disponível'}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-orkut-blue cursor-pointer">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>

              {item.hasAISummary && item.content && (
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
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
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
      )}
    </div>
  );
}
