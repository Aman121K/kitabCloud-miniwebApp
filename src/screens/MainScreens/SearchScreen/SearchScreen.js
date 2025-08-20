import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import { commonStyles } from '../../../constants/commonStyles';
import BookCard from '../../../components/BookCard';
import BottomNavigation from '../../../components/BottomNavigation';
import AuthorCard from '../../../components/AuthorCard';
import PodcastCard from '../../../components/PodcastCard';

const SearchScreen = () => {
    const { token } = useAuth();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [searchType, setSearchType] = useState(location.state?.searchType || 'all');
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        if (!searchQuery.trim()) {
            fetchCategories();
        }
        // eslint-disable-next-line
    }, [searchQuery, token]);

    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const data = await apiFunctions.getCategories(token);
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
        setCategoriesLoading(false);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            const searchParams = { query: searchQuery };
            
            // Add search type if specified
            if (searchType && searchType !== 'all') {
                searchParams.type = searchType;
            }
            
            console.log('Searching with params:', searchParams);
            const data = await apiFunctions.searchItems(searchParams, token);
            console.log('Search results:', data);
            setSearchResults(data || {});
        } catch (error) {
            console.error('Error searching:', error);
            setSearchResults({});
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCategorySearch = (categoryName) => {
        setSearchQuery(categoryName);
        setSearchType('all');
        // Trigger search after setting query
        setTimeout(() => handleSearch(), 100);
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Auto-search after 500ms of no typing
        if (value.trim()) {
            const timeout = setTimeout(() => {
                handleSearch();
            }, 500);
            setSearchTimeout(timeout);
        } else {
            setSearchResults({});
        }
    };

    return (
        <div style={{
            ...commonStyles.fullScreenContainer,
            paddingBottom: '80px' // Account for bottom navigation
        }}>
            <div style={{
                ...commonStyles.fullScreenInnerContainer,
                paddingBottom: '20px'
            }}>
                {/* Search Header */}
                <div style={{ marginBottom: 20 }}>
                    <h1 style={commonStyles.textLightBold(24, { marginBottom: 10 })}>
                        {searchType === 'all' ? 'Search' : `Search ${searchType}`}
                    </h1>
                    
                    {/* Search Type Selector */}
                    <div style={{ 
                        display: 'flex', 
                        gap: 8, 
                        marginBottom: 12,
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch'
                    }}>
                        {['all', 'books', 'authors', 'podcasts'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSearchType(type)}
                                style={{
                                    padding: '6px 12px',
                                    background: searchType === type ? colors.appPrimary : colors.white,
                                    color: searchType === type ? colors.white : colors.black,
                                    border: `1px solid ${searchType === type ? colors.appPrimary : colors.lightGrey}`,
                                    borderRadius: 16,
                                    fontSize: 12,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    minWidth: 'fit-content'
                                }}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search for books, authors, podcasts..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleKeyPress}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: `1px solid ${colors.lightGrey}`,
                                borderRadius: 8,
                                fontSize: 16,
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            style={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: loading ? colors.grey : colors.appPrimary,
                                color: colors.white,
                                border: 'none',
                                borderRadius: 6,
                                padding: '8px 16px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                minHeight: '36px',
                                minWidth: '60px'
                            }}
                        >
                            {loading ? '...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                    {!searchQuery.trim() ? (
                        categoriesLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                                <div style={{ width: 40, height: 40, border: `3px solid ${colors.lightGrey}`, borderTop: `3px solid ${colors.appPrimary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ marginBottom: 16, color: colors.black }}>Browse by Category</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategorySearch(category.category_name)}
                                            style={{
                                                padding: '12px 16px',
                                                background: colors.white,
                                                border: `1px solid ${colors.lightGrey}`,
                                                borderRadius: 8,
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.borderColor = colors.appPrimary;
                                                e.target.style.backgroundColor = colors.lightestGrey;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.borderColor = colors.lightGrey;
                                                e.target.style.backgroundColor = colors.white;
                                            }}
                                        >
                                            <div style={{ fontWeight: 600, fontSize: 14, color: colors.black, marginBottom: 4 }}>
                                                {category.category_name}
                                            </div>
                                            <div style={{ fontSize: 12, color: colors.grey }}>
                                                {category.books?.length || 0} items
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    ) : (
                        loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                                <div style={{ width: 40, height: 40, border: `3px solid ${colors.lightGrey}`, borderTop: `3px solid ${colors.appPrimary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            </div>
                        ) : (
                            <>
                                {/* Books Section */}
                                {searchResults.books && searchResults.books.length > 0 ? (
                                    <div style={{ marginBottom: 32 }}>
                                        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Books ({searchResults.books.length})</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
                                            {searchResults.books.filter(book => book && book.id).map((item, idx) => {
                                                // Ensure book has required properties
                                                const safeBook = {
                                                    id: item.id,
                                                    title: item.title || 'Untitled',
                                                    author: item.author || { name: 'Unknown Author' },
                                                    author_name: item.author_name || 'Unknown Author',
                                                    coverimage: item.coverimage || item.image,
                                                    image: item.image,
                                                    rating: item.rating || 0,
                                                    is_liked: item.is_liked || false,
                                                    audio_url: item.audio_url,
                                                    bookaudio: item.bookaudio
                                                };
                                                
                                                return <BookCard key={item.id || idx} book={safeBook} />;
                                            })}
                                        </div>
                                    </div>
                                ) : searchQuery.trim() && searchType !== 'authors' && searchType !== 'podcasts' && (
                                    <div style={{ height: 80, background: '#f5f5f5', borderRadius: 10, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 16 }}>No books found</div>
                                )}
                                
                                {/* Authors Section */}
                                {searchResults.authors && searchResults.authors.length > 0 ? (
                                    <div style={{ marginBottom: 32 }}>
                                        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Authors ({searchResults.authors.length})</div>
                                        <div style={{ 
                                            display: 'flex', 
                                            gap: 16, 
                                            overflowX: 'auto', 
                                            paddingBottom: 8,
                                            WebkitOverflowScrolling: 'touch'
                                        }}>
                                            {searchResults.authors.map((item, idx) => (
                                                <AuthorCard key={item.id || idx} author={item} />
                                            ))}
                                        </div>
                                    </div>
                                ) : searchQuery.trim() && searchType !== 'books' && searchType !== 'podcasts' && (
                                    <div style={{ height: 80, background: '#f5f5f5', borderRadius: 10, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 16 }}>No authors found</div>
                                )}

                                {/* Podcasts Section */}
                                {searchResults.podcasts && searchResults.podcasts.length > 0 ? (
                                    <div style={{ marginBottom: 32 }}>
                                        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Podcasts ({searchResults.podcasts.length})</div>
                                        <div style={{ 
                                            display: 'flex', 
                                            gap: 16, 
                                            overflowX: 'auto', 
                                            paddingBottom: 8,
                                            WebkitOverflowScrolling: 'touch'
                                        }}>
                                            {searchResults.podcasts.map((item, idx) => (
                                                <PodcastCard key={item.id || idx} podcast={item} />
                                            ))}
                                        </div>
                                    </div>
                                ) : searchQuery.trim() && searchType !== 'books' && searchType !== 'authors' && (
                                    <div style={{ height: 80, background: '#f5f5f5', borderRadius: 10, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 16 }}>No podcasts found</div>
                                )}

                                {/* Debug Info (remove in production) */}
                                {process.env.NODE_ENV === 'development' && searchQuery.trim() && (
                                    <div style={{ 
                                        background: '#f0f0f0', 
                                        padding: 16, 
                                        borderRadius: 8, 
                                        marginTop: 20,
                                        fontSize: 12,
                                        fontFamily: 'monospace'
                                    }}>
                                        <div><strong>Debug Info:</strong></div>
                                        <div>Query: "{searchQuery}"</div>
                                        <div>Type: {searchType}</div>
                                        <div>Results: {JSON.stringify(searchResults, null, 2)}</div>
                                    </div>
                                )}

                                {/* No Results */}
                                {searchQuery.trim() && 
                                 (!searchResults.books || searchResults.books.length === 0) &&
                                 (!searchResults.authors || searchResults.authors.length === 0) &&
                                 (!searchResults.podcasts || searchResults.podcasts.length === 0) && (
                                    <div style={{ textAlign: 'center', padding: 40, color: colors.grey }}>
                                        <div style={{ fontSize: 18, marginBottom: 8 }}>No results found</div>
                                        <div style={{ fontSize: 14 }}>Try searching with different keywords</div>
                                    </div>
                                )}
                            </>
                        )
                    )}
                </div>
            </div>
            <BottomNavigation />
        </div>
    );
};

export default SearchScreen; 