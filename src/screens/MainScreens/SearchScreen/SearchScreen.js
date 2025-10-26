import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { colors } from '../../../constants/colors';
import { commonStyles } from '../../../constants/commonStyles';
import BookCard from '../../../components/BookCard';
import BottomNavigation from '../../../components/BottomNavigation';
import AuthorCard from '../../../components/AuthorCard';
import PodcastCard from '../../../components/PodcastCard';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';

const SearchScreen = () => {
    const { token } = useAuth();
    const { homeData, fetchHomeData } = useData();
    const location = useLocation();
    const navigate = useNavigate();
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
            // Use cached home data if available, otherwise fetch
            const data = homeData || await fetchHomeData(token);
            console.log('Home data for categories:', data);
            // Use categoryWithBooks from home data
            setCategories(data?.categoryWithBooks || []);
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
            
            // Use cached home data instead of API
            const data = homeData || await fetchHomeData(token);
            const query = searchQuery.toLowerCase().trim();
            
            // Perform local search across all data
            const results = {
                books: [],
                authors: [],
                podcasts: []
            };
            
            // Search in all books from categoryWithBooks
            if (data.categoryWithBooks) {
                data.categoryWithBooks.forEach(category => {
                    if (category.books && Array.isArray(category.books)) {
                        category.books.forEach(book => {
                            const title = (book.title || '').toLowerCase();
                            const authorName = (typeof book.author === 'object' && book.author?.name 
                                ? book.author.name 
                                : (book.author_name || '')).toLowerCase();
                            
                            if (title.includes(query) || authorName.includes(query)) {
                                if (searchType === 'all' || searchType === 'books') {
                                    if (!results.books.find(b => b.id === book.id)) {
                                        results.books.push(book);
                                    }
                                }
                            }
                        });
                    }
                });
            }
            
            // Search in categoryWithAudioBooks (audiobooks)
            if (data.categoryWithAudioBooks) {
                data.categoryWithAudioBooks.forEach(category => {
                    if (category.books && Array.isArray(category.books)) {
                        category.books.forEach(book => {
                            const title = (book.title || '').toLowerCase();
                            const authorName = (typeof book.author === 'object' && book.author?.name 
                                ? book.author.name 
                                : (book.author_name || '')).toLowerCase();
                            
                            if (title.includes(query) || authorName.includes(query)) {
                                if (searchType === 'all' || searchType === 'books') {
                                    if (!results.books.find(b => b.id === book.id)) {
                                        results.books.push(book);
                                    }
                                }
                            }
                        });
                    }
                });
            }
            
            // Search in categoryWithEBooks (ebooks)
            if (data.categoryWithEBooks) {
                data.categoryWithEBooks.forEach(category => {
                    if (category.books && Array.isArray(category.books)) {
                        category.books.forEach(book => {
                            const title = (book.title || '').toLowerCase();
                            const authorName = (typeof book.author === 'object' && book.author?.name 
                                ? book.author.name 
                                : (book.author_name || '')).toLowerCase();
                            
                            if (title.includes(query) || authorName.includes(query)) {
                                if (searchType === 'all' || searchType === 'books') {
                                    if (!results.books.find(b => b.id === book.id)) {
                                        results.books.push(book);
                                    }
                                }
                            }
                        });
                    }
                });
            }
            
            // Search in categoryWithMagazines (magazines)
            if (data.categoryWithMagazines) {
                data.categoryWithMagazines.forEach(category => {
                    if (category.books && Array.isArray(category.books)) {
                        category.books.forEach(book => {
                            const title = (book.title || '').toLowerCase();
                            const authorName = (typeof book.author === 'object' && book.author?.name 
                                ? book.author.name 
                                : (book.author_name || '')).toLowerCase();
                            
                            if (title.includes(query) || authorName.includes(query)) {
                                if (searchType === 'all' || searchType === 'books') {
                                    if (!results.books.find(b => b.id === book.id)) {
                                        results.books.push(book);
                                    }
                                }
                            }
                        });
                    }
                });
            }
            
            // Search in categoryWithVideos (videos)
            if (data.categoryWithVideos) {
                data.categoryWithVideos.forEach(category => {
                    if (category.books && Array.isArray(category.books)) {
                        category.books.forEach(book => {
                            const title = (book.title || '').toLowerCase();
                            const authorName = (typeof book.author === 'object' && book.author?.name 
                                ? book.author.name 
                                : (book.author_name || '')).toLowerCase();
                            
                            if (title.includes(query) || authorName.includes(query)) {
                                if (searchType === 'all' || searchType === 'books') {
                                    if (!results.books.find(b => b.id === book.id)) {
                                        results.books.push(book);
                                    }
                                }
                            }
                        });
                    }
                });
            }
            
            // Search in free_books
            if (data.free_books && Array.isArray(data.free_books)) {
                data.free_books.forEach(book => {
                    const title = (book.title || '').toLowerCase();
                    const authorName = (typeof book.author === 'object' && book.author?.name 
                        ? book.author.name 
                        : (book.author_name || '')).toLowerCase();
                    
                    if (title.includes(query) || authorName.includes(query)) {
                        if (searchType === 'all' || searchType === 'books') {
                            if (!results.books.find(b => b.id === book.id)) {
                                results.books.push(book);
                            }
                        }
                    }
                });
            }
            
            // Search in top_played_book
            if (data.top_played_book && Array.isArray(data.top_played_book)) {
                data.top_played_book.forEach(item => {
                    if (item.book) {
                        const book = item.book;
                        const title = (book.title || '').toLowerCase();
                        const authorName = (typeof book.author === 'object' && book.author?.name 
                            ? book.author.name 
                            : (book.author_name || '')).toLowerCase();
                        
                        if (title.includes(query) || authorName.includes(query)) {
                            if (searchType === 'all' || searchType === 'books') {
                                if (!results.books.find(b => b.id === book.id)) {
                                    results.books.push(book);
                                }
                            }
                        }
                    }
                });
            }
            
            // Search in top played authors
            if (searchType === 'all' || searchType === 'authors') {
                if (data.top_played_author && Array.isArray(data.top_played_author)) {
                    data.top_played_author.forEach(item => {
                        if (item.author) {
                            const authorName = (typeof item.author === 'object' && item.author.name 
                                ? item.author.name 
                                : item.author).toLowerCase();
                            if (authorName.includes(query)) {
                                if (!results.authors.find(a => a.id === item.author.id)) {
                                    results.authors.push(item.author);
                                }
                            }
                        }
                    });
                }
                
                // Also search in category books for authors
                if (data.categoryWithBooks) {
                    data.categoryWithBooks.forEach(category => {
                        if (category.books && Array.isArray(category.books)) {
                            category.books.forEach(book => {
                                if (book.author) {
                                    const authorName = (typeof book.author === 'object' && book.author?.name 
                                        ? book.author.name 
                                        : (book.author_name || '')).toLowerCase();
                                    if (authorName.includes(query)) {
                                        const author = typeof book.author === 'object' ? book.author : { name: book.author };
                                        if (!results.authors.find(a => a.id === (author.id || author.name))) {
                                            results.authors.push(author);
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
            
            // Search in podcasts
            if (searchType === 'all' || searchType === 'podcasts') {
                if (data.categoryWithPodcast) {
                    data.categoryWithPodcast.forEach(category => {
                        if (category.books && Array.isArray(category.books)) {
                            category.books.forEach(podcast => {
                                const title = (podcast.title || '').toLowerCase();
                                if (title.includes(query)) {
                                    if (!results.podcasts.find(p => p.id === podcast.id)) {
                                        results.podcasts.push(podcast);
                                    }
                                }
                            });
                        }
                    });
                }
            }
            
            console.log('Local search results:', results);
            setSearchResults(results);
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

    const handleCategoryClick = (categoryName) => {
        // Navigate to category books page instead of searching
        navigate(`/category/${encodeURIComponent(categoryName)}`);
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
        
        // Auto-search after 300ms of no typing (reduced from 500ms for better UX)
        if (value.trim()) {
            // Set loading state immediately while waiting for search
            setLoading(true);
            const timeout = setTimeout(() => {
                handleSearch();
            }, 300);
            setSearchTimeout(timeout);
        } else {
            setSearchResults({});
            setLoading(false);
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
                                            onClick={() => handleCategoryClick(category.category_name)}
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
                                                {category.books?.length || 0} book{category.books?.length !== 1 ? 's' : ''}
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
                                                // Safely extract author name
                                                let authorName = 'Unknown Author';
                                                if (typeof item.author === 'string') {
                                                    authorName = item.author;
                                                } else if (item.author && typeof item.author === 'object' && item.author.name) {
                                                    authorName = item.author.name;
                                                } else if (item.author_name) {
                                                    authorName = item.author_name;
                                                }
                                                
                                                // Ensure book has required properties with proper image URLs
                                                const safeBook = {
                                                    id: item.id,
                                                    title: item.title || 'Untitled',
                                                    author: authorName,
                                                    author_name: authorName,
                                                    coverimage: item.coverimage ? `${FILE_BASE_URL}${item.coverimage}` : (item.image ? `${FILE_BASE_URL}${item.image}` : '/logo192.png'),
                                                    image: item.image ? `${FILE_BASE_URL}${item.image}` : null,
                                                    rating: item.rating || 0,
                                                    is_liked: item.is_liked || false,
                                                    audio_url: item.audio_url ? `${FILE_BASE_URL}${item.audio_url}` : null,
                                                    bookaudio: item.bookaudio ? `${FILE_BASE_URL}${item.bookaudio}` : null
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