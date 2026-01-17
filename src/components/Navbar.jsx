import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const links = [
        { to: '/', label: 'Dashboard' },
        { to: '/notices', label: 'Notices' },
        { to: '/payments', label: 'Payments' },
        { to: '/documents', label: 'Documents' }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <nav className="glass" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            margin: '1rem',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                    KONDO
                </div>
            </Link>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {links.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`nav-link${location.pathname === link.to ? ' nav-link-active' : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}
                <button onClick={handleLogout} className="btn-logout">
                    Sign Out
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
