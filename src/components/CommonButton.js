import React from 'react';

const CommonButton = ({ 
    buttonTitle, 
    onPress, 
    customStyles = {}, 
    customTextStyles = {}, 
    isLoading = false,
    disabled = false 
}) => {
    return (
        <button
            onClick={onPress}
            disabled={disabled || isLoading}
            style={{
                backgroundColor: '#e7440d',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
                opacity: disabled || isLoading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '48px',
                ...customStyles
            }}
        >
            {isLoading ? (
                <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            ) : (
                <span style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Poppins-Bold, sans-serif',
                    ...customTextStyles
                }}>
                    {buttonTitle}
                </span>
            )}
        </button>
    );
};

export default CommonButton; 