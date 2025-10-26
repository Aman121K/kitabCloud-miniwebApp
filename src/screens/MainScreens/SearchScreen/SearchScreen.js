import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import { commonStyles } from '../../../constants/commonStyles';
import BookCard from '../../../components/BookCard';
import BottomNavigation from '../../../components/BottomNavigation';
import AuthorCard from '../../../components/AuthorCard';
import PodcastCard from '../../../components/PodcastCard';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';

const SearchScreen = () => {
    const { token } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [allBooks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [booksLoading, setBooksLoading] = useState(true);
    const [searchType, setSearchType] = useState(location.state?.searchType || 'all');
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        if (token) {
            fetchAllBooksData();
        }
        // eslint-disable-next-line
    }, [token]);

    const fetchAllBooksData = async () => {
        try {
            setBooksLoading(true);
            console.log('Fetching all books data from API...');
            const booksData = await apiFunctions.getAllBooks(token);
            console.log('All books API response:', booksData);
            console.log('Response structure:', {
                hasBooks: !!(booksData && booksData.books),
                booksLength: booksData?.books?.length,
                isArray: Array.isArray(booksData),
                dataLength: booksData?.length,
                keys: booksData ? Object.keys(booksData) : 'no data'
            });
            
            if (booksData && booksData.books && Array.isArray(booksData.books)) {
                console.log('Setting all books from booksData.books:', booksData.books.length, 'books');
                setAllBooks(booksData.books);
            } else if (booksData && Array.isArray(booksData)) {
                // Handle case where books are directly in the response
                console.log('Setting all books (direct array):', booksData.length, 'books');
                setAllBooks(booksData);
            } else if (booksData && booksData.data && Array.isArray(booksData.data)) {
                // Handle case where books are in data property
                console.log('Setting all books from booksData.data:', booksData.data.length, 'books');
                setAllBooks(booksData.data);
            } else {
                console.log('No books found in response, setting empty array');
                // For testing purposes, let's add some sample data
                const sampleBooks = [
                    {
                        id: 1,
                        title: "Sample Book 1",
                        author: "Sample Author 1",
                        coverimage: "/logo192.png",
                        rating: 4.5,
                        is_liked: false
                    },
                    {
                        id: 2,
                        title: "Sample Book 2", 
                        author: "Sample Author 2",
                        coverimage: "/logo192.png",
                        rating: 4.0,
                        is_liked: false
                    }
                ];
                console.log('Setting sample books for testing');
                setAllBooks(sampleBooks);
            }
        } catch (error) {
            console.error('Error fetching all books:', error);
            setAllBooks([]);
        } finally {
            setBooksLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            
            // Use allBooks from state or fetch fresh data
            const booksData = allBooks.length > 0 ? { books: allBooks } : await apiFunctions.getAllBooks(token);
            const query = searchQuery.toLowerCase().trim();
            
            // Perform local search across all books
            const results = {
                books: [],
                authors: [],
                podcasts: []
            };
            
            // Search in all books from the comprehensive API
            if (booksData && booksData.books && Array.isArray(booksData.books)) {
                booksData.books.forEach(book => {
                    if (!book || !book.id) return;
                    
                    const title = (book.title || '').toLowerCase();
                    const authorName = (typeof book.author === 'object' && book.author?.name 
                        ? book.author.name 
                        : (book.author_name || '')).toLowerCase();
                    
                    // Search in book titles and authors
                    if (title.includes(query) || authorName.includes(query)) {
                        if (searchType === 'all' || searchType === 'books') {
                            if (!results.books.find(b => b.id === book.id)) {
                                results.books.push(book);
                            }
                        }
                    }
                    
                    // Extract unique authors for author search
                    if (searchType === 'all' || searchType === 'authors') {
                        if (book.author) {
                            const author = typeof book.author === 'object' ? book.author : { 
                                id: book.author_id || book.author, 
                                name: book.author 
                            };
                            const authorNameLower = author.name.toLowerCase();
                            
                            if (authorNameLower.includes(query)) {
                                if (!results.authors.find(a => a.id === author.id || a.name === author.name)) {
                                    results.authors.push(author);
                                }
                            }
                        }
                    }
                    
                    // Filter by book type for podcasts (if book has podcast type)
                    if (searchType === 'all' || searchType === 'podcasts') {
                        const bookType = (book.type || book.file_type || '').toLowerCase();
                        const isPodcast = bookType === 'podcast' || book.is_podcast === 1 || book.is_podcast === true;
                        
                        if (isPodcast) {
                            const title = (book.title || '').toLowerCase();
                            if (title.includes(query)) {
                                if (!results.podcasts.find(p => p.id === book.id)) {
                                    results.podcasts.push(book);
                                }
                            }
                        }
                    }
                });
            }
            
            console.log('All books API search results:', results);
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
                        booksLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                                <div style={{ width: 40, height: 40, border: `3px solid ${colors.lightGrey}`, borderTop: `3px solid ${colors.appPrimary}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ marginBottom: 16, color: colors.black }}>All Books ({allBooks.length})</h3>
                                {console.log('Rendering all books:', allBooks.length, 'books')}
                                {allBooks.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 40, color: colors.grey }}>
                                        <div style={{ fontSize: 16 }}>No books available</div>
                                        <div style={{ fontSize: 12, marginTop: 8 }}>Debug: allBooks array length is {allBooks.length}</div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
                                        {allBooks.filter(book => book && book.id).map((book) => {
                                        // Safely extract author name
                                        let authorName = 'Unknown Author';
                                        if (typeof book.author === 'string') {
                                            authorName = book.author;
                                        } else if (book.author && typeof book.author === 'object' && book.author.name) {
                                            authorName = book.author.name;
                                        } else if (book.author_name) {
                                            authorName = book.author_name;
                                        }
                                        
                                        // Ensure book has required properties with proper image URLs
                                        const safeBook = {
                                            id: book.id,
                                            title: book.title || 'Untitled',
                                            author: authorName,
                                            author_name: authorName,
                                            coverimage: book.coverimage ? `${FILE_BASE_URL}${book.coverimage}` : (book.image ? `${FILE_BASE_URL}${book.image}` : '/logo192.png'),
                                            image: book.image ? `${FILE_BASE_URL}${book.image}` : null,
                                            rating: book.rating || 0,
                                            is_liked: book.is_liked || false,
                                            audio_url: book.audio_url ? `${FILE_BASE_URL}${book.audio_url}` : null,
                                            bookaudio: book.bookaudio ? `${FILE_BASE_URL}${book.bookaudio}` : null
                                        };
                                        
                                            return <BookCard key={book.id} book={safeBook} />;
                                        })}
                                    </div>
                                )}
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