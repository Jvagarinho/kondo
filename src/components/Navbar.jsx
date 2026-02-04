import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
    const { currentUser, logout, isAdmin } = useAuth();
    const { t, toggleLanguage } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { to: '/', labelKey: 'nav.dashboard' },
        { to: '/profile', labelKey: 'nav.profile' },
        { to: '/notices', labelKey: 'nav.notices' },
        { to: '/payments', labelKey: 'nav.payments' },
        { to: '/documents', labelKey: 'nav.documents' },
        { to: '/condominium', labelKey: 'nav.condominium' }
    ];

    if (isAdmin) {
        links.push({ to: '/users', labelKey: 'nav.users' });
    }

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className={`glass navbar${isMenuOpen ? ' navbar-open' : ''}`}>
            <Link to="/" className="navbar-brand-link">
                <div className="navbar-brand">
                    KONDO
                </div>
            </Link>
            <button
                type="button"
                className="hamburger-menu"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
            >
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
            </button>
            <div className="navbar-right" style={{ marginLeft: '2rem' }}>
                {links.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`nav-link${location.pathname === link.to ? ' nav-link-active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t(link.labelKey)}
                    </Link>
                ))}
                <button
                    type="button"
                    onClick={() => {
                        toggleLanguage();
                        setIsMenuOpen(false);
                    }}
                    className="nav-link language-toggle language-btn"
                    style={{ paddingInline: '0.75rem' }}
                    title={t('nav.languageToggle')}
                >
                    <span className="language-text">{t('nav.languageToggle')}</span>
                    <svg className="language-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 5h6M21 12a9 9 0 11.21 0 9 0 11.21 0 00-4.41 2.86-7.4 41 7h-4.13l2.65-2.66a.5.5 0 01.7.29-.71l2.65 2.66c.19.19.34.28.5.28h.01zm-6.28 3.72c.78-.6 1.28-1.18 2-1.72zm0 0h4v1M5 9a9 9 0 111.21 0 9 0 11.21 0 00-4.41 2.86-7.4 41 7H14a8 9 0 112.32 9 0 111.21 0 00-4.41 2.86-7.4 41 7a5 5 0 11.21 0 01-1.6-1.6-1.73A3 7 3-2.59 9 0 111.21 0 00-4.41 2.86-7.4 41 7z" />
                    </svg>
                    <span className="lang-code">{t('nav.languageToggle').split(' ')[0]}</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="btn-logout"
                >
                    {t('nav.signOut')}
                </button>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--accent-glow)',
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600'
                }}>
                    {currentUser?.email?.substring(0, 2).toUpperCase()}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
