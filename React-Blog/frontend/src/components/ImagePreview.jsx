import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from './Button';

export function ImagePreview({ onUploadSuccess, API_BASE_URL }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedResult, setUploadedResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const baseApiUrl = API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, GIF, WEBP, SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setUploadedResult(null);

    // Generate local client preview URL
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${baseApiUrl}/api/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setUploadedResult(data.data);
      if (onUploadSuccess) {
        onUploadSuccess(data.data);
      }
    } catch (err) {
      setError(err.message || 'Image upload error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="image-preview-container glass-card">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*"
        className="hidden-file-input"
        id="multer-image-input"
      />

      {!previewUrl ? (
        <div
          className={`dropzone-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-icon">
            <UploadCloud size={40} />
          </div>
          <h4>Choose an image or drag & drop here</h4>
          <p>Supports PNG, JPG, JPEG, WEBP, GIF (Max 5MB)</p>
          <Button variant="outline" size="sm" type="button">
            Browse Image
          </Button>
        </div>
      ) : (
        <div className="preview-active-box">
          <div className="preview-image-wrapper">
            <img src={previewUrl} alt="Client preview" className="preview-img" />
            <button className="remove-preview-btn" onClick={handleClear} title="Remove image">
              <X size={16} />
            </button>
          </div>

          <div className="file-info-details">
            <div className="file-name-row">
              <ImageIcon size={16} />
              <span className="file-name">{selectedFile.name}</span>
            </div>
            <span className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</span>
          </div>

          {!uploadedResult ? (
            <div className="preview-actions-row">
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={isUploading}
                icon={isUploading ? Loader2 : UploadCloud}
              >
                {isUploading ? 'Uploading to Server...' : 'Upload Image (Multer)'}
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={isUploading}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="upload-success-banner">
              <div className="success-header">
                <CheckCircle size={18} className="text-success" />
                <span>Uploaded via Multer successfully!</span>
              </div>
              <code className="file-url-code">{uploadedResult.url}</code>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default ImagePreview;
