import React, { useState } from 'react';
import { parseCSV } from '../utils/parseCSV';

function UploadPanel({ onPostsLoaded }) {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("File selected:", file.name);
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
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>
        Upload Posts
      </h2>
      <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '16px' }}>
        Upload a CSV file of job posts or recruitment listings to analyze.
      </p>
      <label style={{
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        padding: '10px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem'
      }}>
        {loading ? 'Loading...' : 'Upload CSV'}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>
      {fileName && (
        <p style={{ marginTop: '12px', color: '#555', fontSize: '0.85rem' }}>
          Loaded: {fileName}
        </p>
      )}
    </div>
  );
}

export default UploadPanel;