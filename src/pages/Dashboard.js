import React, { useState } from 'react';
import UploadPanel from '../components/UploadPanel';
import MapView from '../components/MapView';
import NetworkGraph from '../components/NetworkGraph';
import OutreachPanel from '../components/OutreachPanel';
import { analyzePost } from '../utils/groqApi';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [analyzedPosts, setAnalyzedPosts] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const handlePostsLoaded = async (data) => {
    console.log("Posts loaded:", data);
    setPosts(data);
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

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gridTemplateRows: 'auto auto',
      gap: '24px',
      padding: '24px',
      backgroundColor: '#f5f5f5',
      minHeight: '90vh'
    }}>
      <div>
        <UploadPanel onPostsLoaded={handlePostsLoaded} />
        {analyzing && (
          <p style={{ marginTop: '16px', color: '#e94560', fontWeight: 'bold' }}>
            🔍 Analyzing posts...
          </p>
        )}
        {analyzedPosts.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            {analyzedPosts.map((post, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${
                  post.analysis.riskLevel === 'High' ? '#e94560' :
                  post.analysis.riskLevel === 'Medium' ? '#f5a623' : '#27ae60'
                }`
              }}>
                <h3 style={{ color: '#1a1a2e', marginBottom: '4px' }}>{post.title}</h3>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: post.analysis.riskLevel === 'High' ? '#e94560' :
                         post.analysis.riskLevel === 'Medium' ? '#f5a623' : '#27ae60'
                }}>
                  {post.analysis.riskLevel} Risk
                </span>
                <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
                  {post.analysis.reasons.map((reason, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: '#555' }}>{reason}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <MapView />
      </div>
      <div>
        <OutreachPanel posts={analyzedPosts} />
      </div>
      <div>
        <NetworkGraph posts={analyzedPosts} />
      </div>
    </div>
  );
}

export default Dashboard;