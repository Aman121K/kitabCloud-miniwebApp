import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import BookCard from '../../../components/BookCard';
import EmptyState from '../../../components/EmptyState';

const AllAudiobooksPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [audiobooks, setAudiobooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            fetchAllAudiobooks();
        }
    }, [token]);

    const fetchAllAudiobooks = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await apiFunctions.getAudiobooks(token);
            setAudiobooks(data || []);
        } catch (error) {
            console.error('Error fetching audiobooks:', error);
            setError(true);
            setAudiobooks([]);
        } finally {
            setLoading(false);
        }
    };

    const validAudiobooks = audiobooks.filter(audiobook => audiobook && audiobook.id);

    if (loading) {
        return (
            <EmptyState 
                loading={true}
                loadingMessage="Loading all audiobooks..."
            />
        );
    }

    if (error) {
        return (
            <EmptyState 
                icon="⚠️"
                title="Unable to Load Audiobooks"
                message="We're having trouble loading audiobooks right now. Please check your connection and try again."
                showRetryButton={true}
                onRetry={fetchAllAudiobooks}
            />
        );
    }

    if (!validAudiobooks.length) {
        return (
            <EmptyState 
                icon="🎧"
                title="No Audiobooks Available"
                message="We don't have any audiobooks at the moment. Check back later for new audio content!"
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
                    All Audiobooks
                </h1>
                <div style={{ marginLeft: 'auto', fontSize: 14, color: colors.grey }}>
                    {validAudiobooks.length} audiobooks
                </div>
            </div>

            {/* Audiobooks Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
                padding: '0 4px'
            }}>
                {validAudiobooks.map((audiobook) => {
                    // Ensure audiobook has required properties
                    const safeAudiobook = {
                        id: audiobook.id,
                        title: audiobook.title || 'Untitled',
                        author: audiobook.author || { name: 'Unknown Author' },
                        author_name: audiobook.author_name || 'Unknown Author',
                        coverimage: audiobook.coverimage || audiobook.image,
                        image: audiobook.image,
                        rating: audiobook.rating || 0,
                        is_liked: audiobook.is_liked || false,
                        audio_url: audiobook.audio_url,
                        bookaudio: audiobook.bookaudio,
                        bookfile: audiobook.bookfile
                    };
                    
                    return <BookCard key={audiobook.id} book={safeAudiobook} />;
                })}
            </div>
        </div>
    );
};

export default AllAudiobooksPage;

