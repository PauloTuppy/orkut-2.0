import { Users } from 'lucide-react';

interface Community {
  id: string;
  name: string;
  icon: string;
  members: number;
  color: string;
}

interface CommunityGridProps {
  communities: Community[];
}

export function CommunityGrid({ communities }: CommunityGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {communities.map((community) => (
        <div
          key={community.id}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer group"
        >
          <div
            className="h-32 rounded-t-lg flex items-center justify-center text-6xl"
            style={{ backgroundColor: community.color }}
          >
            {community.icon}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orkut-blue">
              {community.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {community.members.toLocaleString()} membros
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
