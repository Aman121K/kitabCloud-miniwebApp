import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFunctions } from '../../apiService/apiFunctions';
import BookCard from '../BookCard';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';

const AudioBooksTabComponent = () => {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchAudiobooks();
        }
    }, [token]);

    const fetchAudiobooks = async () => {
        try {
            setLoading(true);
            const data = await apiFunctions.getAudiobooks(token);
            setCategories(data || []);
        } catch (error) {
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                <div style={{ width: 40, height: 40, border: '3px solid #f3f3f3', borderTop: '3px solid #e7440d', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    if (!categories.length) {
        return <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>No audiobooks found.</div>;
    }

    return (
        <div style={{ padding: '0 8px', maxWidth: 500, margin: '0 auto' }}>
            {categories.filter(cat => (cat.books && cat.books.length > 0)).map((cat) => (
                <div key={cat.id} style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', background: cat.category_color || '#e7440d', display: 'inline-block' }}></span>
                            <span style={{ fontWeight: 600, fontSize: 18 }}>{cat.category_name}</span>
                        </div>
                        <button
                            style={{ background: 'none', border: 'none', color: '#e7440d', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
                            onClick={() => alert(`View all for ${cat.category_name}`)}
                        >
                            View All
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                        {(cat.books || []).slice(0, 4).map((book) => (
                            <div key={book.id} style={{ minWidth: 160, maxWidth: 180 }}>
                                <BookCard book={{
                                    ...book,
                                    coverimage: book.coverimage ? `${FILE_BASE_URL}${book.coverimage}` : book.coverimage,
                                    bookaudio: book.bookaudio ? `${FILE_BASE_URL}${book.bookaudio}` : book.bookaudio
                                }} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AudioBooksTabComponent; 