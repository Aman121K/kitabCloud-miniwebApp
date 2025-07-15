import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiFunctions } from '../../../apiService/apiFunctions';
import FilterBar from '../../../components/HomescreenComponents/FilterBar';
import AllTabComponent from '../../../components/HomeTabComponents/AllTabComponent';
import AudioBooksTabComponent from '../../../components/HomeTabComponents/AudioBooksTabComponent';
import EbooksTabComponent from '../../../components/HomeTabComponents/EbooksTabComponent';
import MagazinesTabComponent from '../../../components/HomeTabComponents/MagazinesTabComponent';
import PodcastsTabComponent from '../../../components/HomeTabComponents/PodcastsTabComponent';
import VideosTabComponent from '../../../components/HomeTabComponents/VideosTabComponent';
import BottomNavigation from '../../../components/BottomNavigation';

const FilterData = ['All', 'Audiobooks', 'Ebooks', 'Videos', 'Magazines', 'Podcasts'];

const HomeScreen = () => {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [selectedFilterTab, setSelectedFilterTab] = useState(FilterData[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getUserData();
    }
    // eslint-disable-next-line
  }, [token]);

  const getUserData = async () => {
    setLoading(true);
    try {
      const res = await apiFunctions.getUserData(token);
      setUserData(res);
    } catch (error) {
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <div style={{ width: 40, height: 40, border: '3px solid #f3f3f3', borderTop: '3px solid #e7440d', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <>
            {userData && userData.full_name && (
              <div style={{ padding: '30px 15px 0 15px' }}>
                <h2 style={{ margin: 0 }}>{getGreeting()}</h2>
              </div>
            )}
            <FilterBar filterData={FilterData} selectedFilterTab={selectedFilterTab} setSelectedFilterTab={setSelectedFilterTab} />
            <div style={{ flex: 1, paddingTop: 15 }}>
              {selectedFilterTab === 'All' && <AllTabComponent />}
              {selectedFilterTab === 'Audiobooks' && <AudioBooksTabComponent />}
              {selectedFilterTab === 'Ebooks' && <EbooksTabComponent />}
              {selectedFilterTab === 'Magazines' && <MagazinesTabComponent />}
              {selectedFilterTab === 'Podcasts' && <PodcastsTabComponent />}
              {selectedFilterTab === 'Videos' && <VideosTabComponent />}
            </div>
          </>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default HomeScreen;
