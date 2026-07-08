import React from "react";
function MapView(){
    return(
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0,1)',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h2 style={{color: '#1a1a2e', marginBottom: '8px'}}>
                Risk Zone Map
            </h2>
            <p style={{color: '#555', fontSize: '0.9rem'}}>
                Map will display event risk zones here.
            </p>
        </div>
    );
}
export default MapView;