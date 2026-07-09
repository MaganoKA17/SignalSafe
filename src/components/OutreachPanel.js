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

  const urgencyColor = outreach?.urgencyLevel === 'High' ? 'var(--high)' :
                       outreach?.urgencyLevel === 'Medium' ? 'var(--medium)' : 'var(--low)';
  const urgencyBg = outreach?.urgencyLevel === 'High' ? 'var(--high-bg)' :
                    outreach?.urgencyLevel === 'Medium' ? 'var(--medium-bg)' : 'var(--low-bg)';
  const urgencyIcon = outreach?.urgencyLevel === 'High' ? '🚨' :
                      outreach?.urgencyLevel === 'Medium' ? '⚠️' : '✅';

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span>📋</span>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700' }}>
          Outreach Recommendations
        </h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '16px', lineHeight: '1.6' }}>
        AI-generated guidance for NGO outreach workers based on analyzed posts.
      </p>

      {loading && (
        <p style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '500' }}>
          🤖 Generating outreach recommendations...
        </p>
      )}

      {!loading && !outreach && (
        <div style={{
          padding: '24px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          fontSize: '0.82rem',
          textAlign: 'center'
        }}>
          Upload and analyze posts to generate NGO recommendations.
        </div>
      )}

      {outreach && (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          <div style={{
            backgroundColor: urgencyBg,
            borderRadius: '8px',
            padding: '14px 18px',
            marginBottom: '20px',
            border: `1px solid ${urgencyColor}`
          }}>
            <span style={{ fontWeight: '700', color: urgencyColor, fontSize: '0.85rem' }}>
              {urgencyIcon} {outreach.urgencyLevel} Urgency
            </span>
            <p style={{ margin: '8px 0 0', color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
              {outreach.summary}
            </p>
          </div>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px' }}>
            ⚡ Immediate Actions
          </h3>
          <ul style={{ paddingLeft: '16px', marginBottom: '20px' }}>
            {outreach.immediateActions.map((action, i) => (
              <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', lineHeight: '1.5' }}>
                {action}
              </li>
            ))}
          </ul>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px' }}>
            📌 Recommendations
          </h3>
          <ul style={{ paddingLeft: '16px', marginBottom: '20px' }}>
            {outreach.recommendations.map((rec, i) => (
              <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', lineHeight: '1.5' }}>
                {rec}
              </li>
            ))}
          </ul>

          <h3 style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px' }}>
            👥 Priority Target Groups
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {outreach.targetGroups.map((group, i) => (
              <span key={i} style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-secondary)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '500',
                border: '1px solid var(--border)'
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