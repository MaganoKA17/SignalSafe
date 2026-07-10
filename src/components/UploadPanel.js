import React, { useState, useRef } from 'react';

function UploadPanel({ onImagesLoaded }) {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFiles = async (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setLoading(true);
    const newPreviews = imageFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
    onImagesLoaded(imageFiles);
    setLoading(false);
  };

  const handleInputChange = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removePreview = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span>📸</span>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700' }}>
          Upload Screenshots
        </h2>
      </div>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.82rem',
        lineHeight: '1.6',
        marginBottom: '16px'
      }}>
        Upload screenshots of suspicious job posts, WhatsApp messages, or event offers.
      </p>

      <div
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '10px',
          padding: '28px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver ? 'var(--high-bg)' : 'var(--bg-primary)',
          transition: 'all 0.2s ease',
          marginBottom: '16px'
        }}
      >
        <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📁</div>
        <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>
          {loading ? 'Processing...' : 'Drop images here or click to browse'}
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          JPG, PNG, WEBP — multiple files supported
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {previews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {previews.map((preview, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '8px',
              padding: '8px 12px',
              border: '1px solid var(--border)'
            }}>
              <img
                src={preview.url}
                alt={preview.name}
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  flexShrink: 0
                }}
              />
              <span style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {preview.name}
              </span>
              <button
                onClick={() => removePreview(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '0 4px',
                  flexShrink: 0
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadPanel;