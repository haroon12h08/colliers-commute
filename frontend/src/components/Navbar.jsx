import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

export default function Navbar({
  cities,
  selectedCity,
  onSelectCity,
  onOpenComparison,
  activeTab,
  setActiveTab,
  onStartTour
}) {
  return (
    <header
      style={{
        height: 'var(--colliers-nav-height)',
        backgroundColor: 'var(--colliers-primary-deep-blue)',
        borderBottom: '1px solid rgba(219, 229, 255, 0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 50
      }}
    >
      {/* Brand Wordmark & Global Nav Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div
          onClick={() => setActiveTab('properties')}
          style={{ display: 'flex', alignItems: 'baseline', gap: 8, cursor: 'pointer' }}
          title="Colliers Commute & Location Intelligence"
        >
          <span
            style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: '#FFFFFF',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            Colliers
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--colliers-primary-light-blue)',
              letterSpacing: '1.2px',
              textTransform: 'uppercase'
            }}
          >
            COMMUTE INTELLIGENCE
          </span>
        </div>

        <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(219, 229, 255, 0.18)' }} />

        {/* Enterprise Navigation Links (Text-first, no unnecessary icon slop) */}
        <nav style={{ display: 'flex', alignItems: 'center', height: 'var(--colliers-nav-height)' }}>
          {[
            { id: 'properties', label: 'Properties & Hubs' },
            { id: 'isochrones', label: 'Commute Catchments' },
            { id: 'insights', label: 'Market Advisory' },
            { id: 'database', label: 'Workforce Database' }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: active ? '#FFFFFF' : '#DBE5FF',
                  fontSize: '12px',
                  fontWeight: active ? 600 : 500,
                  padding: '0 16px',
                  height: 'var(--colliers-nav-height)',
                  cursor: 'pointer',
                  borderBottom: active ? '2px solid var(--colliers-primary-medium-blue)' : '2px solid transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'color 0.15s ease',
                  letterSpacing: '0.2px'
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Segmented Metro Switcher & Restrained Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Compact Segmented Control (30px height, 3px radius) */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(0, 7, 89, 0.6)',
            padding: '2px',
            borderRadius: 'var(--colliers-radius-sm)',
            border: '1px solid rgba(219, 229, 255, 0.2)'
          }}
        >
          {cities.map(city => {
            const isSelected = selectedCity.code === city.code;
            return (
              <button
                key={city.code}
                onClick={() => onSelectCity(city)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--colliers-radius-xs)',
                  border: 'none',
                  backgroundColor: isSelected ? 'var(--colliers-primary-dark-blue)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : '#DBE5FF',
                  fontSize: '11px',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {city.name}
              </button>
            );
          })}
        </div>

        {/* User Guide & Tour Trigger for Ms. Vijaya */}
        <button
          onClick={onStartTour}
          style={{
            height: '30px',
            padding: '0 11px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: 'rgba(28, 84, 244, 0.28)',
            border: '1px solid rgba(219, 229, 255, 0.45)',
            borderRadius: 'var(--colliers-radius-xs)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease'
          }}
          title="Open interactive walkthrough & user guide for Ms. Vijaya"
        >
          <Compass size={14} color="#DBE5FF" />
          <span>User Guide</span>
        </button>

        {/* Matrix Comparison Action */}
        <button
          onClick={onOpenComparison}
          className="colliers-btn-secondary"
          style={{ height: '30px', padding: '0 12px', fontSize: '11px', color: '#FFFFFF', borderColor: 'rgba(219, 229, 255, 0.35)' }}
        >
          <span>Site Comparison</span>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenComparison}
          className="colliers-btn-primary"
          style={{ height: '30px', padding: '0 14px', fontSize: '11px', color: '#FFFFFF' }}
        >
          <span>Download Report</span>
        </button>
      </div>
    </header>
  );
}
