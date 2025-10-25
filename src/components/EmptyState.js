import React from 'react';
import { colors } from '../constants/colors';

const EmptyState = ({ 
    icon, 
    title, 
    message, 
    tags = [], 
    showRetryButton = false, 
    onRetry,
    loading = false,
    loadingMessage = "Loading..."
}) => {
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 60,
                minHeight: '50vh'
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: `3px solid ${colors.lightGrey}`,
                    borderTop: `3px solid ${colors.appPrimary}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: 16
                }}></div>
                <p style={{ color: '#4a4a4a', fontSize: 15 }}>{loadingMessage}</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 60,
            minHeight: '50vh',
            textAlign: 'center'
        }}>
            <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: colors.lightGrey,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24
            }}>
                <span style={{ fontSize: 48 }}>{icon}</span>
            </div>
            <h3 style={{
                fontSize: 20,
                fontWeight: 600,
                color: colors.darkGrey,
                marginBottom: 12
            }}>
                {title}
            </h3>
            <p style={{
                color: '#4a4a4a',
                fontSize: 15,
                marginBottom: 20,
                maxWidth: 300,
                lineHeight: '1.5'
            }}>
                {message}
            </p>
            
            {tags.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginBottom: 20
                }}>
                    {tags.map((tag, index) => (
                        <span key={index} style={{
                            backgroundColor: tag.primary ? colors.appPrimary + '20' : colors.lightGrey,
                            color: tag.primary ? colors.appPrimary : '#4a4a4a',
                            padding: '6px 12px',
                            borderRadius: 16,
                            fontSize: 13,
                            fontWeight: 600
                        }}>
                            {tag.text}
                        </span>
                    ))}
                </div>
            )}
            
            {showRetryButton && onRetry && (
                <button
                    onClick={onRetry}
                    style={{
                        backgroundColor: colors.appPrimary,
                        color: colors.white,
                        border: 'none',
                        borderRadius: 8,
                        padding: '12px 24px',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default EmptyState;
