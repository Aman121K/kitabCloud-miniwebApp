import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFunctions } from '../../apiService/apiFunctions';
import BookCard from '../BookCard';

const AllTabComponent = () => {
  const { token } = useAuth();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchHomeData();
    }
    // eslint-disable-next-line
  }, [token]);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const res = await apiFunctions.getHomeData(token);
      setHomeData(res);
    } catch (err) {
      setHomeData(null);
    }
    setLoading(false);
  };

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
  }

  if (!homeData) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>No data available.</div>;
  }

  // Promo Banner
  const PromoBanner = () => (
    <></>
    // <div style={{
    //   background: '#fff4f0',
    //   borderRadius: 12,
    //   padding: '20px 16px',
    //   margin: '20px 0',
    //   textAlign: 'left',
    // }}>
    //   <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>
    //     Read on-the-go, anytime, anywhere.
    //   </div>
    //   <div style={{ color: '#555', fontSize: 14, marginBottom: 18 }}>
    //     Discover the best reads on interesting topics you love.
    //   </div>
    //   <button
    //     style={{
    //       background: '#e7440d',
    //       color: '#fff',
    //       border: 'none',
    //       borderRadius: 8,
    //       padding: '12px 0',
    //       width: 180,
    //       fontWeight: 600,
    //       fontSize: 16,
    //       cursor: 'pointer',
    //       marginBottom: 8,
    //     }}
    //     onClick={() => alert('Start Your Trial clicked!')}
    //   >
    //     Start Your Trial
    //   </button>
    //   <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Cancel anytime</div>
    // </div>
  );

  // New Books Section
  const NewBooksSection = () => (
    <div style={{ margin: '28px 0 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>New Books</div>
        <button
          style={{ background: 'none', border: 'none', color: '#e7440d', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
          onClick={() => alert('See All New Books')}
        >
          See All
        </button>
      </div>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
        {(homeData.free_books || []).slice(0, 3).map((book) => (
          <div key={book.id} style={{ minWidth: 160, maxWidth: 180 }}>
            <BookCard book={{...book, coverimage: book.coverimage ? `${FILE_BASE_URL}${book.coverimage}` : book.coverimage}} />
          </div>
        ))}
      </div>
    </div>
  );

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
          <video width="100%" height="180" controls style={{ borderRadius: 12, background: '#000' }}>
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={fileUrl} alt={ad.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12 }} />
        )}
        <div style={{ fontWeight: 600, fontSize: 16, marginTop: 8 }}>{ad.title}</div>
        {ad.description && <div style={{ color: '#555', fontSize: 14 }}>{ad.description}</div>}
      </div>
    );
  };

  // Readers Section
  const ReadersSection = () => {
    const readers = homeData.reader || [];
    if (!readers.length) return null;
    return (
      <div style={{ margin: '32px 0 0 0' }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Readers</div>
        <div style={{ display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 8 }}>
          {readers.map((reader) => (
            <div key={reader.id} style={{ minWidth: 90, maxWidth: 100, textAlign: 'center' }}>
              <div style={{ position: 'relative', marginBottom: 6 }}>
                <a
                  href={reader.youtube || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', textDecoration: 'none' }}
                >
                  <img
                    src={reader.image ? `${FILE_BASE_URL}${reader.image}` : '/favicon.ico'}
                    alt={reader.name}
                    style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e7440d' }}
                  />
                </a>
              </div>
              <div style={{ fontSize: 13, color: '#333', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{reader.name}</div>
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
          />
        </div>
        <div style={{ fontWeight: 700, fontSize: 20, marginTop: 10, color: '#e7440d' }}>{coming.title}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: '0 16px 80px 16px', maxWidth: 420, margin: '0 auto' }}>
      <AdsSection />
      <PromoBanner />
      <NewBooksSection />
      <ComingSoonSection />
      <ReadersSection />
    </div>
  );
};

export default AllTabComponent; 