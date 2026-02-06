import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import BookCard from '../../../components/BookCard';
import EmptyState from '../../../components/EmptyState';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';
const KITABCLOUD_LOGO = '/logo192.png'; // Local logo fallback

const AllBooksPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            fetchAllBooks();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchAllBooks = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await apiFunctions.getBooks(token);
            setBooks(data || []);
        } catch (error) {
            console.error('Error fetching books:', error);
            setError(true);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const validBooks = books.filter(book => book && book.id);

    if (loading) {
        return (
            <EmptyState 
                loading={true}
                loadingMessage="Loading all books..."
            />
        );
    }

    if (error) {
        return (
            <EmptyState 
                icon="⚠️"
                title="Unable to Load Books"
                message="We're having trouble loading books right now. Please check your connection and try again."
                showRetryButton={true}
                onRetry={fetchAllBooks}
            />
        );
    }

    if (!validBooks.length) {
        return (
            <EmptyState 
                icon="📚"
                title="No Books Available"
                message="We don't have any books at the moment. Check back later for new content!"
                tags={[
                    { text: "Coming Soon", primary: true },
                    { text: "New Releases", primary: false }
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
                    All Books
                </h1>
                <div style={{ marginLeft: 'auto', fontSize: 14, color: colors.grey }}>
                    {validBooks.length} books
                </div>
            </div>

            {/* Books Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
                padding: '0 4px'
            }}>
                {validBooks.map((book) => {
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
                        author_name: book.author_name || authorName,
                        coverimage: book.coverimage ? `${FILE_BASE_URL}${book.coverimage}` : (book.image ? `${FILE_BASE_URL}${book.image}` : KITABCLOUD_LOGO),
                        image: book.image ? `${FILE_BASE_URL}${book.image}` : book.image,
                        rating: book.rating || 0,
                        is_liked: book.is_liked || false,
                        audio_url: book.audio_url,
                        bookaudio: book.bookaudio ? `${FILE_BASE_URL}${book.bookaudio}` : book.bookaudio,
                        bookfile: book.bookfile ? `${FILE_BASE_URL}${book.bookfile}` : book.bookfile
                    };
                    
                    return <BookCard key={book.id} book={safeBook} />;
                })}
            </div>
        </div>
    );
};

export default AllBooksPage;

