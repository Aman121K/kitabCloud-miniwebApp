import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFunctions } from '../../apiService/apiFunctions';
import { colors } from '../../constants/colors';
import BookCard from '../BookCard';
import EmptyState from '../EmptyState';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';

const VideosTabComponent = ({ homeData }) => {
    const { token } = useAuth();
    const navigate = useNavigate();

    // Extract videos from homeData - videos might be in ads or other sections
    const videos = homeData?.ads?.filter(ad => ad.type === 'Video') || [];
    const validVideos = videos.filter(video => video && video.id);

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
                    All Videos
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
                    onClick={() => navigate('/all-videos')}
                >
                    View All
                </button>
            </div>
            
            {/* Videos Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 20,
                padding: '20px 0'
            }}>
                {validVideos.map((video, index) => {
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
                    coverimage: video.coverimage ? `${FILE_BASE_URL}${video.coverimage}` : (video.image || '/favicon.ico'),
                    image: video.image ? `${FILE_BASE_URL}${video.image}` : video.image,
                    rating: video.rating || 0,
                    is_liked: video.is_liked || false,
                    audio_url: video.audio_url,
                    bookaudio: video.bookaudio
                };
                
                return <BookCard key={video.id || index} book={safeVideo} />;
            })}
            </div>
        </div>
    );
};

export default VideosTabComponent; 