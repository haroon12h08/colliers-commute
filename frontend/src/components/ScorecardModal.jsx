import React from 'react';
import { X, Building2, TrendingUp, Check, ShieldCheck, Download, FileSpreadsheet } from 'lucide-react';

export default function ScorecardModal({ isOpen, onClose, selectedCity, offices, scorecards }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 7, 89, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 960,
          maxHeight: '90vh',
          borderRadius: 4,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          border: '1px solid #CCCDD5',
          boxShadow: '0 16px 36px rgba(0, 7, 89, 0.22)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header in Official Colliers Deep Blue */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#000759',
            borderTop: '3px solid #1C54F4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <div>
            <div className="colliers-kicker" style={{ color: '#DBE5FF', marginBottom: 4 }}>
              COLLIERS RESEARCH &amp; VALUATION ADVISORY
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0, letterSpacing: '-0.2px' }}>
              {selectedCity.name} Commercial Real Estate Commute Matrix
            </h2>
            <p style={{ fontSize: '12px', color: '#DBE5FF', margin: '4px 0 0 0', fontWeight: 400 }}>
              Comparative travel catchment, workforce accessibility, and lease economics across Grade-A hubs.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.85
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Matrix Table */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EBEBEE', backgroundColor: '#F8F9FA', color: '#525255', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Office Property</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Micro-Market</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Base Rent</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Avg Commute</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>&lt; 45 Mins Reach</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Transit Rating</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>ESG Score</th>
              </tr>
            </thead>
            <tbody>
              {offices.map((office, idx) => {
                const sc = scorecards.find(s => s.officeId === office.id);
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={office.id}
                    style={{
                      borderBottom: '1px solid #EBEBEE',
                      backgroundColor: isEven ? '#FFFFFF' : '#FAFAFC',
                      color: '#272B30'
                    }}
                  >
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                      <span style={{ color: '#000759', fontSize: '13px' }}>{office.name}</span>
                      <span style={{ display: 'block', fontSize: '10px', color: '#7A7B80', fontWeight: 400 }}>
                        {office.grade} • {office.city}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#525255' }}>
                      {office.microMarket}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      ₹{office.rentPerSqft} <span style={{ fontSize: '10px', color: '#7A7B80', fontWeight: 400 }}>/sqft</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      <span style={{ fontWeight: 700, color: '#000759' }}>
                        {sc ? `${sc.avgCommuteMins}m` : `${office.avgCommuteMins}m`}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      <span
                        style={{
                          backgroundColor: '#EDF2FF',
                          color: '#1C54F4',
                          padding: '3px 6px',
                          borderRadius: 3,
                          fontWeight: 700,
                          fontSize: '11px',
                          border: '1px solid #DBE5FF'
                        }}
                      >
                        {sc ? sc.pctUnder45Mins : `${office.pctUnder45Mins}%`}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#272B30', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {sc ? `${sc.transitAccessibilityScore} / 10` : '9.0 / 10'}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#10B981', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {sc ? `${sc.sustainabilityScore} / 10` : '8.8 / 10'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Strategic Narrative Cards */}
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {scorecards.map((sc) => (
              <div
                key={sc.officeId}
                style={{
                  backgroundColor: '#F8F9FA',
                  padding: '12px 14px',
                  borderRadius: 3,
                  border: '1px solid #EBEBEE',
                  borderLeft: '3px solid #1C54F4'
                }}
              >
                <div style={{ fontWeight: 700, color: '#000759', fontSize: '12px', marginBottom: 4 }}>
                  {sc.officeName}
                </div>
                <p style={{ fontSize: '11px', color: '#525255', lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
                  {sc.recommendationSummary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #EBEBEE',
            backgroundColor: '#F8F9FA',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '11px', color: '#7A7B80' }}>
            Source: Colliers Occupier Services &amp; Research Matrix
          </span>
          <button
            onClick={onClose}
            className="colliers-btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
