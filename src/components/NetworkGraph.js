import React, { useRef } from 'react';
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
      nodes.push({ id: postId, label: post.title || `Post ${index + 1}`, type: 'post', risk: post.analysis.riskLevel });

      if (phone) {
        if (!seen[phone]) { seen[phone] = `phone-${phone}`; nodes.push({ id: seen[phone], label: phone, type: 'phone' }); }
        links.push({ source: postId, target: seen[phone] });
      }
      if (location) {
        if (!seen[location]) { seen[location] = `loc-${location}`; nodes.push({ id: seen[location], label: location, type: 'location' }); }
        links.push({ source: postId, target: seen[location] });
      }
      if (recruiterName) {
        if (!seen[recruiterName]) { seen[recruiterName] = `rec-${recruiterName}`; nodes.push({ id: seen[recruiterName], label: recruiterName, type: 'recruiter' }); }
        links.push({ source: postId, target: seen[recruiterName] });
      }
    });

    return { nodes, links };
  };

  const getNodeColor = (node) => {
    if (node.type === 'post') {
      return node.risk === 'High' ? '#C1121F' : node.risk === 'Medium' ? '#E9A825' : '#4CAF7D';
    }
    if (node.type === 'phone') return '#9b59b6';
    if (node.type === 'recruiter') return '#3498db';
    if (node.type === 'location') return '#1abc9c';
    return '#8A9BB0';
  };

  const graphData = buildGraphData();
  const hasData = graphData.nodes.length > 0;

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span>🕸️</span>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700' }}>
          Recruitment Network
        </h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '16px', lineHeight: '1.6' }}>
        Connections between suspicious recruiters across analyzed posts.
      </p>

      {!hasData ? (
        <div style={{
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          Upload posts to visualize the recruiter network.
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {[
              { color: '#C1121F', label: 'High Risk Post' },
              { color: '#E9A825', label: 'Medium Risk Post' },
              { color: '#4CAF7D', label: 'Low Risk Post' },
              { color: '#9b59b6', label: 'Phone Number' },
              { color: '#3498db', label: 'Recruiter' },
              { color: '#1abc9c', label: 'Location' },
            ].map((item, i) => (
              <span key={i} style={{ fontSize: '0.72rem', color: item.color, fontWeight: '600' }}>
                ● {item.label}
              </span>
            ))}
          </div>
          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel="label"
              nodeColor={getNodeColor}
              nodeRelSize={6}
              linkColor={() => '#2E4057'}
              width={680}
              height={320}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const fontSize = 11 / globalScale;
                ctx.font = `${fontSize}px Inter, sans-serif`;
                ctx.fillStyle = getNodeColor(node);
                ctx.beginPath();
                ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = '#E0E0E0';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y + 14);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default NetworkGraph;