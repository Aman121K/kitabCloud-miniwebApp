import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonButton from '../../components/CommonButton';
import { commonStyles } from '../../constants/commonStyles';
import { apiFunctions } from '../../apiService/apiFunctions';
import { useAuth } from '../../context/AuthContext';
import './LanguageSelection.css';

const LanguageSelection = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [isStartingLoading, setIsStartingLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsStartingLoading(true);
            try {
                const response = await apiFunctions.getAllLanguages(token);
                const userSavedLanguages = await apiFunctions.getUsersSavedLanguages(token);
                const updatedLanguages = response.map(lang => {
                    const foundLanguage = userSavedLanguages.find(item => item.id === lang.id);
                    return { ...lang, selected: foundLanguage !== undefined };
                });
                setLanguages(updatedLanguages);
            } catch (error) {
                console.error("Error fetching language data: ", error);
            } finally {
                setIsStartingLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleCheckboxChange = (id) => {
        const updatedLanguages = languages.map(lang =>
            lang.id === id ? { ...lang, selected: !lang.selected } : lang
        );
        setLanguages(updatedLanguages);
    };

    const onUpdatePress = async () => {
        setIsLoading(true);
        const selectedLanguages = languages.filter(language => language.selected).map(language => language.id.toString());
        const body = {
            languages: selectedLanguages
        };
        try {
            const response = await apiFunctions.AddUserlangauge(body, token);
            if (response) {
                navigate('/category-selection');
            }
        } catch (error) {
            console.error("Error updating user language: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="language-selection-container">
            <div className="header-section">
                <button
                    onClick={() => navigate(-1)}
                    className="back-button"
                >
                    ← Back
                </button>
            </div>

            <h1 className="title">Select your language</h1>
            <p className="subtitle">
                Find tales in your preferred languages, tailored for each device. You can change this easily at any time in the settings.
            </p>

            {isStartingLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="languages-list">
                    {languages.map(language => (
                        <div key={language.id} className="language-row">
                            <span className="language-text">{language.name}</span>
                            <input
                                type="checkbox"
                                checked={language.selected}
                                onChange={() => handleCheckboxChange(language.id)}
                                className="language-checkbox"
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="button-container">
                <CommonButton
                    isLoading={isLoading}
                    buttonTitle='Save'
                    onPress={onUpdatePress}
                    customStyles={{ width: '90%', paddingVertical: 8, marginTop: 10 }}
                    customTextStyles={commonStyles.textWhiteBold(20)}
                />
            </div>
        </div>
    );
};

export default LanguageSelection;
