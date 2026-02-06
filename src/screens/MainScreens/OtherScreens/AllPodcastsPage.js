import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import BookCard from '../../../components/BookCard';
import EmptyState from '../../../components/EmptyState';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';
const KITABCLOUD_LOGO = '/logo192.png'; // Local logo fallback

const AllPodcastsPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            fetchAllPodcasts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchAllPodcasts = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await apiFunctions.getPodcasts(token);
            setPodcasts(data || []);
        } catch (error) {
            console.error('Error fetching podcasts:', error);
            setError(true);
            setPodcasts([]);
        } finally {
            setLoading(false);
        }
    };

    const validPodcasts = podcasts.filter(podcast => podcast && podcast.id);

    if (loading) {
        return (
            <EmptyState 
                loading={true}
                loadingMessage="Loading all podcasts..."
            />
        );
    }

    if (error) {
        return (
            <EmptyState 
                icon="⚠️"
                title="Unable to Load Podcasts"
                message="We're having trouble loading podcasts right now. Please check your connection and try again."
                showRetryButton={true}
                onRetry={fetchAllPodcasts}
            />
        );
    }

    if (!validPodcasts.length) {
        return (
            <EmptyState 
                icon="🎧"
                title="No Podcasts Available"
                message="We don't have any podcasts at the moment. Check back later for new episodes!"
                tags={[
                    { text: "Coming Soon", primary: true },
                    { text: "Audio Stories", primary: false }
                ]}
            />
        );
    }

    return (
        <div style={{ 
            padding: '16px', 
            maxWidth: 420, 
            margin: '0 auto',
            paddingBottom: '80px'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 24,
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                padding: '16px 0',
                zIndex: 10,
                borderBottom: `1px solid ${colors.lightGrey}`
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 24,
                        cursor: 'pointer',
                        marginRight: 16,
                        color: colors.darkGrey
                    }}
                >
                    ←
                </button>
                <h1 style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: colors.darkGrey,
                    margin: 0
                }}>
                    All Podcasts
                </h1>
                <div style={{ marginLeft: 'auto', fontSize: 14, color: colors.grey }}>
                    {validPodcasts.length} podcasts
                </div>
            </div>

            {/* Podcasts Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
                padding: '0 4px'
            }}>
                {validPodcasts.map((podcast) => {
                    // Safely extract author name
                    let authorName = 'Unknown Author';
                    if (typeof podcast.author === 'string') {
                        authorName = podcast.author;
                    } else if (podcast.author && typeof podcast.author === 'object' && podcast.author.name) {
                        authorName = podcast.author.name;
                    } else if (podcast.author_name) {
                        authorName = podcast.author_name;
                    }
                    
                    // Ensure podcast has required properties with proper image URLs
                    const safePodcast = {
                        id: podcast.id,
                        title: podcast.title || 'Untitled',
                        author: authorName,
                        author_name: podcast.author_name || authorName,
                        coverimage: podcast.coverimage ? `${FILE_BASE_URL}${podcast.coverimage}` : (podcast.image ? `${FILE_BASE_URL}${podcast.image}` : KITABCLOUD_LOGO),
                        image: podcast.image ? `${FILE_BASE_URL}${podcast.image}` : podcast.image,
                        rating: podcast.rating || 0,
                        is_liked: podcast.is_liked || false,
                        audio_url: podcast.audio_url,
                        bookaudio: podcast.bookaudio,
                        bookfile: podcast.bookfile ? `${FILE_BASE_URL}${podcast.bookfile}` : podcast.bookfile
                    };
                    
                    return <BookCard key={podcast.id} book={safePodcast} />;
                })}
            </div>
        </div>
    );
};

export default AllPodcastsPage;
