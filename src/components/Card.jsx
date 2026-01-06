import React from 'react';

const Card = ({ title, children, action }) => {
    return (
        <div className="premium-card fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h3>
                {action}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};

export default Card;
