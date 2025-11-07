// frontend/src/components/GistMemory.tsx
import { useState, useRef } from 'react';
import aiService, { GistMemoryResult } from '../services/aiService';

const GistMemory: React.FC = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [result, setResult] = useState<GistMemoryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcess = async () => {
    if (!content.trim() || !title.trim()) {
      alert('Preencha título e conteúdo');
      return;
    }

    setLoading(true);
    try {
      const data = await aiService.createGistMemory(content, title);
      setResult(data);
    } catch (error) {
      console.error('Erro ao processar documento:', error);
      alert('Erro ao processar documento');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !content.trim()) {
      alert('Digite uma pergunta');
      return;
    }

    setLoading(true);
    try {
      const ans = await aiService.askQuestion(question, content);
      setAnswer(ans);
    } catch (error) {
      console.error('Erro ao responder pergunta:', error);
      alert('Erro ao responder pergunta');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar se é PDF
    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione apenas arquivos PDF');
      return;
    }

    // Verificar tamanho (50MB = 50 * 1024 * 1024 bytes)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Arquivo muito grande! Máximo permitido: 50MB');
      return;
    }

    setFileName(file.name);
    setTitle(file.name.replace('.pdf', ''));
    setLoading(true);
    setUploadProgress(0);

    try {
      // Upload real usando o backend
      const result = await aiService.uploadPDF(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setContent(result.text);
      
      // Mostrar informações do arquivo processado
      setTimeout(() => {
        alert(`✅ PDF processado com sucesso!\n\n📄 Arquivo: ${result.filename}\n📊 Páginas: ${result.pages}\n📝 Palavras: ${result.words}\n💾 Tamanho: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      alert('Erro ao processar PDF. Verifique se o arquivo não está corrompido e tente novamente.');
      setFileName('');
      setTitle('');
    } finally {
      setLoading(false);
    }
  };



  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const clearContent = () => {
    setContent('');
    setTitle('');
    setResult(null);
    setAnswer('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file: File) => file.type === 'application/pdf');

    if (!pdfFile) {
      alert('Por favor, arraste apenas arquivos PDF');
      return;
    }

    // Processar arquivo diretamente
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(pdfFile);
      fileInputRef.current.files = dataTransfer.files;
      
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🧠 Gist Memory</h1>
        <p className="opacity-90">Resuma documentos longos com IA</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📄 Upload de Documento</h2>
        
        {/* File Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileUpload}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {fileName ? (
            <div className="space-y-3">
              <div className="text-green-600 text-xl">✅ {fileName}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>📄 Arquivo carregado com sucesso!</div>
                <div>💾 Tamanho: {content ? (content.length / 1024).toFixed(1) : '0'} KB</div>
                <div>📝 Palavras: {content ? content.split(' ').filter(w => w.length > 0).length : 0}</div>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={triggerFileUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition"
                >
                  📁 Trocar arquivo
                </button>
                <button
                  onClick={clearContent}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm transition"
                >
                  🗑️ Remover
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">📄</div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Arraste um PDF aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Máximo: 50MB • Apenas arquivos PDF
                </p>
              </div>
              <button
                onClick={triggerFileUpload}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                📁 Selecionar PDF
              </button>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processando PDF...</span>
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

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">✏️ Edição Manual</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título do Documento
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: Relatório Anual 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conteúdo (Cole seu texto aqui ou faça upload de PDF acima)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-48"
            placeholder="Cole um documento longo aqui ou faça upload de um PDF..."
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{content.split(' ').filter(word => word.length > 0).length} palavras</span>
            <span>{(content.length / 1024).toFixed(1)} KB</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleProcess}
            disabled={loading || !content.trim() || !title.trim()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? '⏳ Processando...' : '🚀 Gerar Resumos'}
          </button>
          
          {content && (
            <button
              onClick={clearContent}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              🗑️ Limpar
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            📄 Resumos ({result.total_pages} páginas)
          </h2>
          
          <div className="space-y-3">
            {result.gists.map((gist, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500"
              >
                <p className="text-sm font-semibold text-purple-600 mb-1">
                  Página {index + 1}
                </p>
                <p className="text-gray-700">{gist}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Q&A Section */}
      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">💬 Perguntas</h2>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Faça uma pergunta sobre o documento..."
            />
            <button
              onClick={handleAskQuestion}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Perguntar
            </button>
          </div>

          {answer && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-semibold text-blue-600 mb-1">Resposta:</p>
              <p className="text-gray-700">{answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GistMemory;
