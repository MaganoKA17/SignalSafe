import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const RISK_CONFIG = {
  nightclub: { color: '#C1121F', risk: 'High Risk', label: 'Nightclub' },
  bar: { color: '#C1121F', risk: 'High Risk', label: 'Bar' },
  hotel: { color: '#E9A825', risk: 'Medium Risk', label: 'Hotel' },
  hostel: { color: '#E9A825', risk: 'Medium Risk', label: 'Hostel' },
  bus_station: { color: '#E9A825', risk: 'Medium Risk', label: 'Transit Hub' },
  train_station: { color: '#E9A825', risk: 'Medium Risk', label: 'Train Station' },
  guest_house: { color: '#4CAF7D', risk: 'Low Risk', label: 'Guest House' },
};

function MapView() {
  const [location, setLocation] = useState('');
  const [mapCenter, setMapCenter] = useState([-26.2041, 28.0473]);
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
    return RISK_CONFIG[type] || { color: '#8A9BB0', risk: 'Unknown', label: type };
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

  const card = {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)'
  };

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span>🗺️</span>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700' }}>
          Risk Zone Map
        </h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '16px', lineHeight: '1.6' }}>
        Enter any event city to plot real trafficking risk zones from live venue data.
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
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            outline: 'none',
            fontFamily: 'Inter, sans-serif'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {searching && (
        <p style={{ color: 'var(--accent)', fontSize: '0.82rem', marginBottom: '12px', fontWeight: '500' }}>
          🔍 Fetching real venue data...
        </p>
      )}

      {stats && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { count: stats.high, label: 'High Risk', color: 'var(--high)', bg: 'var(--high-bg)' },
            { count: stats.medium, label: 'Medium Risk', color: 'var(--medium)', bg: 'var(--medium-bg)' },
            { count: stats.low, label: 'Low Risk', color: 'var(--low)', bg: 'var(--low-bg)' },
            { count: stats.total, label: 'Total', color: 'var(--text-secondary)', bg: 'var(--bg-primary)' },
          ].map((s, i) => (
            <span key={i} style={{
              backgroundColor: s.bg,
              color: s.color,
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: '700'
            }}>
              {s.count} {s.label}
            </span>
          ))}
        </div>
      )}

      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={14}
        style={{ height: '380px', borderRadius: '8px' }}
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
              pathOptions={{ color: score.color, fillColor: score.color, fillOpacity: 0.4 }}
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

      <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--high)' }}>🔴 High — Nightclubs, Bars</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--medium)' }}>🟠 Medium — Hotels, Transit</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--low)' }}>🟢 Low — Guest Houses</span>
      </div>
    </div>
  );
}

export default MapView;