// frontend/src/components/GistMemory.tsx
import { useState, useRef } from 'react';
import aiService, { GistMemoryResult } from '../services/aiService';

interface DocumentAnalysis {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  readingTime: number;
  complexity: 'Baixa' | 'Média' | 'Alta';
  language: 'pt' | 'en' | 'mixed';
  topics: string[];
  keyPhrases: string[];
}

const GistMemory: React.FC = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [result, setResult] = useState<GistMemoryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [processingStage, setProcessingStage] = useState('');
  const [extractedSections, setExtractedSections] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Análise avançada do documento
  const analyzeDocument = (text: string): DocumentAnalysis => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const characters = text.length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Tempo de leitura (250 palavras por minuto)
    const readingTime = Math.ceil(words.length / 250);
    
    // Complexidade baseada no tamanho médio das palavras e frases
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = words.length / sentences.length;
    
    let complexity: 'Baixa' | 'Média' | 'Alta' = 'Baixa';
    if (avgWordLength > 6 || avgSentenceLength > 20) complexity = 'Média';
    if (avgWordLength > 8 || avgSentenceLength > 30) complexity = 'Alta';
    
    // Detecção de idioma simples
    const portugueseWords = ['que', 'de', 'a', 'o', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais'];
    const englishWords = ['the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i'];
    
    const textLower = text.toLowerCase();
    const ptCount = portugueseWords.filter(word => textLower.includes(word)).length;
    const enCount = englishWords.filter(word => textLower.includes(word)).length;
    
    let language: 'pt' | 'en' | 'mixed' = 'mixed';
    if (ptCount > enCount * 1.5) language = 'pt';
    else if (enCount > ptCount * 1.5) language = 'en';
    
    // Extração de tópicos e frases-chave
    const topics = extractTopics(text);
    const keyPhrases = extractKeyPhrases(text);
    
    return {
      wordCount: words.length,
      characterCount: characters,
      paragraphCount: paragraphs.length,
      readingTime,
      complexity,
      language,
      topics,
      keyPhrases
    };
  };

  // Extração de tópicos principais
  const extractTopics = (text: string): string[] => {
    const commonWords = new Set(['que', 'de', 'a', 'o', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it']);
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));
    
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word);
  };

  // Extração de frases-chave
  const extractKeyPhrases = (text: string): string[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Selecionar frases com palavras-chave importantes
    const keywordPatterns = [
      /\b(importante|fundamental|essencial|crucial|principal|básico|central)\b/i,
      /\b(resultado|conclusão|descoberta|achado|evidência)\b/i,
      /\b(método|processo|procedimento|técnica|abordagem)\b/i,
      /\b(objetivo|meta|propósito|finalidade|intenção)\b/i
    ];
    
    const keyPhrases = sentences
      .filter(sentence => keywordPatterns.some(pattern => pattern.test(sentence)))
      .slice(0, 5)
      .map(sentence => sentence.trim().substring(0, 100) + (sentence.length > 100 ? '...' : ''));
    
    return keyPhrases;
  };

  // Extração de seções do documento
  const extractSections = (text: string): string[] => {
    const sections: string[] = [];
    
    // Dividir por títulos/cabeçalhos
    const titlePatterns = [
      /^[A-Z][^.!?]*$/gm, // Linhas em maiúsculas
      /^\d+\.\s+[A-Z][^.!?]*$/gm, // Numeração (1. Título)
      /^[IVX]+\.\s+[A-Z][^.!?]*$/gm, // Numeração romana
      /^[A-Z][A-Z\s]{10,}$/gm // Títulos longos em maiúsculas
    ];
    
    let currentSection = '';
    const lines = text.split('\n');
    
    for (const line of lines) {
      const isTitle = titlePatterns.some(pattern => {
        pattern.lastIndex = 0; // Reset regex
        return pattern.test(line.trim());
      });
      
      if (isTitle && currentSection.trim()) {
        sections.push(currentSection.trim());
        currentSection = line + '\n';
      } else {
        currentSection += line + '\n';
      }
    }
    
    if (currentSection.trim()) {
      sections.push(currentSection.trim());
    }
    
    // Se não encontrou seções, dividir por parágrafos grandes
    if (sections.length <= 1) {
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 200);
      return paragraphs.slice(0, 10);
    }
    
    return sections.slice(0, 10);
  };

  const handleProcess = async () => {
    if (!content.trim() || !title.trim()) {
      alert('Preencha título e conteúdo');
      return;
    }

    setLoading(true);
    setProcessingStage('Analisando documento...');
    
    try {
      // 1. Análise do documento
      const docAnalysis = analyzeDocument(content);
      setAnalysis(docAnalysis);
      
      // 2. Extração de seções
      setProcessingStage('Extraindo seções...');
      const sections = extractSections(content);
      setExtractedSections(sections);
      
      // 3. Processamento com IA
      setProcessingStage('Gerando resumos com IA...');
      const data = await aiService.createGistMemory(content, title);
      setResult(data);
      
      setProcessingStage('Concluído!');
    } catch (error) {
      console.error('Erro ao processar documento:', error);
      alert('Erro ao processar documento');
    } finally {
      setLoading(false);
      setProcessingStage('');
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
    setAnalysis(null);
    setExtractedSections([]);
    setProcessingStage('');
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
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              🗑️ Limpar
            </button>
          )}
        </div>

        {/* Processing Progress */}
        {loading && processingStage && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-700 font-medium">{processingStage}</span>
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-500 animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        )}
      </div>

      {/* Document Analysis Section */}
      {analysis && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Análise do Documento</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="text-sm text-blue-600 font-semibold">Palavras</div>
              <div className="text-2xl font-bold text-gray-800">{analysis.wordCount.toLocaleString()}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <div className="text-sm text-green-600 font-semibold">Parágrafos</div>
              <div className="text-2xl font-bold text-gray-800">{analysis.paragraphCount}</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <div className="text-sm text-orange-600 font-semibold">Tempo Leitura</div>
              <div className="text-2xl font-bold text-gray-800">{analysis.readingTime} min</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <div className="text-sm text-purple-600 font-semibold">Complexidade</div>
              <div className="text-2xl font-bold text-gray-800">{analysis.complexity}</div>
            </div>
          </div>

          {/* Topics */}
          {analysis.topics.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🏷️ Tópicos Principais</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Phrases */}
          {analysis.keyPhrases.length > 0 && (
            <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Frases-Chave</h3>
              <div className="space-y-2">
                {analysis.keyPhrases.map((phrase, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold">•</span>
                    <p className="text-gray-700 text-sm">{phrase}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Language & Stats */}
          <div className="flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Idioma:</span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                {analysis.language === 'pt' ? '🇧🇷 Português' : 
                 analysis.language === 'en' ? '🇺🇸 Inglês' : '🌐 Misto'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Caracteres:</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{analysis.characterCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Sections */}
      {extractedSections.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📑 Seções Identificadas</h2>
          
          <div className="space-y-3">
            {extractedSections.map((section, index) => (
              <details
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-purple-600">
                  📄 Seção {index + 1} ({section.split(' ').length} palavras)
                </summary>
                <div className="mt-3 text-gray-700 text-sm whitespace-pre-wrap">
                  {section.substring(0, 500)}{section.length > 500 ? '...' : ''}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            🤖 Resumos Gerados por IA ({result.total_pages} páginas)
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
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
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
