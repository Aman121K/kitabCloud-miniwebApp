import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Auto redirect to home after 3 seconds
        const timer = setTimeout(() => {
            navigate('/home');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <div className="welcome-icon">
                    <span role="img" aria-label="welcome">🎉</span>
                </div>
                <h1 className="welcome-title">Welcome to KitabCloud!</h1>
                <p className="welcome-message">
                    Your personalized reading experience is ready. 
                    We've set up your preferences and you're all set to explore amazing content.
                </p>
                <div className="loading-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
                <p className="redirect-message">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
};

export default WelcomePage;
