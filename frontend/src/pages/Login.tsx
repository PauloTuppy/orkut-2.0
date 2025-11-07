import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('demo@orkut.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Conexão direta - mais rápida e confiável
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Email ou senha inválidos');
      }

      const data = await response.json();
      
      // Salvar token
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_email', email);
      
      console.log('✅ Login successful, redirecting...');
      
      // Navegar para dashboard
      navigate('/');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Erro ao fazer login. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* ============================================================
          BACKGROUND ORKUT (Padrão azul + rosa)
          ============================================================ */}
      <div className="orkut-bg">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="orkut-logo-bg"
        >
          O
        </motion.div>
        {/* Padrão de fundo Orkut */}
        <div className="orkut-pattern" />
      </div>

      {/* ============================================================
          MSN CHARACTERS (Personagens flutuantes)
          ============================================================ */}
      <motion.div
        initial={{ x: -100, y: 100 }}
        animate={{ x: 20, y: 0 }}
        transition={{ duration: 2 }}
        className="msn-character msn-char-left"
        title="Saudade dos bonequinhos do MSN!"
      >
        <div className="msn-char-emoji">😊</div>
        <span className="msn-status-online" />
      </motion.div>

      <motion.div
        initial={{ x: 100, y: -50 }}
        animate={{ x: -20, y: 20 }}
        transition={{ duration: 2.5 }}
        className="msn-character msn-char-right"
      >
        <div className="msn-char-emoji">🤖</div>
        <span className="msn-status-away" />
      </motion.div>

      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 3 }}
        className="msn-character msn-char-top"
      >
        <div className="msn-char-emoji">😎</div>
      </motion.div>

      {/* ============================================================
          MAIN LOGIN CARD (Glassmorphism + Orkut colors)
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="login-card glassmorphic"
      >
        {/* HEADER com Logo Orkut */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="login-header"
        >
          <div className="orkut-logo-main">
            <span className="orkut-o">O</span>
            <span className="orkut-rkut">rkut</span>
          </div>
          <p className="login-tagline">Comunidades + Chat + Nostalgia 💜</p>
        </motion.div>

        {/* ERROR MESSAGE */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="error-message"
          >
            <AlertCircle className="error-icon" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="form-group"
          >
            <label className="form-label">Email</label>
            <div className="input-wrapper orkut-input">
              <Mail className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="form-input"
                required
              />
            </div>
            <p className="form-hint">💡 Demo: demo@orkut.com</p>
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="form-group"
          >
            <label className="form-label">Senha</label>
            <div className="input-wrapper orkut-input">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="form-hint">🔐 Demo: demo123</p>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="submit-button orkut-gradient"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Entrar</span>
                <span className="button-arrow">→</span>
              </>
            )}
          </motion.button>
        </form>

        {/* DIVIDER */}
        <div className="login-divider">
          <span>ou</span>
        </div>

        {/* REGISTER LINK */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="register-text"
        >
          Não tem conta?{' '}
          <Link to="/register" className="register-link">
            Crie uma agora
          </Link>
        </motion.p>

        {/* FORGOTTEN PASSWORD */}
        <motion.a
          href="#"
          className="forgot-password"
          whileHover={{ scale: 1.05 }}
        >
          Esqueceu a senha?
        </motion.a>
      </motion.div>

      {/* ============================================================
          FLOATING NOSTALGIA ITEMS
          ============================================================ */}
      <motion.div className="nostalgia-items">
        {/* Orkut Comunidades */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="nostalgia-item community-bubble"
        >
          <span className="bubble-icon">🎮</span>
          <span className="bubble-label">Gamers</span>
        </motion.div>

        {/* MSN Status */}
        <motion.div
          animate={{
            y: [0, 20, 0]
          }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="nostalgia-item msn-bubble"
        >
          <span className="status-dot online" />
          <span className="bubble-label">Online</span>
        </motion.div>

        {/* RSS Feed */}
        <motion.div
          animate={{
            y: [0, -15, 0]
          }}
          transition={{ duration: 3.8, repeat: Infinity }}
          className="nostalgia-item feed-bubble"
        >
          <span className="bubble-icon">📰</span>
          <span className="bubble-label">Feed</span>
        </motion.div>

        {/* Audio Rooms */}
        <motion.div
          animate={{
            y: [0, 15, 0]
          }}
          transition={{ duration: 4.2, repeat: Infinity }}
          className="nostalgia-item audio-bubble"
        >
          <span className="bubble-icon">🎤</span>
          <span className="bubble-label">Audio</span>
        </motion.div>
      </motion.div>

      {/* ============================================================
          BOTTOM BRANDING
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="login-footer"
      >
        <p>🌟 Orkut 2.0: Orkut + MSN + RSS + Clubhouse + Napster</p>
        <p className="footer-small">A rede social que você sempre quis</p>
      </motion.div>
    </div>
  );
}
