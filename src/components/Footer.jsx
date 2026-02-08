import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer style={{
            marginTop: '3rem',
            padding: '2rem 1rem',
            textAlign: 'center',
            borderTop: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                alignItems: 'center'
            }}>
                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    fontWeight: '500'
                }}>
                    © {currentYear} IterioTech. All rights reserved.
                </p>
                
                <a 
                    href="https://iteriotech.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                        color: 'var(--accent-color)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.textDecoration = 'none';
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    iteriotech.com
                </a>
                
                <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    margin: '0.5rem 0 0 0',
                    fontStyle: 'italic',
                    opacity: 0.8
                }}>
                    Building the future of application development, one iteration at a time.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
