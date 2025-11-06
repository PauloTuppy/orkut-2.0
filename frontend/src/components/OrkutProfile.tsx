import { User, Star, Users, Eye } from 'lucide-react';

interface OrkutProfileProps {
  user: {
    name: string;
    avatar: string;
    friends: number;
    fans: number;
    views: number;
    rating: number;
  };
}

export function OrkutProfile({ user }: OrkutProfileProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-64">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full border-4 border-orkut-blue"
        />
        <h3 className="mt-3 text-lg font-semibold text-gray-900">
          {user.name}
        </h3>
        
        {/* Rating (5 stars) */}
        <div className="flex mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < user.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            Amigos
          </span>
          <span className="font-semibold text-orkut-blue">
            {user.friends}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-600">
            <Star className="w-4 h-4 mr-2" />
            Fãs
          </span>
          <span className="font-semibold text-orkut-pink">
            {user.fans}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-600">
            <Eye className="w-4 h-4 mr-2" />
            Visitas
          </span>
          <span className="font-semibold text-gray-700">
            {user.views}
          </span>
        </div>
      </div>

      {/* Actions */}
      <button className="mt-6 w-full bg-orkut-blue text-white py-2 rounded-lg hover:bg-orkut-blue-dark transition">
        Editar Perfil
      </button>
    </div>
  );
}
