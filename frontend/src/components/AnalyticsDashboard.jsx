import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart
} from 'recharts';
import {
  Users,
  Clock,
  Navigation,
  Leaf,
  IndianRupee,
  Building,
  TrendingDown,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';

const COLORS = [
  '#000759', // Primary Deep Blue
  '#25408F', // Primary Dark Blue
  '#1C54F4', // Primary Medium Blue
  '#059669', // Emerald / ESG
  '#D97706', // Amber / Warning
  '#56648F'  // Dark Blue Grey
];

export default function AnalyticsDashboard({ records, stats, filterCity, setFilterCity }) {
  if (!records || records.length === 0 || !stats) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: '12px', color: '#7A7B80' }}>Loading analytics...</div>;
  }

  // 1. Commute Duration Histogram Data
  const durationData = [
    { range: '< 15m', count: records.filter(r => r.commuteDurationMins < 15).length, fill: '#059669' },
    { range: '15–30m', count: records.filter(r => r.commuteDurationMins >= 15 && r.commuteDurationMins < 30).length, fill: '#10B981' },
    { range: '30–45m', count: records.filter(r => r.commuteDurationMins >= 30 && r.commuteDurationMins <= 45).length, fill: '#1C54F4' },
    { range: '45–60m', count: records.filter(r => r.commuteDurationMins > 45 && r.commuteDurationMins <= 60).length, fill: '#D97706' },
    { range: '> 60m', count: records.filter(r => r.commuteDurationMins > 60).length, fill: '#DC2626' }
  ];

  // 2. Metro Comparison Data (Chennai vs Bengaluru vs Mumbai)
  const metroData = ['CHE', 'BLR', 'BOM'].map(code => {
    const cityRecords = records.filter(r => r.cityCode === code);
    const count = cityRecords.length || 1;
    const avgTime = Math.round(cityRecords.reduce((acc, r) => acc + r.commuteDurationMins, 0) / count);
    const avgDist = Math.round((cityRecords.reduce((acc, r) => acc + r.commuteDistanceKm, 0) / count) * 10) / 10;
    const avgCost = Math.round(cityRecords.reduce((acc, r) => acc + r.monthlyCommuteCostInr, 0) / count);
    const totalCarbonTons = Math.round(cityRecords.reduce((acc, r) => acc + r.monthlyCarbonKg, 0) / 100) / 10;

    const names = { CHE: 'Chennai', BLR: 'Bengaluru', BOM: 'Mumbai' };
    return {
      city: names[code],
      code,
      avgTime,
      avgDist,
      avgCost,
      totalCarbonTons,
      headcount: cityRecords.length
    };
  });

  // 3. Transit Mode Split Pie Data
  const modeData = Object.entries(stats.modeBreakdown || {}).map(([name, value]) => ({
    name,
    value
  }));

  // 4. Department Comparison: Commute Time vs Satisfaction
  const deptsMap = {};
  records.forEach(r => {
    if (!deptsMap[r.department]) {
      deptsMap[r.department] = { dept: r.department, count: 0, totalMins: 0, totalSat: 0, totalCost: 0 };
    }
    deptsMap[r.department].count++;
    deptsMap[r.department].totalMins += r.commuteDurationMins;
    deptsMap[r.department].totalSat += r.satisfactionScore;
    deptsMap[r.department].totalCost += r.monthlyCommuteCostInr;
  });

  const departmentData = Object.values(deptsMap).map(d => ({
    name: d.dept.replace('Services', 'Svc').replace('Management', 'Mgmt').replace('Operations', 'Ops'),
    avgDuration: Math.round(d.totalMins / d.count),
    satisfaction: Math.round((d.totalSat / d.count) * 10) / 10,
    headcount: d.count,
    avgCost: Math.round(d.totalCost / d.count)
  })).sort((a, b) => b.avgDuration - a.avgDuration);

  // 5. Commute Distance Tiers vs Cost & Carbon Progression
  const distanceTiers = [
    { tier: '0–5 km', min: 0, max: 5 },
    { tier: '5–10 km', min: 5, max: 10 },
    { tier: '10–15 km', min: 10, max: 15 },
    { tier: '15–20 km', min: 15, max: 20 },
    { tier: '20–25 km', min: 20, max: 25 },
    { tier: '25–30 km', min: 25, max: 30 },
    { tier: '> 30 km', min: 30, max: 999 }
  ].map(t => {
    const tierRecords = records.filter(r => r.commuteDistanceKm >= t.min && r.commuteDistanceKm < t.max);
    const count = tierRecords.length || 1;
    const avgCost = Math.round(tierRecords.reduce((acc, r) => acc + r.monthlyCommuteCostInr, 0) / count);
    const avgMins = Math.round(tierRecords.reduce((acc, r) => acc + r.commuteDurationMins, 0) / count);
    const avgCarbon = Math.round((tierRecords.reduce((acc, r) => acc + r.monthlyCarbonKg, 0) / count) * 10) / 10;
    return {
      tier: t.tier,
      avgCost,
      avgMins,
      avgCarbon,
      headcount: tierRecords.length
    };
  });

  // 6. Top 8 Residential Origin Clusters
  const locMap = {};
  records.forEach(r => {
    const key = `${r.residentialLocality} (${r.cityCode})`;
    if (!locMap[key]) {
      locMap[key] = { locality: key, name: r.residentialLocality, count: 0, totalMins: 0, city: r.cityCode };
    }
    locMap[key].count++;
    locMap[key].totalMins += r.commuteDurationMins;
  });

  const topLocalities = Object.values(locMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map(l => ({
      locality: l.locality,
      employees: l.count,
      avgCommute: Math.round(l.totalMins / l.count)
    }));

  // 7. Work Model Schedule Policy Split
  const workModelData = Object.entries(stats.workModelBreakdown || {}).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* 1. Headline Executive Summary Banner */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: '#000759',
          color: '#FFFFFF',
          borderLeft: '4px solid #1C54F4',
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div>
          <div className="colliers-kicker" style={{ color: '#DBE5FF', marginBottom: 2 }}>
            COLLIERS RESEARCH &amp; VALUATION ADVISORY
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '-0.2px' }}>
            Workforce Commute Catchment &amp; ESG Mobility Benchmarks
          </h2>
          <p style={{ fontSize: '12px', color: '#DBE5FF', margin: '3px 0 0 0', fontWeight: 400 }}>
            Analysis across {records.length.toLocaleString()} corporate occupier profiles in Chennai, Bengaluru, and Mumbai.
          </p>
        </div>

        {/* Firm Filter Buttons */}
        <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.12)', padding: 2, borderRadius: 3 }}>
          {[
            { code: 'ALL', label: 'All Firms' },
            { code: 'CHE', label: 'Chennai' },
            { code: 'BLR', label: 'Bengaluru' },
            { code: 'BOM', label: 'Mumbai' }
          ].map(c => (
            <button
              key={c.code}
              onClick={() => setFilterCity(c.code)}
              style={{
                height: '28px',
                padding: '0 10px',
                borderRadius: 2,
                border: 'none',
                backgroundColor: filterCity === c.code ? '#1C54F4' : 'transparent',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: filterCity === c.code ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top 5 KPI Summary Cards (Flat, 0-3px radius, tabular numbers, subtle borders) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: 3, border: '1px solid #CCCDD5', borderTop: '3px solid #000759' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7A7B80', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Workforce Analyzed</span>
            <Users size={14} color="#000759" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#000759', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
            {records.length.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#525255', marginTop: 2 }}>
            Active occupier profiles
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: 3, border: '1px solid #CCCDD5', borderTop: '3px solid #25408F' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7A7B80', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Avg Commute Duration</span>
            <Clock size={14} color="#25408F" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#000759', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
            {stats.avgCommuteMinutes} <span style={{ fontSize: '12px', fontWeight: 400, color: '#7A7B80' }}>mins</span>
          </div>
          <div style={{ fontSize: '11px', color: '#525255', marginTop: 2 }}>
            One-way door-to-desk
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: 3, border: '1px solid #CCCDD5', borderTop: '3px solid #1C54F4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7A7B80', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Avg Travel Distance</span>
            <Navigation size={14} color="#1C54F4" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#000759', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
            {stats.avgCommuteDistanceKm} <span style={{ fontSize: '12px', fontWeight: 400, color: '#7A7B80' }}>km</span>
          </div>
          <div style={{ fontSize: '11px', color: '#525255', marginTop: 2 }}>
            Radial catchment spread
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: 3, border: '1px solid #CCCDD5', borderTop: '3px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7A7B80', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Fleet Monthly Carbon</span>
            <Leaf size={14} color="#059669" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#000759', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
            {(stats.totalMonthlyCarbonKg / 1000).toFixed(1)} <span style={{ fontSize: '12px', fontWeight: 400, color: '#7A7B80' }}>tons</span>
          </div>
          <div style={{ fontSize: '11px', color: '#059669', marginTop: 2, fontWeight: 500 }}>
            Scope 3 commuter footprint
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: 3, border: '1px solid #CCCDD5', borderTop: '3px solid #56648F' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7A7B80', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Monthly Travel Spend</span>
            <IndianRupee size={14} color="#56648F" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#000759', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
            ₹{stats.avgMonthlyCostInr.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#525255', marginTop: 2 }}>
            Average expense per occupier
          </div>
        </div>
      </div>

      {/* 3. ROW A: Commute Duration Histogram & Metro Benchmark Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Chart 1: Commute Duration Histogram */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #CCCDD5', padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#000759', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Commute Duration Distribution
              </h3>
              <p style={{ fontSize: '11px', color: '#7A7B80', margin: '2px 0 0 0' }}>
                Headcount spread across 15-minute catchment brackets
              </p>
            </div>
            <span style={{ fontSize: '11px', backgroundColor: '#EDF2FF', color: '#1C54F4', padding: '2px 6px', borderRadius: 2, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {records.filter(r => r.commuteDurationMins <= 45).length} under 45m ({Math.round(records.filter(r => r.commuteDurationMins <= 45).length / records.length * 100)}%)
            </span>
          </div>

          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#EBEBEE" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#525255' }} axisLine={{ stroke: '#CCCDD5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#525255' }} axisLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} Employees (${Math.round(val / records.length * 100)}%)`, 'Occupiers']}
                  contentStyle={{ backgroundColor: '#000759', color: '#FFFFFF', border: 'none', borderRadius: 3, fontSize: '11px' }}
                  itemStyle={{ color: '#FFFFFF' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {durationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Regional Metro Benchmark Comparison */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #CCCDD5', padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#000759', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Metro Regional Benchmark (Chennai vs BLR vs Mumbai)
              </h3>
              <p style={{ fontSize: '11px', color: '#7A7B80', margin: '2px 0 0 0' }}>
                Comparative commute duration (mins) and travel distance (km)
              </p>
            </div>
          </div>

          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metroData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#EBEBEE" />
                <XAxis dataKey="city" tick={{ fontSize: 11, fill: '#525255' }} axisLine={{ stroke: '#CCCDD5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#525255' }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000759', color: '#FFFFFF', border: 'none', borderRadius: 3, fontSize: '11px' }}
                  itemStyle={{ color: '#FFFFFF' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="avgTime" name="Avg Commute (mins)" fill="#25408F" radius={[2, 2, 0, 0]} />
                <Bar dataKey="avgDist" name="Avg Distance (km)" fill="#1C54F4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. ROW B: Transit Mode Modal Split, Schedule Policy, Top Neighborhoods */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 16 }}>
        {/* Chart 3: Modal Split Donut */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #CCCDD5', padding: '16px 18px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#000759', margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Transit Mode Split
          </h3>
          <p style={{ fontSize: '11px', color: '#7A7B80', margin: '0 0 10px 0' }}>
            Modal share across active workforce
          </p>

          <div style={{ height: 210, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {modeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val} (${Math.round(val / records.length * 100)}%)`, 'Occupiers']}
                  contentStyle={{ backgroundColor: '#000759', color: '#FFFFFF', border: 'none', borderRadius: 3, fontSize: '11px' }}
                  itemStyle={{ color: '#FFFFFF' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} layout="horizontal" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Workplace Schedule Policy Split */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #CCCDD5', padding: '16px 18px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#000759', margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Workplace Model Split
          </h3>
          <p style={{ fontSize: '11px', color: '#7A7B80', margin: '0 0 10px 0' }}>
            Office occupancy schedule distribution
          </p>

          <div style={{ height: 210, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workModelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  <Cell fill="#000759" />
                  <Cell fill="#1C54F4" />
                  <Cell fill="#56648F" />
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val} Employees`, 'Occupiers']}
                  contentStyle={{ backgroundColor: '#000759', color: '#FFFFFF', border: 'none', borderRadius: 3, fontSize: '11px' }}
                  itemStyle={{ color: '#FFFFFF' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Top 8 Residential Origin Clusters */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #CCCDD5', padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#000759', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Top Residential Hubs
              </h3>
              <p style={{ fontSize: '11px', color: '#7A7B80', margin: '2px 0 0 0' }}>
                Ranked by employee workforce density
              </p>
            </div>
            <span style={{ fontSize: '10px', color: '#7A7B80', textTransform: 'uppercase' }}>Avg Travel</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {topLocalities.map((item, idx) => (
              <div key={idx} style={{ fontSize: '11.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontWeight: 500, color: '#272B30' }}>
                    {idx + 1}. {item.locality}
                  </span>
                  <span style={{ color: '#525255', fontVariantNumeric: 'tabular-nums' }}>
                    <strong style={{ color: '#000759' }}>{item.employees}</strong> emps • {item.avgCommute}m
                  </span>
                </div>
                <div style={{ height: 4, backgroundColor: '#EDF2FF', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(item.employees / topLocalities[0].employees) * 100}%`,
                      height: '100%',
                      backgroundColor: idx === 0 ? '#1C54F4' : '#56648F',
                      borderRadius: 2
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. ROW C: Distance Progression Area Chart & Department Friction Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* Chart 6: Distance Tiers vs Cost & Carbon Progression Area Chart */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #CCCDD5', padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#000759', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Distance Progression Curve (Spend vs Travel Time)
              </h3>
              <p style={{ fontSize: '11px', color: '#7A7B80', margin: '2px 0 0 0' }}>
                How monthly commute spend (₹) and duration scale with radial distance
              </p>
            </div>
          </div>

          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={distanceTiers} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#EBEBEE" />
                <XAxis dataKey="tier" tick={{ fontSize: 11, fill: '#525255' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#525255' }} orientation="left" />
                <YAxis yAxisId="right" tick={{ fontSize: 11, fill: '#525255' }} orientation="right" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000759', color: '#FFFFFF', border: 'none', borderRadius: 3, fontSize: '11px' }}
                  itemStyle={{ color: '#FFFFFF' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area yAxisId="left" type="monotone" dataKey="avgCost" name="Monthly Spend (₹)" fill="#DBE5FF" stroke="#1C54F4" />
                <Line yAxisId="right" type="monotone" dataKey="avgMins" name="Travel Duration (mins)" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Departmental Commute Friction */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #CCCDD5', padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#000759', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Department Commute Friction
              </h3>
              <p style={{ fontSize: '11px', color: '#7A7B80', margin: '2px 0 0 0' }}>
                Average travel duration across occupier business units
              </p>
            </div>
          </div>

          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 20, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#EBEBEE" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#525255' }} domain={[0, 50]} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#272B30' }} width={110} />
                <Tooltip
                  formatter={(val, name) => [name === 'avgDuration' ? `${val} mins` : `${val} / 5 ★`, name === 'avgDuration' ? 'Average Duration' : 'Satisfaction']}
                  contentStyle={{ backgroundColor: '#000759', color: '#FFFFFF', border: 'none', borderRadius: 3, fontSize: '11px' }}
                  itemStyle={{ color: '#FFFFFF' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                />
                <Bar dataKey="avgDuration" name="Avg Duration (mins)" fill="#25408F" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
