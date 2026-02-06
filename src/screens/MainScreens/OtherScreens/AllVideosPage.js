import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import BookCard from '../../../components/BookCard';
import EmptyState from '../../../components/EmptyState';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';
const KITABCLOUD_LOGO = '/logo192.png'; // Local logo fallback

const AllVideosPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            fetchAllVideos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchAllVideos = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await apiFunctions.getVideos(token);
            setVideos(data || []);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError(true);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    const validVideos = videos.filter(video => video && video.id);

    if (loading) {
        return (
            <EmptyState 
                loading={true}
                loadingMessage="Loading all videos..."
            />
        );
    }

    if (error) {
        return (
            <EmptyState 
                icon="⚠️"
                title="Unable to Load Videos"
                message="We're having trouble loading videos right now. Please check your connection and try again."
                showRetryButton={true}
                onRetry={fetchAllVideos}
            />
        );
    }

    if (!validVideos.length) {
        return (
            <EmptyState 
                icon="🎬"
                title="No Videos Available"
                message="We don't have any videos at the moment. Check back later for new video content!"
                tags={[
                    { text: "Coming Soon", primary: true },
                    { text: "Educational Content", primary: false }
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
                    All Videos
                </h1>
                <div style={{ marginLeft: 'auto', fontSize: 14, color: colors.grey }}>
                    {validVideos.length} videos
                </div>
            </div>

            {/* Videos Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
                padding: '0 4px'
            }}>
                {validVideos.map((video) => {
                    // Safely extract author name
                    let authorName = 'Unknown Author';
                    if (typeof video.author === 'string') {
                        authorName = video.author;
                    } else if (video.author && typeof video.author === 'object' && video.author.name) {
                        authorName = video.author.name;
                    } else if (video.author_name) {
                        authorName = video.author_name;
                    }
                    
                    // Ensure video has required properties with proper image URLs
                    const safeVideo = {
                        id: video.id,
                        title: video.title || 'Untitled',
                        author: authorName,
                        author_name: video.author_name || authorName,
                        coverimage: video.coverimage ? `${FILE_BASE_URL}${video.coverimage}` : (video.image ? `${FILE_BASE_URL}${video.image}` : KITABCLOUD_LOGO),
                        image: video.image ? `${FILE_BASE_URL}${video.image}` : video.image,
                        rating: video.rating || 0,
                        is_liked: video.is_liked || false,
                        audio_url: video.audio_url,
                        bookaudio: video.bookaudio,
                        bookfile: video.bookfile ? `${FILE_BASE_URL}${video.bookfile}` : video.bookfile
                    };
                    
                    return <BookCard key={video.id} book={safeVideo} />;
                })}
            </div>
        </div>
    );
};

export default AllVideosPage;

