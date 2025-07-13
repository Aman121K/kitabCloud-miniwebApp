import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import { commonStyles } from '../../../constants/commonStyles';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        if (token && id) {
            fetchBookDetails();
        }
    }, [token, id]);

    const fetchBookDetails = async () => {
        try {
            setLoading(true);
            const data = await apiFunctions.getBookDetailsById(id, token);
            setBook(data);
        } catch (error) {
            console.error('Error fetching book details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = () => {
        if (book?.audio_url) {
            if (audio && !audio.paused) {
                audio.pause();
                setIsPlaying(false);
            } else {
                if (audio) {
                    audio.play();
                } else {
                    const newAudio = new Audio(book.audio_url);
                    newAudio.addEventListener('ended', () => setIsPlaying(false));
                    setAudio(newAudio);
                    newAudio.play();
                }
                setIsPlaying(true);
            }
        }
    };

    const handleLike = async () => {
        try {
            await apiFunctions.likeUnlineBook(book.id, token);
            setBook(prev => ({ ...prev, is_liked: !prev.is_liked }));
        } catch (error) {
            console.error('Error liking book:', error);
        }
    };

    if (loading) {
        return (
            <div style={{
                ...commonStyles.fullScreenContainer,
                ...commonStyles.centerContent
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: `3px solid ${colors.lightGrey}`,
                    borderTop: `3px solid ${colors.appPrimary}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div style={{
                ...commonStyles.fullScreenContainer,
                ...commonStyles.centerContent
            }}>
                <p>Book not found</p>
            </div>
        );
    }

    return (
        <div style={commonStyles.fullScreenContainer}>
            <div style={{ padding: '20px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 24,
                        cursor: 'pointer',
                        marginBottom: 20
                    }}
                >
                    ← Back
                </button>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20
                }}>
                    <div style={{
                        display: 'flex',
                        gap: 20
                    }}>
                        <img 
                            src={book.cover_image || book.image || '/dummy-book.png'} 
                            alt={book.title}
                            style={{
                                width: 200,
                                height: 300,
                                objectFit: 'cover',
                                borderRadius: 12
                            }}
                        />
                        
                        <div style={{ flex: 1 }}>
                            <h1 style={commonStyles.textLightBold(24, { 
                                color: colors.black,
                                marginBottom: 10
                            })}>
                                {book.title}
                            </h1>
                            
                            <p style={commonStyles.textLightNormal(16, { 
                                color: colors.grey,
                                marginBottom: 15
                            })}>
                                by {book.author?.name || book.author_name || 'Unknown Author'}
                            </p>
                            
                            {book.rating && (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 5,
                                    marginBottom: 15
                                }}>
                                    <span style={{ color: colors.appPrimary, fontWeight: '600' }}>
                                        ★ {book.rating}
                                    </span>
                                </div>
                            )}
                            
                            <div style={{
                                display: 'flex',
                                gap: 10,
                                marginBottom: 20
                            }}>
                                <button
                                    onClick={handleLike}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: book.is_liked ? colors.appPrimary : colors.white,
                                        color: book.is_liked ? colors.white : colors.black,
                                        border: `1px solid ${colors.appPrimary}`,
                                        borderRadius: 8,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {book.is_liked ? '❤️ Liked' : '🤍 Like'}
                                </button>
                                
                                {book.audio_url && (
                                    <button
                                        onClick={handlePlay}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: colors.appPrimary,
                                            color: colors.white,
                                            border: 'none',
                                            borderRadius: 8,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {book.description && (
                        <div>
                            <h3 style={commonStyles.textLightBold(18, { 
                                color: colors.black,
                                marginBottom: 10
                            })}>
                                Description
                            </h3>
                            <p style={commonStyles.textLightNormal(14, { 
                                color: colors.grey,
                                lineHeight: 1.6
                            })}>
                                {book.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetails; 