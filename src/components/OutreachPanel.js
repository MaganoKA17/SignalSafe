import React from 'react';

function OutreachPanel({ posts }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>
        Outreach Recommendations
      </h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        AI generated outreach recommendations for NGOs will appear here after posts are analyzed.
      </p>
    </div>
  );
}

export default OutreachPanel;