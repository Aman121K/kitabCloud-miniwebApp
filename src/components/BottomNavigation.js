import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../constants/colors';
import { MdHome, MdSearch, MdPerson } from 'react-icons/md';

const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/home', label: 'Home', icon: <MdHome /> },
        { path: '/search', label: 'Search', icon:  <MdSearch /> },
        { path: '/profile', label: 'Profile', icon:  <MdPerson /> }
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.white,
            borderTop: `1px solid ${colors.lightGrey}`,
            padding: '10px 0',
            zIndex: 1000,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '8px 16px',
                            borderRadius: 8,
                            transition: 'background-color 0.2s ease',
                            backgroundColor: location.pathname === item.path ? colors.lightestGrey : 'transparent',
                            minHeight: '44px',
                            minWidth: '44px',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            if (location.pathname !== item.path) {
                                e.target.style.backgroundColor = colors.lightestGrey;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (location.pathname !== item.path) {
                                e.target.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        <span style={{ fontSize: 24, marginBottom: 4 }}>
                            {item.icon}
                        </span>
                        <span style={{
                            fontSize: 12,
                            color: location.pathname === item.path ? colors.appPrimary : colors.grey,
                            fontWeight: location.pathname === item.path ? '600' : '400'
                        }}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomNavigation; 