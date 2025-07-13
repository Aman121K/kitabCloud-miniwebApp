import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFunctions } from '../../apiService/apiFunctions';
import { colors } from '../../constants/colors';
import BookCard from '../BookCard';

const EbooksTabComponent = () => {
    const { token } = useAuth();
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchEbooks();
        }
    }, [token]);

    const fetchEbooks = async () => {
        try {
            setLoading(true);
            const data = await apiFunctions.getEbooks(token);
            setEbooks(data || []);
        } catch (error) {
            console.error('Error fetching ebooks:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
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
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20,
            padding: '20px 0'
        }}>
            {ebooks.map((book, index) => (
                <BookCard key={book.id || index} book={book} />
            ))}
        </div>
    );
};

export default EbooksTabComponent; 