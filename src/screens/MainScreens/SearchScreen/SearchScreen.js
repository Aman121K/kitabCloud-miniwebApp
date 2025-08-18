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
            const data = await apiFunctions.searchItems({ query: searchQuery }, token);
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

    return (
        <div style={commonStyles.fullScreenContainer}>
            <div style={commonStyles.fullScreenInnerContainer}>
                {/* Search Header */}
                <div style={{ marginBottom: 20 }}>
                    <h1 style={commonStyles.textLightBold(24, { marginBottom: 10 })}>
                        {searchType === 'all' ? 'Search' : `Search ${searchType}`}
                    </h1>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search for books, authors, podcasts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                            style={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: colors.appPrimary,
                                color: colors.white,
                                border: 'none',
                                borderRadius: 6,
                                padding: '8px 16px',
                                cursor: 'pointer'
                            }}
                        >
                            Search
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
                                        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Books</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
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
                                ) : searchQuery.trim() && (
                                    <div style={{ height: 80, background: '#f5f5f5', borderRadius: 10, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 16 }}>No books found</div>
                                )}
                                
                                {/* Authors Section */}
                                {searchResults.authors && searchResults.authors.length > 0 ? (
                                    <div style={{ marginBottom: 32 }}>
                                        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Authors</div>
                                        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                                            {searchResults.authors.map((item, idx) => (
                                                <AuthorCard key={item.id || idx} author={item} />
                                            ))}
                                        </div>
                                    </div>
                                ) : searchQuery.trim() && (
                                    <div style={{ height: 80, background: '#f5f5f5', borderRadius: 10, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 16 }}>No authors found</div>
                                )}

                                {/* Podcasts Section */}
                                {searchResults.podcasts && searchResults.podcasts.length > 0 ? (
                                    <div style={{ marginBottom: 32 }}>
                                        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Podcasts</div>
                                        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                                            {searchResults.podcasts.map((item, idx) => (
                                                <PodcastCard key={item.id || idx} podcast={item} />
                                            ))}
                                        </div>
                                    </div>
                                ) : searchQuery.trim() && (
                                    <div style={{ height: 80, background: '#f5f5f5', borderRadius: 10, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 16 }}>No podcasts found</div>
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