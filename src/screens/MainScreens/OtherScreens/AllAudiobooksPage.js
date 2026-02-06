import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import BookCard from '../../../components/BookCard';
import EmptyState from '../../../components/EmptyState';
import PrimaryTextInput from '../../../components/PrimaryTextInput';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';
const KITABCLOUD_LOGO = '/logo192.png'; // Local logo fallback

const AllAudiobooksPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [audiobooks, setAudiobooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAudiobooks, setFilteredAudiobooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            fetchAllAudiobooks();
            fetchCategories();
        }
    }, [token]);

    useEffect(() => {
        if (searchQuery.trim()) {
            handleSearch();
        } else {
            setFilteredAudiobooks(audiobooks);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, audiobooks]);

    const fetchAllAudiobooks = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await apiFunctions.getAudiobooks(token);
            setAudiobooks(data || []);
            setFilteredAudiobooks(data || []);
        } catch (error) {
            console.error('Error fetching audiobooks:', error);
            setError(true);
            setAudiobooks([]);
            setFilteredAudiobooks([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const data = await apiFunctions.getCategories(token);
            if (data && Array.isArray(data)) {
                // Get audiobook counts for each category
                const categoriesWithCounts = await Promise.all(
                    data.map(async (category) => {
                        try {
                            const audiobooksInCategory = await apiFunctions.getAudiobooksByCategory(token, category.id);
                            return {
                                ...category,
                                audiobookCount: audiobooksInCategory.length
                            };
                        } catch (error) {
                            console.error(`Error fetching audiobooks for category ${category.id}:`, error);
                            return {
                                ...category,
                                audiobookCount: 0
                            };
                        }
                    })
                );
                setCategories(categoriesWithCounts);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setFilteredAudiobooks(audiobooks);
            return;
        }

        try {
            setSearchLoading(true);
            const searchResults = await apiFunctions.searchAudiobooks(token, searchQuery);
            setFilteredAudiobooks(searchResults || []);
        } catch (error) {
            console.error('Error searching audiobooks:', error);
            // Fallback to local search
            const localResults = audiobooks.filter(audiobook => {
                const title = (audiobook.title || '').toLowerCase();
                const author = (audiobook.author_name || audiobook.author || '').toLowerCase();
                const query = searchQuery.toLowerCase();
                return title.includes(query) || author.includes(query);
            });
            setFilteredAudiobooks(localResults);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleCategoryClick = async (category) => {
        try {
            setSelectedCategory(category);
            setSearchQuery('');
            setLoading(true);
            const audiobooksInCategory = await apiFunctions.getAudiobooksByCategory(token, category.id);
            setFilteredAudiobooks(audiobooksInCategory || []);
        } catch (error) {
            console.error('Error fetching audiobooks by category:', error);
            setFilteredAudiobooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleShowAll = () => {
        setSelectedCategory(null);
        setSearchQuery('');
        setFilteredAudiobooks(audiobooks);
    };

    const validAudiobooks = filteredAudiobooks.filter(audiobook => audiobook && audiobook.id);

    if (loading && !searchLoading) {
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

    if (!validAudiobooks.length && !loading && !searchLoading) {
        return (
            <EmptyState 
                icon="🎧"
                title={selectedCategory ? `No Audiobooks in ${selectedCategory.name}` : searchQuery ? "No Search Results" : "No Audiobooks Available"}
                message={selectedCategory ? `There are no audiobooks in the ${selectedCategory.name} category yet.` : searchQuery ? "Try searching with different keywords." : "We don't have any audiobooks at the moment. Check back later for new audio content!"}
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
                marginBottom: 16,
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
                    {selectedCategory ? selectedCategory.name : 'All Audiobooks'}
                </h1>
                <div style={{ marginLeft: 'auto', fontSize: 14, color: colors.grey }}>
                    {validAudiobooks.length} audiobooks
                </div>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: 20 }}>
                <PrimaryTextInput
                    placeholder="Search audiobooks by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: 0 }}
                />
            </div>

            {/* Categories Section */}
            {!searchQuery && (
                <div style={{ marginBottom: 24 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 12
                    }}>
                        <h3 style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: colors.darkGrey,
                            margin: 0
                        }}>
                            Categories
                        </h3>
                        {selectedCategory && (
                            <button
                                onClick={handleShowAll}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: colors.appPrimary,
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Show All
                            </button>
                        )}
                    </div>
                    
                    {categoriesLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                            <div style={{ width: 30, height: 30, border: `2px solid ${colors.lightGrey}`, borderTop: `2px solid ${colors.appPrimary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: 12
                        }}>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category)}
                                    style={{
                                        padding: '12px 16px',
                                        background: selectedCategory?.id === category.id ? colors.appPrimary : colors.white,
                                        color: selectedCategory?.id === category.id ? colors.white : colors.darkGrey,
                                        border: `1px solid ${selectedCategory?.id === category.id ? colors.appPrimary : colors.lightGrey}`,
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s ease',
                                        opacity: category.audiobookCount === 0 ? 0.5 : 1
                                    }}
                                    disabled={category.audiobookCount === 0}
                                >
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                                        {category.name}
                                    </div>
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                                        {category.audiobookCount} audiobook{category.audiobookCount !== 1 ? 's' : ''}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Loading indicator for search */}
            {searchLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                    <div style={{ width: 30, height: 30, border: `2px solid ${colors.lightGrey}`, borderTop: `2px solid ${colors.appPrimary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
            )}

            {/* Audiobooks Grid */}
            {!searchLoading && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: 16,
                    padding: '0 4px'
                }}>
                    {validAudiobooks.map((audiobook) => {
                    // Safely extract author name
                    let authorName = 'Unknown Author';
                    if (typeof audiobook.author === 'string') {
                        authorName = audiobook.author;
                    } else if (audiobook.author && typeof audiobook.author === 'object' && audiobook.author.name) {
                        authorName = audiobook.author.name;
                    } else if (audiobook.author_name) {
                        authorName = audiobook.author_name;
                    }
                    
                    // Ensure audiobook has required properties with proper image URLs
                    const safeAudiobook = {
                        id: audiobook.id,
                        title: audiobook.title || 'Untitled',
                        author: authorName,
                        author_name: audiobook.author_name || authorName,
                        coverimage: audiobook.coverimage ? `${FILE_BASE_URL}${audiobook.coverimage}` : (audiobook.image ? `${FILE_BASE_URL}${audiobook.image}` : KITABCLOUD_LOGO),
                        image: audiobook.image ? `${FILE_BASE_URL}${audiobook.image}` : audiobook.image,
                        rating: audiobook.rating || 0,
                        is_liked: audiobook.is_liked || false,
                        audio_url: audiobook.audio_url,
                        bookaudio: audiobook.bookaudio ? `${FILE_BASE_URL}${audiobook.bookaudio}` : audiobook.bookaudio,
                        bookfile: audiobook.bookfile ? `${FILE_BASE_URL}${audiobook.bookfile}` : audiobook.bookfile
                    };
                    
                        return <BookCard key={audiobook.id} book={safeAudiobook} />;
                    })}
                </div>
            )}
        </div>
    );
};

export default AllAudiobooksPage;

