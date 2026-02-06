import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from '../BookCard';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';

const AudioBooksTabComponent = ({ homeData }) => {
    const navigate = useNavigate();

    // Extract audiobooks from homeData
    const categories = homeData?.categoryWithBooks || [];
    const audiobookCategories = categories.filter(cat => 
        cat.books && cat.books.length > 0 && 
        cat.books.some(book => book.type === 'audio' || book.file_type === 'audio')
    );

    if (!audiobookCategories.length) {
        return <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>No audiobooks found.</div>;
    }

    return (
        <div style={{ padding: '0 8px', maxWidth: 500, margin: '0 auto' }}>
            {audiobookCategories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', background: cat.category_color || '#e7440d', display: 'inline-block' }}></span>
                            <span style={{ fontWeight: 600, fontSize: 18 }}>{cat.category_name}</span>
                        </div>
                        <button
                            style={{ background: 'none', border: 'none', color: '#e7440d', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
                            onClick={() => navigate('/all-audiobooks')}
                        >
                            View All
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                        {(cat.books || []).slice(0, 4).map((book) => {
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
            ))}
        </div>
    );
};

export default AudioBooksTabComponent; 