import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Library, LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData);
      const { access_token, role, full_name } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      localStorage.setItem('fullName', full_name);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <Library size={32} color="var(--accent-2)" />
          </div>
          <h1 style={styles.title}>E-Library Login</h1>
          <p style={styles.subtitle}>Welcome back. Please enter your credentials.</p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="admin@elibrary.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Don't have an account? <Link to="/register" style={styles.link}>Register as Student</Link></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--paper)',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWwidth: '420px',
    background: 'white',
    padding: '40px',
    borderRadius: 'var(--r)',
    border: '1px solid var(--rule)',
    boxShadow: '0 12px 32px rgba(0,0,0,0.05)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoContainer: {
    width: '64px',
    height: '64px',
    background: 'var(--accent-pale)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--ink)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--ink-3)',
  },
  errorContainer: {
    background: '#fef2f2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: 'var(--r)',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    border: '1px solid #fecaca',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--ink-4)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--ink-4)',
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid var(--rule)',
    borderRadius: 'var(--r)',
    fontSize: '14px',
    background: 'var(--paper-2)',
    transition: 'all 0.2s',
  },
  button: {
    marginTop: '12px',
    padding: '12px',
    background: 'var(--ink)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--r)',
    fontSize: '15px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--ink-3)',
  },
  link: {
    color: 'var(--accent)',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default Login;
