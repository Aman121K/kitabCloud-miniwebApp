import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFunctions } from '../../apiService/apiFunctions';
import BookCard from '../BookCard';
import { colors } from '../../constants/colors';

const AllTabComponent = ({ homeData }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  if (!homeData) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>No data available.</div>;
  }

  // File base URL for images and audio
  const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';

  // Helper function to safely get author name
  const getAuthorName = (author, authorName) => {
    if (typeof author === 'string') return author;
    if (author && typeof author === 'object' && author.name) return author.name;
    if (authorName) return authorName;
    return 'Unknown Author';
  };

  // Helper function to safely get cover image URL
  const getImageUrl = (coverimage, image) => {
    if (coverimage) return `${FILE_BASE_URL}${coverimage}`;
    if (image) return `${FILE_BASE_URL}${image}`;
    return '/favicon.ico';
  };

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
    const validBooks = books.filter(book => book && book.id);
    
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
          {validBooks.map((book) => {
            const authorName = getAuthorName(book.author, book.author_name);
            const safeBook = {
              id: book.id,
              title: book.title || 'Untitled',
              author: authorName,
              author_name: authorName,
              coverimage: getImageUrl(book.coverimage, book.image),
              image: book.image ? `${FILE_BASE_URL}${book.image}` : book.image,
              rating: book.rating || 0,
              is_liked: book.is_liked || false,
              audio_url: book.audio_url,
              bookaudio: book.bookaudio ? `${FILE_BASE_URL}${book.bookaudio}` : book.bookaudio,
              bookfile: book.bookfile ? `${FILE_BASE_URL}${book.bookfile}` : book.bookfile
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

  // Audiobooks Section
  const AudiobooksSection = () => {
    const categories = homeData?.categoryWithBooks || [];
    const audiobookCategories = categories.filter(cat => 
        cat.books && cat.books.length > 0 && 
        cat.books.some(book => book.type === 'audio' || book.file_type === 'audio')
    );

    if (!audiobookCategories.length) return null;

    // Flatten all audiobooks from all categories
    const allAudiobooks = audiobookCategories.flatMap(cat => cat.books || []);

    return (
      <div style={{ margin: '32px 0 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Audiobooks</div>
          <button
            style={{ background: 'none', border: 'none', color: '#e7440d', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
            onClick={() => navigate('/all-audiobooks')}
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
          {allAudiobooks.map((book) => {
            const authorName = getAuthorName(book.author, book.author_name);
            const safeBook = {
              id: book.id,
              title: book.title || 'Untitled',
              author: authorName,
              author_name: authorName,
              coverimage: getImageUrl(book.coverimage, book.image),
              image: book.image ? `${FILE_BASE_URL}${book.image}` : book.image,
              rating: book.rating || 0,
              is_liked: book.is_liked || false,
              audio_url: book.audio_url,
              bookaudio: book.bookaudio ? `${FILE_BASE_URL}${book.bookaudio}` : book.bookaudio
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

  // Ebooks Section
  const EbooksSection = () => {
    const categories = homeData?.categoryWithBooks || [];
    const ebookCategories = categories.filter(cat => 
        cat.books && cat.books.length > 0 && 
        cat.books.some(book => book.type === 'epub' || book.file_type === 'epub' || book.type === 'pdf' || book.file_type === 'pdf')
    );

    if (!ebookCategories.length) return null;

    // Flatten all ebooks from all categories
    const allEbooks = ebookCategories.flatMap(cat => cat.books || []);

    return (
      <div style={{ margin: '32px 0 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Ebooks</div>
          <button
            style={{ background: 'none', border: 'none', color: '#e7440d', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
            onClick={() => navigate('/all-ebooks')}
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
          {allEbooks.map((book) => {
            const authorName = getAuthorName(book.author, book.author_name);
            const safeBook = {
              id: book.id,
              title: book.title || 'Untitled',
              author: authorName,
              author_name: authorName,
              coverimage: getImageUrl(book.coverimage, book.image),
              image: book.image ? `${FILE_BASE_URL}${book.image}` : book.image,
              rating: book.rating || 0,
              is_liked: book.is_liked || false,
              audio_url: book.audio_url,
              bookaudio: book.bookaudio,
              bookfile: book.bookfile ? `${FILE_BASE_URL}${book.bookfile}` : book.bookfile
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

  // Magazines Section
  const MagazinesSection = () => {
    const magazines = homeData?.categoryWithBooks?.flatMap(cat => 
        cat.books?.filter(book => book.is_magazine === 1) || []
    ) || [];

    if (!magazines.length) return null;

    return (
      <div style={{ margin: '32px 0 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Magazines</div>
          <button
            style={{ background: 'none', border: 'none', color: '#e7440d', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
            onClick={() => navigate('/all-magazines')}
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
          {magazines.map((magazine) => {
            const authorName = getAuthorName(magazine.author, magazine.author_name);
            const safeBook = {
              id: magazine.id,
              title: magazine.title || 'Untitled',
              author: authorName,
              author_name: authorName,
              coverimage: getImageUrl(magazine.coverimage, magazine.image),
              image: magazine.image ? `${FILE_BASE_URL}${magazine.image}` : magazine.image,
              rating: magazine.rating || 0,
              is_liked: magazine.is_liked || false,
              audio_url: magazine.audio_url,
              bookaudio: magazine.bookaudio
            };
            
            return (
              <div key={magazine.id} style={{ minWidth: 160, maxWidth: 180 }}>
                <BookCard book={safeBook} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Podcasts Section
  const PodcastsSection = () => {
    const podcasts = homeData?.categoryWithPodcast?.flatMap(cat => cat.podcasts || []) || [];

    if (!podcasts.length) return null;

    return (
      <div style={{ margin: '32px 0 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Podcasts</div>
          <button
            style={{ background: 'none', border: 'none', color: '#e7440d', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
            onClick={() => navigate('/all-podcasts')}
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
          {podcasts.map((podcast) => {
            const authorName = getAuthorName(podcast.author, podcast.author_name);
            const safeBook = {
              id: podcast.id,
              title: podcast.title || 'Untitled',
              author: authorName,
              author_name: authorName,
              coverimage: getImageUrl(podcast.coverimage, podcast.image),
              image: podcast.image ? `${FILE_BASE_URL}${podcast.image}` : podcast.image,
              rating: podcast.rating || 0,
              is_liked: podcast.is_liked || false,
              audio_url: podcast.audio_url,
              bookaudio: podcast.bookaudio
            };
            
            return (
              <div key={podcast.id} style={{ minWidth: 160, maxWidth: 180 }}>
                <BookCard book={safeBook} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Videos Section
  const VideosSection = () => {
    const videos = homeData?.ads?.filter(ad => ad.type === 'Video') || [];

    if (!videos.length) return null;

    return (
      <div style={{ margin: '32px 0 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Videos</div>
          <button
            style={{ background: 'none', border: 'none', color: '#e7440d', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
            onClick={() => navigate('/all-videos')}
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
          {videos.map((video) => {
            const authorName = getAuthorName(video.author, video.author_name);
            const safeBook = {
              id: video.id,
              title: video.title || 'Untitled',
              author: authorName,
              author_name: authorName,
              coverimage: getImageUrl(video.coverimage, video.image),
              image: video.image ? `${FILE_BASE_URL}${video.image}` : video.image,
              rating: video.rating || 0,
              is_liked: video.is_liked || false,
              audio_url: video.audio_url,
              bookaudio: video.bookaudio
            };
            
            return (
              <div key={video.id} style={{ minWidth: 160, maxWidth: 180 }}>
                <BookCard book={safeBook} />
              </div>
            );
          })}
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
          {readers.map((reader) => (
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

  return (
    <div style={{ 
      padding: '0 16px 20px 16px', 
      maxWidth: 420, 
      margin: '0 auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <AdsSection />
      <NewBooksSection />
      <AudiobooksSection />
      <EbooksSection />
      <MagazinesSection />
      <PodcastsSection />
      <VideosSection />
      <ComingSoonSection />
      <ReadersSection />
    </div>
  );
};

export default AllTabComponent; 