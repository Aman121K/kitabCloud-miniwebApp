import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import Login from './screens/AuthScreens/Login';
import Signup from './screens/AuthScreens/Signup';
import ForgotPassword from './screens/AuthScreens/ForgotPassword';
import HomeScreen from './screens/MainScreens/HomeScreen/HomeScreen';
import BookDetails from './screens/MainScreens/OtherScreens/BookDetails';
import SearchScreen from './screens/MainScreens/SearchScreen/SearchScreen';
import ProfileScreen from './screens/MainScreens/ProfileScreen/ProfileScreen';
import PlayerScreen from './screens/MainScreens/PlayerScreen/PlayerScreen';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();
    
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #e7440d',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }
    
    return token ? children : <Navigate to="/login" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
    const { token } = useAuth();
    return token ? <Navigate to="/home" /> : children;
};

const AppContent = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/signup" element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                } />
                <Route path="/forgot-password" element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                } />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <HomeScreen />
                    </ProtectedRoute>
                } />
                <Route path="/book/:id" element={
                    <ProtectedRoute>
                        <BookDetails />
                    </ProtectedRoute>
                } />
                <Route path="/search" element={
                    <ProtectedRoute>
                        <SearchScreen />
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfileScreen />
                    </ProtectedRoute>
                } />
                <Route path="/player" element={
                    <ProtectedRoute>
                        <PlayerScreen />
                    </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
            <AudioPlayer />
        </Router>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AudioPlayerProvider>
                <AppContent />
            </AudioPlayerProvider>
        </AuthProvider>
    );
};

export default App;
