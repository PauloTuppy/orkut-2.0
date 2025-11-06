// frontend/src/components/GistMemory.tsx
import React, { useState } from 'react';
import aiService, { GistMemoryResult } from '../services/aiService';

const GistMemory: React.FC = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [result, setResult] = useState<GistMemoryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🧠 Gist Memory</h1>
        <p className="opacity-90">Resuma documentos longos com IA</p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
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
            Conteúdo (Cole seu texto aqui)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-48"
            placeholder="Cole um documento longo aqui..."
          />
          <p className="text-sm text-gray-500 mt-1">
            {content.split(' ').length} palavras
          </p>
        </div>

        <button
          onClick={handleProcess}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? '⏳ Processando...' : '🚀 Gerar Resumos'}
        </button>
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
