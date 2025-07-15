import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { commonStyles } from '../../constants/commonStyles';
import { colors } from '../../constants/colors';
import { apiFunctions } from '../../apiService/apiFunctions';
import { useAuth } from '../../context/AuthContext';

// Inline components
const PrimaryTextInput = ({ 
    placeholder, 
    value, 
    onChangeText, 
    secureEntry = false, 
    imageSource,
    style = {},
    ...props 
}) => {
    return (
        <div style={{
            position: 'relative',
            marginBottom: 15,
            ...style
        }}>
            {imageSource && (
                <img 
                    src={imageSource} 
                    alt="icon" 
                    style={{
                        position: 'absolute',
                        left: 15,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 20,
                        height: 20,
                        zIndex: 1
                    }}
                />
            )}
            <input
                type={secureEntry ? 'password' : 'text'}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChangeText(e.target.value)}
                style={{
                    width: '100%',
                    padding: '15px',
                    paddingLeft: imageSource ? '50px' : '15px',
                    border: `1px solid ${colors.lightGrey}`,
                    borderRadius: 8,
                    fontSize: 16,
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: colors.white
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = colors.appPrimary;
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = colors.lightGrey;
                }}
                {...props}
            />
        </div>
    );
};

const CommonButton = ({ 
    buttonTitle, 
    onPress, 
    isLoading = false, 
    customStyles = {}, 
    customTextStyles = {},
    disabled = false
}) => {
    return (
        <button
            onClick={onPress}
            disabled={disabled || isLoading}
            style={{
                backgroundColor: disabled ? colors.grey : colors.appPrimary,
                color: colors.white,
                padding: '12px 24px',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: '600',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 48,
                ...customStyles
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.target.style.backgroundColor = '#d13a0b';
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.target.style.backgroundColor = colors.appPrimary;
                }
            }}
        >
            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                        width: 20,
                        height: 20,
                        border: `2px solid ${colors.white}`,
                        borderTop: `2px solid transparent`,
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: 8
                    }}></div>
                    Loading...
                </div>
            ) : (
                <span style={customTextStyles}>{buttonTitle}</span>
            )}
        </button>
    );
};

const ErrorToast = ({ message, isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 20,
            right: 20,
            backgroundColor: colors.red,
            color: colors.white,
            padding: '15px 20px',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            maxWidth: 300,
            animation: 'slideIn 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{message}</span>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.white,
                        fontSize: 18,
                        cursor: 'pointer',
                        marginLeft: 10
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

const Signup = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        if (!formData.full_name.trim()) {
            setErrorMessage('Please enter your full name');
            setShowError(true);
            return false;
        }
        if (!formData.email.trim()) {
            setErrorMessage('Please enter a valid email address');
            setShowError(true);
            return false;
        }
        if (!formData.password) {
            setErrorMessage('Please enter a password');
            setShowError(true);
            return false;
        }
        if (formData.password !== formData.confirm_password) {
            setErrorMessage('Passwords do not match');
            setShowError(true);
            return false;
        }
        if (formData.password.length < 6) {
            setErrorMessage('Password must be at least 6 characters');
            setShowError(true);
            return false;
        }
        return true;
    };

    const onSignupPress = async () => {
        if (!validateForm()) return;

        try {
            setIsLoading(true);
            const signupData = {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                device_token: 'web',
                device_type: 'web',
                fcm_token: 'web-token'
            };

            const response = await apiFunctions.signUp(signupData);
            setIsLoading(false);

            if (response.data && response.data.success) {
                // Auto login after successful signup
                const loginData = {
                    email: formData.email,
                    password: formData.password,
                    device_token: 'web',
                    device_type: 'web',
                    fcm_token: 'web-token'
                };

                const loginResponse = await apiFunctions.login(loginData);
                if (loginResponse.data && loginResponse.data.success) {
                    const token = loginResponse.data.token;
                    login(loginResponse.data.user, token);
                    navigate('/home');
                }
            } else {
                setErrorMessage(response.data?.message || 'Signup failed');
                setShowError(true);
            }
        } catch (err) {
            setIsLoading(false);
            setErrorMessage('Something went wrong');
            setShowError(true);
        }
    };

    const onBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div style={commonStyles.fullScreenContainer}>
            <div style={commonStyles.fullScreenInnerContainer}>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    minHeight: '100vh',
                    paddingTop: 40
                }}>
                    {/* KitabCloud Logo */}
                    <div style={{
                        width: '100%',
                        maxWidth: 380,
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        padding: '32px 20px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            width: '100%',
                            maxWidth: 400,
                            marginBottom: 20
                        }}>
                            <PrimaryTextInput 
                                placeholder='Full Name' 
                                value={formData.full_name} 
                                onChangeText={(value) => handleInputChange('full_name', value)}
                            />
                        </div>
                        
                        <div style={{
                            width: '100%',
                            maxWidth: 400,
                            marginBottom: 20
                        }}>
                            <PrimaryTextInput 
                                placeholder='Email' 
                                value={formData.email} 
                                onChangeText={(value) => handleInputChange('email', value)}
                            />
                        </div>
                        
                        <div style={{
                            width: '100%',
                            maxWidth: 400,
                            marginBottom: 20
                        }}>
                            <PrimaryTextInput 
                                placeholder='Phone Number (Optional)' 
                                value={formData.phone} 
                                onChangeText={(value) => handleInputChange('phone', value)}
                            />
                        </div>
                        
                        <div style={{
                            width: '100%',
                            maxWidth: 400,
                            marginBottom: 20
                        }}>
                            <PrimaryTextInput 
                                placeholder='Password' 
                                value={formData.password} 
                                onChangeText={(value) => handleInputChange('password', value)}
                                secureEntry={true}
                            />
                        </div>
                        
                        <div style={{
                            width: '100%',
                            maxWidth: 400,
                            marginBottom: 20
                        }}>
                            <PrimaryTextInput 
                                placeholder='Confirm Password' 
                                value={formData.confirm_password} 
                                onChangeText={(value) => handleInputChange('confirm_password', value)}
                                secureEntry={true}
                            />
                        </div>
                        
                        <div style={{
                            width: '100%',
                            maxWidth: 400,
                            marginBottom: 20
                        }}>
                            <CommonButton 
                                isLoading={isLoading} 
                                buttonTitle='Sign Up' 
                                onPress={onSignupPress} 
                                customStyles={{ 
                                    width: '100%', 
                                }} 
                            />
                        </div>
                        
                        <p style={commonStyles.textLightNormal(16, { 
                            color: colors.black, 
                            textAlign: 'center' 
                        })}>
                            Already have an account?
                            <button
                                onClick={onBackToLogin}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: colors.appPrimary,
                                    fontSize: 16,
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginLeft: 5
                                }}
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            
            <ErrorToast 
                message={errorMessage} 
                isVisible={showError} 
                onClose={() => setShowError(false)} 
            />
        </div>
    );
};

export default Signup; 