import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
    }
    return context;
};

export const AudioPlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isShuffled, setIsShuffled] = useState(false);
    const [isRepeated, setIsRepeated] = useState(false);
    
    const audioRef = useRef(new Audio());
    const audio = audioRef.current;

    useEffect(() => {
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('pause', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('play', () => setIsPlaying(true));
            audio.removeEventListener('pause', () => setIsPlaying(false));
        };
    }, []);

    const handleLoadedMetadata = () => {
        setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
        if (isRepeated) {
            audio.currentTime = 0;
            audio.play();
        } else if (currentIndex < playlist.length - 1) {
            playNext();
        } else {
            setIsPlaying(false);
            setCurrentTime(0);
        }
    };

    const handleError = (error) => {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
    };

    const playTrack = async (track, index = 0) => {
        try {
            if (currentTrack?.id === track.id) {
                if (isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
                return;
            }

            setCurrentTrack(track);
            setCurrentIndex(index);
            audio.src = track.audio_url;
            audio.currentTime = 0;
            await audio.play();
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing track:', error);
        }
    };

    const playPlaylist = async (tracks, startIndex = 0) => {
        setPlaylist(tracks);
        if (tracks.length > 0) {
            await playTrack(tracks[startIndex], startIndex);
        }
    };

    const pause = () => {
        audio.pause();
        setIsPlaying(false);
    };

    const resume = () => {
        audio.play();
        setIsPlaying(true);
    };

    const stop = () => {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const seekTo = (time) => {
        audio.currentTime = time;
        setCurrentTime(time);
    };

    const seekByPercentage = (percentage) => {
        const time = (percentage / 100) * duration;
        seekTo(time);
    };

    const playNext = () => {
        if (currentIndex < playlist.length - 1) {
            const nextIndex = currentIndex + 1;
            playTrack(playlist[nextIndex], nextIndex);
        }
    };

    const playPrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            playTrack(playlist[prevIndex], prevIndex);
        }
    };

    const setVolumeLevel = (newVolume) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        audio.volume = clampedVolume;
        setVolume(clampedVolume);
    };

    const toggleShuffle = () => {
        setIsShuffled(!isShuffled);
    };

    const toggleRepeat = () => {
        setIsRepeated(!isRepeated);
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const value = {
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        playlist,
        currentIndex,
        isShuffled,
        isRepeated,
        playTrack,
        playPlaylist,
        pause,
        resume,
        stop,
        seekTo,
        seekByPercentage,
        playNext,
        playPrevious,
        setVolumeLevel,
        toggleShuffle,
        toggleRepeat,
        formatTime
    };

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    );
}; 