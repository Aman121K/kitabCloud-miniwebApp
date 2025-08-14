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
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [reviews, setReviews] = useState([]); // Placeholder for reviews
    const [userRating, setUserRating] = useState(0);
    const [moreBooks, setMoreBooks] = useState([]); // More from author
    const [isPlayingFull, setIsPlayingFull] = useState(false);
    const [fullAudio, setFullAudio] = useState(null);
    const { playTrack } = useAudioPlayer();

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
            // Placeholder: fetch reviews and more from author
            // fetchReviews(data.id);
            // fetchMoreFromAuthor(data.author?.id);
        } catch (error) {
            console.error('Error fetching book details:', error);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder for review fetching
    // const fetchReviews = async (bookId) => { ... };
    // const fetchMoreFromAuthor = async (authorId) => { ... };

    const handlePlaySample = () => {
        if (book?.bookaudio) {
            // if (audio && !audio.paused) {
            //     audio.pause();
            //     setIsPlaying(false);
            // } else {
            //     if (audio) {
            //         audio.play();
            //     } else {
            //         const newAudio = new Audio(FILE_BASE_URL + book.bookaudio);
            //         newAudio.addEventListener('ended', () => setIsPlaying(false));
            //         setAudio(newAudio);
            //         newAudio.play();
            //     }
            //     setIsPlaying(true);
            // }
            playTrack({
                id: book.id + '-sample',
                title: book.title + ' (Sample)',
                author: book.author,
                cover_image: book.coverimage || book.image,
                audio_url: (book.bookaudio.startsWith('http') ? book.bookaudio : FILE_BASE_URL + book.bookaudio),
            });
        }
    };

    const handlePlayFullBook = () => {
        if (book?.bookaudio) {
            // extention test
            // if (fullAudio && !fullAudio.paused) {
            //     fullAudio.pause();
            //     setIsPlayingFull(false);
            // } else {
            //     if (fullAudio) {
            //         fullAudio.play();
            //     } else {
            //         const url = book.bookaudio.startsWith('http') ? book.bookaudio : FILE_BASE_URL + book.bookaudio;
            //         const newAudio = new Audio(url);
            //         newAudio.addEventListener('ended', () => setIsPlayingFull(false));
            //         setFullAudio(newAudio);
            //         newAudio.play();
            //     }
            //     setIsPlayingFull(true);
            // }
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
            await apiFunctions.likeUnlineBook(book.id, token);
            setBook(prev => ({ ...prev, is_liked: !prev.is_liked }));
        } catch (error) {
            console.error('Error liking book:', error);
        }
    };

    const handleUserRating = (rating) => {
        setUserRating(rating);
        // Optionally: post rating to API
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

    if (!book) {
        return (
            <div style={{ ...commonStyles.fullScreenContainer, ...commonStyles.centerContent }}>
                <p>Book not found</p>
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
    const releaseDate = formatDate(book.created_at) || '01 Jan 2023'; // fallback
    const language = book.language || 'Somali'; // fallback
    const length = book.length || '2 hr 22 min'; // fallback
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
                    <button onClick={handleLike} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>
                        {book.is_liked ? '❤️' : '🤍'}
                    </button>
                </div>

                {/* Book Card */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
                    <img
                        src={getImage()}
                        alt={book.title}
                        style={{ width: 100, height: 140, objectFit: 'cover', borderRadius: 8, background: colors.lightGrey }}
                        onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{ ...commonStyles.textLightNormal(14), color: colors.grey, marginBottom: 4 }}>Written by <span style={{ fontWeight: 600 }}>{authorName}</span></div>
                        <button onClick={handlePlayFullBook} style={{ width: '100%', background: colors.appPrimary, color: colors.white, border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 600, fontSize: 16, marginBottom: 8, cursor: 'pointer' }}>
                            {isPlayingFull ? 'Pause Audio Book' : 'Listen Audio Book'}
                        </button>
                        <button onClick={handlePlaySample} style={{ width: '100%', background: colors.white, color: colors.appPrimary, border: `1.5px solid ${colors.appPrimary}`, borderRadius: 8, padding: '12px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                            {isPlaying ? 'Pause ' : 'Play'}
                        </button>
                    </div>
                </div>

                {/* Book Info */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 18, fontSize: 14 }}>
                    <div>Rating <span style={{ color: colors.appPrimary, fontWeight: 600 }}>★ {rating}</span></div>
                    <div>Length <span style={{ color: colors.black }}>{length}</span></div>
                    <div>Language <span style={{ color: colors.appPrimary, cursor: 'pointer', textDecoration: 'underline' }}>{language} Change</span></div>
                    <div>Publisher <span style={{ color: colors.black }}>{publisher}</span></div>
                    <div>Released <span style={{ color: colors.black }}>{releaseDate}</span></div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 18 }}>
                    <div style={{ ...commonStyles.textLightBold(16), marginBottom: 6 }}>Description</div>
                    <div style={{ ...commonStyles.textLightNormal(14), color: colors.grey, lineHeight: 1.6 }}>
                        {descToShow} {showSeeMore && !showFullDesc && (
                            <span style={{ color: colors.appPrimary, cursor: 'pointer', marginLeft: 4 }} onClick={() => setShowFullDesc(true)}>See more</span>
                        )}
                    </div>
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

                {/* More from Author */}
                {/* <div style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ ...commonStyles.textLightBold(16), flex: 1 }}>More audiobooks from {authorName}</div>
                        <span style={{ color: colors.appPrimary, fontSize: 14, cursor: 'pointer' }}>See All</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
                        {moreBooksToShow.map(b => (
                            <div key={b.id} style={{ minWidth: 120, maxWidth: 140 }}>
                                <BookCard book={b} />
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
            {/* Render AudioPlayer only if audio is playing */}
             <AudioPlayer />
        </div>
    );
};

export default BookDetails; 