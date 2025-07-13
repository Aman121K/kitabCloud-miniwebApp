import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import { colors } from '../../../constants/colors';
import { commonStyles } from '../../../constants/commonStyles';
import BottomNavigation from '../../../components/BottomNavigation';

const ProfileScreen = () => {
    const { user, token, logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const data = await apiFunctions.getUserData(token);
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <div style={{
                ...commonStyles.fullScreenContainer,
                ...commonStyles.centerContent
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
        );
    }

    return (
        <div style={commonStyles.fullScreenContainer}>
            <div style={{ padding: '20px', paddingBottom: 80 }}>
                <h1 style={commonStyles.textLightBold(28, { 
                    color: colors.black,
                    marginBottom: 20
                })}>
                    Profile
                </h1>

                <div style={{
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 20,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 20
                    }}>
                        <div style={{
                            width: 80,
                            height: 80,
                            backgroundColor: colors.appPrimary,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <span style={{
                                color: colors.white,
                                fontSize: 32,
                                fontWeight: 'bold'
                            }}>
                                {userData?.full_name?.charAt(0) || 'U'}
                            </span>
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
                        gap: 15
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
                                {userData?.liked_books?.length || 0}
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
            <BottomNavigation />
        </div>
    );
};

export default ProfileScreen; 