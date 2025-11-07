import { useState } from 'react';
import { Heart, MessageCircle, Share2, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  community: string;
  liked?: boolean;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: { name: 'João Silva', avatar: '👤' },
      content: 'Acabei de descobrir essa nova comunidade incrível! 🚀',
      timestamp: '2h atrás',
      likes: 42,
      comments: [
        {
          id: 'c1',
          author: { name: 'Ana Costa', avatar: '👩‍💻' },
          content: 'Qual comunidade? Estou procurando novas também!',
          timestamp: '1h atrás',
          likes: 3
        },
        {
          id: 'c2',
          author: { name: 'Pedro Lima', avatar: '👨‍🎓' },
          content: 'Compartilha aí! 😄',
          timestamp: '45min atrás',
          likes: 1
        }
      ],
      community: 'Tech',
      liked: false
    },
    {
      id: '2',
      author: { name: 'Maria Santos', avatar: '👩' },
      content: 'Quem mais está viciado em ouvir música? 🎵',
      timestamp: '4h atrás',
      likes: 156,
      comments: [
        {
          id: 'c3',
          author: { name: 'Carlos Silva', avatar: '👨‍🎤' },
          content: 'Eu! Não consigo parar de ouvir o novo álbum do Coldplay',
          timestamp: '3h atrás',
          likes: 8
        },
        {
          id: 'c4',
          author: { name: 'Juliana Rocha', avatar: '👩‍🎨' },
          content: 'Música é vida! 🎶 Qual seu gênero favorito?',
          timestamp: '2h atrás',
          likes: 5
        }
      ],
      community: 'Música',
      liked: false
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [showShareModal, setShowShareModal] = useState<string | null>(null);

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: string) => {
    const newShowComments = new Set(showComments);
    if (newShowComments.has(postId)) {
      newShowComments.delete(postId);
    } else {
      newShowComments.add(postId);
    }
    setShowComments(newShowComments);
  };

  const addComment = (postId: string) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: { name: 'Vinicius Junior', avatar: '⚽' },
      content: commentText,
      timestamp: 'agora',
      likes: 0
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    }));

    setNewComment({ ...newComment, [postId]: '' });
  };

  const createPost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: `p${Date.now()}`,
      author: { name: 'Vinicius Junior', avatar: '⚽' },
      content: newPost,
      timestamp: 'agora',
      likes: 0,
      comments: [],
      community: 'Geral',
      liked: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const shareToChat = (post: Post) => {
    const shareText = `${post.author.name} compartilhou: "${post.content}" - Orkut 2.0`;
    
    // Simular compartilhamento no chat MSN
    const chatWindow = window.open('/chat-msn', '_blank', 'width=400,height=600');
    if (chatWindow) {
      // Enviar dados para o chat (simulado)
      setTimeout(() => {
        try {
          chatWindow.postMessage({
            type: 'SHARE_POST',
            data: { text: shareText, post }
          }, '*');
        } catch (e) {
          console.log('Chat window not ready yet');
        }
      }, 1000);
    }
    
    setShowShareModal(null);
    alert('Post compartilhado no chat MSN! 💬');
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
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orkut-blue to-orkut-pink flex items-center justify-center text-white text-xl">
            ⚽
          </div>
          <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createPost()}
            placeholder="No que você está pensando, Vinicius?"
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orkut-blue"
          />
          <button 
            onClick={createPost}
            disabled={!newPost.trim()}
            className="bg-orkut-pink text-white px-6 py-2 rounded-full hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
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
              <span>💬 {post.comments.length} comentários</span>
            </div>

            {/* Post Actions */}
            <div className="p-3 flex justify-around">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center space-x-2 flex-1 py-2 justify-center rounded-lg transition ${
                  post.liked
                    ? 'bg-orkut-pink bg-opacity-20 text-orkut-pink'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={post.liked ? 'currentColor' : 'none'}
                />
                <span>Curtir</span>
              </button>
              <button 
                onClick={() => toggleComments(post.id)}
                className="flex items-center space-x-2 flex-1 py-2 justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Comentar</span>
              </button>
              <button 
                onClick={() => setShowShareModal(post.id)}
                className="flex items-center space-x-2 flex-1 py-2 justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <Share2 className="w-5 h-5" />
                <span>Compartilhar</span>
              </button>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
              {showComments.has(post.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t bg-gray-50"
                >
                  {/* Existing Comments */}
                  <div className="p-4 space-y-3">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm">
                          {comment.author.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-sm text-gray-900">
                                {comment.author.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 ml-3">
                            <button className="text-xs text-gray-500 hover:text-orkut-pink transition">
                              ❤️ {comment.likes}
                            </button>
                            <button className="text-xs text-gray-500 hover:text-orkut-blue transition">
                              Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orkut-blue to-orkut-pink flex items-center justify-center text-sm">
                        ⚽
                      </div>
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                          placeholder="Escreva um comentário..."
                          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orkut-blue"
                        />
                        <button
                          onClick={() => addComment(post.id)}
                          disabled={!newComment[post.id]?.trim()}
                          className="bg-orkut-blue text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowShareModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Compartilhar Post
                </h3>
                <button
                  onClick={() => setShowShareModal(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    const post = posts.find(p => p.id === showShareModal);
                    if (post) shareToChat(post);
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-msn-green bg-opacity-10 rounded-lg hover:bg-opacity-20 transition"
                >
                  <div className="w-10 h-10 bg-msn-green rounded-lg flex items-center justify-center text-white">
                    💬
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Chat MSN</div>
                    <div className="text-sm text-gray-600">
                      Compartilhar no chat com amigos
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const post = posts.find(p => p.id === showShareModal);
                    if (post) {
                      navigator.clipboard.writeText(`${post.author.name}: "${post.content}" - Orkut 2.0`);
                      alert('Link copiado para a área de transferência! 📋');
                      setShowShareModal(null);
                    }
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-orkut-blue bg-opacity-10 rounded-lg hover:bg-opacity-20 transition"
                >
                  <div className="w-10 h-10 bg-orkut-blue rounded-lg flex items-center justify-center text-white">
                    📋
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Copiar Link</div>
                    <div className="text-sm text-gray-600">
                      Copiar para área de transferência
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const post = posts.find(p => p.id === showShareModal);
                    if (post) {
                      const shareText = `${post.author.name}: "${post.content}" - Orkut 2.0`;
                      if (navigator.share) {
                        navigator.share({
                          title: 'Post do Orkut 2.0',
                          text: shareText,
                          url: window.location.href
                        });
                      } else {
                        alert('Compartilhamento não suportado neste navegador');
                      }
                      setShowShareModal(null);
                    }
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-orkut-pink bg-opacity-10 rounded-lg hover:bg-opacity-20 transition"
                >
                  <div className="w-10 h-10 bg-orkut-pink rounded-lg flex items-center justify-center text-white">
                    📱
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Compartilhar</div>
                    <div className="text-sm text-gray-600">
                      Usar compartilhamento nativo
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
