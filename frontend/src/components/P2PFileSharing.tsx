import { Search, Download, Upload, Music, FileText, Film, Folder } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'music' | 'document' | 'video';
  size: string;
  seeds: number;
}

interface P2PFileSharingProps {
  files: FileItem[];
  downloads: Array<{
    name: string;
    progress: number;
    speed: string;
  }>;
}

export function P2PFileSharing({ files, downloads }: P2PFileSharingProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'music':
        return <Music className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'video':
        return <Film className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-napster-gray rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          💿 Orkut Share (P2P)
        </h2>
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Peers online:</span> 1,245
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex items-center bg-white rounded-lg border-2 border-napster-border p-3">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Buscar arquivos..."
            className="flex-1 outline-none text-gray-700"
          />
          <button className="bg-orkut-blue text-white px-4 py-2 rounded-lg hover:bg-orkut-blue-dark transition">
            Buscar
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">RESULTADOS</h3>
        <div className="bg-white rounded-lg border-2 border-napster-border overflow-hidden">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-3 flex-1">
                {getFileIcon(file.type)}
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {file.size} • {file.seeds} seeds
                  </p>
                </div>
              </div>
              <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Downloads */}
      {downloads.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            DOWNLOADS ATIVOS
          </h3>
          <div className="bg-white rounded-lg border-2 border-napster-border p-4 space-y-3">
            {downloads.map((download, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {download.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    ↓ {download.speed}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${download.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {download.progress}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shared Files */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">
          COMPARTILHADOS (Meus arquivos)
        </h3>
        <div className="bg-white rounded-lg border-2 border-napster-border p-4 space-y-2">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition">
            <div className="flex items-center space-x-3">
              <Folder className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium text-gray-900">Música</p>
                <p className="text-sm text-gray-500">50 arquivos</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Upload className="w-4 h-4" />
              <span>150 uploads</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition">
            <div className="flex items-center space-x-3">
              <Folder className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium text-gray-900">Documentos</p>
                <p className="text-sm text-gray-500">12 arquivos</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Upload className="w-4 h-4" />
              <span>30 uploads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
