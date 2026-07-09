import React from 'react';

function Home({ onGetStarted }) {
  const features = [
    { icon: '📂', title: 'AI Post Scanner', desc: 'Upload job listings and get instant risk scores with plain-language explanations.' },
    { icon: '🗺️', title: 'Live Risk Map', desc: 'Real venue data from any city — hotels, transit hubs, nightlife — scored by risk level.' },
    { icon: '🕸️', title: 'Network Mapper', desc: 'Connect the dots across posts — shared phones, recruiters, locations.' },
    { icon: '📋', title: 'Outreach Intel', desc: 'AI-generated recommendations for NGO field workers based on analyzed data.' },
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      animation: 'fadeIn 0.5s ease'
    }}>
      <div style={{
        display: 'inline-block',
        backgroundColor: 'var(--high-bg)',
        color: 'var(--accent)',
        fontSize: '0.7rem',
        fontWeight: '700',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '6px 16px',
        borderRadius: '20px',
        marginBottom: '32px',
        border: '1px solid var(--accent)'
      }}>
        Call for Code · United Against Trafficking · Anticipate & Disrupt
      </div>

      <h1 style={{
        fontSize: 'clamp(2.8rem, 7vw, 5rem)',
        fontWeight: '800',
        color: 'var(--text-primary)',
        marginBottom: '16px',
        lineHeight: '1.1',
        letterSpacing: '-0.03em',
        textAlign: 'center',
        maxWidth: '820px'
      }}>
        Exploitation hides<br />
        <span style={{ color: 'var(--accent)' }}>in plain sight.</span>
      </h1>

      <p style={{
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
        maxWidth: '540px',
        lineHeight: '1.75',
        marginBottom: '48px',
        textAlign: 'center'
      }}>
        SignalSafe gives NGOs, labor advocates, and social workers 
        the tools to detect trafficking risk before vulnerable people are harmed.
      </p>

      <button
        onClick={onGetStarted}
        style={{
          backgroundColor: 'var(--accent)',
          color: 'white',
          border: 'none',
          padding: '16px 48px',
          fontSize: '1rem',
          fontWeight: '700',
          borderRadius: '8px',
          cursor: 'pointer',
          letterSpacing: '0.02em',
          marginBottom: '80px',
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Launch Dashboard →
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        maxWidth: '900px',
        width: '100%'
      }}>
        {features.map((f, i) => (
          <div key={i} style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{f.icon}</div>
            <h3 style={{
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              {f.title}
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              lineHeight: '1.6'
            }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;