import React from 'react';

const PodcastCard = ({ podcast }) => {
  return (
    <div style={{
      minWidth: 120,
      maxWidth: 160,
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
        src={podcast.image ? podcast.image : '/favicon.ico'}
        alt={podcast.title}
        style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', marginBottom: 10, border: '2px solid #e7440d' }}
      />
      <div style={{ fontWeight: 600, fontSize: 15, color: '#222', marginBottom: 4 }}>{podcast.title}</div>
      {podcast.description && <div style={{ fontSize: 13, color: '#888' }}>{podcast.description.slice(0, 40)}{podcast.description.length > 40 ? '...' : ''}</div>}
    </div>
  );
};

export default PodcastCard; 