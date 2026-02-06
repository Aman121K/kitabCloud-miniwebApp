import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiFunctions } from '../apiService/apiFunctions';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    // Cache for home data
    const [homeData, setHomeData] = useState(null);
    const [homeDataLoading, setHomeDataLoading] = useState(false);
    const [homeDataError, setHomeDataError] = useState(null);
    const [homeDataTimestamp, setHomeDataTimestamp] = useState(null);

    // Cache for liked books
    const [likedBooks, setLikedBooks] = useState(null);
    const [likedBooksLoading, setLikedBooksLoading] = useState(false);
    const [likedBooksError, setLikedBooksError] = useState(null);
    const [likedBooksTimestamp, setLikedBooksTimestamp] = useState(null);

    // Cache for all books
    const [allBooks, setAllBooks] = useState(null);
    const [allBooksLoading, setAllBooksLoading] = useState(false);
    const [allBooksError, setAllBooksError] = useState(null);
    const [allBooksTimestamp, setAllBooksTimestamp] = useState(null);

    // Cache expiration time (5 minutes)
    const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    // Check if cache is still valid
    const isCacheValid = (timestamp) => {
        if (!timestamp) return false;
        const now = Date.now();
        return (now - timestamp) < CACHE_EXPIRATION;
    };

    // Fetch home data with caching
    const fetchHomeData = useCallback(async (token, forceRefresh = false) => {
        // If we have valid cached data and not forcing refresh, return cached data
        if (!forceRefresh && homeData && isCacheValid(homeDataTimestamp)) {
            console.log('Using cached home data');
            return homeData;
        }

        // Otherwise, fetch fresh data
        setHomeDataLoading(true);
        setHomeDataError(null);

        try {
            const data = await apiFunctions.getHomeData(token);
            const now = Date.now();
            
            setHomeData(data);
            setHomeDataTimestamp(now);
            console.log('Fetched fresh home data');
            
            return data;
        } catch (error) {
            console.error('Error fetching home data:', error);
            setHomeDataError(error);
            
            // Return cached data if available, even if expired
            if (homeData) {
                console.log('Returning expired cached data due to error');
                return homeData;
            }
            
            throw error;
        } finally {
            setHomeDataLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [homeData, homeDataTimestamp]);

    // Fetch liked books with caching
    const fetchLikedBooks = useCallback(async (token, forceRefresh = false) => {
        // If we have valid cached data and not forcing refresh, return cached data
        if (!forceRefresh && likedBooks && isCacheValid(likedBooksTimestamp)) {
            console.log('Using cached liked books');
            return likedBooks;
        }

        // Otherwise, fetch fresh data
        setLikedBooksLoading(true);
        setLikedBooksError(null);

        try {
            const data = await apiFunctions.getUserLikedBooks(token);
            const now = Date.now();
            
            setLikedBooks(data);
            setLikedBooksTimestamp(now);
            console.log('Fetched fresh liked books');
            
            return data;
        } catch (error) {
            console.error('Error fetching liked books:', error);
            setLikedBooksError(error);
            
            // Return cached data if available, even if expired
            if (likedBooks) {
                console.log('Returning expired cached liked books due to error');
                return likedBooks;
            }
            
            throw error;
        } finally {
            setLikedBooksLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [likedBooks, likedBooksTimestamp]);

    // Clear all cached data
    const clearCache = useCallback(() => {
        setHomeData(null);
        setHomeDataTimestamp(null);
        setLikedBooks(null);
        setLikedBooksTimestamp(null);
        setAllBooks(null);
        setAllBooksTimestamp(null);
        setHomeDataError(null);
        setLikedBooksError(null);
        setAllBooksError(null);
        console.log('Cache cleared');
    }, []);

    // Clear specific cache
    const clearHomeDataCache = useCallback(() => {
        setHomeData(null);
        setHomeDataTimestamp(null);
        setHomeDataError(null);
        console.log('Home data cache cleared');
    }, []);

    const clearLikedBooksCache = useCallback(() => {
        setLikedBooks(null);
        setLikedBooksTimestamp(null);
        setLikedBooksError(null);
        console.log('Liked books cache cleared');
    }, []);

    const clearAllBooksCache = useCallback(() => {
        setAllBooks(null);
        setAllBooksTimestamp(null);
        setAllBooksError(null);
        console.log('All books cache cleared');
    }, []);

    // Refresh home data (force fetch)
    const refreshHomeData = useCallback(async (token) => {
        return await fetchHomeData(token, true);
    }, [fetchHomeData]);

    // Refresh liked books (force fetch)
    const refreshLikedBooks = useCallback(async (token) => {
        return await fetchLikedBooks(token, true);
    }, [fetchLikedBooks]);

    // Fetch all books with caching
    const fetchAllBooks = useCallback(async (token, forceRefresh = false) => {
        // If we have valid cached data and not forcing refresh, return cached data
        if (!forceRefresh && allBooks && isCacheValid(allBooksTimestamp)) {
            console.log('Using cached all books');
            return allBooks;
        }

        // Otherwise, fetch fresh data
        setAllBooksLoading(true);
        setAllBooksError(null);

        try {
            const data = await apiFunctions.getAllBooks(token);
            const now = Date.now();
            
            setAllBooks(data);
            setAllBooksTimestamp(now);
            console.log('Fetched fresh all books');
            
            return data;
        } catch (error) {
            console.error('Error fetching all books:', error);
            setAllBooksError(error);
            
            // Return cached data if available, even if expired
            if (allBooks) {
                console.log('Returning expired cached all books due to error');
                return allBooks;
            }
            
            throw error;
        } finally {
            setAllBooksLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allBooks, allBooksTimestamp]);

    // Refresh all books (force fetch)
    const refreshAllBooks = useCallback(async (token) => {
        return await fetchAllBooks(token, true);
    }, [fetchAllBooks]);

    const value = {
        // Home data
        homeData,
        homeDataLoading,
        homeDataError,
        fetchHomeData,
        refreshHomeData,
        clearHomeDataCache,

        // Liked books
        likedBooks,
        likedBooksLoading,
        likedBooksError,
        fetchLikedBooks,
        refreshLikedBooks,
        clearLikedBooksCache,

        // All books
        allBooks,
        allBooksLoading,
        allBooksError,
        fetchAllBooks,
        refreshAllBooks,
        clearAllBooksCache,

        // General cache management
        clearCache
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
