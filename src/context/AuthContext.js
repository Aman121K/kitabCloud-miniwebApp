import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFunctions } from '../apiService/apiFunctions';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getUserData();
        } else {
            setLoading(false);
        }
    }, [token]);

    const getUserData = async () => {
        try {
            const userData = await apiFunctions.getUserData(token);
            setUser(userData);
        } catch (error) {
            console.error('Error getting user data:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (userData, accessToken) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
    };

    const logout = async () => {
        try {
            if (token) {
                await apiFunctions.logoutUser(token);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 