import { useState, useEffect, useRef } from 'react';
import { Search, Download, Upload, Folder, Music, File, Play, Pause, Volume2, Trash2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import aiService from '../services/aiService';

interface SharedFile {
  id: string;
  name: string;
  original_name: string;
  size: number;
  type: string;
  category: string;
  description?: string;
  upload_date: string;
  downloads: number;
  peers: number;
  is_audio: boolean;
}

interface P2PStats {
  online_peers: number;
  total_files: number;
  total_downloads: number;
  categories: Record<string, { files: number; size: number }>;
  network_status: string;
}

interface MediaPlayer {
  currentFile: SharedFile | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isVideo: boolean;
}

export default function P2PShare() {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [stats, setStats] = useState<P2PStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('music');
  const [uploadDescription, setUploadDescription] = useState('');
  
  // Media Player State (Audio + Video)
  const [player, setPlayer] = useState<MediaPlayer>({
    currentFile: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isVideo: false
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data on component mount
  useEffect(() => {
    loadFiles();
    loadStats();
  }, []);

  // Media player effects (Audio + Video)
  useEffect(() => {
    const media = player.isVideo ? videoRef.current : audioRef.current;
    if (!media) return;

    const updateTime = () => {
      setPlayer(prev => ({
        ...prev,
        currentTime: media.currentTime,
        duration: media.duration || 0
      }));
    };

    const handleEnded = () => {
      setPlayer(prev => ({ ...prev, isPlaying: false }));
    };

    media.addEventListener('timeupdate', updateTime);
    media.addEventListener('ended', handleEnded);
    media.addEventListener('loadedmetadata', updateTime);

    return () => {
      media.removeEventListener('timeupdate', updateTime);
      media.removeEventListener('ended', handleEnded);
      media.removeEventListener('loadedmetadata', updateTime);
    };
  }, [player.currentFile, player.isVideo]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await aiService.getSharedFiles(
        selectedCategory === 'all' ? undefined : selectedCategory,
        searchQuery || undefined
      );
      setFiles(response.files);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await aiService.getP2PStats();
      setStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
      'video/mp4', 'video/avi', 'video/mkv',
      'application/pdf', 'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não suportado. Use MP3, WAV, MP4, PDF ou TXT.');
      return;
    }

    // Check file size (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Arquivo muito grande! Máximo permitido: 100MB');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      await aiService.uploadFile(
        file,
        uploadCategory,
        uploadDescription,
        (progress) => setUploadProgress(progress)
      );

      // Reset form
      setUploadDescription('');
      setShowUpload(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Reload files and stats
      await loadFiles();
      await loadStats();

      alert('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar arquivo. Tente novamente.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (file: SharedFile) => {
    try {
      const blob = await aiService.downloadFile(file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.original_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Reload stats to update download count
      await loadStats();
    } catch (error) {
      console.error('Erro no download:', error);
      alert('Erro ao baixar arquivo.');
    }
  };

  const playMedia = (file: SharedFile) => {
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.is_audio;
    
    if (!isVideo && !isAudio) return;

    const media = isVideo ? videoRef.current : audioRef.current;
    if (!media) return;

    if (player.currentFile?.id === file.id) {
      // Toggle play/pause for current file
      if (player.isPlaying) {
        media.pause();
        setPlayer(prev => ({ ...prev, isPlaying: false }));
      } else {
        media.play();
        setPlayer(prev => ({ ...prev, isPlaying: true }));
      }
    } else {
      // Stop current media if playing different type
      if (player.currentFile) {
        const currentMedia = player.isVideo ? videoRef.current : audioRef.current;
        if (currentMedia) {
          currentMedia.pause();
          currentMedia.currentTime = 0;
        }
      }

      // Load new file
      const streamUrl = aiService.getStreamUrl(file.id);
      media.src = streamUrl;
      media.load();
      media.play();
      setPlayer(prev => ({
        ...prev,
        currentFile: file,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        isVideo: isVideo
      }));
    }
  };

  const stopMedia = () => {
    const audio = audioRef.current;
    const video = videoRef.current;
    
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    
    setPlayer(prev => ({
      ...prev,
      currentFile: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isVideo: false
    }));
  };

  const seekMedia = (time: number) => {
    const media = player.isVideo ? videoRef.current : audioRef.current;
    if (media) {
      media.currentTime = time;
    }
  };

  const setVolume = (volume: number) => {
    const audio = audioRef.current;
    const video = videoRef.current;
    
    if (audio) audio.volume = volume;
    if (video) video.volume = volume;
    
    setPlayer(prev => ({ ...prev, volume }));
  };

  const handleSearch = () => {
    loadFiles();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Reload files with new category
    setTimeout(loadFiles, 100);
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return;

    try {
      await aiService.deleteFile(fileId);
      await loadFiles();
      await loadStats();
      
      // Stop media if it's the current file
      if (player.currentFile?.id === fileId) {
        stopMedia();
      }
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      alert('Erro ao excluir arquivo.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (file: SharedFile) => {
    if (file.is_audio) {
      return <Music className="w-5 h-5 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <div className="text-purple-500 text-lg">🎬</div>;
    } else if (file.type.includes('pdf')) {
      return <File className="w-5 h-5 text-red-500" />;
    } else {
      return <File className="w-5 h-5 text-green-500" />;
    }
  };

  const canPlayMedia = (file: SharedFile) => {
    return file.is_audio || file.type.startsWith('video/');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hidden Media Elements */}
      <audio ref={audioRef} />
      <video ref={videoRef} className="hidden" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          💿 Orkut Share (P2P)
        </h1>

        {/* Search and Controls */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar arquivos..."
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
            onClick={loadFiles}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-6">
          {['all', 'music', 'video', 'document', 'general'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                selectedCategory === category
                  ? 'bg-orkut-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category === 'all' ? 'Todos' : 
               category === 'music' ? 'Música' :
               category === 'video' ? 'Vídeo' :
               category === 'document' ? 'Documentos' : 'Geral'}
            </button>
          ))}
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-gray-600 text-sm">Peers Online</p>
              <p className="text-2xl font-bold text-orkut-blue">{stats.online_peers.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-gray-600 text-sm">Arquivos</p>
              <p className="text-2xl font-bold text-orkut-pink">{stats.total_files}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-gray-600 text-sm">Downloads</p>
              <p className="text-2xl font-bold text-msn-green">{stats.total_downloads}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Upload Form */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4">📤 Upload de Arquivo</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="music">🎵 Música</option>
                  <option value="video">🎬 Vídeo</option>
                  <option value="document">📄 Documento</option>
                  <option value="general">📁 Geral</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição (opcional)</label>
                <input
                  type="text"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Descreva o arquivo..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept=".mp3,.wav,.ogg,.mp4,.avi,.mkv,.pdf,.txt"
                className="hidden"
              />
              <div className="space-y-4">
                <div className="text-6xl">📁</div>
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Clique para selecionar arquivo
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Suporte: MP3, WAV, MP4, PDF, TXT • Máximo: 100MB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  {uploading ? 'Enviando...' : 'Selecionar Arquivo'}
                </button>
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Enviando arquivo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Media Player (Audio + Video) */}
      {player.currentFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                {player.isVideo ? (
                  <div className="text-2xl">🎬</div>
                ) : (
                  <Music className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{player.currentFile.original_name}</h3>
                <p className="text-sm opacity-90">
                  {player.isVideo ? '🎬 Vídeo' : '🎵 Áudio'} • {formatTime(player.currentTime)} / {formatTime(player.duration)}
                </p>
              </div>
            </div>
            <button
              onClick={stopMedia}
              className="text-white hover:text-gray-200 transition"
            >
              ✕
            </button>
          </div>

          {/* Video Player */}
          {player.isVideo && (
            <div className="mb-4 bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full max-h-96 object-contain"
                controls
                onPlay={() => setPlayer(prev => ({ ...prev, isPlaying: true }))}
                onPause={() => setPlayer(prev => ({ ...prev, isPlaying: false }))}
              />
            </div>
          )}

          {/* Progress Bar (for audio or additional video controls) */}
          <div className="mb-4">
            <div
              className="w-full bg-white bg-opacity-20 rounded-full h-2 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                seekMedia(percent * player.duration);
              }}
            >
              <div
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${(player.currentTime / player.duration) * 100 || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => playMedia(player.currentFile!)}
                className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition"
              >
                {player.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <span className="text-sm opacity-90">
                {player.isVideo ? 'Player de Vídeo' : 'Player de Áudio'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={player.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Files List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-4 border-b font-bold text-gray-900 flex items-center justify-between">
          <span>Arquivos Compartilhados ({files.length})</span>
          {loading && <RefreshCw className="w-5 h-5 animate-spin text-gray-500" />}
        </div>

        {files.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-500">
            <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Nenhum arquivo encontrado</p>
            <p className="text-sm">Faça upload de arquivos para começar a compartilhar</p>
          </div>
        ) : (
          <div className="divide-y">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">{file.original_name}</p>
                        {player.currentFile?.id === file.id && (
                          <div className="flex items-center space-x-1 text-purple-600">
                            <Music className="w-4 h-4" />
                            <span className="text-xs">Tocando</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.downloads} downloads • {file.peers} peers
                      </p>
                      {file.description && (
                        <p className="text-xs text-gray-400 mt-1">{file.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {canPlayMedia(file) && (
                      <button
                        onClick={() => playMedia(file)}
                        className={`text-white px-3 py-2 rounded-lg transition flex items-center space-x-2 ${
                          file.type.startsWith('video/') 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {player.currentFile?.id === file.id && player.isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        <span className="text-sm">
                          {file.type.startsWith('video/') ? 'Vídeo' : 'Áudio'}
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(file)}
                      className="bg-msn-green text-white px-3 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </button>
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
