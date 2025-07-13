# KitabCloud Mini App

A web-based mini app version of the KitabCloud React Native application, designed for M-Pesa integration.

## Features

- **Authentication**: Login with existing API
- **Home Screen**: Browse books with filter tabs
- **Search**: Search for books, authors, and content
- **Book Details**: View detailed book information
- **Audio Playback**: Play audiobooks directly in the browser
- **Profile Management**: User profile and settings
- **Responsive Design**: Mobile-optimized for M-Pesa mini app

## Tech Stack

- React 18
- React Router DOM
- Axios for API calls
- CSS3 with custom styling
- Context API for state management

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## API Integration

The app uses the same API endpoints as your React Native app:
- Base URL: `https://admin.kitabcloud.se/api/`
- Authentication: Bearer token
- All existing API functions are preserved

## M-Pesa Integration

This mini app is designed to be deployed and integrated with M-Pesa's mini app platform. The app includes:

- Mobile-responsive design
- Touch-friendly interface
- Optimized for small screens
- Fast loading times

## File Structure
