import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { colors } from '../../constants/colors';
import { commonStyles } from '../../constants/commonStyles';
import './AudioPlayer.css';

const FILE_BASE_URL = 'https://api.kitabcloud.se/storage/';
// Use local logo as fallback to avoid remote loading issues
const KITABCLOUD_LOGO = '/logo192.png'; // Local logo that won't flicker
const KITABCLOUD_LOGO_REMOTE = "https://usercontent.one/wp/kitabcloud.se/wp-content/uploads/2022/04/kitab.jpg";

const AudioPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        currentIndex,
        playlist,
        isShuffled,
        isRepeated,
        playTrack,
        pause,
        resume,
        stop,
        seekByPercentage,
        playNext,
        playPrevious,
        setVolumeLevel,
        toggleShuffle,
        toggleRepeat,
        formatTime
    } = useAudioPlayer();

    const [showVolume, setShowVolume] = useState(false);
    const [showFullPlayer, setShowFullPlayer] = useState(false);

    if (!currentTrack) return null;

    const handlePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            resume();
        }
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = (clickX / rect.width) * 100;
        seekByPercentage(percentage);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolumeLevel(newVolume);
    };

    // Mini FAB with cover image or KitabCloud logo
    if (!showFullPlayer) {
        // Get cover image URL
        const getImageUrl = () => {
            const imagePath = currentTrack.cover_image || currentTrack.image;
            if (!imagePath) return null;
            if (imagePath.startsWith('http')) return imagePath;
            return `${FILE_BASE_URL}${imagePath}`;
        };

        const coverImageUrl = getImageUrl();

        return (
            <div className="audio-player-fab">
                <div className="fab-container" onClick={() => setShowFullPlayer(true)}>
                    <div className="fab-logo">
                        <img 
                            src={coverImageUrl || KITABCLOUD_LOGO} 
                            alt={currentTrack.title || "KitabCloud"}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                // If cover image fails to load, show local KitabCloud logo
                                if (e.target.src !== KITABCLOUD_LOGO) {
                                    e.target.src = KITABCLOUD_LOGO;
                                }
                            }}
                        />
                    </div>
                    <div className="fab-play-button" onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause();
                    }}>
                        {isPlaying ? '⏸️' : '▶️'}
                    </div>
                </div>
            </div>
        );
    }

    // Full Audio Player
    return (
        <div className="audio-player">
            <div className="audio-player-content">
                {/* Header with close button */}
                <div className="player-header">
                    <div className="player-logo">
                        <img 
                            src={KITABCLOUD_LOGO} 
                            alt="KitabCloud"
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.src = '/favicon.ico';
                            }}
                        />
                        <span style={{ marginLeft: '10px', fontWeight: 'bold', color: colors.appPrimary }}>
                            KitabCloud
                        </span>
                    </div>
                    <button 
                        className="close-btn"
                        onClick={() => setShowFullPlayer(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Track Info */}
                <div className="track-info">
                    <div className="track-image">
                        <img 
                            src={(() => {
                                const imagePath = currentTrack.cover_image || currentTrack.image;
                                if (!imagePath) return KITABCLOUD_LOGO;
                                if (imagePath.startsWith('http')) return imagePath;
                                return `${FILE_BASE_URL}${imagePath}`;
                            })()}
                            alt={currentTrack.title}
                            onError={(e) => {
                                // Fallback to local KitabCloud logo if image fails to load
                                if (e.target.src !== KITABCLOUD_LOGO) {
                                    e.target.src = KITABCLOUD_LOGO;
                                }
                            }}
                        />
                    </div>
                    <div className="track-details">
                        <h4 className="track-title">{currentTrack.title}</h4>
                        <p className="track-author">
                            {(() => {
                                // Safely get author string
                                if (typeof currentTrack.author === 'string') {
                                    return currentTrack.author;
                                } else if (currentTrack.author && typeof currentTrack.author === 'object') {
                                    return currentTrack.author.name || 'Unknown Author';
                                } else if (currentTrack.author_name) {
                                    return currentTrack.author_name;
                                }
                                return 'Unknown Author';
                            })()}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar" onClick={handleSeek}>
                        <div 
                            className="progress-fill"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                    </div>
                    <div className="time-display">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="controls">
                    <button 
                        className="control-btn shuffle-btn"
                        onClick={toggleShuffle}
                        style={{ color: isShuffled ? colors.appPrimary : colors.grey }}
                    >
                        🔀
                    </button>
                    
                    <button 
                        className="control-btn"
                        onClick={playPrevious}
                        disabled={playlist.length <= 1}
                    >
                        ⏮️
                    </button>
                    
                    <button 
                        className="control-btn play-btn"
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    
                    <button 
                        className="control-btn"
                        onClick={playNext}
                        disabled={playlist.length <= 1}
                    >
                        ⏭️
                    </button>
                    
                    <button 
                        className="control-btn repeat-btn"
                        onClick={toggleRepeat}
                        style={{ color: isRepeated ? colors.appPrimary : colors.grey }}
                    >
                        🔁
                    </button>
                </div>

                {/* Volume Control */}
                <div className="volume-container">
                    <button 
                        className="volume-btn"
                        onClick={() => setShowVolume(!showVolume)}
                    >
                        🔊
                    </button>
                    {showVolume && (
                        <div className="volume-slider">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="volume-input"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;


