import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  community: string;
}

export default function Dashboard() {
  const [posts] = useState<Post[]>([
    {
      id: '1',
      author: { name: 'João Silva', avatar: '👤' },
      content: 'Acabei de descobrir essa nova comunidade incrível! 🚀',
      timestamp: '2h atrás',
      likes: 42,
      comments: 8,
      community: 'Tech'
    },
    {
      id: '2',
      author: { name: 'Maria Santos', avatar: '👩' },
      content: 'Quem mais está viciado em ouvir música? 🎵',
      timestamp: '4h atrás',
      likes: 156,
      comments: 34,
      community: 'Música'
    }
  ]);

  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    const newLiked = new Set(liked);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLiked(newLiked);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="orkut-gradient rounded-lg shadow-lg p-6 mb-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Orkut 2.0! 🎉</h1>
        <p className="opacity-90">
          Conecte com amigos, explore comunidades e descubra conteúdo incrível
        </p>
      </motion.div>

      {/* Create Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-4 mb-6"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-orkut-blue flex items-center justify-center text-white text-xl">
            👤
          </div>
          <input
            type="text"
            placeholder="No que você está pensando?"
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orkut-blue"
          />
          <button className="bg-orkut-pink text-white px-6 py-2 rounded-full hover:bg-pink-600 transition">
            Postar
          </button>
        </div>
      </motion.div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {/* Post Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orkut-blue to-orkut-pink flex items-center justify-center text-xl">
                  {post.author.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {post.author.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {post.timestamp} • {post.community}
                  </p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
              <p className="text-gray-800">{post.content}</p>
            </div>

            {/* Post Stats */}
            <div className="px-4 py-2 border-t border-b text-sm text-gray-600 flex justify-between">
              <span>❤️ {post.likes} curtidas</span>
              <span>💬 {post.comments} comentários</span>
            </div>

            {/* Post Actions */}
            <div className="p-3 flex justify-around">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center space-x-2 flex-1 py-2 justify-center rounded-lg transition ${
                  liked.has(post.id)
                    ? 'bg-orkut-pink bg-opacity-20 text-orkut-pink'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={liked.has(post.id) ? 'currentColor' : 'none'}
                />
                <span>Curtir</span>
              </button>
              <button className="flex items-center space-x-2 flex-1 py-2 justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <MessageCircle className="w-5 h-5" />
                <span>Comentar</span>
              </button>
              <button className="flex items-center space-x-2 flex-1 py-2 justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Share2 className="w-5 h-5" />
                <span>Compartilhar</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
