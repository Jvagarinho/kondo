import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await signUp(email, password, name);
            navigate('/login');
        } catch (err) {
            setError('Failed to create an account. ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem'
        }}>
            <div className="premium-card fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.75rem', color: 'var(--accent-color)' }}>
                    Create Account
                </h2>
                {error && <div style={{ color: '#ef4444', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                        <input
                            type="text"
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '10px',
                                border: '1px solid var(--glass-border)',
                                outline: 'none',
                                background: '#f8fafc'
                            }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '10px',
                                border: '1px solid var(--glass-border)',
                                outline: 'none',
                                background: '#f8fafc'
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '10px',
                                border: '1px solid var(--glass-border)',
                                outline: 'none',
                                background: '#f8fafc'
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button disabled={loading} className="btn-primary" type="submit" style={{ marginTop: '0.5rem' }}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
