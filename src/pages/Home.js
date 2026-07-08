import React from 'react';

function Home({onGetStarted}){
    return (
        <div style={{
            display : 'flex',
            flexDirection : 'column',
            alignItems : 'center',
            justifyContent : 'center',
            height : '80vh',
            textAlign : 'center',
            padding : '0 24px'
        }}>
            <h1 style = {{ fontSize : '2.5rem', color : '#1a1a2e',marginBottom : '32px'}}>
                SignalSafe
            </h1>

            <p style ={{ fontSize: '1.2rem', color: '#555', maxWidth: '600px', marginBottom: '32px'}}>
                Detecting exploitation and trafficking risks in job posts and recruitment networks, before harm occurs.
            </p>
            <button onClick={onGetStarted} style={{
                backgroundColor: '#e94560',
                color: 'white',
                border: 'none',
                padding: '14px 32 px',
                fontSize: '1rem',
                borderRadius: '8px',
                cursor: 'pointer'
            }}>
                Get Started
            </button>
        </div>
    );
}

export default Home;