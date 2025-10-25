import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { apiFunctions } from '../apiService/apiFunctions';
import { colors } from '../constants/colors';
import { commonStyles } from '../constants/commonStyles';

const BookCard = ({ book }) => {
    const { token } = useAuth();
    const { playTrack, currentTrack, isPlaying } = useAudioPlayer();
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(book.is_liked || false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    // Update like state when book prop changes
    useEffect(() => {
        setIsLiked(book.is_liked || false);
    }, [book.is_liked]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (isLikeLoading) return; // Prevent multiple clicks
        
        try {
            setIsLikeLoading(true);
            const response = await apiFunctions.likeUnlineBook(book.id, token);
            
            if (response && response.success !== false) {
                setIsLiked(!isLiked);
            } else {
                console.error('Like/unlike failed:', response);
            }
        } catch (error) {
            console.error('Error liking book:', error);
            // Don't change state on error
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handlePlay = (e) => {
        e.stopPropagation();
        if (book.audio_url || book.bookaudio) {
            // Safely get author name
            let authorName = 'Unknown Author';
            if (typeof book.author === 'string') {
                authorName = book.author;
            } else if (book.author && typeof book.author === 'object' && book.author.name) {
                authorName = book.author.name;
            } else if (book.author_name) {
                authorName = book.author_name;
            }
            
            // Create a proper track object with string author and proper image URLs
            const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';
            const getImageUrl = (imgPath) => {
                if (!imgPath) return null;
                if (imgPath.startsWith('http')) return imgPath;
                return `${FILE_BASE_URL}${imgPath}`;
            };
            
            const track = {
                id: book.id,
                title: book.title || 'Untitled',
                author: authorName,
                author_name: book.author_name || authorName,
                cover_image: getImageUrl(book.coverimage) || getImageUrl(book.image) || '/favicon.ico',
                image: getImageUrl(book.image),
                audio_url: book.audio_url || book.bookaudio
            };
            
            // Try to get sibling tracks from the DOM context (same parent container)
            let contextTracks = [];
            try {
                const cardElement = e.currentTarget.closest('[data-track-container]');
                if (cardElement) {
                    const allCards = Array.from(cardElement.parentElement.children);
                    contextTracks = allCards
                        .map(el => el.querySelector('[data-track]'))
                        .filter(Boolean)
                        .map(dataTrack => {
                            try {
                                return JSON.parse(dataTrack.dataset.track);
                            } catch {
                                return null;
                            }
                        })
                        .filter(Boolean);
                }
            } catch (err) {
                console.log('Could not get context tracks:', err);
            }
            
            playTrack(track, 0, contextTracks);
        }
    };

    const handleCardClick = () => {
        navigate(`/book/${book.id}`);
    };

    const isCurrentTrack = currentTrack?.id === book.id;

    // Helper function to safely get string values
    const getSafeString = (value) => {
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value !== null) {
            // If it's an object, try to get a meaningful string representation
            if (value.name) return value.name;
            if (value.title) return value.title;
            if (value.id) return `ID: ${value.id}`;
            return 'Unknown';
        }
        return value?.toString() || 'Unknown';
    };

    // Safely get book properties
    const bookTitle = getSafeString(book.title);
    const bookAuthor = getSafeString(book.author?.name || book.author_name || book.author);
    const bookImage = book.coverimage || book.image || '/dummy-book.png';
    const bookRating = typeof book.rating === 'number' ? book.rating : 0;

    // Prepare track data for context
    const trackData = useMemo(() => {
        // Safely get author name
        let authorName = 'Unknown Author';
        if (typeof book.author === 'string') {
            authorName = book.author;
        } else if (book.author && typeof book.author === 'object' && book.author.name) {
            authorName = book.author.name;
        } else if (book.author_name) {
            authorName = book.author_name;
        }
        
        return {
            id: book.id,
            title: book.title,
            author: authorName,
            author_name: book.author_name || authorName,
            cover_image: book.coverimage || book.image,
            audio_url: book.audio_url || book.bookaudio
        };
    }, [book]);

    return (
        <div 
            data-track-container
            onClick={handleCardClick}
            style={{
                backgroundColor: colors.white,
                borderRadius: 12,
                padding: 15,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                border: isCurrentTrack ? `2px solid ${colors.appPrimary}` : 'none',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
                if (window.matchMedia('(hover: hover)').matches) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }
            }}
            onMouseLeave={(e) => {
                if (window.matchMedia('(hover: hover)').matches) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }
            }}
        >
            <div style={{ position: 'relative' }}>
                <img 
                    src={bookImage} 
                    alt={bookTitle}
                    style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 8,
                        marginBottom: 10,
                        aspectRatio: '3/4'
                    }}
                    onError={(e) => {
                        e.target.src = '/favicon.ico';
                    }}
                />
                
                {/* Hidden data for playlist context */}
                {book.audio_url || book.bookaudio ? (
                    <div data-track={JSON.stringify(trackData)} style={{ display: 'none' }} />
                ) : null}
                
                <button
                    onClick={handleLike}
                    disabled={isLikeLoading}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'none',
                        border: 'none',
                        cursor: isLikeLoading ? 'not-allowed' : 'pointer',
                        padding: 5,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: '50%',
                        width: 30,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isLikeLoading ? 0.6 : 1
                    }}
                >
                    {isLikeLoading ? (
                        <div style={{
                            width: 16,
                            height: 16,
                            border: '2px solid #e7440d',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    ) : (
                        <span style={{ 
                            fontSize: 16,
                            color: isLiked ? colors.appPrimary : colors.grey
                        }}>
                            {isLiked ? '❤️' : '🤍'}
                        </span>
                    )}
                </button>
                
                {(book.audio_url || book.bookaudio) && (
                    <button
                        onClick={handlePlay}
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            right: 10,
                            background: colors.appPrimary,
                            border: 'none',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: colors.white
                        }}
                    >
                        {isCurrentTrack && isPlaying ? '⏸️' : '▶️'}
                    </button>
                )}
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{
                        ...commonStyles.textLightBold(16),
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: '1.2'
                    }}>
                        {bookTitle}
                    </h3>
                    <p style={{
                        ...commonStyles.textLightNormal(14),
                        color: colors.grey,
                        marginBottom: 8,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: '1.2'
                    }}>
                        {bookAuthor}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
                    <span style={{ color: colors.appPrimary }}>★</span>
                    <span style={{ fontSize: 14, color: colors.grey }}>
                        {bookRating}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BookCard;

