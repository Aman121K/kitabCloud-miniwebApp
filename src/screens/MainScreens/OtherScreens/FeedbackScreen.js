import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import CommonButton from '../../../components/CommonButton';
import { colors } from '../../../constants/colors';
import { commonStyles } from '../../../constants/commonStyles';
import axios from 'axios';

const FeedbackScreen = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert('Please enter your feedback before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post('http://localhost:3002/api/admin/feedback', {
        feedback: feedback.trim(),
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // const response = await apiFunctions.submitFeedback(token, {
      //   feedback: feedback.trim(),
      //   timestamp: new Date().toISOString()
      // });
      console.log('Response is', response)
      if (response && response.success) {

        setSubmitStatus('success');
        setFeedback('');
        // Auto navigate back after 2 seconds
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.white,
      paddingBottom: '80px' // Account for bottom navigation
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 20px 10px 20px',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              marginRight: '15px',
              padding: '5px'
            }}
          >
            ←
          </button>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '600',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            Feedback & Suggestions
          </h1>
        </div>
        <p style={{
          margin: 0,
          fontSize: '16px',
          opacity: 0.9,
          lineHeight: '1.4'
        }}>
          Help us improve by sharing your thoughts and suggestions
        </p>
      </div>

      {/* Content */}
      <div style={{
        padding: '20px',
        flex: 1
      }}>
        {/* Success Message */}
        {submitStatus === 'success' && (
          <div style={{
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            color: '#155724',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '10px', fontSize: '20px' }}>✅</span>
            <div>
              <strong>Thank you!</strong> Your feedback has been submitted successfully.
              Our team will review it and consider it for future improvements.
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '10px', fontSize: '20px' }}>❌</span>
            <div>
              <strong>Error!</strong> There was a problem submitting your feedback.
              Please try again.
            </div>
          </div>
        )}

        {/* Feedback Form */}
        <div style={{
          backgroundColor: colors.white,
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{
            ...commonStyles.textLightBold('18px'),
            marginBottom: '15px',
            color: colors.black
          }}>
            Share Your Feedback
          </h3>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you think! Share your suggestions, report issues, or let us know what features you'd like to see..."
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '15px',
              border: `2px solid ${colors.lightGrey}`,
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.appPrimary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.lightGrey;
            }}
          />

          <div style={{
            marginTop: '10px',
            fontSize: '14px',
            color: colors.grey,
            textAlign: 'right'
          }}>
            {feedback.length} characters
          </div>
        </div>

        {/* Submit Button */}
        <CommonButton
          buttonTitle={isSubmitting ? "Submitting..." : "Submit Feedback"}
          onPress={handleSubmit}
          isLoading={isSubmitting}
          disabled={!feedback.trim() || isSubmitting}
          customStyles={{
            width: '100%',
            marginBottom: '20px'
          }}
        />

        {/* Info Section */}
        <div style={{
          backgroundColor: colors.lightestGrey,
          borderRadius: '8px',
          padding: '15px',
          border: `1px solid ${colors.lighterGrey}`
        }}>
          <h4 style={{
            ...commonStyles.textLightBold('16px'),
            marginBottom: '10px',
            color: colors.black
          }}>
            💡 What kind of feedback are we looking for?
          </h4>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            color: colors.grey,
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <li>Feature requests and suggestions</li>
            <li>Bug reports and issues</li>
            <li>User experience improvements</li>
            <li>Content recommendations</li>
            <li>General feedback about the app</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackScreen;
