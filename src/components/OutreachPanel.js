import React, { useState, useEffect } from 'react';
import { generateOutreach } from '../utils/groqApi';

function OutreachPanel({ posts }) {
  const [outreach, setOutreach] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (posts.length === 0) return;
    const fetchOutreach = async () => {
      setLoading(true);
      try {
        const result = await generateOutreach(posts);
        setOutreach(result);
      } catch (error) {
        console.error('Error generating outreach:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOutreach();
  }, [posts]);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>
        📋 Outreach Recommendations
      </h2>
      <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '16px' }}>
        AI generated recommendations for NGO outreach workers.
      </p>

      {loading && (
        <p style={{ color: '#e94560', fontSize: '0.9rem' }}>
          🤖 Generating outreach recommendations...
        </p>
      )}

      {!loading && !outreach && (
        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
          Upload and analyze posts to generate recommendations.
        </p>
      )}

      {outreach && (
        <div>
          <div style={{
            backgroundColor: outreach.urgencyLevel === 'High' ? '#ffeef0' :
                             outreach.urgencyLevel === 'Medium' ? '#fff8ee' : '#eefff4',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px'
          }}>
            <span style={{
              fontWeight: 'bold',
              color: outreach.urgencyLevel === 'High' ? '#e94560' :
                     outreach.urgencyLevel === 'Medium' ? '#f5a623' : '#27ae60'
            }}>
              {outreach.urgencyLevel === 'High' ? '🚨' :
               outreach.urgencyLevel === 'Medium' ? '⚠️' : '✅'} {outreach.urgencyLevel} Urgency
            </span>
            <p style={{ margin: '8px 0 0', color: '#333', fontSize: '0.9rem' }}>
              {outreach.summary}
            </p>
          </div>

          <h3 style={{ color: '#1a1a2e', fontSize: '1rem', marginBottom: '8px' }}>
            ⚡ Immediate Actions
          </h3>
          <ul style={{ paddingLeft: '16px', marginBottom: '16px' }}>
            {outreach.immediateActions.map((action, i) => (
              <li key={i} style={{
                fontSize: '0.85rem',
                color: '#333',
                marginBottom: '6px'
              }}>
                {action}
              </li>
            ))}
          </ul>

          <h3 style={{ color: '#1a1a2e', fontSize: '1rem', marginBottom: '8px' }}>
            📌 Recommendations
          </h3>
          <ul style={{ paddingLeft: '16px', marginBottom: '16px' }}>
            {outreach.recommendations.map((rec, i) => (
              <li key={i} style={{
                fontSize: '0.85rem',
                color: '#333',
                marginBottom: '6px'
              }}>
                {rec}
              </li>
            ))}
          </ul>

          <h3 style={{ color: '#1a1a2e', fontSize: '1rem', marginBottom: '8px' }}>
            👥 Priority Target Groups
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {outreach.targetGroups.map((group, i) => (
              <span key={i} style={{
                backgroundColor: '#f0f0f0',
                color: '#555',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem'
              }}>
                {group}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OutreachPanel;