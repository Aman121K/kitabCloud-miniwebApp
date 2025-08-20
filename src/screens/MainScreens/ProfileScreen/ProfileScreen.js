import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import { commonStyles } from '../../../constants/commonStyles';
import BookCard from '../../../components/BookCard';
import BottomNavigation from '../../../components/BottomNavigation';

const ProfileScreen = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [likedBooks, setLikedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'liked'

    useEffect(() => {
        if (token) {
            fetchUserData();
            fetchLikedBooks();
        }
    }, [token]);

    const fetchUserData = async () => {
        try {
            const data = await apiFunctions.getUserData(token);
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLikedBooks = async () => {
        try {
            const data = await apiFunctions.getUserLikedBooks(token);
            setLikedBooks(data || []);
        } catch (error) {
            console.error('Error fetching liked books:', error);
            setLikedBooks([]);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div style={commonStyles.fullScreenContainer}>
                <div style={commonStyles.centerContent}>
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

    return (
        <div style={{
            ...commonStyles.fullScreenContainer,
            paddingBottom: '80px' // Account for bottom navigation
        }}>
            <div style={{
                ...commonStyles.fullScreenInnerContainer,
                paddingBottom: '20px'
            }}>
                {/* Tab Navigation */}
                <div style={{
                    display: 'flex',
                    marginBottom: 20,
                    borderBottom: `1px solid ${colors.lightGrey}`
                }}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'profile' ? `2px solid ${colors.appPrimary}` : 'none',
                            color: activeTab === 'profile' ? colors.appPrimary : colors.grey,
                            fontWeight: activeTab === 'profile' ? '600' : '400',
                            cursor: 'pointer'
                        }}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('liked')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'liked' ? `2px solid ${colors.appPrimary}` : 'none',
                            color: activeTab === 'liked' ? colors.appPrimary : colors.grey,
                            fontWeight: activeTab === 'liked' ? '600' : '400',
                            cursor: 'pointer'
                        }}
                    >
                        Liked Items ({likedBooks.length})
                    </button>
                </div>

                {activeTab === 'profile' ? (
                    /* Profile Content */
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            marginBottom: 24,
                            padding: 20,
                            backgroundColor: colors.lightestGrey,
                            borderRadius: 12
                        }}>
                            <div style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                backgroundColor: colors.appPrimary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors.white,
                                fontSize: 24,
                                fontWeight: 'bold'
                            }}>
                                {userData?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 style={commonStyles.textLightBold(20, { 
                                    color: colors.black,
                                    marginBottom: 5
                                })}>
                                    {userData?.full_name || 'User'}
                                </h2>
                                <p style={commonStyles.textLightNormal(14, { 
                                    color: colors.grey
                                })}>
                                    {userData?.email || 'user@example.com'}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 15,
                            marginBottom: 24
                        }}>
                            <div style={{
                                textAlign: 'center',
                                padding: '15px',
                                backgroundColor: colors.lightestGrey,
                                borderRadius: 8
                            }}>
                                <h3 style={commonStyles.textLightBold(18, { 
                                    color: colors.black,
                                    marginBottom: 5
                                })}>
                                    {likedBooks.length}
                                </h3>
                                <p style={commonStyles.textLightNormal(12, { 
                                    color: colors.grey
                                })}>
                                    Liked Books
                                </p>
                            </div>
                            <div style={{
                                textAlign: 'center',
                                padding: '15px',
                                backgroundColor: colors.lightestGrey,
                                borderRadius: 8
                            }}>
                                <h3 style={commonStyles.textLightBold(18, { 
                                    color: colors.black,
                                    marginBottom: 5
                                })}>
                                    {userData?.bookmark_books?.length || 0}
                                </h3>
                                <p style={commonStyles.textLightNormal(12, { 
                                    color: colors.grey
                                })}>
                                    Bookmarked
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                padding: '15px',
                                backgroundColor: colors.red,
                                color: colors.white,
                                border: 'none',
                                borderRadius: 8,
                                fontSize: 16,
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    /* Liked Items Content */
                    <div>
                        <h2 style={commonStyles.textLightBold(20, { 
                            color: colors.black,
                            marginBottom: 16
                        })}>
                            Your Liked Items
                        </h2>
                        
                        {likedBooks.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: 16
                            }}>
                                {likedBooks.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: 40,
                                color: colors.grey
                            }}>
                                <div style={{ fontSize: 18, marginBottom: 8 }}>No liked items yet</div>
                                <div style={{ fontSize: 14 }}>Start exploring and like some books!</div>
                                <button
                                    onClick={() => navigate('/home')}
                                    style={{
                                        marginTop: 16,
                                        padding: '10px 20px',
                                        backgroundColor: colors.appPrimary,
                                        color: colors.white,
                                        border: 'none',
                                        borderRadius: 6,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Explore Books
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <BottomNavigation />
        </div>
    );
};

export default ProfileScreen; 