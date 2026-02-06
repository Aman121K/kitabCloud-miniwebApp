import React, { useState, useEffect } from 'react';
import { colors } from '../../../constants/colors';
import { commonStyles } from '../../../constants/commonStyles';

const PlayerScreen = () => {
    const [currentTime, setCurrentTime] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [duration, setDuration] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [isPlaying, setIsPlaying] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        // This would be connected to your global audio player
        // For now, it's a placeholder
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const newTime = (e.target.value / 100) * duration;
        setCurrentTime(newTime);
        if (audio) {
            audio.currentTime = newTime;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.white,
            borderTop: `1px solid ${colors.lightGrey}`,
            padding: '20px',
            zIndex: 1001
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 15
            }}>
                <div style={{
                    width: 60,
                    height: 60,
                    backgroundColor: colors.appPrimary,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ color: colors.white, fontSize: 24 }}>
                        📚
                    </span>
                </div>
                
                <div style={{ flex: 1 }}>
                    <h4 style={commonStyles.textLightBold(16, { 
                        color: colors.black,
                        marginBottom: 5
                    })}>
                        Book Title
                    </h4>
                    <p style={commonStyles.textLightNormal(14, { 
                        color: colors.grey
                    })}>
                        Author Name
                    </p>
                </div>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                }}>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 24,
                            cursor: 'pointer'
                        }}
                    >
                        ⏮️
                    </button>
                    
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 32,
                            cursor: 'pointer'
                        }}
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 24,
                            cursor: 'pointer'
                        }}
                    >
                        ⏭️
                    </button>
                </div>
            </div>
            
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 10
            }}>
                <span style={{ fontSize: 12, color: colors.grey }}>
                    {formatTime(currentTime)}
                </span>
                
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentTime / duration) * 100 || 0}
                    onChange={handleSeek}
                    style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        background: colors.lightGrey,
                        outline: 'none'
                    }}
                />
                
                <span style={{ fontSize: 12, color: colors.grey }}>
                    {formatTime(duration)}
                </span>
            </div>
        </div>
    );
};

export default PlayerScreen; 