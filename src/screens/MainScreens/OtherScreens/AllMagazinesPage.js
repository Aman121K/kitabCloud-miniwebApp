import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import BookCard from '../../../components/BookCard';
import EmptyState from '../../../components/EmptyState';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';

const AllMagazinesPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [magazines, setMagazines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            fetchAllMagazines();
        }
    }, [token]);

    const fetchAllMagazines = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await apiFunctions.getMagazines(token);
            // Flatten the nested structure
            const allMagazines = (data || []).flatMap(category => 
                category.books?.filter(book => book.is_magazine === 1) || []
            );
            setMagazines(allMagazines);
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
                loadingMessage="Loading all magazines..."
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
                onRetry={fetchAllMagazines}
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
                    All Magazines
                </h1>
                <div style={{ marginLeft: 'auto', fontSize: 14, color: colors.grey }}>
                    {validMagazines.length} magazines
                </div>
            </div>

            {/* Magazines Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
                padding: '0 4px'
            }}>
                {validMagazines.map((magazine) => {
                    // Safely extract author name
                    let authorName = 'Unknown Author';
                    if (typeof magazine.author === 'string') {
                        authorName = magazine.author;
                    } else if (magazine.author && typeof magazine.author === 'object' && magazine.author.name) {
                        authorName = magazine.author.name;
                    } else if (magazine.author_name) {
                        authorName = magazine.author_name;
                    }
                    
                    // Ensure magazine has required properties with proper image URLs
                    const safeMagazine = {
                        id: magazine.id,
                        title: magazine.title || 'Untitled',
                        author: authorName,
                        author_name: magazine.author_name || authorName,
                        coverimage: magazine.coverimage ? `${FILE_BASE_URL}${magazine.coverimage}` : (magazine.image || '/favicon.ico'),
                        image: magazine.image ? `${FILE_BASE_URL}${magazine.image}` : magazine.image,
                        rating: magazine.rating || 0,
                        is_liked: magazine.is_liked || false,
                        audio_url: magazine.audio_url,
                        bookaudio: magazine.bookaudio,
                        bookfile: magazine.bookfile ? `${FILE_BASE_URL}${magazine.bookfile}` : magazine.bookfile
                    };
                    
                    return <BookCard key={magazine.id} book={safeMagazine} />;
                })}
            </div>
        </div>
    );
};

export default AllMagazinesPage;

