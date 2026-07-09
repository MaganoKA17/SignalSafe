import React, { useState } from 'react';
import { parseCSV } from '../utils/parseCSV';

function UploadPanel({ onPostsLoaded }) {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    try {
      const data = await parseCSV(file);
      onPostsLoaded(data);
    } catch (error) {
      console.error('Error parsing CSV:', error);
    } finally {
      setLoading(false);
    }
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
        <span>📂</span>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700' }}>
          Upload Posts
        </h2>
      </div>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.82rem',
        lineHeight: '1.6',
        marginBottom: '20px'
      }}>
        Upload a CSV of job posts or recruitment listings to scan for exploitation signals.
      </p>
      <label style={{
        display: 'inline-block',
        backgroundColor: 'var(--accent)',
        color: 'white',
        padding: '10px 22px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600',
        letterSpacing: '0.02em'
      }}>
        {loading ? '⏳ Processing...' : '+ Upload CSV'}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>
      {fileName && (
        <p style={{
          marginTop: '12px',
          color: 'var(--text-secondary)',
          fontSize: '0.78rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ color: 'var(--low)' }}>✓</span> {fileName}
        </p>
      )}
      <div style={{
        marginTop: '20px',
        padding: '12px 16px',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Required columns</strong><br />
          title · description · contact
        </p>
      </div>
    </div>
  );
}

export default UploadPanel;