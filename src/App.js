import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import Login from './screens/AuthScreens/Login';
import Signup from './screens/AuthScreens/Signup';
import ForgotPassword from './screens/AuthScreens/ForgotPassword';
import LanguageSelection from './screens/AuthScreens/LanguageSelection';
import CategorySelection from './screens/AuthScreens/CategorySelection';
import WelcomePage from './screens/AuthScreens/WelcomePage';
import HomeScreen from './screens/MainScreens/HomeScreen/HomeScreen';
import SearchScreen from './screens/MainScreens/SearchScreen/SearchScreen';
import ProfileScreen from './screens/MainScreens/ProfileScreen/ProfileScreen';
import BookDetails from './screens/MainScreens/OtherScreens/BookDetails';
import AllBooksPage from './screens/MainScreens/OtherScreens/AllBooksPage';
import AllEbooksPage from './screens/MainScreens/OtherScreens/AllEbooksPage';
import AllAudiobooksPage from './screens/MainScreens/OtherScreens/AllAudiobooksPage';
import AllVideosPage from './screens/MainScreens/OtherScreens/AllVideosPage';
import AllMagazinesPage from './screens/MainScreens/OtherScreens/AllMagazinesPage';
import AllPodcastsPage from './screens/MainScreens/OtherScreens/AllPodcastsPage';
import PlayerScreen from './screens/MainScreens/PlayerScreen/PlayerScreen';
import FeedbackScreen from './screens/MainScreens/OtherScreens/FeedbackScreen';
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
                <Route path="/language-selection" element={
                    <ProtectedRoute>
                        <LanguageSelection />
                    </ProtectedRoute>
                } />
                <Route path="/category-selection" element={
                    <ProtectedRoute>
                        <CategorySelection />
                    </ProtectedRoute>
                } />
                <Route path="/welcome" element={
                    <ProtectedRoute>
                        <WelcomePage />
                    </ProtectedRoute>
                } />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <HomeScreen />
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
                <Route path="/book/:id" element={
                    <ProtectedRoute>
                        <BookDetails />
                    </ProtectedRoute>
                } />
                <Route path="/all-books" element={
                    <ProtectedRoute>
                        <AllBooksPage />
                    </ProtectedRoute>
                } />
                <Route path="/all-ebooks" element={
                    <ProtectedRoute>
                        <AllEbooksPage />
                    </ProtectedRoute>
                } />
                <Route path="/all-audiobooks" element={
                    <ProtectedRoute>
                        <AllAudiobooksPage />
                    </ProtectedRoute>
                } />
                <Route path="/all-videos" element={
                    <ProtectedRoute>
                        <AllVideosPage />
                    </ProtectedRoute>
                } />
                <Route path="/all-magazines" element={
                    <ProtectedRoute>
                        <AllMagazinesPage />
                    </ProtectedRoute>
                } />
                <Route path="/all-podcasts" element={
                    <ProtectedRoute>
                        <AllPodcastsPage />
                    </ProtectedRoute>
                } />
                <Route path="/player" element={
                    <ProtectedRoute>
                        <PlayerScreen />
                    </ProtectedRoute>
                } />
                <Route path="/feedback" element={
                    <ProtectedRoute>
                        <FeedbackScreen />
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
