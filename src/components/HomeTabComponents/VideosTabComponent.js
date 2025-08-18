import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFunctions } from '../../apiService/apiFunctions';
import { colors } from '../../constants/colors';
import BookCard from '../BookCard';
import EmptyState from '../EmptyState';

const VideosTabComponent = () => {
    const { token } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            fetchVideos();
        }
    }, [token]);

    const fetchVideos = async () => {
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
                loadingMessage="Loading videos..."
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
                onRetry={fetchVideos}
            />
        );
    }

    if (!validVideos.length) {
        return (
            <EmptyState 
                icon="🎬"
                title="No Videos Available"
                message="We don't have any videos at the moment. Check back later for new content!"
                tags={[
                    { text: "Coming Soon", primary: true },
                    { text: "Educational Content", primary: false }
                ]}
            />
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20,
            padding: '20px 0'
        }}>
            {validVideos.map((video, index) => {
                // Ensure video has required properties
                const safeVideo = {
                    id: video.id,
                    title: video.title || 'Untitled',
                    author: video.author || { name: 'Unknown Author' },
                    author_name: video.author_name || 'Unknown Author',
                    coverimage: video.coverimage || video.image,
                    image: video.image,
                    rating: video.rating || 0,
                    is_liked: video.is_liked || false,
                    audio_url: video.audio_url,
                    bookaudio: video.bookaudio
                };
                
                return <BookCard key={video.id || index} book={safeVideo} />;
            })}
        </div>
    );
};

export default VideosTabComponent; 