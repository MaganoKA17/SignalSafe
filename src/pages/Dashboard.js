import React, { useState } from 'react';
import UploadPanel from '../components/UploadPanel';
import MapView from '../components/MapView';
import NetworkGraph from '../components/NetworkGraph';
import OutreachPanel from '../components/OutreachPanel';
import { analyzePost } from '../utils/groqApi';

function Dashboard() {
  const [analyzedPosts, setAnalyzedPosts] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  const handlePostsLoaded = async (data) => {
    setAnalyzing(true);
    try {
      const results = await Promise.all(
        data.map(async (post) => {
          const postText = `${post.title} ${post.description}`;
          const analysis = await analyzePost(postText);
          return { ...post, analysis };
        })
      );
      setAnalyzedPosts(results);
    } catch (error) {
      console.error('Error analyzing posts:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const highRiskCount = analyzedPosts.filter(p => p.analysis?.riskLevel === 'High').length;

  const riskColor = (level) =>
    level === 'High' ? 'var(--high)' :
    level === 'Medium' ? 'var(--medium)' : 'var(--low)';

  const riskBg = (level) =>
    level === 'High' ? 'var(--high-bg)' :
    level === 'Medium' ? 'var(--medium-bg)' : 'var(--low-bg)';

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 64px)' }}>

      {highRiskCount > 0 && (
        <div style={{
          backgroundColor: 'var(--accent)',
          color: 'white',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.85rem',
          fontWeight: '700',
          letterSpacing: '0.04em',
          animation: 'threatPulse 2s ease-in-out infinite'
        }}>
          🚨 HIGH RISK ACTIVITY DETECTED —{' '}
          {highRiskCount} post{highRiskCount > 1 ? 's' : ''} flagged for immediate review
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: '24px',
        padding: '24px',
        alignItems: 'start'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <UploadPanel onPostsLoaded={handlePostsLoaded} />

          {analyzing && (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px 20px',
              color: 'var(--accent)',
              fontWeight: '600',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🔍 Scanning posts with AI...
            </div>
          )}

          {analyzedPosts.map((post, index) => (
            <div key={index} style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '12px',
              padding: '18px',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--border)',
              borderLeft: `4px solid ${riskColor(post.analysis.riskLevel)}`,
              animation: 'fadeIn 0.3s ease'
            }}>
              <h3 style={{
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {post.title}
              </h3>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: riskColor(post.analysis.riskLevel),
                backgroundColor: riskBg(post.analysis.riskLevel),
                padding: '3px 10px',
                borderRadius: '12px'
              }}>
                {post.analysis.riskLevel} Risk
              </span>
              <ul style={{ marginTop: '12px', paddingLeft: '16px' }}>
                {post.analysis.reasons.map((reason, i) => (
                  <li key={i} style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '4px',
                    lineHeight: '1.5'
                  }}>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <MapView />
          <NetworkGraph posts={analyzedPosts} />
          <OutreachPanel posts={analyzedPosts} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;