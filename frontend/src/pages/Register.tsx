import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import './Login.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    if (password.length < 8) {
      setError('Senha deve ter mínimo 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Tentar proxy primeiro, depois URL direta (fallback rápido)
      let response;
      try {
        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
          signal: AbortSignal.timeout(3000) // Timeout de 3 segundos
        });
      } catch (proxyError) {
        console.log('Proxy failed, trying direct connection...');
        // Fallback para conexão direta
        response = await fetch('http://localhost:8000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password })
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erro ao criar conta');
      }

      const data = await response.json();
      
      // Salvar token
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_name', name);
      
      // Navegar para dashboard imediatamente
      navigate('/');
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background */}
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
        <div className="orkut-pattern" />
      </div>

      {/* MSN Characters */}
      <motion.div
        initial={{ x: -100, y: 100 }}
        animate={{ x: 20, y: 0 }}
        transition={{ duration: 2 }}
        className="msn-character msn-char-left"
      >
        <div className="msn-char-emoji">🎉</div>
      </motion.div>

      <motion.div
        initial={{ x: 100, y: -50 }}
        animate={{ x: -20, y: 20 }}
        transition={{ duration: 2.5 }}
        className="msn-character msn-char-right"
      >
        <div className="msn-char-emoji">🙌</div>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="login-card glassmorphic"
      >
        {/* Header */}
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
          <p className="login-tagline">Crie sua conta agora! 🎉</p>
        </motion.div>

        {/* Error */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="form-group"
          >
            <label className="form-label">Nome Completo</label>
            <div className="input-wrapper orkut-input">
              <User className="input-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu Nome"
                className="form-input"
                required
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="form-group"
          >
            <label className="form-label">Senha</label>
            <div className="input-wrapper orkut-input">
              <Lock className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>
            <p className="form-hint">🔐 Mínimo 8 caracteres</p>
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="form-group"
          >
            <label className="form-label">Confirmar Senha</label>
            <div className="input-wrapper orkut-input">
              <Lock className="input-icon" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>
          </motion.div>

          {/* Submit */}
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
                <span>Criando conta...</span>
              </>
            ) : (
              <>
                <span>Criar Conta</span>
                <span className="button-arrow">→</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>já tem conta?</span>
        </div>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="register-text"
        >
          <Link to="/login" className="register-link">
            Faça login aqui
          </Link>
        </motion.p>
      </motion.div>

      {/* Floating Items */}
      <motion.div className="nostalgia-items">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="nostalgia-item community-bubble"
        >
          <span className="bubble-icon">🎨</span>
          <span className="bubble-label">Design</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="nostalgia-item msn-bubble"
        >
          <span className="bubble-icon">💬</span>
          <span className="bubble-label">Chat</span>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="login-footer"
      >
        <p>🌟 Bem-vindo ao Orkut 2.0!</p>
      </motion.div>
    </div>
  );
}
