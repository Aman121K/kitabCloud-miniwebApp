import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../constants/colors';

const FeedbackFAB = () => {
  const navigate = useNavigate();

  const handleFeedbackClick = () => {
    navigate('/feedback');
  };

  return (
    <button
      onClick={handleFeedbackClick}
      style={{
        position: 'fixed',
        bottom: '100px', // Above bottom navigation
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: colors.appPrimary,
        border: 'none',
        boxShadow: '0 4px 12px rgba(231, 68, 13, 0.3)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        ':hover': {
          transform: 'scale(1.1)',
          boxShadow: '0 6px 16px rgba(231, 68, 13, 0.4)'
        }
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = '0 6px 16px rgba(231, 68, 13, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 4px 12px rgba(231, 68, 13, 0.3)';
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"
          fill="white"
        />
        <path
          d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z"
          fill="white"
        />
      </svg>
    </button>
  );
};

export default FeedbackFAB;
