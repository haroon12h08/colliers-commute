import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronRight,
  Check,
  Building,
  Users,
  Clock,
  Navigation,
  MapPin,
  Layers,
  Sparkles,
  Award,
  Filter,
  Train,
  Car,
  Bus,
  Bike,
  Compass,
  FileSpreadsheet,
  ChevronDown,
  CheckCircle2,
  X
} from 'lucide-react';
import { STORYLINES } from '../data/fallbackData';
import { WORKFORCE_1500 } from '../data/workforceData';

function haversineKm(lon1, lat1, lon2, lat2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Sidebar({
  cities,
  selectedCity,
  onSelectCity,
  offices,
  selectedOffice,
  onSelectOffice,
  scorecards,
  travelMode,
  setTravelMode,
  visibleLayers,
  onToggleLayer,
  onOpenComparison,
  onOpenDatabase,
  activeTab = 'properties',
  setActiveTab,
  employees = [],
  selectedEmployee,
  onSelectEmployee,
  centerOfGravity
}) {
  // Local search & filter states
  const [propertySearch, setPropertySearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedModeFilter, setSelectedModeFilter] = useState('ALL');
  const [selectedDurationFilter, setSelectedDurationFilter] = useState('ALL');

  const currentStory = STORYLINES[selectedCity.code] || STORYLINES.CHE;

  // Active city employees pool
  const cityEmployees = useMemo(() => {
    if (employees && employees.length > 0) return employees;
    return WORKFORCE_1500.filter(e => e.cityCode === selectedCity.code);
  }, [employees, selectedCity.code]);

  // Filtered properties for "properties" tab
  const filteredOffices = useMemo(() => {
    return (offices || []).filter(o =>
      o.name.toLowerCase().includes(propertySearch.toLowerCase()) ||
      o.microMarket.toLowerCase().includes(propertySearch.toLowerCase())
    );
  }, [offices, propertySearch]);

  // Filtered employees for "database" tab
  const filteredEmployees = useMemo(() => {
    return cityEmployees.filter(emp => {
      // 1. Text Search
      if (employeeSearch) {
        const q = employeeSearch.toLowerCase();
        const matchesName = emp.fullName?.toLowerCase().includes(q);
        const matchesId = emp.employeeId?.toLowerCase().includes(q);
        const matchesDept = emp.department?.toLowerCase().includes(q);
        const matchesLoc = emp.residentialLocality?.toLowerCase().includes(q);
        const matchesAddr = emp.residentialAddress?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesDept && !matchesLoc && !matchesAddr) {
          return false;
        }
      }

      // 2. Commute Mode Filter
      if (selectedModeFilter !== 'ALL') {
        const mode = (emp.commuteMode || '').toLowerCase();
        if (selectedModeFilter === 'Metro' && !mode.includes('metro') && !mode.includes('train')) return false;
        if (selectedModeFilter === 'Bus' && !mode.includes('bus')) return false;
        if (selectedModeFilter === 'Two-Wheeler' && !mode.includes('two-wheeler') && !mode.includes('bike') && !mode.includes('scooter')) return false;
        if (selectedModeFilter === 'Car' && !mode.includes('car') && !mode.includes('drive') && !mode.includes('driving')) return false;
      }

      // 3. Duration Filter
      if (selectedDurationFilter !== 'ALL') {
        const dur = emp.commuteDurationMins || 0;
        if (selectedDurationFilter === '<30m' && dur >= 30) return false;
        if (selectedDurationFilter === '30-45m' && (dur < 30 || dur > 45)) return false;
        if (selectedDurationFilter === '>45m' && dur <= 45) return false;
      }

      return true;
    });
  }, [cityEmployees, employeeSearch, selectedModeFilter, selectedDurationFilter]);

  // Active office scorecard
  const activeScorecard = useMemo(() => {
    return (scorecards || []).find(s => s.officeId === selectedOffice?.id);
  }, [scorecards, selectedOffice]);

  // Market average rent
  const avgRent = useMemo(() => {
    if (!offices || offices.length === 0) return 0;
    return Math.round(offices.reduce((acc, o) => acc + o.rentPerSqft, 0) / offices.length);
  }, [offices]);

  // Distance from workforce centroid to selected campus
  const centroidDistKm = useMemo(() => {
    if (!centerOfGravity?.geometry?.coordinates || !selectedOffice) return null;
    const [cLng, cLat] = centerOfGravity.geometry.coordinates;
    const d = haversineKm(cLng, cLat, selectedOffice.longitude, selectedOffice.latitude);
    return Math.round(d * 10) / 10;
  }, [centerOfGravity, selectedOffice]);

  // Distribution figures for isochrone tab
  const isochroneDist = useMemo(() => {
    const total = cityEmployees.length || 500;
    const raw = activeScorecard?.commuteDistribution || {
      '<15m': 28,
      '15-30m': 44,
      '30-45m': 19,
      '45-60m': 7,
      '>60m': 2
    };

    return [
      {
        bracket: '< 15 mins',
        tier: 'Prime Core Hub',
        pct: raw['<15m'] || 28,
        count: Math.round(total * ((raw['<15m'] || 28) / 100)),
        color: '#10B981',
        description: 'Walking / immediate feeder perimeter'
      },
      {
        bracket: '15 – 30 mins',
        tier: 'Optimal Commute',
        pct: raw['15-30m'] || 44,
        count: Math.round(total * ((raw['15-30m'] || 44) / 100)),
        color: '#1C54F4',
        description: 'Primary rapid transit & arterial corridor'
      },
      {
        bracket: '30 – 45 mins',
        tier: 'Secondary Reach',
        pct: raw['30-45m'] || 19,
        count: Math.round(total * ((raw['30-45m'] || 19) / 100)),
        color: '#F59E0B',
        description: 'Standard urban commuter perimeter'
      },
      {
        bracket: '45 – 60 mins',
        tier: 'Outer Catchment',
        pct: raw['45-60m'] || 7,
        count: Math.round(total * ((raw['45-60m'] || 7) / 100)),
        color: '#6366F1',
        description: 'Peripheral sub-market reach'
      },
      {
        bracket: '> 60 mins',
        tier: 'Long-Haul Transit',
        pct: raw['>60m'] || 2,
        count: Math.round(total * ((raw['>60m'] || 2) / 100)),
        color: '#E11D48',
        description: 'Exurban commute requiring shuttle support'
      }
    ];
  }, [activeScorecard, cityEmployees]);

  return (
    <aside
      style={{
        width: 420,
        height: 'calc(100vh - var(--colliers-nav-height))',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--colliers-primary-deep-blue)',
        borderRight: '1px solid rgba(219, 229, 255, 0.16)',
        zIndex: 40,
        overflow: 'hidden'
      }}
    >
      {/* =========================================================================
          TAB 1: PROPERTIES & HUBS VIEW
         ========================================================================= */}
      {activeTab === 'properties' && (
        <>
          {/* Header & Site Filter */}
          <div
            style={{
              padding: '16px 20px 14px 20px',
              borderBottom: '1px solid rgba(219, 229, 255, 0.14)',
              backgroundColor: 'rgba(37, 64, 143, 0.12)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div className="colliers-kicker" style={{ color: '#DBE5FF' }}>
                COMMERCIAL TECH PARKS ({filteredOffices.length})
              </div>
              <span style={{ fontSize: '11px', color: '#DBE5FF' }}>
                Metro: <strong style={{ color: '#FFFFFF' }}>{selectedCity.name}</strong>
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={14} color="#DBE5FF" style={{ position: 'absolute', top: 10, left: 10 }} />
              <input
                type="text"
                placeholder="Filter campus name or micro-market..."
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                className="colliers-input colliers-input-dark"
                style={{ height: '34px', paddingLeft: '32px', fontSize: '12px' }}
              />
              {propertySearch && (
                <button
                  onClick={() => setPropertySearch('')}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'transparent',
                    border: 'none',
                    color: '#DBE5FF',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Market Benchmarks Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              padding: '10px 20px',
              backgroundColor: 'rgba(0, 7, 89, 0.4)',
              borderBottom: '1px solid rgba(219, 229, 255, 0.12)',
              fontSize: '11px'
            }}
          >
            <div>
              <span style={{ display: 'block', color: '#DBE5FF', fontSize: '10px', textTransform: 'uppercase' }}>Avg Market Rent</span>
              <span className="tabular-nums" style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '13px' }}>₹{avgRent}</span>
              <span style={{ color: '#DBE5FF', fontSize: '10px' }}> /sqft</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#DBE5FF', fontSize: '10px', textTransform: 'uppercase' }}>Sample Pool</span>
              <span className="tabular-nums" style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '13px' }}>{cityEmployees.length}</span>
              <span style={{ color: '#DBE5FF', fontSize: '10px' }}> staff</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#DBE5FF', fontSize: '10px', textTransform: 'uppercase' }}>Prime Hubs</span>
              <span className="tabular-nums" style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '13px' }}>{offices.length}</span>
              <span style={{ color: '#DBE5FF', fontSize: '10px' }}> sites</span>
            </div>
          </div>

          {/* Single Route Isolation Focus Banner */}
          {selectedEmployee && (
            <div
              style={{
                padding: '12px 20px',
                backgroundColor: 'rgba(5, 150, 105, 0.18)',
                borderBottom: '1px solid rgba(5, 150, 105, 0.4)',
                borderLeft: '3px solid #10B981',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#10B981', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  DOORSTEP ROUTE FOCUS
                </span>
                <button
                  onClick={() => onSelectEmployee(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#DBE5FF',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Clear Focus
                </button>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                {selectedEmployee.fullName} ({selectedEmployee.employeeId})
              </div>
              <div style={{ fontSize: '11px', color: '#DBE5FF' }}>
                {selectedEmployee.residentialAddress || selectedEmployee.residentialLocality}
              </div>
            </div>
          )}

          {/* Scrollable Content: Office Parks List & Map Layers */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                padding: '12px 20px 8px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(219, 229, 255, 0.1)'
              }}
            >
              <span className="colliers-kicker" style={{ color: '#FFFFFF' }}>
                SELECT CANDIDATE CAMPUS
              </span>
              <button
                onClick={onOpenComparison}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#DBE5FF',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3
                }}
              >
                <span>Scorecard Matrix</span>
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Flat Rows for 5 Tech Parks */}
            <div>
              {filteredOffices.map((office) => {
                const isSelected = selectedOffice?.id === office.id;
                const sc = (scorecards || []).find(s => s.officeId === office.id);
                const avgCommute = sc ? sc.avgCommuteMins : office.avgCommuteMins;
                const pctReach = sc ? sc.pctUnder45Mins : `${office.pctUnder45Mins}%`;

                return (
                  <div
                    key={office.id}
                    onClick={() => onSelectOffice(office)}
                    className={`colliers-site-row ${isSelected ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                          {office.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#DBE5FF', marginTop: 2 }}>
                          {office.microMarket} • {office.grade}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="tabular-nums" style={{ fontSize: '14px', fontWeight: 700, color: '#38BDF8' }}>
                          ₹{office.rentPerSqft}
                        </div>
                        <div style={{ fontSize: '10px', color: '#DBE5FF' }}>/sqft/mo</div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 8,
                        fontSize: '11px',
                        color: '#DBE5FF'
                      }}
                    >
                      <div>
                        Avg Commute: <strong className="tabular-nums" style={{ color: '#F59E0B' }}>{avgCommute} mins</strong>
                      </div>
                      <div>
                        &lt;45m Reach: <strong className="tabular-nums" style={{ color: '#00F5D4' }}>{pctReach}</strong>
                      </div>
                    </div>

                    {/* Area & LEED specs badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: '10px', color: '#94A3B8' }}>
                      <span>Campus Area: <strong style={{ color: '#FFFFFF' }}>{office.totalAreaSqft || 'N/A'}</strong></span>
                      <span>•</span>
                      <span>LEED: <strong style={{ color: '#10B981' }}>{office.leedRating || 'Certified'}</strong></span>
                    </div>

                    {isSelected && (
                      <div style={{ fontSize: '10px', color: '#00F5D4', fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00F5D4', display: 'inline-block' }} />
                        <span>Active Campus ({cityEmployees.length} Real-World Transit Corridors)</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Campus Detail Spotlight */}
            {selectedOffice && (
              <div style={{ borderTop: '1px solid rgba(219, 229, 255, 0.14)', padding: '16px 20px', backgroundColor: 'rgba(37, 64, 143, 0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="colliers-kicker" style={{ color: '#FFFFFF' }}>
                    CAMPUS TRANSIT &amp; ESG HIGHLIGHTS
                  </span>
                  <button
                    onClick={() => setActiveTab('isochrones')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#38BDF8',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    View Catchment →
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(selectedOffice.keyFeatures || []).map((feat, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '10px',
                        color: '#DBE5FF',
                        backgroundColor: 'rgba(28, 84, 244, 0.25)',
                        border: '1px solid rgba(28, 84, 244, 0.45)',
                        padding: '3px 8px',
                        borderRadius: 2
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map Display Layers Checklist */}
            <div style={{ borderTop: '1px solid rgba(219, 229, 255, 0.14)', padding: '16px 20px' }}>
              <div className="colliers-kicker" style={{ color: '#FFFFFF', marginBottom: 10 }}>
                MAP DISPLAY LAYERS
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '11px' }}>
                {[
                  { id: 'heatmap', label: 'Workforce Heatmap' },
                  { id: 'routes', label: 'Commute Corridors' },
                  { id: 'isochrones', label: 'Travel Catchments' },
                  { id: 'offices', label: 'Office Locations' },
                  { id: 'employees', label: 'Residential Points (Dots)' },
                  { id: 'centerOfGravity', label: 'Workforce Centroid' }
                ].map(layer => {
                  const active = visibleLayers[layer.id] !== false;
                  return (
                    <label
                      key={layer.id}
                      onClick={() => onToggleLayer(layer.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        color: '#FFFFFF'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => {}}
                        style={{ accentColor: 'var(--colliers-primary-medium-blue)', cursor: 'pointer' }}
                      />
                      <span>{layer.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          TAB 2: COMMUTE CATCHMENTS VIEW
         ========================================================================= */}
      {activeTab === 'isochrones' && (
        <>
          {/* Header & Target Office Switcher */}
          <div
            style={{
              padding: '16px 20px 14px 20px',
              borderBottom: '1px solid rgba(219, 229, 255, 0.14)',
              backgroundColor: 'rgba(37, 64, 143, 0.12)'
            }}
          >
            <div className="colliers-kicker" style={{ color: '#DBE5FF', marginBottom: 6 }}>
              COMMUTE CATCHMENTS &amp; ISOCHRONES
            </div>
            <div style={{ fontSize: '11px', color: '#DBE5FF', marginBottom: 8 }}>
              Multi-band travel time contours mapped to employee doorstep distribution
            </div>

            {/* Target Campus Dropdown Selector */}
            <div style={{ position: 'relative' }}>
              <select
                value={selectedOffice?.id}
                onChange={(e) => {
                  const target = offices.find(o => o.id === e.target.value);
                  if (target) onSelectOffice(target);
                }}
                className="colliers-input colliers-input-dark"
                style={{ height: '36px', padding: '0 12px', fontSize: '12px', cursor: 'pointer', width: '100%' }}
              >
                {offices.map(o => (
                  <option key={o.id} value={o.id} style={{ backgroundColor: '#000759', color: '#FFFFFF' }}>
                    {o.name} ({o.microMarket}) — ₹{o.rentPerSqft}/sqft
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Campus Key Accessibility KPIs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              padding: '10px 20px',
              backgroundColor: 'rgba(0, 7, 89, 0.4)',
              borderBottom: '1px solid rgba(219, 229, 255, 0.12)',
              fontSize: '11px'
            }}
          >
            <div>
              <span style={{ display: 'block', color: '#DBE5FF', fontSize: '10px', textTransform: 'uppercase' }}>Avg Travel</span>
              <span className="tabular-nums" style={{ color: '#F59E0B', fontWeight: 700, fontSize: '13px' }}>
                {activeScorecard?.avgCommuteMins || selectedOffice?.avgCommuteMins || 32} mins
              </span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#DBE5FF', fontSize: '10px', textTransform: 'uppercase' }}>&lt;45m Reach</span>
              <span className="tabular-nums" style={{ color: '#00F5D4', fontWeight: 700, fontSize: '13px' }}>
                {activeScorecard?.pctUnder45Mins || `${selectedOffice?.pctUnder45Mins}%` || '84%'}
              </span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#DBE5FF', fontSize: '10px', textTransform: 'uppercase' }}>&lt;30m Core Hub</span>
              <span className="tabular-nums" style={{ color: '#10B981', fontWeight: 700, fontSize: '13px' }}>
                {activeScorecard?.pctUnder30Mins || '72%'}
              </span>
            </div>
          </div>

          {/* Scrollable Catchment Analysis Content */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            
            {/* Travel-Time Isochrone Distribution Table */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="colliers-kicker" style={{ color: '#FFFFFF' }}>
                  ISOCHRONE TRAVEL BRACKETS
                </span>
                <span style={{ fontSize: '10px', color: '#DBE5FF' }}>
                  {cityEmployees.length} Staff Total
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {isochroneDist.map((b, idx) => (
                  <div key={idx} style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(219, 229, 255, 0.1)', padding: '10px 12px', borderRadius: 3 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: b.color }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>{b.bracket}</span>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>• {b.tier}</span>
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '12px', fontWeight: 700, color: b.color }}>
                        {b.pct}% <span style={{ fontSize: '10px', fontWeight: 400, color: '#DBE5FF' }}>({b.count} staff)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: 4, width: '100%', backgroundColor: 'rgba(219, 229, 255, 0.12)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.pct}%`, backgroundColor: b.color, borderRadius: 2 }} />
                    </div>

                    <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: 5 }}>
                      {b.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cumulative Accessibility Summary */}
            <div style={{ borderTop: '1px solid rgba(219, 229, 255, 0.14)', padding: '16px 20px', backgroundColor: 'rgba(37, 64, 143, 0.12)' }}>
              <div className="colliers-kicker" style={{ color: '#DBE5FF', marginBottom: 8 }}>
                CUMULATIVE ACCESSIBILITY BENCHMARK
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '11px', color: '#DBE5FF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Within 30-Minute Commute:</span>
                  <strong className="tabular-nums" style={{ color: '#10B981' }}>
                    {activeScorecard?.pctUnder30Mins || '72%'} of workforce
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Within 45-Minute Commute:</span>
                  <strong className="tabular-nums" style={{ color: '#00F5D4' }}>
                    {activeScorecard?.pctUnder45Mins || '84%'} of workforce
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Centroid Proximity:</span>
                  <strong className="tabular-nums" style={{ color: '#FFFFFF' }}>
                    {centroidDistKm !== null ? `${centroidDistKm} km from workforce centroid` : 'Optimally centered'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Catchment Map Display Controls */}
            <div style={{ borderTop: '1px solid rgba(219, 229, 255, 0.14)', padding: '16px 20px' }}>
              <div className="colliers-kicker" style={{ color: '#FFFFFF', marginBottom: 10 }}>
                CATCHMENT DISPLAY TOGGLES
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '11px' }}>
                <label
                  onClick={() => onToggleLayer('isochrones')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#FFFFFF' }}
                >
                  <input
                    type="checkbox"
                    checked={visibleLayers?.isochrones !== false}
                    onChange={() => {}}
                    style={{ accentColor: '#1C54F4', cursor: 'pointer' }}
                  />
                  <span>Show Travel-Time Isochrone Polygons on Map</span>
                </label>

                <label
                  onClick={() => onToggleLayer('centerOfGravity')}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#FFFFFF' }}
                >
                  <input
                    type="checkbox"
                    checked={visibleLayers?.centerOfGravity !== false}
                    onChange={() => {}}
                    style={{ accentColor: '#D97706', cursor: 'pointer' }}
                  />
                  <span>Show Workforce Centroid Indicator (Center of Gravity)</span>
                </label>
              </div>
            </div>

          </div>
        </>
      )}

      {/* =========================================================================
          TAB 3: MARKET ADVISORY VIEW
         ========================================================================= */}
      {activeTab === 'insights' && (
        <>
          {/* Header */}
          <div
            style={{
              padding: '16px 20px 14px 20px',
              borderBottom: '1px solid rgba(219, 229, 255, 0.14)',
              backgroundColor: 'rgba(37, 64, 143, 0.12)'
            }}
          >
            <div className="colliers-kicker" style={{ color: '#DBE5FF', marginBottom: 4 }}>
              COLLIERS CRE LOCATION ADVISORY
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              {selectedCity.name} Commercial Real Estate Brief
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: 2 }}>
              Executive location intelligence &amp; trade-off evaluation
            </div>
          </div>

          {/* Strategic Storyline Brief */}
          <div
            style={{
              padding: '14px 20px',
              backgroundColor: 'rgba(0, 7, 89, 0.5)',
              borderBottom: '1px solid rgba(219, 229, 255, 0.12)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                {currentStory.headline}
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '2px 6px',
                  borderRadius: 2,
                  whiteSpace: 'nowrap'
                }}
              >
                {currentStory.statHighlight}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#DBE5FF', lineHeight: 1.5 }}>
              {currentStory.narrative}
            </div>
          </div>

          {/* Scrollable Ranked Recommendations List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                padding: '12px 20px 8px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(219, 229, 255, 0.1)'
              }}
            >
              <span className="colliers-kicker" style={{ color: '#FFFFFF' }}>
                CANDIDATE PARKS ADVISORY RANKING
              </span>
              <button
                onClick={onOpenComparison}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#38BDF8',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Full Matrix Modal →
              </button>
            </div>

            {/* Ranked Offices */}
            <div>
              {(offices || []).map((office, idx) => {
                const sc = (scorecards || []).find(s => s.officeId === office.id);
                const isSelected = selectedOffice?.id === office.id;
                
                // Advisory rank tag
                let rankLabel = 'Strategic Sub-Market';
                let rankColor = '#94A3B8';
                if (idx === 0) {
                  rankLabel = '★ #1 RECOMMENDED LOCATION';
                  rankColor = '#10B981';
                } else if (idx === 1) {
                  rankLabel = 'TALENT MAGNET';
                  rankColor = '#38BDF8';
                } else if (idx === 2) {
                  rankLabel = 'COST LEADER';
                  rankColor = '#F59E0B';
                }

                return (
                  <div
                    key={office.id}
                    onClick={() => onSelectOffice(office)}
                    className={`colliers-site-row ${isSelected ? 'active' : ''}`}
                    style={{ padding: '12px 16px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: rankColor, letterSpacing: '0.6px' }}>
                        {rankLabel}
                      </span>
                      <span className="tabular-nums" style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                        ₹{office.rentPerSqft}<span style={{ fontSize: '10px', color: '#94A3B8' }}>/sqft</span>
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                      {office.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#DBE5FF', marginTop: 1 }}>
                      {office.microMarket} • {office.grade}
                    </div>

                    {/* Scores row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8, fontSize: '10px', color: '#DBE5FF' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '4px 6px', borderRadius: 2 }}>
                        <div>Commute:</div>
                        <strong style={{ color: '#F59E0B' }}>{sc?.avgCommuteMins || office.avgCommuteMins}m avg</strong>
                      </div>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '4px 6px', borderRadius: 2 }}>
                        <div>Transit Rating:</div>
                        <strong style={{ color: '#00F5D4' }}>{sc?.transitAccessibilityScore || '9.0'}/10</strong>
                      </div>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '4px 6px', borderRadius: 2 }}>
                        <div>ESG Score:</div>
                        <strong style={{ color: '#10B981' }}>{sc?.sustainabilityScore || '8.8'}/10</strong>
                      </div>
                    </div>

                    {sc?.recommendationSummary && (
                      <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: 8, fontStyle: 'italic', lineHeight: 1.4 }}>
                        "{sc.recommendationSummary}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid rgba(219, 229, 255, 0.16)',
              backgroundColor: 'rgba(0, 7, 89, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ fontSize: '11px', color: '#DBE5FF' }}>
              Comparative Decision Matrix
            </div>
            <button
              onClick={onOpenComparison}
              className="colliers-btn-secondary"
              style={{ height: '30px', padding: '0 12px', fontSize: '11px', color: '#FFFFFF', backgroundColor: 'rgba(28, 84, 244, 0.35)' }}
            >
              <span>Open Matrix Modal</span>
              <span>→</span>
            </button>
          </div>
        </>
      )}

      {/* =========================================================================
          TAB 4: WORKFORCE DATABASE VIEW
         ========================================================================= */}
      {activeTab === 'database' && (
        <>
          {/* Header & Search */}
          <div
            style={{
              padding: '16px 20px 14px 20px',
              borderBottom: '1px solid rgba(219, 229, 255, 0.14)',
              backgroundColor: 'rgba(37, 64, 143, 0.12)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div className="colliers-kicker" style={{ color: '#DBE5FF' }}>
                WORKFORCE DATABASE ({filteredEmployees.length})
              </div>
              <span style={{ fontSize: '11px', color: '#DBE5FF' }}>
                Metro: <strong style={{ color: '#FFFFFF' }}>{selectedCity.name}</strong>
              </span>
            </div>

            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Search size={14} color="#DBE5FF" style={{ position: 'absolute', top: 10, left: 10 }} />
              <input
                type="text"
                placeholder="Search name, ID, locality, pincode..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="colliers-input colliers-input-dark"
                style={{ height: '34px', paddingLeft: '32px', fontSize: '12px' }}
              />
              {employeeSearch && (
                <button
                  onClick={() => setEmployeeSearch('')}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'transparent',
                    border: 'none',
                    color: '#DBE5FF',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Commute Mode Filter Pills */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
              {['ALL', 'Metro', 'Bus', 'Two-Wheeler', 'Car'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setSelectedModeFilter(mode)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '10px',
                    borderRadius: 2,
                    border: selectedModeFilter === mode ? '1px solid #1C54F4' : '1px solid rgba(219, 229, 255, 0.2)',
                    backgroundColor: selectedModeFilter === mode ? 'rgba(28, 84, 244, 0.35)' : 'transparent',
                    color: selectedModeFilter === mode ? '#FFFFFF' : '#DBE5FF',
                    cursor: 'pointer',
                    fontWeight: selectedModeFilter === mode ? 600 : 400
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Commute Duration Filter Pills */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['ALL', '<30m', '30-45m', '>45m'].map(dur => (
                <button
                  key={dur}
                  onClick={() => setSelectedDurationFilter(dur)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '10px',
                    borderRadius: 2,
                    border: selectedDurationFilter === dur ? '1px solid #10B981' : '1px solid rgba(219, 229, 255, 0.2)',
                    backgroundColor: selectedDurationFilter === dur ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                    color: selectedDurationFilter === dur ? '#FFFFFF' : '#DBE5FF',
                    cursor: 'pointer',
                    fontWeight: selectedDurationFilter === dur ? 600 : 400
                  }}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Active Employee Single Isolation Banner */}
          {selectedEmployee && (
            <div
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(5, 150, 105, 0.2)',
                borderBottom: '1px solid rgba(5, 150, 105, 0.4)',
                borderLeft: '3px solid #10B981',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>
                  DOORSTEP ROUTE ISOLATED
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>
                  {selectedEmployee.fullName} ({selectedEmployee.employeeId})
                </div>
              </div>
              <button
                onClick={() => onSelectEmployee(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#DBE5FF',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear Focus
              </button>
            </div>
          )}

          {/* Scrollable List of Filtered Employees */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                padding: '8px 16px',
                fontSize: '10px',
                color: '#94A3B8',
                borderBottom: '1px solid rgba(219, 229, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>Click any record to isolate route on map</span>
              <span className="tabular-nums">Showing {filteredEmployees.length} of {cityEmployees.length}</span>
            </div>

            <div>
              {filteredEmployees.slice(0, 100).map((emp) => {
                const isSelected = selectedEmployee?.employeeId === emp.employeeId;

                // Mode icon or badge
                const modeLower = (emp.commuteMode || '').toLowerCase();
                const isRail = modeLower.includes('metro') || modeLower.includes('train');
                const isBus = modeLower.includes('bus');

                return (
                  <div
                    key={emp.employeeId}
                    onClick={() => {
                      if (isSelected) {
                        onSelectEmployee(null);
                      } else {
                        onSelectEmployee(emp);
                      }
                    }}
                    className={`colliers-site-row ${isSelected ? 'active' : ''}`}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: isSelected ? 'rgba(5, 150, 105, 0.25)' : 'transparent',
                      borderLeft: isSelected ? '3px solid #10B981' : '3px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                          {emp.fullName}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: 1 }}>
                          {emp.employeeId} • {emp.department}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: emp.commuteDurationMins <= 30 ? '#10B981' : emp.commuteDurationMins <= 45 ? '#1C54F4' : '#E11D48'
                          }}
                        >
                          {emp.commuteDurationMins}m
                        </span>
                        <div className="tabular-nums" style={{ fontSize: '10px', color: '#94A3B8' }}>
                          {emp.commuteDistanceKm} km
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <div style={{ fontSize: '11px', color: '#DBE5FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                        {emp.residentialLocality || emp.residentialAddress}
                      </div>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: 2,
                          backgroundColor: isRail ? 'rgba(0, 245, 212, 0.15)' : isBus ? 'rgba(245, 158, 11, 0.15)' : 'rgba(28, 84, 244, 0.15)',
                          color: isRail ? '#00F5D4' : isBus ? '#F59E0B' : '#38BDF8',
                          border: '1px solid rgba(255, 255, 255, 0.12)'
                        }}
                      >
                        {emp.commuteMode}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredEmployees.length > 100 && (
              <div style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', color: '#94A3B8' }}>
                Showing first 100 matching staff. Use search or open master spreadsheet for full dataset.
              </div>
            )}
          </div>

          {/* Master Spreadsheet Overlay Access Button */}
          {onOpenDatabase && (
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid rgba(219, 229, 255, 0.16)',
                backgroundColor: 'rgba(0, 7, 89, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#FFFFFF' }}>
                  Full 1,500 Workforce Grid
                </div>
                <div style={{ fontSize: '10px', color: '#DBE5FF' }}>
                  Master Spreadsheet &amp; Analytics
                </div>
              </div>
              <button
                onClick={onOpenDatabase}
                className="colliers-btn-secondary"
                style={{ height: '28px', padding: '0 10px', fontSize: '11px', color: '#FFFFFF', backgroundColor: 'rgba(28, 84, 244, 0.35)' }}
              >
                <span>Spreadsheet</span>
                <span>→</span>
              </button>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
