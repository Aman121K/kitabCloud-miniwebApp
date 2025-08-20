import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import BookCard from '../../../components/BookCard';
import EmptyState from '../../../components/EmptyState';

const AllEbooksPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            fetchAllEbooks();
        }
    }, [token]);

    const fetchAllEbooks = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await apiFunctions.getEbooks(token);
            setEbooks(data || []);
        } catch (error) {
            console.error('Error fetching ebooks:', error);
            setError(true);
            setEbooks([]);
        } finally {
            setLoading(false);
        }
    };

    const validEbooks = ebooks.filter(ebook => ebook && ebook.id);

    if (loading) {
        return (
            <EmptyState 
                loading={true}
                loadingMessage="Loading all ebooks..."
            />
        );
    }

    if (error) {
        return (
            <EmptyState 
                icon="⚠️"
                title="Unable to Load Ebooks"
                message="We're having trouble loading ebooks right now. Please check your connection and try again."
                showRetryButton={true}
                onRetry={fetchAllEbooks}
            />
        );
    }

    if (!validEbooks.length) {
        return (
            <EmptyState 
                icon="📖"
                title="No Ebooks Available"
                message="We don't have any ebooks at the moment. Check back later for new digital content!"
                tags={[
                    { text: "Coming Soon", primary: true },
                    { text: "Digital Books", primary: false }
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
                    All Ebooks
                </h1>
                <div style={{ marginLeft: 'auto', fontSize: 14, color: colors.grey }}>
                    {validEbooks.length} ebooks
                </div>
            </div>

            {/* Ebooks Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
                padding: '0 4px'
            }}>
                {validEbooks.map((ebook) => {
                    // Ensure ebook has required properties
                    const safeEbook = {
                        id: ebook.id,
                        title: ebook.title || 'Untitled',
                        author: ebook.author || { name: 'Unknown Author' },
                        author_name: ebook.author_name || 'Unknown Author',
                        coverimage: ebook.coverimage || ebook.image,
                        image: ebook.image,
                        rating: ebook.rating || 0,
                        is_liked: ebook.is_liked || false,
                        audio_url: ebook.audio_url,
                        bookaudio: ebook.bookaudio,
                        bookfile: ebook.bookfile
                    };
                    
                    return <BookCard key={ebook.id} book={safeEbook} />;
                })}
            </div>
        </div>
    );
};

export default AllEbooksPage;

