import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { commonStyles } from '../../constants/commonStyles';
import { colors } from '../../constants/colors';
import { apiFunctions } from '../../apiService/apiFunctions';

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

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const navigate = useNavigate();

    const onResetPassword = async () => {
        if (!email.trim()) {
            setErrorMessage('Please enter your email address');
            setShowError(true);
            return;
        }

        try {
            setIsLoading(true);
            const response = await apiFunctions.forgotPassword({ email });
            setIsLoading(false);
            
            setSuccessMessage('Password reset instructions have been sent to your email');
            setShowSuccess(true);
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setIsLoading(false);
            setErrorMessage('Something went wrong. Please try again.');
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
                    <div style={{
                        width: 200,
                        height: 150,
                        backgroundColor: colors.appPrimary,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20
                    }}>
                        <span style={{
                            color: colors.white,
                            fontSize: 24,
                            fontWeight: 'bold'
                        }}>
                            KitabCloud
                        </span>
                    </div>
                    
                    <h1 style={commonStyles.textLightBold(32, { 
                        color: colors.black, 
                        marginBottom: 10, 
                        textAlign: 'center' 
                    })}>
                        Forgot Password
                    </h1>
                    
                    <p style={commonStyles.textLightNormal(18, { 
                        color: colors.grey, 
                        marginBottom: 30, 
                        textAlign: 'center',
                        maxWidth: 400
                    })}>
                        Enter your email address to reset your password
                    </p>

                    <div style={{ width: '100%', maxWidth: 400 }}>
                        <PrimaryTextInput 
                            placeholder='Email' 
                            value={email} 
                            onChangeText={setEmail}
                        />
                        
                        <CommonButton 
                            isLoading={isLoading} 
                            buttonTitle='Reset Password' 
                            onPress={onResetPassword} 
                            customStyles={{ 
                                width: '100%', 
                                marginBottom: 20 
                            }} 
                        />
                        
                        <button
                            onClick={onBackToLogin}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: colors.appPrimary,
                                fontSize: 16,
                                cursor: 'pointer',
                                width: '100%',
                                textAlign: 'center'
                            }}
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
            
            <ErrorToast 
                message={errorMessage} 
                isVisible={showError} 
                onClose={() => setShowError(false)} 
            />
            
            {showSuccess && (
                <div style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    backgroundColor: colors.green,
                    color: colors.white,
                    padding: '15px 20px',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    maxWidth: 300,
                    animation: 'slideIn 0.3s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{successMessage}</span>
                        <button
                            onClick={() => setShowSuccess(false)}
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
            )}
        </div>
    );
};

export default ForgotPassword;

