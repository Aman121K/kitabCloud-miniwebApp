import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import BookCard from '../../../components/BookCard';
import EmptyState from '../../../components/EmptyState';
import BottomNavigation from '../../../components/BottomNavigation';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';

const FavoritesScreen = () => {
    const { token } = useAuth();
    const { fetchLikedBooks } = useData();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            // Fetch liked books using cached data
            const response = await fetchLikedBooks(token);
            
            // Response structure: response[0].booklike is an array of { id, book: {...} }
            // We need to extract the book objects
            const booklikeArray = response[0]?.booklike || [];
            const books = booklikeArray.map(item => item.book).filter(Boolean);
            
            console.log('Favorites data:', books);
            setFavorites(books);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError(true);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    }, [token, fetchLikedBooks]);

    useEffect(() => {
        if (token) {
            fetchFavorites();
        }
    }, [token, fetchFavorites]);

    const validFavorites = favorites.filter(fav => fav && fav.id);

    if (loading) {
        return (
            <div>
                <EmptyState 
                    loading={true}
                    loadingMessage="Loading your favorites..."
                />
                <BottomNavigation />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <EmptyState 
                    icon="⚠️"
                    title="Unable to Load Favorites"
                    message="We're having trouble loading your favorites right now. Please check your connection and try again."
                    showRetryButton={true}
                    onRetry={fetchFavorites}
                />
                <BottomNavigation />
            </div>
        );
    }

    if (!validFavorites.length) {
        return (
            <div style={{ paddingBottom: '80px' }}>
                <EmptyState 
                    icon="❤️"
                    title="No Favorites Yet"
                    message="You haven't liked any books yet. Start exploring and add books to your favorites!"
                    tags={[
                        { text: "Browse Books", primary: true },
                        { text: "Discover Content", primary: false }
                    ]}
                />
                <BottomNavigation />
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '16px', 
            paddingTop: '20px',
            maxWidth: 420, 
            margin: '0 auto',
            paddingBottom: '100px',
            minHeight: '100vh',
            background: '#F8F9FA'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #F8B500 100%)',
                borderRadius: 16,
                padding: '20px 24px',
                marginBottom: 24,
                boxShadow: '0 4px 20px rgba(255, 107, 157, 0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background element */}
                <div style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    backdropFilter: 'blur(10px)'
                }}></div>
                
                {/* Content */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                    }}>
                        {/* Heart Icon */}
                        <div style={{
                            width: 48,
                            height: 48,
                            background: 'rgba(255, 255, 255, 0.25)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}>
                            <span style={{
                                fontSize: 28,
                                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                            }}>❤️</span>
                        </div>
                        
                        {/* Title */}
                        <div>
                            <h1 style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: '#FFFFFF',
                                margin: 0,
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                letterSpacing: '-0.5px'
                            }}>
                                My Favorites
                            </h1>
                            <div style={{
                                fontSize: 13,
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginTop: 2,
                                fontWeight: 500
                            }}>
                                {validFavorites.length} {validFavorites.length === 1 ? 'item' : 'items'}
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative badge */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                        <span style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#FFFFFF',
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                        }}>
                            ✨ Collection
                        </span>
                    </div>
                </div>
            </div>

            {/* Favorites Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
                padding: '0 4px'
            }}>
                {validFavorites.map((book) => {
                    // Safely extract author name
                    let authorName = 'Unknown Author';
                    if (typeof book.author === 'string') {
                        authorName = book.author;
                    } else if (book.author && typeof book.author === 'object' && book.author.name) {
                        authorName = book.author.name;
                    } else if (book.author_name) {
                        authorName = book.author_name;
                    }
                    
                    // Extract audio URL if available
                    const audioUrl = book.bookaudio ? `${FILE_BASE_URL}${book.bookaudio}` : (book.sample_audio || null);
                    
                    // Ensure book has required properties with proper image URLs
                    const safeBook = {
                        id: book.id,
                        title: book.title || 'Untitled',
                        author: authorName,
                        author_name: authorName,
                        coverimage: book.coverimage ? `${FILE_BASE_URL}${book.coverimage}` : '/logo192.png',
                        image: book.image ? `${FILE_BASE_URL}${book.image}` : null,
                        rating: parseFloat(book.average_rating) || 0,
                        is_liked: true, // These are liked books
                        audio_url: audioUrl,
                        bookaudio: book.bookaudio,
                        bookfile: book.bookfile ? `${FILE_BASE_URL}${book.bookfile}` : null
                    };
                    
                    return <BookCard key={book.id} book={safeBook} />;
                })}
            </div>
            
            <BottomNavigation />
        </div>
    );
};

export default FavoritesScreen;
