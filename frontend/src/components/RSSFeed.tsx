import { Bookmark, ExternalLink, Sparkles, Clock } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  source: string;
  image: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  category: string;
}

interface RSSFeedProps {
  articles: Article[];
}

export function RSSFeed({ articles }: RSSFeedProps) {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div
          key={article.id}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
        >
          {/* Image */}
          <div className="h-48 bg-gray-200 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <span className="font-semibold text-orkut-blue">
                {article.source}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {article.publishedAt}
              </span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-orkut-blue cursor-pointer">
              {article.title}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {article.excerpt}
            </p>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Ver Resumo Gemini</span>
              </button>
              <button className="p-2 text-gray-600 hover:text-orkut-blue transition">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-orkut-blue transition">
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
