import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Phone, GraduationCap, Calendar, Library, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    course: '',
    year: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <UserPlus size={32} color="var(--accent-2)" />
          </div>
          <h1 style={styles.title}>Student Registration</h1>
          <p style={styles.subtitle}>Join the E-Library to access academic resources.</p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.inputIcon} />
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <div style={styles.inputWrapper}>
                <Phone size={18} style={styles.inputIcon} />
                <input
                  name="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Course</label>
              <div style={styles.inputWrapper}>
                <GraduationCap size={18} style={styles.inputIcon} />
                <input
                  name="course"
                  type="text"
                  placeholder="B.Tech Computer Science"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Year</label>
              <div style={styles.inputWrapper}>
                <Calendar size={18} style={styles.inputIcon} />
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Processing...' : (
              <>
                <Library size={18} />
                <span>Register Account</span>
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Already have an account? <Link to="/login" style={styles.link}>Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--paper)',
    padding: '40px 20px',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
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
    background: 'var(--teal-pale)',
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
    gap: '24px',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
    padding: '14px',
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

export default Register;
