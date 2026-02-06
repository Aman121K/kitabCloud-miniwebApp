import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import FilterBar from '../../../components/HomescreenComponents/FilterBar';
import AllTabComponent from '../../../components/HomeTabComponents/AllTabComponent';
import AudioBooksTabComponent from '../../../components/HomeTabComponents/AudioBooksTabComponent';
import EbooksTabComponent from '../../../components/HomeTabComponents/EbooksTabComponent';
import MagazinesTabComponent from '../../../components/HomeTabComponents/MagazinesTabComponent';
import PodcastsTabComponent from '../../../components/HomeTabComponents/PodcastsTabComponent';
import VideosTabComponent from '../../../components/HomeTabComponents/VideosTabComponent';
import BottomNavigation from '../../../components/BottomNavigation';
import FeedbackFAB from '../../../components/FeedbackFAB';

const FilterData = ['All', 'Audiobooks', 'Ebooks', 'Videos', 'Magazines', 'Podcasts'];

const HomeScreen = () => {
  const { token } = useAuth();
  const { homeData, fetchHomeData } = useData();
  const [userData, setUserData] = useState(null);
  const [selectedFilterTab, setSelectedFilterTab] = useState(FilterData[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both user data and home data (home data will use cache)
      const [userRes, homeRes] = await Promise.all([
        apiFunctions.getUserData(token),
        fetchHomeData(token)
      ]);
      
      setUserData(userRes);
      console.log('Home data received:', homeRes);
      console.log('Category with books:', homeRes?.categoryWithBooks?.length || 0);
      console.log('Authors:', homeRes?.author?.length || 0);
      console.log('Readers:', homeRes?.reader?.length || 0);
      console.log('Ads:', homeRes?.ads?.length || 0);
      console.log('Free books:', homeRes?.free_books?.length || 0);
      console.log('Coming soon:', homeRes?.coming_soon?.length || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = useCallback(() => {
    const time = new Date().getHours();
    if (!userData || !userData.full_name) return '';
    if (time < 12) return `Good morning ${userData.full_name}!`;
    if (time < 18) return `Good afternoon ${userData.full_name}!`;
    return `Good evening ${userData.full_name}!`;
  }, [userData]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#fff',
      paddingBottom: '80px' // Account for bottom navigation
    }}>
      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <div style={{ width: 40, height: 40, border: '3px solid #f3f3f3', borderTop: '3px solid #e7440d', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <>
            {userData && userData.full_name && (
              <div style={{ 
                padding: '20px 15px 10px 15px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '24px',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  {getGreeting()}
                </h2>
              </div>
            )}
            <FilterBar filterData={FilterData} selectedFilterTab={selectedFilterTab} setSelectedFilterTab={setSelectedFilterTab} />
            <div style={{ 
              flex: 1, 
              paddingTop: 15,
              paddingBottom: 20,
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}>
              {selectedFilterTab === 'All' && <AllTabComponent homeData={homeData} />}
              {selectedFilterTab === 'Audiobooks' && <AudioBooksTabComponent homeData={homeData} />}
              {selectedFilterTab === 'Ebooks' && <EbooksTabComponent homeData={homeData} />}
              {selectedFilterTab === 'Magazines' && <MagazinesTabComponent homeData={homeData} />}
              {selectedFilterTab === 'Podcasts' && <PodcastsTabComponent homeData={homeData} />}
              {selectedFilterTab === 'Videos' && <VideosTabComponent homeData={homeData} />}
            </div>
          </>
        )}
      </div>
      <BottomNavigation />
      <FeedbackFAB />
    </div>
  );
};

export default HomeScreen;
