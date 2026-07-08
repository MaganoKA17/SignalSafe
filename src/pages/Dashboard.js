import React, { useState } from 'react';
import UploadPanel from '../components/UploadPanel';
import MapView from '../components/MapView';
import NetworkGraph from '../components/NetworkGraph';
import OutreachPanel from '../components/OutreachPanel';

function Dashboard() {
  const [posts, setPosts] = useState([]);

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
        <UploadPanel onPostsLoaded={setPosts} />
      </div>
      <div>
        <MapView />
      </div>
      <div>
        <OutreachPanel posts={posts} />
      </div>
      <div>
        <NetworkGraph posts={posts} />
      </div>
    </div>
  );
}

export default Dashboard;