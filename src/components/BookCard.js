import React, { useState } from 'react';
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

    const handleLike = async (e) => {
        e.stopPropagation();
        try {
            await apiFunctions.likeUnlineBook(book.id, token);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error liking book:', error);
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
                    src={book.cover_image || book.image || '/dummy-book.png'} 
                    alt={book.title}
                    style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 8,
                        marginBottom: 10
                    }}
                />
                
                <button
                    onClick={handleLike}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 5,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: '50%',
                        width: 30,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <span style={{ 
                        fontSize: 16,
                        color: isLiked ? colors.appPrimary : colors.grey
                    }}>
                        {isLiked ? '❤️' : '🤍'}
                    </span>
                </button>
                
                {book.audio_url && (
                    <button
                        onClick={handlePlay}
                        style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            background: isCurrentTrack && isPlaying ? colors.green : colors.appPrimary,
                            border: 'none',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <span style={{ 
                            fontSize: 16,
                            color: colors.white
                        }}>
                            {isCurrentTrack && isPlaying ? '⏸️' : '▶️'}
                        </span>
                    </button>
                )}
            </div>
            
            <h3 style={commonStyles.textLightBold(16, { 
                marginBottom: 5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            })}>
                {book.title}
            </h3>
            
            <p style={commonStyles.textLightNormal(14, { 
                color: colors.grey,
                marginBottom: 5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            })}>
                {book.author?.name || book.author_name || 'Unknown Author'}
            </p>
            
            {book.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: colors.appPrimary, fontWeight: '600' }}>
                        ★ {book.rating}
                    </span>
                </div>
            )}
        </div>
    );
};

export default BookCard;

