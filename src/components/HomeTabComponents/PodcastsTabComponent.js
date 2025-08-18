import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFunctions } from '../../apiService/apiFunctions';
import { colors } from '../../constants/colors';
import BookCard from '../BookCard';
import EmptyState from '../EmptyState';

const PodcastsTabComponent = () => {
    const { token } = useAuth();
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            fetchPodcasts();
        }
    }, [token]);

    const fetchPodcasts = async () => {
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
                loadingMessage="Loading podcasts..."
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
                onRetry={fetchPodcasts}
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20,
            padding: '20px 0'
        }}>
            {validPodcasts.map((podcast, index) => {
                // Ensure podcast has required properties
                const safePodcast = {
                    id: podcast.id,
                    title: podcast.title || 'Untitled',
                    author: podcast.author || { name: 'Unknown Author' },
                    author_name: podcast.author_name || 'Unknown Author',
                    coverimage: podcast.coverimage || podcast.image,
                    image: podcast.image,
                    rating: podcast.rating || 0,
                    is_liked: podcast.is_liked || false,
                    audio_url: podcast.audio_url,
                    bookaudio: podcast.bookaudio
                };
                
                return <BookCard key={podcast.id || index} book={safePodcast} />;
            })}
        </div>
    );
};

export default PodcastsTabComponent; 