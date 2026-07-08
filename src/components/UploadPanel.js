import React from "react";

function UploadPanel({onPostsLoaded}){
    return(
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0,1)'
        }}>
            <h2 style={{color: '#1a1a2e', marginBottom: '8px'}}>
                Upload Posts
            </h2>
            <p style={{color: '#555', fontSize: '0.9rem'}}>
                Upload a CSV file of job posts or recruitment listings to analyze.
            </p>
            <button style={{
                marginTop: '16px',
                backgroundColor: '#e94560',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
            }}>
                Upload CSV
            </button>
        </div>
    );
}
export default UploadPanel;