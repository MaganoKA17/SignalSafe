import React from "react";

function NetworkGraph({posts}){
    return (
        <div style={{
            backgroundColor: 'white',
            borderStatus: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignmentItems: 'center'
        }}>
            <h2 style={{color: '#1a1a2e', marginBottom: '8px'}}>
                Recruitment Network
            </h2>
            <p style={{color: '#555', fontSize: '0.9rem'}}>
               Network graph will display suspicious recriuter connections here.
            </p>
        </div>
    );
}
export default NetworkGraph;