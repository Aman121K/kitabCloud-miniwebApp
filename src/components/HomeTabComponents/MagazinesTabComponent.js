import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFunctions } from '../../apiService/apiFunctions';
import { colors } from '../../constants/colors';
import BookCard from '../BookCard';
import EmptyState from '../EmptyState';

const MagazinesTabComponent = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [magazines, setMagazines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            fetchMagazines();
        }
    }, [token]);

    const fetchMagazines = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await apiFunctions.getMagazines(token);
            setMagazines(data || []);
        } catch (error) {
            console.error('Error fetching magazines:', error);
            setError(true);
            setMagazines([]);
        } finally {
            setLoading(false);
        }
    };

    const validMagazines = magazines.filter(magazine => magazine && magazine.id);

    if (loading) {
        return (
            <EmptyState 
                loading={true}
                loadingMessage="Loading magazines..."
            />
        );
    }

    if (error) {
        return (
            <EmptyState 
                icon="⚠️"
                title="Unable to Load Magazines"
                message="We're having trouble loading magazines right now. Please check your connection and try again."
                showRetryButton={true}
                onRetry={fetchMagazines}
            />
        );
    }

    if (!validMagazines.length) {
        return (
            <EmptyState 
                icon="📰"
                title="No Magazines Available"
                message="We don't have any magazines at the moment. Check back later for new publications!"
                tags={[
                    { text: "Coming Soon", primary: true },
                    { text: "Latest Issues", primary: false }
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
                    All Magazines
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
                    onClick={() => navigate('/all-magazines')}
                >
                    View All
                </button>
            </div>
            
            {/* Magazines Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 20,
                padding: '20px 0'
            }}>
                {validMagazines.map((magazine, index) => {
                // Ensure magazine has required properties
                const safeMagazine = {
                    id: magazine.id,
                    title: magazine.title || 'Untitled',
                    author: magazine.author || { name: 'Unknown Author' },
                    author_name: magazine.author_name || 'Unknown Author',
                    coverimage: magazine.coverimage || magazine.image,
                    image: magazine.image,
                    rating: magazine.rating || 0,
                    is_liked: magazine.is_liked || false,
                    audio_url: magazine.audio_url,
                    bookaudio: magazine.bookaudio
                };
                
                return <BookCard key={magazine.id || index} book={safeMagazine} />;
            })}
            </div>
        </div>
    );
};

export default MagazinesTabComponent; 