import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ConfirmDialog from './ConfirmDialog';

const Navbar = () => {
    const { currentUser, logout, isAdmin } = useAuth();
    const { t, toggleLanguage } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
        setIsMenuOpen(false);
    };

    const handleConfirmLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
        setShowLogoutConfirm(false);
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
                    className="nav-link language-btn"
                    title={t('nav.languageToggle')}
                >
                    {t('nav.languageToggle')}
                </button>

                <div className="navbar-user-section">
                    <div className="user-avatar">
                        {currentUser?.email?.substring(0, 2).toUpperCase()}
                    </div>
                    <button
                        onClick={handleLogoutClick}
                        className="btn-logout"
                    >
                        {t('nav.signOut')}
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleConfirmLogout}
                type="logout"
                title={t('confirmDialog.logout.title')}
                message={t('confirmDialog.logout.message')}
                confirmLabel={t('confirmDialog.logout.confirm')}
            />
        </nav>
    );
};

export default Navbar;
