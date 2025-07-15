import React, { useState, useEffect } from 'react';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

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
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div style={commonStyles.fullScreenContainer}>
            <div style={{ padding: '20px', paddingBottom: 80 }}>
                <h1 style={commonStyles.textLightBold(28, { 
                    color: colors.black,
                    marginBottom: 20
                })}>
                    Search
                </h1>
                
                <div style={{
                    display: 'flex',
                    gap: 10,
                    marginBottom: 20
                }}>
                    <input
                        type="text"
                        placeholder="Search for books, authors, or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{
                            flex: 1,
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
                            padding: '12px 24px',
                            backgroundColor: colors.appPrimary,
                            color: colors.white,
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 16
                        }}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {(!searchQuery.trim()) ? (
                    categoriesLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                            <div style={{ width: 40, height: 40, border: `3px solid ${colors.lightGrey}`, borderTop: `3px solid ${colors.appPrimary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
                            {categories.map((cat, idx) => (
                                <div key={cat.id || idx} style={{ background: cat.category_color || colors.lighterGrey, borderRadius: 8, padding: 18, color: '#fff', fontWeight: 600, fontSize: 18, textAlign: 'center', cursor: 'pointer' }}>
                                    {cat.category_name}
                                </div>
                            ))}
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
                                        {searchResults.books.map((item, idx) => (
                                            <BookCard key={item.id || idx} book={item} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
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
                            ) : (
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
                            ) : (
                                <div style={{ height: 80, background: '#f5f5f5', borderRadius: 10, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 16 }}>No podcasts found</div>
                            )}
                        </>
                    )
                )}
            </div>
            <BottomNavigation />
        </div>
    );
};

export default SearchScreen; 