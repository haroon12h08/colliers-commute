import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Download,
  Filter,
  BarChart2,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building,
  Users,
  Clock,
  Navigation,
  Leaf,
  IndianRupee,
  Star,
  MapPin,
  Car,
  Bike,
  Train,
  Bus,
  X,
  FileSpreadsheet,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react';
import { WORKFORCE_1500, calculateWorkforceStats, exportToCsvClient } from '../data/workforceData';
import AnalyticsDashboard from './AnalyticsDashboard';

export default function WorkforceDatabase({ selectedCity, onSelectCity, onBackToMap, onSelectEmployee }) {
  // Pre-load all 1,500 employees immediately
  const [workforce, setWorkforce] = useState(WORKFORCE_1500);
  const [stats, setStats] = useState(() => calculateWorkforceStats(WORKFORCE_1500));

  // Filters
  const [filterCity, setFilterCity] = useState('ALL');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterMode, setFilterMode] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting
  const [sortField, setSortField] = useState('employeeId');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Detail Modal
  const [selectedRecord, setSelectedRecord] = useState(null);

  // View Mode: 'all' (Dashboard + Spreadsheet), 'dashboard' (Charts & Graphs only), 'grid' (Spreadsheet only)
  const [viewMode, setViewMode] = useState('all');

  // Fetch optional sync from backend if online
  useEffect(() => {
    fetch(`/api/v1/commute/workforce?cityCode=${filterCity}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setWorkforce(data);
          setStats(calculateWorkforceStats(data));
        }
      })
      .catch(() => {});
  }, [filterCity]);

  // Recalculate stats when city changes locally
  useEffect(() => {
    const cityRecords = filterCity === 'ALL'
      ? WORKFORCE_1500
      : WORKFORCE_1500.filter(r => r.cityCode === filterCity);
    setStats(calculateWorkforceStats(cityRecords));
  }, [filterCity]);

  // Unique Departments
  const departments = useMemo(() => {
    const set = new Set();
    WORKFORCE_1500.forEach(w => set.add(w.department));
    return Array.from(set);
  }, []);

  // Unique Commute Modes
  const commuteModes = useMemo(() => {
    const set = new Set();
    WORKFORCE_1500.forEach(w => set.add(w.commuteMode));
    return Array.from(set);
  }, []);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return workforce.filter(item => {
      if (filterCity !== 'ALL' && item.cityCode !== filterCity) return false;
      if (filterDept !== 'ALL' && item.department !== filterDept) return false;
      if (filterMode !== 'ALL' && item.commuteMode !== filterMode) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches =
          item.fullName.toLowerCase().includes(q) ||
          item.employeeId.toLowerCase().includes(q) ||
          item.residentialLocality.toLowerCase().includes(q) ||
          (item.residentialAddress && item.residentialAddress.toLowerCase().includes(q)) ||
          item.pinCode.includes(q) ||
          item.assignedOffice.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [workforce, filterCity, filterDept, filterMode, searchQuery]);

  // Sorting Logic
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDownloadCsv = () => {
    exportToCsvClient(sortedData, `colliers_workforce_${filterCity.toLowerCase()}_${sortedData.length}.csv`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 'calc(100vh - 56px)',
        backgroundColor: '#F8F9FA',
        color: '#272B30',
        overflow: 'hidden'
      }}
    >
      {/* 1. Sub-Header Toolbar (Restrained 52px enterprise bar) */}
      <div
        style={{
          height: '52px',
          padding: '0 20px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #CCCDD5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              color: '#000759',
              borderRight: '1px solid #CCCDD5',
              paddingRight: 14
            }}
          >
            Workforce Database
          </span>
          <span style={{ fontSize: '12px', color: '#525255', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981' }} />
            1,500 Occupier Records (500 Chennai • 500 Bengaluru • 500 Mumbai)
          </span>
        </div>

        {/* View Switchers & Export Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="colliers-btn-secondary"
              style={{ height: '32px', fontSize: '11px', padding: '0 12px', color: '#000759', borderColor: '#CCCDD5' }}
            >
              <span>Back to GIS Map</span>
            </button>
          )}

          {/* View Mode Tabs (Visual Analytics vs Spreadsheet vs Unified) */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#F5F5F7',
              padding: 2,
              borderRadius: 3,
              border: '1px solid #CCCDD5'
            }}
          >
            {[
              { id: 'all', label: 'Unified View' },
              { id: 'dashboard', label: 'Analytics' },
              { id: 'grid', label: 'Spreadsheet' }
            ].map(m => {
              const active = viewMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setViewMode(m.id)}
                  style={{
                    height: '28px',
                    padding: '0 10px',
                    borderRadius: 2,
                    border: 'none',
                    backgroundColor: active ? '#25408F' : 'transparent',
                    color: active ? '#FFFFFF' : '#525255',
                    fontSize: '11px',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleDownloadCsv}
            className="colliers-btn-primary"
            style={{
              height: '32px',
              padding: '0 14px',
              fontSize: '11px',
              backgroundColor: '#000759'
            }}
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Main Scrollable Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* COMPREHENSIVE CHARTS & VISUALIZATIONS SUITE */}
        {(viewMode === 'all' || viewMode === 'dashboard') && (
          <AnalyticsDashboard
            records={filteredData}
            stats={stats}
            filterCity={filterCity}
            setFilterCity={setFilterCity}
          />
        )}

        {/* SPREADSHEET GRID SECTION */}
        {(viewMode === 'all' || viewMode === 'grid') && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 3,
              border: '1px solid #CCCDD5',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header / Filter Bar */}
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid #CCCDD5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
                backgroundColor: '#F8F9FA'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#000759' }}>
                  Occupier Mobility Register
                </span>
                <span style={{ fontSize: '11px', color: '#7A7B80', fontVariantNumeric: 'tabular-nums' }}>
                  ({sortedData.length.toLocaleString()} matching records)
                </span>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {/* Firm / City Filter */}
                <div style={{ display: 'flex', backgroundColor: '#FFFFFF', border: '1px solid #CCCDD5', borderRadius: 3, overflow: 'hidden' }}>
                  {[
                    { code: 'ALL', label: 'All' },
                    { code: 'CHE', label: 'Chennai' },
                    { code: 'BLR', label: 'Bengaluru' },
                    { code: 'BOM', label: 'Mumbai' }
                  ].map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setFilterCity(c.code);
                        setCurrentPage(1);
                      }}
                      style={{
                        height: '28px',
                        padding: '0 8px',
                        border: 'none',
                        borderRight: '1px solid #EBEBEE',
                        backgroundColor: filterCity === c.code ? '#25408F' : '#FFFFFF',
                        color: filterCity === c.code ? '#FFFFFF' : '#272B30',
                        fontSize: '11px',
                        fontWeight: filterCity === c.code ? 600 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Department Filter */}
                <select
                  value={filterDept}
                  onChange={(e) => {
                    setFilterDept(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    height: '28px',
                    padding: '0 8px',
                    borderRadius: 3,
                    border: '1px solid #CCCDD5',
                    fontSize: '11px',
                    color: '#272B30',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    fontWeight: 500
                  }}
                >
                  <option value="ALL">All Departments ({departments.length})</option>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {/* Commute Mode Filter */}
                <select
                  value={filterMode}
                  onChange={(e) => {
                    setFilterMode(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    height: '28px',
                    padding: '0 8px',
                    borderRadius: 3,
                    border: '1px solid #CCCDD5',
                    fontSize: '11px',
                    color: '#272B30',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    fontWeight: 500
                  }}
                >
                  <option value="ALL">All Transit Modes ({commuteModes.length})</option>
                  {commuteModes.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                {/* Search */}
                <div style={{ position: 'relative', width: 200 }}>
                  <Search size={13} color="#7A7B80" style={{ position: 'absolute', top: 7, left: 8 }} />
                  <input
                    type="text"
                    placeholder="Search name, locality, PIN..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{
                      height: '28px',
                      width: '100%',
                      padding: '0 8px 0 26px',
                      borderRadius: 3,
                      border: '1px solid #CCCDD5',
                      fontSize: '11px',
                      outline: 'none',
                      color: '#272B30'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Table Spreadsheet View (Strict 40px row height, tabular numerals) */}
            <div style={{ overflowX: 'auto', minHeight: 380 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F5F5F7', color: '#525255', borderBottom: '1px solid #CCCDD5', height: '36px', userSelect: 'none' }}>
                    <th onClick={() => handleSort('employeeId')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>EMP ID</span>
                        <ArrowUpDown size={11} color={sortField === 'employeeId' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('fullName')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>FULL NAME</span>
                        <ArrowUpDown size={11} color={sortField === 'fullName' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('cityCode')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>METRO</span>
                        <ArrowUpDown size={11} color={sortField === 'cityCode' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('department')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>DEPARTMENT</span>
                        <ArrowUpDown size={11} color={sortField === 'department' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('assignedOffice')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>ASSIGNED OFFICE</span>
                        <ArrowUpDown size={11} color={sortField === 'assignedOffice' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('residentialLocality')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>RESIDENTIAL ORIGIN</span>
                        <ArrowUpDown size={11} color={sortField === 'residentialLocality' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('commuteMode')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>MODE</span>
                        <ArrowUpDown size={11} color={sortField === 'commuteMode' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('commuteDistanceKm')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', textAlign: 'right', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        <span>DISTANCE</span>
                        <ArrowUpDown size={11} color={sortField === 'commuteDistanceKm' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('commuteDurationMins')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', textAlign: 'right', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        <span>DURATION</span>
                        <ArrowUpDown size={11} color={sortField === 'commuteDurationMins' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('monthlyCarbonKg')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', textAlign: 'right', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        <span>CARBON (MO)</span>
                        <ArrowUpDown size={11} color={sortField === 'monthlyCarbonKg' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                    <th onClick={() => handleSort('monthlyCommuteCostInr')} style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', textAlign: 'right', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        <span>SPEND (MO)</span>
                        <ArrowUpDown size={11} color={sortField === 'monthlyCommuteCostInr' ? '#1C54F4' : '#CCCDD5'} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={row.employeeId}
                        onClick={() => setSelectedRecord(row)}
                        style={{
                          height: '40px',
                          backgroundColor: isEven ? '#FFFFFF' : '#FAFAFC',
                          borderBottom: '1px solid #EBEBEE',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDF2FF'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isEven ? '#FFFFFF' : '#FAFAFC'}
                      >
                        <td style={{ padding: '0 12px', fontWeight: 600, color: '#1C54F4', fontFamily: 'monospace', fontSize: '11px' }}>
                          {row.employeeId}
                        </td>
                        <td style={{ padding: '0 12px', fontWeight: 600, color: '#000759' }}>
                          {row.fullName}
                        </td>
                        <td style={{ padding: '0 12px', color: '#525255', fontWeight: 500 }}>
                          {row.cityCode}
                        </td>
                        <td style={{ padding: '0 12px', color: '#272B30' }}>
                          {row.department}
                        </td>
                        <td style={{ padding: '0 12px', color: '#525255' }}>
                          {row.assignedOffice}
                        </td>
                        <td style={{ padding: '0 12px', color: '#272B30' }}>
                          <span>{row.residentialLocality}</span>
                          <span style={{ fontSize: '10px', color: '#7A7B80', marginLeft: 4 }}>({row.pinCode})</span>
                        </td>
                        <td style={{ padding: '0 12px', color: '#000759', fontWeight: 500 }}>
                          {row.commuteMode}
                        </td>
                        <td style={{ padding: '0 12px', textAlign: 'right', fontWeight: 600, color: '#272B30', fontVariantNumeric: 'tabular-nums' }}>
                          {row.commuteDistanceKm} km
                        </td>
                        <td style={{ padding: '0 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          <span
                            style={{
                              fontWeight: 600,
                              color: row.commuteDurationMins <= 30 ? '#059669' : row.commuteDurationMins <= 45 ? '#1C54F4' : '#DC2626'
                            }}
                          >
                            {row.commuteDurationMins}m
                          </span>
                        </td>
                        <td style={{ padding: '0 12px', textAlign: 'right', color: '#525255', fontVariantNumeric: 'tabular-nums' }}>
                          {row.monthlyCarbonKg} kg
                        </td>
                        <td style={{ padding: '0 12px', textAlign: 'right', fontWeight: 600, color: '#000759', fontVariantNumeric: 'tabular-nums' }}>
                          ₹{row.monthlyCommuteCostInr.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div
              style={{
                height: '40px',
                padding: '0 14px',
                borderTop: '1px solid #CCCDD5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                fontSize: '11px',
                color: '#525255'
              }}
            >
              <div>
                Showing <strong style={{ color: '#000759' }}>{sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong>–<strong style={{ color: '#000759' }}>{Math.min(currentPage * pageSize, sortedData.length)}</strong> of <strong style={{ color: '#000759' }}>{sortedData.length.toLocaleString()}</strong> employees
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Page Size Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Rows:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ height: '24px', padding: '0 4px', borderRadius: 3, border: '1px solid #CCCDD5', fontSize: '11px' }}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                {/* Page Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    style={{
                      height: '24px',
                      padding: '0 6px',
                      borderRadius: 3,
                      border: '1px solid #CCCDD5',
                      backgroundColor: '#FFFFFF',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.4 : 1
                    }}
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <span style={{ padding: '0 6px', fontWeight: 600, color: '#000759', fontVariantNumeric: 'tabular-nums' }}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    style={{
                      height: '24px',
                      padding: '0 6px',
                      borderRadius: 3,
                      border: '1px solid #CCCDD5',
                      backgroundColor: '#FFFFFF',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.4 : 1
                    }}
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. Employee Detail Modal Drawer (Restrained Enterprise Dossier) */}
      {selectedRecord && (
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
          onClick={() => setSelectedRecord(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 540,
              backgroundColor: '#FFFFFF',
              borderRadius: 4,
              boxShadow: '0 16px 36px rgba(0,7,89,0.22)',
              overflow: 'hidden',
              border: '1px solid #CCCDD5'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: '#000759',
                borderTop: '3px solid #1C54F4',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <span style={{ fontSize: '10px', color: '#DBE5FF', letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: 700 }}>
                  COLLIERS OCCUPIER RECORD • {selectedRecord.employeeId}
                </span>
                <h2 style={{ fontSize: '17px', fontWeight: 700, margin: '3px 0 1px 0' }}>
                  {selectedRecord.fullName}
                </h2>
                <div style={{ fontSize: '11px', color: '#DBE5FF' }}>
                  {selectedRecord.jobTitle} • {selectedRecord.department}
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: 2, opacity: 0.85 }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '11.5px' }}>
                <div style={{ backgroundColor: '#F8F9FA', padding: '10px 12px', borderRadius: 3, border: '1px solid #EBEBEE' }}>
                  <span style={{ fontSize: '10px', color: '#7A7B80', textTransform: 'uppercase', display: 'block' }}>Entity / Firm</span>
                  <strong style={{ fontSize: '12px', color: '#000759' }}>{selectedRecord.firmName}</strong>
                </div>
                <div style={{ backgroundColor: '#F8F9FA', padding: '10px 12px', borderRadius: 3, border: '1px solid #EBEBEE' }}>
                  <span style={{ fontSize: '10px', color: '#7A7B80', textTransform: 'uppercase', display: 'block' }}>Assigned Campus</span>
                  <strong style={{ fontSize: '12px', color: '#000759' }}>{selectedRecord.assignedOffice}</strong>
                </div>
                <div style={{ backgroundColor: '#F8F9FA', padding: '10px 12px', borderRadius: 3, border: '1px solid #EBEBEE', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '10px', color: '#7A7B80', textTransform: 'uppercase', display: 'block' }}>Residential Address</span>
                  <strong style={{ fontSize: '12px', color: '#000759' }}>
                    {selectedRecord.residentialAddress || `${selectedRecord.residentialLocality}, PIN ${selectedRecord.pinCode}`}
                  </strong>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #EBEBEE', paddingTop: 12 }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#000759', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.5px' }}>
                  Commute &amp; ESG Metrics
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
                  <div style={{ border: '1px solid #EBEBEE', padding: '8px 6px', borderRadius: 3, backgroundColor: '#FAFAFC' }}>
                    <span style={{ fontSize: '10px', color: '#7A7B80', display: 'block' }}>Mode</span>
                    <strong style={{ fontSize: '12px', color: '#1C54F4' }}>{selectedRecord.commuteMode}</strong>
                  </div>
                  <div style={{ border: '1px solid #EBEBEE', padding: '8px 6px', borderRadius: 3, backgroundColor: '#FAFAFC' }}>
                    <span style={{ fontSize: '10px', color: '#7A7B80', display: 'block' }}>One-Way Route</span>
                    <strong style={{ fontSize: '12px', color: '#000759' }}>{selectedRecord.commuteDurationMins}m ({selectedRecord.commuteDistanceKm}km)</strong>
                  </div>
                  <div style={{ border: '1px solid #EBEBEE', padding: '8px 6px', borderRadius: 3, backgroundColor: '#FAFAFC' }}>
                    <span style={{ fontSize: '10px', color: '#7A7B80', display: 'block' }}>Monthly Carbon</span>
                    <strong style={{ fontSize: '12px', color: '#059669' }}>{selectedRecord.monthlyCarbonKg} kg</strong>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#EDF2FF', padding: '10px 12px', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#000759', fontWeight: 600, display: 'block' }}>
                    Work Schedule: {selectedRecord.workModel}
                  </span>
                  <span style={{ fontSize: '11px', color: '#525255' }}>
                    Monthly Travel Spend: ₹{selectedRecord.monthlyCommuteCostInr.toLocaleString()}
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#1C54F4' }}>
                  Score: {selectedRecord.satisfactionScore}/5 ★
                </span>
              </div>
            </div>

            <div style={{ padding: '10px 20px', backgroundColor: '#F8F9FA', borderTop: '1px solid #CCCDD5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setSelectedRecord(null)}
                className="colliers-btn-secondary"
                style={{ height: '32px', padding: '0 12px', fontSize: '11px', color: '#000759', borderColor: '#CCCDD5' }}
              >
                Close Profile
              </button>
              {onSelectEmployee && (
                <button
                  onClick={() => {
                    const rec = selectedRecord;
                    setSelectedRecord(null);
                    onSelectEmployee(rec);
                  }}
                  className="colliers-btn-primary"
                  style={{ height: '32px', padding: '0 14px', fontSize: '11px', backgroundColor: '#000759', color: '#FFFFFF' }}
                >
                  <span>Track Real Path on Map</span>
                  <span>—</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
