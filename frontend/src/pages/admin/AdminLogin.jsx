import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('admin-token', 'authenticated-session-token');
      navigate('/admin');
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="animate-fade">
        <div style={styles.logoWrapper}>
          <img src="/banner.png" alt="Mie Ayam Chili Oil Bang Ade" style={styles.logo} />
        </div>
        
        <h1 style={styles.title}>Admin Portal</h1>
        <p style={styles.subtitle}>Silakan masuk untuk mengelola toko Anda</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.icon} />
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Login <ArrowRight size={18} />
          </button>
        </form>

        <footer style={styles.footer}>
          &copy; 2024 Mie Ayam Chili Oil. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f6f8',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '24px',
    padding: '2.5rem 2rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  logo: {
    height: '64px',
    objectFit: 'contain',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    textAlign: 'center',
    color: '#1d1d1f',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '0.875rem',
    textAlign: 'center',
    color: '#86868b',
    marginBottom: '1.5rem',
  },
  error: {
    backgroundColor: '#ffeef0',
    color: '#ff3b30',
    padding: '0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    textAlign: 'center',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1d1d1f',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '14px',
    color: '#86868b',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    borderRadius: '12px',
    border: '1px solid #eaeaea',
    backgroundColor: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    backgroundColor: 'var(--primary, #ff3b30)',
    color: '#ffffff',
    padding: '0.875rem',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '0.5rem',
    boxShadow: '0 4px 12px rgba(255, 59, 48, 0.2)',
    border: 'none',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#86868b',
  },
};

export default AdminLogin;
