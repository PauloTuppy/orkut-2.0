import { useState } from 'react';
import { Search, Download, Upload, Folder, Music, File } from 'lucide-react';
import { motion } from 'framer-motion';

interface SharedFile {
  id: string;
  name: string;
  size: string;
  type: 'music' | 'video' | 'document';
  downloads: number;
  peers: number;
}

interface DownloadItem {
  id: string;
  name: string;
  progress: number;
  speed: string;
  eta: string;
}

const SHARED_FILES: SharedFile[] = [
  {
    id: '1',
    name: 'música.mp3',
    size: '3.5 MB',
    type: 'music',
    downloads: 1250,
    peers: 342
  },
  {
    id: '2',
    name: 'video.mp4',
    size: '50 MB',
    type: 'video',
    downloads: 568,
    peers: 126
  },
  {
    id: '3',
    name: 'documento.pdf',
    size: '1.2 MB',
    type: 'document',
    downloads: 234,
    peers: 45
  }
];

export default function P2PShare() {
  const [files] = useState(SHARED_FILES);
  const [downloads] = useState<DownloadItem[]>([
    {
      id: '1',
      name: 'música.mp3',
      progress: 80,
      speed: '500 KB/s',
      eta: '2s'
    },
    {
      id: '2',
      name: 'video.mp4',
      progress: 30,
      speed: '1.2 MB/s',
      eta: '45s'
    }
  ]);

  const getFileIcon = (type: SharedFile['type']) => {
    switch (type) {
      case 'music':
        return <Music className="w-5 h-5 text-blue-500" />;
      case 'video':
        return '🎬';
      case 'document':
        return <File className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          💿 Orkut Share (P2P)
        </h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar arquivos..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orkut-blue"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-gray-600 text-sm">Peers Online</p>
            <p className="text-2xl font-bold text-orkut-blue">1,245</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-gray-600 text-sm">Arquivos</p>
            <p className="text-2xl font-bold text-orkut-pink">3,842</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-gray-600 text-sm">Compartilhados</p>
            <p className="text-2xl font-bold text-msn-green">24</p>
          </div>
        </div>
      </motion.div>

      {/* Downloads */}
      {downloads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white rounded-lg shadow-md p-4"
        >
          <h2 className="font-bold text-lg text-gray-900 mb-4">
            📥 Downloads Ativos
          </h2>
          <div className="space-y-3">
            {downloads.map((dl) => (
              <div key={dl.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {dl.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {dl.progress}% • ↓ {dl.speed} • ETA: {dl.eta}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dl.progress}%` }}
                    className="bg-msn-green h-2 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-4 border-b font-bold text-gray-900">
          Resultados de Busca
        </div>
        <div className="divide-y">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50 transition flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-600">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {file.size} • Baixado {file.downloads}x • {file.peers}{' '}
                    peers
                  </p>
                </div>
              </div>
              <button className="bg-msn-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* My Shared Files */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-white rounded-lg shadow-md p-4"
      >
        <h2 className="font-bold text-lg text-gray-900 mb-4">
          📁 Arquivos Compartilhados (Meus)
        </h2>
        <div className="space-y-2">
          <button className="w-full p-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-orkut-blue hover:text-orkut-blue transition">
            <Upload className="w-5 h-5 inline mr-2" />
            Clique para adicionar arquivos
          </button>
          <div className="mt-4 space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Folder className="w-5 h-5 text-yellow-500" />
                <span>Música (50 arquivos)</span>
              </div>
              <span className="text-xs text-gray-500">↑ 150 uploads</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Folder className="w-5 h-5 text-yellow-500" />
                <span>Documentos (12 arquivos)</span>
              </div>
              <span className="text-xs text-gray-500">↑ 30 uploads</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
