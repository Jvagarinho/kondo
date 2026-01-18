import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch {
            setError(t('auth.signIn.error'));
        }
        setLoading(false);
    }

    return (
        <div className="auth-layout">
            <div className="premium-card fade-in auth-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.75rem', color: 'var(--accent-color)' }}>
                    {t('auth.signIn.title')}
                </h2>
                {error && <div style={{ color: '#ef4444', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('auth.signIn.emailLabel')}</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('auth.signIn.passwordLabel')}</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button disabled={loading} className="btn-primary" type="submit" style={{ marginTop: '0.5rem' }}>
                        {loading ? t('auth.signIn.loading') : t('auth.signIn.submit')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    {t('auth.signIn.switchText')}{' '}
                    <Link to="/signup" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>
                        {t('auth.signIn.switchLink')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
