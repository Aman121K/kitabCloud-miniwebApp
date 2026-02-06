import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import BookCard from '../../../components/BookCard';
import EmptyState from '../../../components/EmptyState';
import BackButton from '../../../components/BackButton';
import { colors } from '../../../constants/colors';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';

const CategoryBooksPage = () => {
    const { categoryName } = useParams();
    const { token } = useAuth();
    const { homeData, fetchHomeData } = useData();

    const [categoryData, setCategoryData] = React.useState(null);
    const [books, setBooks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchCategoryBooks();
        // eslint-disable-next-line
    }, [categoryName, token]);

    const fetchCategoryBooks = async () => {
        setLoading(true);
        try {
            // Use cached home data if available, otherwise fetch
            const data = homeData || await fetchHomeData(token);
            console.log('Home data for category:', data);
            
            // Find the category by name
            const foundCategory = data?.categoryWithBooks?.find(
                cat => cat.category_name === categoryName
            );
            
            if (foundCategory) {
                setCategoryData(foundCategory);
                setBooks(foundCategory.books || []);
            } else {
                setCategoryData(null);
                setBooks([]);
            }
        } catch (error) {
            console.error('Error fetching category books:', error);
            setCategoryData(null);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to safely get author name
    const getAuthorName = (author) => {
        if (typeof author === 'string') return author;
        if (author && typeof author === 'object' && author.name) return author.name;
        return 'Unknown Author';
    };

    // Helper function to safely get cover image URL
    const getImageUrl = (coverimage, image) => {
        if (coverimage) return `${FILE_BASE_URL}${coverimage}`;
        if (image) return `${FILE_BASE_URL}${image}`;
        return '/logo192.png';
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    flex: 1
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
            </div>
        );
    }

    if (!categoryData || books.length === 0) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '24px 20px',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        marginBottom: 8
                    }}>
                        <BackButton />
                        <div style={{ flex: 1 }}>
                            <h1 style={{
                                margin: 0,
                                fontSize: 26,
                                fontWeight: 800,
                                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                                letterSpacing: '-0.5px'
                            }}>
                                {categoryName || 'Category'}
                            </h1>
                        </div>
                    </div>
                </div>

                <EmptyState 
                    icon="📚"
                    title="No Books Available"
                    message="This category doesn't have any books yet. Check back later for new content!"
                />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${categoryData.category_color || '#667eea'} 0%, #764ba2 100%)`,
                padding: '24px 20px',
                color: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background element */}
                <div style={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 150,
                    height: 150,
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    backdropFilter: 'blur(20px)'
                }}></div>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 12,
                    position: 'relative',
                    zIndex: 1
                }}>
                    <BackButton />
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            margin: '0 0 4px 0',
                            fontSize: 28,
                            fontWeight: 800,
                            textShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
                            letterSpacing: '-0.5px',
                            lineHeight: '1.2'
                        }}>
                            {categoryData.category_name}
                        </h1>
                        <div style={{
                            fontSize: 15,
                            opacity: 0.95,
                            fontWeight: 600,
                            textShadow: '0 1px 6px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            <span>📚</span>
                            <span>{books.length} book{books.length !== 1 ? 's' : ''} available</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Books Section */}
            <div style={{
                flex: 1,
                padding: '24px 16px',
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto'
            }}>
                {/* Section Header */}
                <div style={{
                    marginBottom: 20,
                    paddingBottom: 12,
                    borderBottom: `2px solid ${colors.lightGrey}`
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span>📖</span>
                        <span>All Books</span>
                    </h2>
                </div>

                {/* Books Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: 20,
                    paddingBottom: 24
                }}>
                    {books.map((book) => {
                        if (!book || !book.id) return null;

                        const authorName = getAuthorName(book.author || book.author_name);
                        const coverImageUrl = getImageUrl(book.coverimage, book.image);
                        
                        // Extract audio URL if available
                        const audioUrl = book.bookaudio ? `${FILE_BASE_URL}${book.bookaudio}` : (book.sample_audio || null);

                        // Ensure book has required properties with proper image URLs
                        const safeBook = {
                            id: book.id,
                            title: book.title || 'Untitled',
                            author: authorName,
                            author_name: authorName,
                            coverimage: coverImageUrl,
                            image: book.image ? `${FILE_BASE_URL}${book.image}` : null,
                            rating: parseFloat(book.average_rating) || 0,
                            is_liked: book.is_liked || false,
                            audio_url: audioUrl,
                            bookaudio: book.bookaudio,
                            bookfile: book.bookfile ? `${FILE_BASE_URL}${book.bookfile}` : null
                        };

                        return <BookCard key={book.id} book={safeBook} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default CategoryBooksPage;
