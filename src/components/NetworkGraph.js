import React, { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

function NetworkGraph({ posts }) {
  const graphRef = useRef();

  const buildGraphData = () => {
    const nodes = [];
    const links = [];
    const seen = {};

    posts.forEach((post, index) => {
      if (!post.analysis) return;

      const { phone, location, recruiterName } = post.analysis.entities;

      const postId = `post-${index}`;
      nodes.push({
        id: postId,
        label: post.title || `Post ${index + 1}`,
        type: 'post',
        risk: post.analysis.riskLevel
      });

      if (phone) {
        if (!seen[phone]) {
          seen[phone] = `phone-${phone}`;
          nodes.push({ id: seen[phone], label: phone, type: 'phone' });
        }
        links.push({ source: postId, target: seen[phone] });
      }

      if (location) {
        if (!seen[location]) {
          seen[location] = `loc-${location}`;
          nodes.push({ id: seen[location], label: location, type: 'location' });
        }
        links.push({ source: postId, target: seen[location] });
      }

      if (recruiterName) {
        if (!seen[recruiterName]) {
          seen[recruiterName] = `rec-${recruiterName}`;
          nodes.push({ id: seen[recruiterName], label: recruiterName, type: 'recruiter' });
        }
        links.push({ source: postId, target: seen[recruiterName] });
      }
    });

    return { nodes, links };
  };

  const getNodeColor = (node) => {
    if (node.type === 'post') {
      return node.risk === 'High' ? '#e94560' :
             node.risk === 'Medium' ? '#f5a623' : '#27ae60';
    }
    if (node.type === 'phone') return '#9b59b6';
    if (node.type === 'recruiter') return '#3498db';
    if (node.type === 'location') return '#1abc9c';
    return '#aaa';
  };

  const graphData = buildGraphData();
  const hasData = graphData.nodes.length > 0;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>
        Recruitment Network
      </h2>
      <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '16px' }}>
        Connections between suspicious recruiters across posts.
      </p>

      {!hasData ? (
        <div style={{
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#aaa',
          fontSize: '0.9rem'
        }}>
          Upload and analyze posts to see the network graph.
        </div>
      ) : (
        <>
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.8rem' }}>🔴 High Risk Post</span>
            <span style={{ fontSize: '0.8rem' }}>🟠 Medium Risk Post</span>
            <span style={{ fontSize: '0.8rem' }}>🟢 Low Risk Post</span>
            <span style={{ fontSize: '0.8rem', color: '#9b59b6' }}>🟣 Phone Number</span>
            <span style={{ fontSize: '0.8rem', color: '#3498db' }}>🔵 Recruiter</span>
            <span style={{ fontSize: '0.8rem', color: '#1abc9c' }}>🟦 Location</span>
          </div>
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeLabel="label"
            nodeColor={getNodeColor}
            nodeRelSize={6}
            linkColor={() => '#ddd'}
            width={600}
            height={350}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = getNodeColor(node);
              ctx.beginPath();
              ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
              ctx.fill();
              ctx.fillStyle = '#333';
              ctx.textAlign = 'center';
              ctx.fillText(label, node.x, node.y + 12);
            }}
          />
        </>
      )}
    </div>
  );
}

export default NetworkGraph;