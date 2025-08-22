import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFunctions } from '../../apiService/apiFunctions';
import BookCard from '../BookCard';

const AllTabComponent = ({ homeData }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  if (!homeData) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>No data available.</div>;
  }

  // File base URL for images and audio
  const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';

  // Ads Section
  const AdsSection = () => {
    const ad = (homeData.ads || [])[0];
    if (!ad) return null;
    const isVideo = ad.type === 'Video';
    const fileUrl = ad.file ? `${FILE_BASE_URL}${ad.file}` : '';
    const handleClick = () => {
      if (ad.redirect_url) {
        window.open(ad.redirect_url.startsWith('http') ? ad.redirect_url : `https://${ad.redirect_url}`, '_blank');
      }
    };
    return (
      <div style={{ margin: '18px 0', cursor: ad.redirect_url ? 'pointer' : 'default' }} onClick={handleClick}>
        {isVideo ? (
          <video 
            width="100%" 
            height="180" 
            controls 
            style={{ borderRadius: 12, background: '#000' }}
            onError={(e) => {
              console.error('Video loading error:', e);
              e.target.style.display = 'none';
            }}
          >
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={fileUrl} 
            alt={ad.title} 
            style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12 }}
            onError={(e) => {
              e.target.src = '/favicon.ico';
            }}
          />
        )}
        <div style={{ fontWeight: 600, fontSize: 16, marginTop: 8 }}>{ad.title}</div>
        {ad.description && <div style={{ color: '#555', fontSize: 14 }}>{ad.description}</div>}
      </div>
    );
  };

  // New Books Section
  const NewBooksSection = () => {
    const books = homeData.free_books || [];
    const validBooks = books.filter(book => book && book.id); // Filter out invalid books
    
    if (!validBooks.length) {
      return (
        <div style={{ margin: '28px 0 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 18 }}>New Books</div>
                      <button
            style={{ background: 'none', border: 'none', color: '#e7440d', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
            onClick={() => navigate('/all-books')}
          >
            See All
          </button>
          </div>
          <div style={{ textAlign: 'center', padding: 20, color: '#888' }}>
            No books available
          </div>
        </div>
      );
    }

    return (
      <div style={{ margin: '28px 0 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>New Books</div>
          <button
            style={{ background: 'none', border: 'none', color: '#e7440d', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
            onClick={() => navigate('/all-books')}
          >
            See All
          </button>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          overflowX: 'auto', 
          paddingBottom: 8,
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {validBooks.slice(0, 3).map((book) => {
            // Ensure book has required properties
            const safeBook = {
              id: book.id,
              title: book.title || 'Untitled',
              author: book.author || { name: 'Unknown Author' },
              author_name: book.author_name || 'Unknown Author',
              coverimage: book.coverimage ? `${FILE_BASE_URL}${book.coverimage}` : book.coverimage,
              image: book.image,
              rating: book.rating || 0,
              is_liked: book.is_liked || false,
              audio_url: book.audio_url,
              bookaudio: book.bookaudio,
              bookfile: book.bookfile
            };
            
            return (
              <div key={book.id} style={{ minWidth: 160, maxWidth: 180 }}>
                <BookCard book={safeBook} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Readers Section
  const ReadersSection = () => {
    const readers = homeData.readers || [];
    if (!readers.length) return null;
    
    return (
      <div style={{ margin: '32px 0 0 0' }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Readers</div>
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          overflowX: 'auto', 
          paddingBottom: 8,
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {readers.slice(0, 4).map((reader) => (
            <div key={reader.id} style={{ minWidth: 120, textAlign: 'center' }}>
              <img
                src={reader.image ? `${FILE_BASE_URL}${reader.image}` : '/favicon.ico'}
                alt={reader.name}
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }}
                onError={(e) => {
                  e.target.src = '/favicon.ico';
                }}
              />
              <div style={{ fontSize: 14, fontWeight: 500 }}>{reader.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Coming Soon Section
  const ComingSoonSection = () => {
    const coming = (homeData.coming_soon || [])[0];
    if (!coming) return null;
    return (
      <div style={{ margin: '32px 0 0 0' }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Coming Soon</div>
        <div style={{ borderRadius: 16, overflow: 'hidden', width: '100%', maxWidth: 340 }}>
          <img
            src={coming.coverimage ? `${FILE_BASE_URL}${coming.coverimage}` : '/favicon.ico'}
            alt={coming.title}
            style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.target.src = '/favicon.ico';
            }}
          />
        </div>
        <div style={{ fontWeight: 700, fontSize: 20, marginTop: 10, color: '#e7440d' }}>{coming.title}</div>
      </div>
    );
  };

  return (
    <div style={{ 
      padding: '0 16px 20px 16px', 
      maxWidth: 420, 
      margin: '0 auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <AdsSection />
      <NewBooksSection />
      <ComingSoonSection />
      <ReadersSection />
    </div>
  );
};

export default AllTabComponent; 