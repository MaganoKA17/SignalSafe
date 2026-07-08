import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const RISK_CONFIG = {
  nightclub: { color: '#e94560', risk: 'High Risk', label: 'Nightclub' },
  bar: { color: '#e94560', risk: 'High Risk', label: 'Bar' },
  hotel: { color: '#f5a623', risk: 'Medium Risk', label: 'Hotel' },
  hostel: { color: '#f5a623', risk: 'Medium Risk', label: 'Hostel' },
  bus_station: { color: '#f5a623', risk: 'Medium Risk', label: 'Transit Hub' },
  train_station: { color: '#f5a623', risk: 'Medium Risk', label: 'Train Station' },
  guest_house: { color: '#27ae60', risk: 'Low Risk', label: 'Guest House' },
};

function MapView() {
  const [location, setLocation] = useState('');
  const [mapCenter, setMapCenter] = useState([-26.2041, 28.0473]);
  const [cityName, setCityName] = useState('Johannesburg');
  const [searching, setSearching] = useState(false);
  const [venues, setVenues] = useState([]);
  const [mapKey, setMapKey] = useState(0);
  const [stats, setStats] = useState(null);

  const fetchVenues = async (lat, lon) => {
    const query = `
      [out:json];
      (
        node["amenity"="nightclub"](around:3000,${lat},${lon});
        node["amenity"="bar"](around:3000,${lat},${lon});
        node["tourism"="hotel"](around:3000,${lat},${lon});
        node["tourism"="hostel"](around:3000,${lat},${lon});
        node["tourism"="guest_house"](around:3000,${lat},${lon});
        node["amenity"="bus_station"](around:3000,${lat},${lon});
        node["railway"="station"](around:3000,${lat},${lon});
      );
      out body;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    const data = await response.json();
    return data.elements;
  };

  const scoreVenue = (venue) => {
    const type =
      venue.tags?.amenity ||
      venue.tags?.tourism ||
      (venue.tags?.railway === 'station' ? 'train_station' : null);
    return RISK_CONFIG[type] || { color: '#aaa', risk: 'Unknown', label: type };
  };

  const handleSearch = async () => {
    if (!location.trim()) return;
    setSearching(true);
    setVenues([]);
    setStats(null);

    try {
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
      );
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        alert('Location not found. Try a different city name.');
        return;
      }

      const { lat, lon, display_name } = geoData[0];
      const coords = [parseFloat(lat), parseFloat(lon)];
      setMapCenter(coords);
      setCityName(display_name.split(',')[0]);
      setMapKey(prev => prev + 1);

      const fetchedVenues = await fetchVenues(lat, lon);
      setVenues(fetchedVenues);

      const high = fetchedVenues.filter(v => scoreVenue(v).risk === 'High Risk').length;
      const medium = fetchedVenues.filter(v => scoreVenue(v).risk === 'Medium Risk').length;
      const low = fetchedVenues.filter(v => scoreVenue(v).risk === 'Low Risk').length;
      setStats({ high, medium, low, total: fetchedVenues.length });

    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>
        🗺️ Risk Zone Map
      </h2>
      <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '16px' }}>
        Enter an event city to see real trafficking risk zones based on venue data.
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Enter city or event location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '0.9rem'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: '#e94560',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {searching && (
        <p style={{ color: '#e94560', fontSize: '0.9rem', marginBottom: '12px' }}>
          🔍 Fetching real venue data...
        </p>
      )}

      {stats && (
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            backgroundColor: '#ffeef0',
            color: '#e94560',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 'bold'
          }}>
            🔴 {stats.high} High Risk
          </span>
          <span style={{
            backgroundColor: '#fff8ee',
            color: '#f5a623',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 'bold'
          }}>
            🟠 {stats.medium} Medium Risk
          </span>
          <span style={{
            backgroundColor: '#eefff4',
            color: '#27ae60',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 'bold'
          }}>
            🟢 {stats.low} Low Risk
          </span>
          <span style={{
            backgroundColor: '#f0f0f0',
            color: '#555',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem'
          }}>
            📍 {stats.total} Total Venues
          </span>
        </div>
      )}

      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={14}
        style={{ height: '400px', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {venues.map((venue, index) => {
          const score = scoreVenue(venue);
          return (
            <Circle
              key={index}
              center={[venue.lat, venue.lon]}
              radius={100}
              pathOptions={{
                color: score.color,
                fillColor: score.color,
                fillOpacity: 0.4
              }}
            >
              <Popup>
                <strong>{venue.tags?.name || score.label}</strong><br />
                <span style={{ color: score.color }}>{score.risk}</span><br />
                <small>{score.label}</small>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>

      <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
        <span style={{ fontSize: '0.8rem', color: '#e94560' }}>🔴 High Risk — Nightclubs, Bars</span>
        <span style={{ fontSize: '0.8rem', color: '#f5a623' }}>🟠 Medium Risk — Hotels, Transit</span>
        <span style={{ fontSize: '0.8rem', color: '#27ae60' }}>🟢 Low Risk — Guest Houses</span>
      </div>
    </div>
  );
}

export default MapView;