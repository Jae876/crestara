'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

const SESSION_KEY = 'crestara_admin_auth';
const MASTER_PASSWORD = 'jaeseanjae';

interface AdminAuthCtx {
  authenticated: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthCtx>({ authenticated: false, logout: () => {} });

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export function AdminGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === 'true') setAuthenticated(true);
    setLoading(false);
  }, []);

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    setTimeout(() => {
      if (password === MASTER_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setAuthenticated(true);
      } else {
        setError('Incorrect password. Access denied.');
        setPassword('');
      }
      setSubmitting(false);
    }, 600);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060d17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(0,196,180,0.3)', borderTopColor: '#00c4b4', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#060d17', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(13,32,64,0.85)',
          border: '1px solid #1a3050',
          borderRadius: 20,
          padding: '48px 40px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}>
          {/* Logo / Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(0,196,180,0.1)',
              border: '2px solid rgba(0,196,180,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', margin: '0 auto 16px',
            }}>
              🔐
            </div>
            <h1 style={{
              fontFamily: 'Orbitron, system-ui', fontSize: '1.1rem', fontWeight: 900,
              color: '#fff', letterSpacing: '0.1em', marginBottom: 8,
            }}>
              ADMIN ACCESS
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#4a5a6a', letterSpacing: '0.05em' }}>
              Restricted area. Authorised personnel only.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'Orbitron, system-ui', color: '#6b7e96', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Master Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder="Enter master password"
                style={{
                  width: '100%',
                  background: 'rgba(6,13,23,0.8)',
                  border: `1px solid ${error ? 'rgba(245,101,101,0.5)' : 'rgba(0,196,180,0.25)'}`,
                  borderRadius: 10,
                  padding: '13px 16px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  letterSpacing: '0.05em',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { if (!error) e.target.style.borderColor = 'rgba(0,196,180,0.5)'; }}
                onBlur={(e) => { if (!error) e.target.style.borderColor = 'rgba(0,196,180,0.25)'; }}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                background: 'rgba(245,101,101,0.1)',
                border: '1px solid rgba(245,101,101,0.3)',
                color: '#f56565', fontSize: '0.78rem',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !password}
              style={{
                width: '100%',
                padding: '13px 0',
                borderRadius: 10,
                background: submitting || !password
                  ? 'rgba(0,196,180,0.2)'
                  : 'linear-gradient(135deg, #00c4b4, #1e90ff)',
                color: submitting || !password ? '#4a5a6a' : '#fff',
                fontFamily: 'Orbitron, system-ui',
                fontSize: '0.8rem',
                fontWeight: 900,
                letterSpacing: '0.1em',
                border: 'none',
                cursor: submitting || !password ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {submitting ? 'VERIFYING...' : 'UNLOCK PANEL'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.68rem', color: '#2a3a4a' }}>
            Crestara · Secure Admin Interface
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ authenticated, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
