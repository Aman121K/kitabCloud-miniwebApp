import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { apiFunctions } from '../apiService/apiFunctions';
import { colors } from '../constants/colors';
import { commonStyles } from '../constants/commonStyles';

const BookCard = ({ book }) => {
    console.log("full image path>>",book)
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
        if (book.audio_url) {
            playTrack(book);
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

    return (
        <div 
            onClick={handleCardClick}
            style={{
                backgroundColor: colors.white,
                borderRadius: 12,
                padding: 15,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                border: isCurrentTrack ? `2px solid ${colors.appPrimary}` : 'none'
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
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
                        marginBottom: 10
                    }}
                    onError={(e) => {
                        e.target.src = '/favicon.ico';
                    }}
                />
                
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
                
                {book.audio_url && (
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
            
            <div>
                <h3 style={{
                    ...commonStyles.textLightBold(16),
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {bookTitle}
                </h3>
                <p style={{
                    ...commonStyles.textLightNormal(14),
                    color: colors.grey,
                    marginBottom: 8,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {bookAuthor}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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

