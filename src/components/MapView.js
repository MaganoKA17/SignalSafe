import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// US State Department TIP Report 2024 - Country Risk Tiers
// Source: https://www.state.gov/trafficking-in-persons-report/
const TIP_TIERS = {
  tier3: [
    'Afghanistan', 'Belarus', 'Burma', 'Myanmar', 'Central African Republic',
    'China', 'Cuba', 'Eritrea', 'Equatorial Guinea', 'Iran', 'Mali',
    'Nicaragua', 'North Korea', 'Papua New Guinea', 'Russia', 'South Sudan',
    'Sudan', 'Syria', 'Turkmenistan', 'Venezuela'
  ],
  tier2WL: [
    'Algeria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bolivia', 'Cameroon',
    'Chad', 'Congo', 'Djibouti', 'Ecuador', 'El Salvador', 'Ethiopia',
    'Guatemala', 'Guinea', 'Haiti', 'Honduras', 'India', 'Indonesia',
    'Iraq', 'Jamaica', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Lebanon',
    'Libya', 'Madagascar', 'Mauritania', 'Mexico', 'Moldova', 'Mozambique',
    'Nepal', 'Niger', 'Nigeria', 'Oman', 'Pakistan', 'Philippines',
    'Qatar', 'Saudi Arabia', 'Sierra Leone', 'Somalia', 'Sri Lanka',
    'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'Türkiye', 'Uganda',
    'Ukraine', 'United Arab Emirates', 'UAE', 'Uzbekistan', 'Vietnam',
    'Yemen', 'Zimbabwe'
  ],
  tier1: [
    'Australia', 'Austria', 'Belgium', 'Canada', 'Chile', 'Colombia',
    'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany',
    'Iceland', 'Ireland', 'Israel', 'Italy', 'Japan', 'Latvia',
    'Lithuania', 'Luxembourg', 'Netherlands', 'New Zealand', 'Norway',
    'Poland', 'Portugal', 'Slovakia', 'Slovenia', 'South Korea', 'Spain',
    'Sweden', 'Switzerland', 'United Kingdom', 'United States'
  ]
};

const VENUE_BASE_SCORES = {
  nightclub: 75,
  bar: 60,
  hotel: 45,
  hostel: 42,
  bus_station: 38,
  train_station: 35,
  guest_house: 22,
};

const VENUE_LABELS = {
  nightclub: 'Nightclub',
  bar: 'Bar',
  hotel: 'Hotel',
  hostel: 'Hostel',
  bus_station: 'Bus Station',
  train_station: 'Train Station',
  guest_house: 'Guest House',
};

const getCountryMultiplier = (country) => {
  if (!country) return 1.0;
  if (TIP_TIERS.tier3.some(c => country.includes(c))) return 1.4;
  if (TIP_TIERS.tier2WL.some(c => country.includes(c))) return 1.25;
  if (TIP_TIERS.tier1.some(c => country.includes(c))) return 0.8;
  return 1.0;
};

