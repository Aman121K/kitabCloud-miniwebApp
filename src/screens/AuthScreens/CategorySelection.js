import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonButton from '../../components/CommonButton';
import { commonStyles } from '../../constants/commonStyles';
import { apiFunctions } from '../../apiService/apiFunctions';
import { useAuth } from '../../context/AuthContext';
import './CategorySelection.css';

const CategorySelection = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [categoriesData, setCategoriesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        getCategoryData();
    }, []);

    const getCategoryData = async () => {
        try {
            const response = await apiFunctions.getCategories(token);
            console.log("Cat>>", response);
            if (response) {
                const reorderedCategories = [
                    ...response.filter(category => category.category_name === "Book Summaries"),
                    ...response.filter(category => category.category_name !== "Book Summaries")
                ];
                setCategoriesData(reorderedCategories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const toggleCategory = (categoryName, categoryId) => {
        let updatedCategories;
        if (selectedCategories.some(cat => cat.id === categoryId)) {
            updatedCategories = selectedCategories.filter((category) => category.id !== categoryId);
        } else {
            updatedCategories = [...selectedCategories, { id: categoryId, name: categoryName }];
        }
        setSelectedCategories(updatedCategories);
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedCategories([]);
        } else {
            const allCategories = categoriesData.map(cat => ({ id: cat.id, name: cat.category_name }));
            setSelectedCategories(allCategories);
        }
        setSelectAll(!selectAll);
    };

    const onContinuePress = async () => {
        setIsLoading(true);
        const categoryIds = selectedCategories.map(category => category.id.toString());
        const body = {
            categories: categoryIds
        };
        try {
            const response = await apiFunctions.AddUserCategory(body, token);
            if (response) {
                navigate('/welcome');
            } else {
                navigate('/welcome');
            }
        } catch (error) {
            console.error("Error updating user categories:", error);
            navigate('/welcome');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="category-selection-container">
            <h1 className="header">Select 3 or more categories:</h1>
            <p className="sub-header">
                Begin your adventure with personalized suggestions made just for you. And don't worry, you'll still be able to explore a wide selection of books.
            </p>

            <div className="categories-container">
                <button
                    className={`category-item ${selectAll ? 'selected-category' : ''}`}
                    onClick={toggleSelectAll}
                >
                    <span className={`category-name ${selectAll ? 'selected-text-category' : ''}`}>
                        {selectAll ? 'Deselect All' : 'Select All'}
                    </span>
                </button>

                {categoriesData.map((category, index) => (
                    <button
                        key={index}
                        className={`category-item ${selectedCategories.some(cat => cat.id === category.id) ? 'selected-category' : ''}`}
                        onClick={() => toggleCategory(category.category_name, category.id)}
                    >
                        {category.category_image && (
                            <img 
                                src={category.category_image} 
                                alt={category.category_name}
                                className="category-image"
                            />
                        )}
                        <span className={`category-name ${selectedCategories.some(cat => cat.id === category.id) ? 'selected-text-category' : ''}`}>
                            {category.category_name}
                        </span>
                    </button>
                ))}
            </div>

            <div className="button-container">
                <CommonButton 
                    isLoading={isLoading} 
                    buttonTitle='Continue' 
                    onPress={onContinuePress} 
                    customStyles={{ width: '90%', paddingVertical: 8, marginTop: 10 }} 
                    customTextStyles={commonStyles.textWhiteBold(20)} 
                />
            </div>
        </div>
    );
};

export default CategorySelection;
