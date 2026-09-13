import React, { useState } from 'react';
import ImagePreview from '../components/ImagePreview';
import Button from '../components/Button';
import {
  UploadCloud,
  ImageIcon,
  Copy,
  ExternalLink,
  CheckCircle,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ImageUploadSandbox({ showToast }) {
  const { API_BASE_URL } = useAuth();
  const [gallery, setGallery] = useState([
    {
      id: 1,
      filename: 'sample-project-arch.png',
      originalName: 'System Architecture Diagram',
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      size: 245000,
      createdAt: 'Just now'
    },
    {
      id: 2,
      filename: 'sample-ui-design.png',
      originalName: 'Task Manager Dashboard Mockup',
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      size: 189000,
      createdAt: '5 mins ago'
    }
  ]);

  const [activeUpload, setActiveUpload] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const baseApiUrl = API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleUploadSuccess = (uploadedData) => {
    setActiveUpload(uploadedData);

    const fullUrl = uploadedData.fullUrl || `${baseApiUrl}${uploadedData.url}`;
    const newGalleryItem = {
      id: Date.now(),
      filename: uploadedData.filename,
      originalName: uploadedData.originalName,
      url: fullUrl,
      size: uploadedData.size,
      createdAt: 'Just now'
    };

    setGallery((prev) => [newGalleryItem, ...prev]);
    showToast('🎉 Image uploaded to Multer backend & added to gallery!');
  };

  const handleCopyLink = (url) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('🔗 Image URL copied to clipboard!');
    }
  };

  return (
    <div className="upload-sandbox-page">
      <div className="container">
        {/* Banner */}
        <section className="page-header-banner glass-card">
          <div className="banner-content">
            <div className="badge-pill">
              <Sparkles size={14} /> Assignment Feature 2
            </div>
            <h1 className="page-title">Multer Image Upload Showcase</h1>
            <p className="page-subtitle">
              Upload images via Express Multer middleware, generate real-time client preview, inspect uploaded metadata, and view media in the gallery.
            </p>
          </div>
        </section>

        {/* 2-Column Sandbox Layout */}
        <div className="sandbox-grid">
          {/* Column 1: Interactive Uploader */}
          <div className="sandbox-col">
            <div className="card-header-bar">
              <UploadCloud size={20} />
              <h2>Interactive Image Uploader</h2>
            </div>
            <ImagePreview API_BASE_URL={baseApiUrl} onUploadSuccess={handleUploadSuccess} />

            {/* Upload Result Metadata Inspector */}
            {activeUpload && (
              <div className="metadata-inspector-card glass-card">
                <div className="inspector-header">
                  <CheckCircle size={18} className="text-success" />
                  <h3>Multer Backend Response</h3>
                </div>

                <div className="metadata-table">
                  <div className="meta-row">
                    <span className="meta-key">Filename:</span>
                    <span className="meta-value">{activeUpload.filename}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">Original Name:</span>
                    <span className="meta-value">{activeUpload.originalName}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">File Size:</span>
                    <span className="meta-value">{(activeUpload.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">MIME Type:</span>
                    <span className="meta-value">{activeUpload.mimeType}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">Served Path:</span>
                    <code className="meta-code">{activeUpload.url}</code>
                  </div>
                </div>

                <div className="inspector-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Copy}
                    onClick={() => handleCopyLink(activeUpload.fullUrl || `${baseApiUrl}${activeUpload.url}`)}
                  >
                    Copy Full URL
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Uploaded Media Gallery */}
          <div className="sandbox-col">
            <div className="card-header-bar">
              <Layers size={20} />
              <h2>Uploaded Images Gallery</h2>
            </div>

            <div className="gallery-grid">
              {gallery.map((item) => (
                <div key={item.id} className="gallery-card glass-card">
                  <div className="gallery-img-wrapper" onClick={() => setLightboxImage(item.url)}>
                    <img src={item.url} alt={item.originalName} className="gallery-img" />
                    <div className="gallery-hover-overlay">
                      <ImageIcon size={20} />
                      <span>View Full Image</span>
                    </div>
                  </div>

                  <div className="gallery-card-body">
                    <h4 className="gallery-card-title">{item.originalName || item.filename}</h4>
                    <span className="gallery-card-meta">
                      {(item.size / 1024).toFixed(1)} KB • {item.createdAt}
                    </span>

                    <div className="gallery-card-actions">
                      <button
                        className="icon-action-btn"
                        onClick={() => handleCopyLink(item.url)}
                        title="Copy image link"
                      >
                        <Copy size={16} />
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-action-btn"
                        title="Open in new tab"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="modal-backdrop" onClick={() => setLightboxImage(null)}>
          <div className="modal-content glass-card image-lightbox" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setLightboxImage(null)}>
              <X size={20} />
            </button>
            <img src={lightboxImage} alt="Uploaded gallery item" className="lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploadSandbox;
