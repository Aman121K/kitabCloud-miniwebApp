import React from 'react';

const AuthorCard = ({ author }) => {
  return (
    <div style={{
      minWidth: 120,
      maxWidth: 140,
      background: '#fff',
      borderRadius: 10,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      margin: '0 4px',
    }}>
      <img
        src={author.image ? author.image : '/favicon.ico'}
        alt={author.name}
        style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginBottom: 10, border: '2px solid #e7440d' }}
      />
      <div style={{ fontWeight: 600, fontSize: 15, color: '#222', marginBottom: 4 }}>{author.name}</div>
      {author.about && <div style={{ fontSize: 13, color: '#888' }}>{author.about.slice(0, 40)}{author.about.length > 40 ? '...' : ''}</div>}
    </div>
  );
};

export default AuthorCard; 