const getTipTierLabel = (country) => {
  if (!country) return 'Tier 2';
  if (TIP_TIERS.tier3.some(c => country.includes(c))) return 'Tier 3 — Highest Risk';
  if (TIP_TIERS.tier2WL.some(c => country.includes(c))) return 'Tier 2 Watch List';
  if (TIP_TIERS.tier1.some(c => country.includes(c))) return 'Tier 1 — Compliant';
  return 'Tier 2';
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getVenueType = (venue) => {
  return (
    venue.tags?.amenity ||
    venue.tags?.tourism ||
    (venue.tags?.railway === 'station' ? 'train_station' : null)
  );
};

const computeVenueScore = (venue, allVenues, center, countryMultiplier) => {
  const type = getVenueType(venue);
  const baseScore = VENUE_BASE_SCORES[type] || 25;

  const nearbyHighRisk = allVenues.filter((v) => {
    if (v === venue) return false;
    const vType = getVenueType(v);
    const isHighRisk = ['nightclub', 'bar'].includes(vType);
    const dist = haversineDistance(venue.lat, venue.lon, v.lat, v.lon);
    return isHighRisk && dist < 500;
  }).length;
  const densityBonus = Math.min(nearbyHighRisk * 4, 15);

  const distFromCenter = haversineDistance(
    venue.lat, venue.lon, center[0], center[1]
  );
  const proximityBonus = distFromCenter < 500 ? 8 : distFromCenter < 1000 ? 4 : 0;

  const rawScore = baseScore + densityBonus + proximityBonus;
  const finalScore = Math.min(Math.round(rawScore * countryMultiplier), 100);

  const riskLevel =
    finalScore >= 70 ? 'High Risk' :
    finalScore >= 40 ? 'Medium Risk' : 'Low Risk';

  const color =
    finalScore >= 70 ? '#C1121F' :
    finalScore >= 55 ? '#E05020' :
    finalScore >= 40 ? '#E9A825' : '#4CAF7D';

  const label = VENUE_LABELS[type] || 'Venue';

  return { score: finalScore, riskLevel, color, label, type, densityBonus, proximityBonus, baseScore };
};

function MapView() {
  const [location, setLocation] = useState('');
  const [mapCenter, setMapCenter] = useState([-26.2041, 28.0473]);
  const [searching, setSearching] = useState(false);
  const [venues, setVenues] = useState([]);
  const [scoredVenues, setScoredVenues] = useState([]);
  const [mapKey, setMapKey] = useState(0);
  const [stats, setStats] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);

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
      body: query,
    });
    const data = await response.json();
    return data.elements;
  };

  const handleSearch = async () => {
    if (!location.trim()) return;
    setSearching(true);
    setVenues([]);
    setScoredVenues([]);
    setStats(null);
    setCountryInfo(null);

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
      setMapKey((prev) => prev + 1);

      const country = display_name.split(',').slice(-1)[0].trim();
      const multiplier = getCountryMultiplier(country);
      const tipLabel = getTipTierLabel(country);
      setCountryInfo({ country, multiplier, tipLabel });

      const fetchedVenues = await fetchVenues(lat, lon);
      setVenues(fetchedVenues);

      const scored = fetchedVenues.map((v) =>
        ({ venue: v, ...computeVenueScore(v, fetchedVenues, coords, multiplier) })
      );
      setScoredVenues(scored);

      const high = scored.filter((v) => v.riskLevel === 'High Risk').length;
      const medium = scored.filter((v) => v.riskLevel === 'Medium Risk').length;
      const low = scored.filter((v) => v.riskLevel === 'Low Risk').length;
      const avgScore = scored.length > 0
        ? Math.round(scored.reduce((sum, v) => sum + v.score, 0) / scored.length)
        : 0;

      setStats({ high, medium, low, total: scored.length, avgScore });
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span>🗺️</span>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700' }}>
          Risk Zone Map
        </h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '16px', lineHeight: '1.6' }}>
        Risk scores are calculated from real venue density, proximity, and
        UN-recognized trafficking risk data (US State Dept TIP Report).
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
          🔍 Fetching real venue data and computing risk scores...
        </p>
      )}

      {countryInfo && (
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '12px',
          border: '1px solid var(--border)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <span>🌍 <strong style={{ color: 'var(--text-primary)' }}>{countryInfo.country}</strong></span>
          <span>📊 TIP Report: <strong style={{ color: 'var(--text-primary)' }}>{countryInfo.tipLabel}</strong></span>
          <span>⚖️ Risk Multiplier: <strong style={{ color: 'var(--accent)' }}>{countryInfo.multiplier}×</strong></span>
        </div>
      )}

      {stats && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { count: stats.high, label: 'High Risk', color: 'var(--high)', bg: 'var(--high-bg)' },
            { count: stats.medium, label: 'Medium Risk', color: 'var(--medium)', bg: 'var(--medium-bg)' },
            { count: stats.low, label: 'Low Risk', color: 'var(--low)', bg: 'var(--low-bg)' },
            { count: `${stats.avgScore}/100`, label: 'Avg Score', color: 'var(--text-secondary)', bg: 'var(--bg-primary)' },
          ].map((s, i) => (
            <span key={i} style={{
              backgroundColor: s.bg,
              color: s.color,
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: '700',
              border: '1px solid var(--border)'
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
        style={{ height: '400px', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {scoredVenues.map((sv, index) => (
          <Circle
            key={index}
            center={[sv.venue.lat, sv.venue.lon]}
            radius={80 + sv.score * 0.8}
            pathOptions={{
              color: sv.color,
              fillColor: sv.color,
              fillOpacity: 0.45,
              weight: 1
            }}
          >
            <Popup>
              <div style={{ minWidth: '180px' }}>
                <strong>{sv.venue.tags?.name || sv.label}</strong>
                <br />
                <span style={{ color: sv.color, fontWeight: 'bold' }}>
                  {sv.riskLevel} — Score: {sv.score}/100
                </span>
                <hr style={{ margin: '6px 0', border: 'none', borderTop: '1px solid #eee' }} />
                <small>
                  <strong>Score breakdown:</strong><br />
                  Base ({sv.label}): {sv.baseScore}<br />
                  Nearby high-risk density: +{sv.densityBonus}<br />
                  Proximity to center: +{sv.proximityBonus}<br />
                  Country multiplier: ×{countryInfo?.multiplier || 1.0}
                </small>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--high)' }}>🔴 High Risk (70-100)</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--medium)' }}>🟠 Medium Risk (40-69)</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--low)' }}>🟢 Low Risk (0-39)</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          · Scores based on venue type, density, proximity & TIP Report country tier
        </span>
      </div>
    </div>
  );
}

export default MapView;