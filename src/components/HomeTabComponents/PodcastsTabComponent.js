import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFunctions } from '../../apiService/apiFunctions';
import { colors } from '../../constants/colors';
import BookCard from '../BookCard';
import EmptyState from '../EmptyState';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';
const KITABCLOUD_LOGO = '/logo192.png'; // Local logo fallback

const PodcastsTabComponent = ({ homeData }) => {
    const { token } = useAuth();
    const navigate = useNavigate();

    // Extract podcasts from homeData - podcasts are in categoryWithPodcast
    const podcasts = homeData?.categoryWithPodcast?.flatMap(cat => cat.podcasts || []) || [];
    const validPodcasts = podcasts.filter(podcast => podcast && podcast.id);

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
        <div style={{ padding: '0 16px' }}>
            {/* Header with View All button */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                padding: '0 4px'
            }}>
                <h2 style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: colors.darkGrey,
                    margin: 0
                }}>
                    All Podcasts
                </h2>
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.primary,
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/all-podcasts')}
                >
                    View All
                </button>
            </div>
            
            {/* Podcasts Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 20,
                padding: '20px 0'
            }}>
                {validPodcasts.map((podcast, index) => {
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
                    bookaudio: podcast.bookaudio
                };
                
                return <BookCard key={podcast.id || index} book={safePodcast} />;
            })}
            </div>
        </div>
    );
};

export default PodcastsTabComponent; 