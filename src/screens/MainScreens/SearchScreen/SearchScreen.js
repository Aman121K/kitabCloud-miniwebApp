import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import { commonStyles } from '../../../constants/commonStyles';
import BookCard from '../../../components/BookCard';
import BottomNavigation from '../../../components/BottomNavigation';

const SearchScreen = () => {
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            const data = await apiFunctions.searchItems({ query: searchQuery }, token);
            setSearchResults(data || []);
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

                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 40
                    }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            border: `3px solid ${colors.lightGrey}`,
                            borderTop: `3px solid ${colors.appPrimary}`,
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: 20
                    }}>
                        {searchResults.map((item, index) => (
                            <BookCard key={item.id || index} book={item} />
                        ))}
                    </div>
                )}
            </div>
            <BottomNavigation />
        </div>
    );
};

export default SearchScreen; 