import React, { useState, useEffect } from 'react';
import { colors } from '../../constants/colors';
import { commonStyles } from '../../constants/commonStyles';

const InAppViewer = ({ fileUrl, fileName, fileType, onClose }) => {
    console.log('fileUrl', fileUrl); // this conatin the real url of the file
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (fileUrl) {
            // For PDFs, we'll use an iframe with PDF.js or direct PDF viewing
            // For other file types, we'll show a download option
            setPdfUrl(fileUrl);
            setLoading(false);
        }
    }, [fileUrl]);

    const handleDownload = () => {
        try {
            // Create a temporary link to download the file
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName || 'document';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            setError('Download failed. Please try again.');
        }
    };

    const isPdf = fileType?.toLowerCase() === 'pdf' || 
                  fileName?.toLowerCase().endsWith('.pdf') ||
                  fileUrl?.toLowerCase().includes('.pdf');

    const isImage = fileType?.toLowerCase().includes('image') ||
                   fileName?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);

    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: `3px solid ${colors.lightGrey}`,
                    borderTop: `3px solid ${colors.appPrimary}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                padding: 20
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                    <h3 style={{ ...commonStyles.textLightBold(18), marginBottom: 8 }}>Unable to Load Document</h3>
                    <p style={{ ...commonStyles.textLightNormal(14), color: colors.grey, marginBottom: 20 }}>
                        {error}
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button
                            onClick={handleDownload}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: colors.appPrimary,
                                color: colors.white,
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontSize: 14
                            }}
                        >
                            Download Instead
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: colors.lightGrey,
                                color: colors.grey,
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontSize: 14
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: colors.white,
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: `1px solid ${colors.lightGrey}`,
                background: colors.white
            }}>
                <h3 style={{
                    ...commonStyles.textLightBold(16),
                    margin: 0,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {fileName || 'Document Viewer'}
                </h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                        onClick={handleDownload}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: colors.appPrimary,
                            color: colors.white,
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: 12
                        }}
                    >
                        Download
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 24,
                            cursor: 'pointer',
                            padding: 4
                        }}
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {isPdf ? (
                    <iframe
                        src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                        title={fileName || 'PDF Document'}
                        onError={() => setError('Failed to load PDF. The file may be corrupted or not accessible.')}
                    />
                ) : isImage ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        padding: 20
                    }}>
                        <img
                            src={pdfUrl}
                            alt={fileName || 'Image'}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain'
                            }}
                            onError={() => setError('Failed to load image. The file may be corrupted or not accessible.')}
                        />
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        padding: 20,
                        textAlign: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                            <h3 style={{ ...commonStyles.textLightBold(18), marginBottom: 8 }}>
                                Document Preview Not Available
                            </h3>
                            <p style={{ ...commonStyles.textLightNormal(14), color: colors.grey, marginBottom: 20 }}>
                                This file type cannot be previewed in the app. You can download it to view on your device.
                            </p>
                            <button
                                onClick={handleDownload}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: colors.appPrimary,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    fontSize: 14
                                }}
                            >
                                Download Document
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InAppViewer;
