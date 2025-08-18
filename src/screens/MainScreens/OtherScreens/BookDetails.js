import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import { commonStyles } from '../../../constants/commonStyles';
import BookCard from '../../../components/BookCard';
import AudioPlayer from '../../../components/AudioPlayer/AudioPlayer';
import { useAudioPlayer } from '../../../context/AudioPlayerContext';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';
const FALLBACK_IMAGE = '/favicon.ico';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [moreBooks, setMoreBooks] = useState([]);
    const { playTrack } = useAudioPlayer();

    useEffect(() => {
        if (token && id) {
            fetchBookDetails();
        }
    }, [token, id]);

    const fetchBookDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiFunctions.getBookDetailsById(id, token);
            if (data) {
                setBook(data);
            } else {
                setError('Book not found');
            }
        } catch (error) {
            console.error('Error fetching book details:', error);
            setError('Failed to load book details');
        } finally {
            setLoading(false);
        }
    };

    const handlePlaySample = () => {
        if (book?.bookaudio) {
            playTrack({
                id: book.id,
                title: book.title,
                author: book.author,
                cover_image: book.coverimage || book.image,
                audio_url: (book.bookaudio.startsWith('http') ? book.bookaudio : FILE_BASE_URL + book.bookaudio),
            });
        }
    };

    const handlePlayFullBook = () => {
        if (book?.bookaudio) {
            playTrack({
                id: book.id,
                title: book.title,
                author: book.author,
                cover_image: book.coverimage || book.image,
                audio_url: (book.bookaudio.startsWith('http') ? book.bookaudio : FILE_BASE_URL + book.bookaudio),
            });
        }
    };

    const handleLike = async () => {
        try {
            const response = await apiFunctions.likeUnlineBook(book.id, token);
            if (response && response.success !== false) {
                setBook(prev => ({ ...prev, is_liked: !prev.is_liked }));
            }
        } catch (error) {
            console.error('Error liking book:', error);
        }
    };

    const handleUserRating = (rating) => {
        setUserRating(rating);
        // TODO: Implement rating submission to API
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div style={{ ...commonStyles.fullScreenContainer, ...commonStyles.centerContent }}>
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

    if (error || !book) {
        return (
            <div style={{ ...commonStyles.fullScreenContainer, ...commonStyles.centerContent }}>
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <p style={{ fontSize: 18, color: colors.grey, marginBottom: 16 }}>{error || 'Book not found'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: colors.appPrimary,
                            color: colors.white,
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer'
                        }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Book info helpers
    const getImage = () => {
        const img = book.coverimage || book.image;
        if (!img) return FALLBACK_IMAGE;
        if ((book.cover_image && book.cover_image.startsWith('http')) || (book.image && book.image.startsWith('http'))) {
            return img;
        }
        return FILE_BASE_URL + img;
    };
    
    const authorName = book.author?.name || book.author_name || 'Unknown Author';
    const publisher = book.publisher || 'Kitab Cloud originals';
    const releaseDate = formatDate(book.created_at) || '01 Jan 2023';
    const language = book.language || 'Somali';
    const length = book.length || '2 hr 22 min';
    const rating = book.rating || 0;

    // Description logic
    const descLimit = 120;
    const desc = book.description || '';
    const showSeeMore = desc.length > descLimit;
    const descToShow = showFullDesc ? desc : desc.slice(0, descLimit) + (showSeeMore ? '...' : '');

    // Placeholder reviews
    const reviewsToShow = reviews.length > 0 ? reviews.slice(0, 1) : [{
        user: 'Ayan Khan',
        rating: 5,
        text: 'Lorem ipsum dolor sit amet consectetur. Mauris volutpat aliquam eu dictum. Pellentesque gravida euismod eu diam quis. Eu quis pretium et pharetra gravida.'
    }];

    // Placeholder more books
    const moreBooksToShow = moreBooks.length > 0 ? moreBooks : [
        { id: 1, title: 'Moaarynto D...', author: { name: authorName }, image: '', rating: 4 },
        { id: 2, title: 'Moaarynto D...', author: { name: authorName }, image: '', rating: 4 },
        { id: 3, title: 'Moaarynto D...', author: { name: authorName }, image: '', rating: 4 }
    ];

    return (
        <div style={{ ...commonStyles.fullScreenContainer, background: colors.white, minHeight: '100vh', paddingBottom: 80 }}>
            <div style={{ maxWidth: 420, margin: '0 auto', padding: 20 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', marginRight: 8 }}
                    >
                        ←
                    </button>
                    <h2 style={{ ...commonStyles.textLightBold(20), flex: 1, margin: 0 }}>{book.title}</h2>
                    <button 
                        onClick={handleLike} 
                        style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}
                    >
                        {book.is_liked ? '❤️' : '🤍'}
                    </button>
                </div>

                {/* Book Card */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <img
                        src={getImage()}
                        alt={book.title}
                        style={{ width: 120, height: 160, objectFit: 'cover', borderRadius: 8 }}
                        onError={(e) => {
                            e.target.src = FALLBACK_IMAGE;
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <h3 style={{ ...commonStyles.textLightBold(18), marginBottom: 8 }}>{book.title}</h3>
                        <p style={{ ...commonStyles.textLightNormal(14), color: colors.grey, marginBottom: 8 }}>by {authorName}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                            <span style={{ color: colors.appPrimary }}>★</span>
                            <span style={{ fontSize: 14, color: colors.grey }}>{rating}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {book.bookaudio && (
                                <button
                                    onClick={handlePlaySample}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: colors.appPrimary,
                                        color: colors.white,
                                        border: 'none',
                                        borderRadius: 6,
                                        fontSize: 14,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Play Sample
                                </button>
                            )}
                            {book.bookfile && (
                                <button
                                    onClick={() => window.open(FILE_BASE_URL + book.bookfile, '_blank')}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: colors.white,
                                        color: colors.appPrimary,
                                        border: `1px solid ${colors.appPrimary}`,
                                        borderRadius: 6,
                                        fontSize: 14,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Read E-book
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Book Details */}
                <div style={{ marginBottom: 24 }}>
                    <h4 style={{ ...commonStyles.textLightBold(16), marginBottom: 12 }}>Book Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                        <div>
                            <span style={{ fontSize: 12, color: colors.grey }}>Publisher</span>
                            <p style={{ fontSize: 14, margin: 0 }}>{publisher}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: 12, color: colors.grey }}>Release Date</span>
                            <p style={{ fontSize: 14, margin: 0 }}>{releaseDate}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: 12, color: colors.grey }}>Language</span>
                            <p style={{ fontSize: 14, margin: 0 }}>{language}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: 12, color: colors.grey }}>Length</span>
                            <p style={{ fontSize: 14, margin: 0 }}>{length}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 24 }}>
                    <h4 style={{ ...commonStyles.textLightBold(16), marginBottom: 12 }}>Description</h4>
                    <p style={{ ...commonStyles.textLightNormal(14), lineHeight: 1.6, marginBottom: 8 }}>
                        {descToShow}
                    </p>
                    {showSeeMore && (
                        <button
                            onClick={() => setShowFullDesc(!showFullDesc)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: colors.appPrimary,
                                fontSize: 14,
                                cursor: 'pointer'
                            }}
                        >
                            {showFullDesc ? 'Show Less' : 'Show More'}
                        </button>
                    )}
                </div>

                {/* Reviews */}
                <div style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ ...commonStyles.textLightBold(16), flex: 1 }}>Reviews ({reviews.length || 1})</div>
                        <span style={{ color: colors.appPrimary, fontSize: 14, cursor: 'pointer' }}>See All</span>
                    </div>
                    <div style={{ background: colors.lightGrey, borderRadius: 8, padding: 12, marginBottom: 6 }}>
                        <div style={{ ...commonStyles.textLightBold(14), marginBottom: 2 }}>{reviewsToShow[0].user}</div>
                        <div style={{ color: colors.appPrimary, fontSize: 13, marginBottom: 4 }}>★ {reviewsToShow[0].rating}</div>
                        <div style={{ ...commonStyles.textLightNormal(13), color: colors.grey }}>{reviewsToShow[0].text}</div>
                    </div>
                </div>

                {/* User Rating */}
                <div style={{ marginBottom: 18 }}>
                    <div style={{ ...commonStyles.textLightBold(16), marginBottom: 6 }}>Rating</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        {[1,2,3,4,5].map(star => (
                            <span
                                key={star}
                                style={{ fontSize: 22, color: userRating >= star ? colors.appPrimary : colors.lightGrey, cursor: 'pointer' }}
                                onClick={() => handleUserRating(star)}
                            >★</span>
                        ))}
                    </div>
                    <span style={{ color: colors.appPrimary, fontSize: 14, cursor: 'pointer' }}>Write a Review</span>
                </div>
            </div>
            {/* Render AudioPlayer only if audio is playing */}
            <AudioPlayer />
        </div>
    );
};

export default BookDetails; 