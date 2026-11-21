import React, { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import { Compass, ZoomIn, ZoomOut, Sun, Moon, ArrowLeft } from 'lucide-react';
import HUB_ROUTES from '../data/hubRoutes.json';
import WORKFORCE_1500 from '../data/workforce1500.json';
import { FALLBACK_OFFICES } from '../data/fallbackData';

const ALL_OFFICES = [
  ...FALLBACK_OFFICES.CHE,
  ...FALLBACK_OFFICES.BLR,
  ...FALLBACK_OFFICES.BOM
];

const MAP_STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
};

// Real-world Haversine distance
function haversineKm(lon1, lat1, lon2, lat2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate geographic heading vector in degrees (0° = North, 90° = East, 180° = South, 270° = West)
function calculateHeading(lat1, lon1, lat2, lon2) {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Dynamically creates travel-time catchments that conform precisely to actual employee spatial distribution
function generateDynamicCatchments(office, empList) {
  if (!office || !empList || empList.length === 0) return null;

  const centerLat = office.latitude;
  const centerLng = office.longitude;
  const numSectors = 36;
  const kmPerLat = 110.574;
  const kmPerLng = 111.320 * Math.cos((centerLat * Math.PI) / 180);

  // Filter employees strictly to this office's metro cluster
  const officeCity = (office.cityCode || (office.id ? office.id.substring(0, 3).toUpperCase() : '')).toUpperCase();
  const validEmps = empList.filter(e => {
    const eCity = (e.cityCode || (e.hubId ? e.hubId.substring(0, 3).toUpperCase() : '')).toUpperCase();
    if (eCity && officeCity && eCity !== officeCity) return false;
    const dLat = (e.latitude - centerLat) * kmPerLat;
    const dLng = (e.longitude - centerLng) * kmPerLng;
    return (dLat * dLat + dLng * dLng) <= 6400; // <= 80 km radius
  });

  const bands = [
    { mins: 60, color: '#6366F1', opacity: 0.10, label: '45-60 min catchment' },
    { mins: 45, color: '#F59E0B', opacity: 0.18, label: '30-45 min catchment' },
    { mins: 30, color: '#1C54F4', opacity: 0.26, label: '15-30 min catchment' },
    { mins: 15, color: '#10B981', opacity: 0.38, label: '0-15 min core' }
  ];

  const features = bands.map(({ mins, color, opacity, label }) => {
    const baseRadiusKm = mins === 15 ? 2.8 : mins === 30 ? 6.5 : mins === 45 ? 11.0 : 17.5;
    const sectorMaxR = new Array(numSectors).fill(baseRadiusKm * 0.35);

    validEmps.forEach((emp) => {
      const dLatKm = (emp.latitude - centerLat) * kmPerLat;
      const dLngKm = (emp.longitude - centerLng) * kmPerLng;
      const distKm = Math.sqrt(dLatKm * dLatKm + dLngKm * dLngKm);
      const estMins = emp.commuteDurationMins || ((distKm / 32) * 60);

      if (estMins <= mins) {
        let angle = Math.atan2(dLatKm, dLngKm);
        if (angle < 0) angle += 2 * Math.PI;
        const sIdx = Math.round((angle / (2 * Math.PI)) * numSectors) % numSectors;
        if (distKm > sectorMaxR[sIdx]) {
          sectorMaxR[sIdx] = Math.min(distKm, baseRadiusKm * 1.45);
        }
      }
    });

    // 3-tap smoothing to eliminate jagged artifacts while respecting city geography
    const smoothed = new Array(numSectors);
    for (let i = 0; i < numSectors; i++) {
      const prevR = sectorMaxR[(i - 1 + numSectors) % numSectors];
      const currR = sectorMaxR[i];
      const nextR = sectorMaxR[(i + 1) % numSectors];
      smoothed[i] = 0.25 * prevR + 0.5 * currR + 0.25 * nextR;
    }

    const ring = [];
    for (let i = 0; i <= numSectors; i++) {
      const idx = i % numSectors;
      const angle = (2 * Math.PI * idx) / numSectors;
      const r = smoothed[idx];
      const dLat = (r * Math.sin(angle)) / kmPerLat;
      const dLng = (r * Math.cos(angle)) / kmPerLng;
      ring.push([centerLng + dLng, centerLat + dLat]);
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ring]
      },
      properties: {
        minutes: mins,
        color,
        opacity,
        label,
        officeName: office.name
      }
    };
  });

  return { type: 'FeatureCollection', features };
}

// Generates clean, enterprise-grade Colliers hover preview card for tech park office markers
function createOfficeHoverCardHtml(office, mapTheme) {
  const isDark = mapTheme === 'dark';
  const bgColor = '#0B192C';
  const textColor = '#FFFFFF';
  const mutedColor = '#94A3B8';
  const borderColor = 'rgba(255, 255, 255, 0.12)';
  const surfaceColor = 'rgba(255, 255, 255, 0.05)';

  const featuresHtml = (office.keyFeatures || [])
    .slice(0, 3)
    .map(f => `<span style="display:inline-block; font-size:10px; color:#DBE5FF; background:rgba(28,84,244,0.18); border:1px solid rgba(28,84,244,0.3); padding:2px 6px; border-radius:2px; margin-right:4px; margin-bottom:4px;">${f}</span>`)
    .join('');

  const imgUrl = office.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80';

  return `
    <div style="width: 290px; background: ${bgColor}; color: ${textColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-radius: 4px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.45);">
      <!-- Building Photo Header -->
      <div style="position: relative; width: 100%; height: 135px; background: #1E293B; overflow: hidden;">
        <img 
          src="${imgUrl}" 
          alt="${office.name}" 
          style="width: 100%; height: 100%; object-fit: cover; display: block;"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80';"
        />
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,25,44,0.1) 0%, rgba(11,25,44,0.85) 100%);"></div>
        
        <!-- Grade Tag Top Left -->
        <div style="position: absolute; top: 8px; left: 8px; background: rgba(11,25,44,0.88); border: 1px solid rgba(255,255,255,0.25); padding: 2px 7px; border-radius: 2px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; color: #FFFFFF;">
          ${office.grade || 'Grade-A'}
        </div>

        <!-- LEED Tag Top Right -->
        ${office.leedRating ? `
        <div style="position: absolute; top: 8px; right: 8px; background: rgba(16,185,129,0.9); padding: 2px 7px; border-radius: 2px; font-size: 10px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.3px;">
          LEED ${office.leedRating}
        </div>` : ''}

        <!-- Office Title Overlay Bottom -->
        <div style="position: absolute; bottom: 8px; left: 10px; right: 10px;">
          <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; line-height: 1.2; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">
            ${office.name}
          </div>
          <div style="font-size: 11px; color: #CBD5E1; margin-top: 2px;">
            ${office.microMarket || ''}
          </div>
        </div>
      </div>

      <!-- Core Specs & Commute Grid -->
      <div style="padding: 10px 12px 12px 12px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
          <div style="background: ${surfaceColor}; border: 1px solid ${borderColor}; padding: 6px 8px; border-radius: 2px;">
            <div style="font-size: 9px; color: ${mutedColor}; text-transform: uppercase; letter-spacing: 0.5px;">COMMERCIAL RENT</div>
            <div style="font-size: 14px; font-weight: 700; color: #38BDF8; font-variant-numeric: tabular-nums; margin-top: 2px;">
              ₹${office.rentPerSqft}<span style="font-size: 10px; font-weight: 400; color: ${mutedColor};"> /sq.ft</span>
            </div>
          </div>

          <div style="background: ${surfaceColor}; border: 1px solid ${borderColor}; padding: 6px 8px; border-radius: 2px;">
            <div style="font-size: 9px; color: ${mutedColor}; text-transform: uppercase; letter-spacing: 0.5px;">CAMPUS AREA</div>
            <div style="font-size: 13px; font-weight: 600; color: #FFFFFF; font-variant-numeric: tabular-nums; margin-top: 2px;">
              ${office.totalAreaSqft || 'N/A'}
            </div>
          </div>

          <div style="background: ${surfaceColor}; border: 1px solid ${borderColor}; padding: 6px 8px; border-radius: 2px;">
            <div style="font-size: 9px; color: ${mutedColor}; text-transform: uppercase; letter-spacing: 0.5px;">AVG COMMUTE</div>
            <div style="font-size: 13px; font-weight: 600; color: #F59E0B; font-variant-numeric: tabular-nums; margin-top: 2px;">
              ${office.avgCommuteMins || '--'} <span style="font-size: 10px; font-weight: 400;">mins</span>
            </div>
          </div>

          <div style="background: ${surfaceColor}; border: 1px solid ${borderColor}; padding: 6px 8px; border-radius: 2px;">
            <div style="font-size: 9px; color: ${mutedColor}; text-transform: uppercase; letter-spacing: 0.5px;">ACCESSIBILITY</div>
            <div style="font-size: 13px; font-weight: 700; color: #10B981; font-variant-numeric: tabular-nums; margin-top: 2px;">
              ${office.pctUnder45Mins || '--'}% <span style="font-size: 9px; font-weight: 400; color: ${mutedColor};">&lt;45m</span>
            </div>
          </div>
        </div>

        <!-- Key Features Tags -->
        ${featuresHtml ? `
        <div style="margin-bottom: 8px; display: flex; flex-wrap: wrap;">
          ${featuresHtml}
        </div>` : ''}

        <!-- Bottom Action CTA -->
        <div style="border-top: 1px solid ${borderColor}; padding-top: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: ${mutedColor}; letter-spacing: 0.4px;">
          <span>COLLIERS ASSET PROFILE</span>
          <span style="color: #38BDF8; font-weight: 600;">CLICK TO SELECT</span>
        </div>
      </div>
    </div>
  `;
}

// Retrieves the real-world road (OSRM) or rail (Metro/Suburban) corridor from doorstep to office
function getEmployeeRealRoute(emp, selectedOffice) {
  if (!emp || !selectedOffice) return null;

  // Strict safety check: Never calculate cross-city routes
  const empCity = (emp.cityCode || (emp.hubId ? emp.hubId.substring(0, 3).toUpperCase() : '')).toUpperCase();
  const officeCity = (selectedOffice.cityCode || (selectedOffice.id ? selectedOffice.id.substring(0, 3).toUpperCase() : '')).toUpperCase();
  if (empCity && officeCity && empCity !== officeCity) {
    return null;
  }

  const modeLower = (emp.commuteMode || '').toLowerCase();
  const isRail = modeLower.includes('metro') || modeLower.includes('train');
  const routeType = isRail ? 'rail' : 'road';
  const hubId = emp.hubId || 'blr-h01';

  // Exact pre-built real-world corridor route from HUB_ROUTES for all 15 offices
  const routeKey = `${hubId}:${selectedOffice.id}:${routeType}`;
  const corridor = HUB_ROUTES[routeKey];

  if (corridor && corridor.coords && corridor.coords.length > 0) {
    const path = [[emp.longitude, emp.latitude], ...corridor.coords];
    return {
      path,
      distanceKm: corridor.dist,
      durationMins: corridor.dur,
      isRail
    };
  }

  // Exact fallback: urban commute must not exceed metro boundary
  const crow = haversineKm(emp.longitude, emp.latitude, selectedOffice.longitude, selectedOffice.latitude);
  if (crow > 75) {
    return null; // Prevents cross-country straight lines
  }

  const dist = Math.max(2.5, Math.round(crow * 1.34 * 10) / 10);
  const dur = Math.max(12, Math.round((dist / (isRail ? 32 : 24)) * 60 + (isRail ? 8 : 6)));
  return {
    path: [[emp.longitude, emp.latitude], [selectedOffice.longitude, selectedOffice.latitude]],
    distanceKm: dist,
    durationMins: dur,
    isRail
  };
}

export default function MapView({
  selectedCity,
  offices,
  selectedOffice,
  onSelectOffice,
  employees,
  selectedEmployee,
  onSelectEmployee,
  isochrones,
  centerOfGravity,
  visibleLayers,
  onToggleLayer
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const hoverPopupRef = useRef(null);
  const homeMarkerRef = useRef(null);
  const [is3D, setIs3D] = useState(true);
  const [mapTheme, setMapTheme] = useState('light'); // Light mode default
  const [routeModeFilter, setRouteModeFilter] = useState('ALL');

  const prevCityRef = useRef(selectedCity);
  const isCityTransitioningRef = useRef(false);
  const [transitionFlightInfo, setTransitionFlightInfo] = useState(null);

  const employeesRef = useRef(employees);
  employeesRef.current = employees;

  const isochronesRef = useRef(isochrones);
  isochronesRef.current = isochrones;

  const routesDataRef = useRef(null);

  // Filter routes and calculate commute metrics
  const { activeRoutesData, routeStats } = useMemo(() => {
    if (!selectedOffice || !employees || employees.length === 0) {
      return {
        activeRoutesData: { type: 'FeatureCollection', features: [] },
        routeStats: { total: 0, under30: 0, between30And45: 0, between45And60: 0, over60: 0, avgMins: 0 }
      };
    }

    // IF A SPECIFIC EMPLOYEE IS SELECTED: ONLY SHOW THAT SINGLE EMPLOYEE'S PATH!
    const targetEmployees = selectedEmployee
      ? [selectedEmployee]
      : (routeModeFilter === 'ALL'
          ? employees
          : employees.filter(e => (e.commuteMode || '').toLowerCase().includes(routeModeFilter.toLowerCase())));

    let sumMins = 0;
    let under30 = 0;
    let between30And45 = 0;
    let between45And60 = 0;
    let over60 = 0;

    const features = targetEmployees.map((emp) => {
      const routeInfo = getEmployeeRealRoute(emp, selectedOffice);
      if (!routeInfo) return null;

      const { path, distanceKm, durationMins, isRail } = routeInfo;

      sumMins += durationMins;
      if (durationMins < 30) under30++;
      else if (durationMins < 45) between30And45++;
      else if (durationMins < 60) between45And60++;
      else over60++;

      // Color by duration bracket with strong contrast for light & dark basemaps
      let color = mapTheme === 'light' ? '#059669' : '#00F5D4'; // < 30m Emerald / Cyan
      if (durationMins >= 60) {
        color = mapTheme === 'light' ? '#E11D48' : '#F43F5E'; // >= 60m Executive Rose/Crimson
      } else if (durationMins >= 45) {
        color = mapTheme === 'light' ? '#D97706' : '#F59E0B'; // 45-60m Amber
      } else if (durationMins >= 30) {
        color = mapTheme === 'light' ? '#1C54F4' : '#3B82F6'; // 30-45m Colliers Medium Blue
      }

      if (selectedEmployee) {
        color = '#10B981'; // Highlights isolated path
      }

      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: path
        },
        properties: {
          employeeId: emp.employeeId,
          fullName: emp.fullName,
          department: emp.department,
          jobTitle: emp.jobTitle,
          locality: emp.residentialLocality,
          address: emp.residentialAddress || emp.residentialLocality,
          pinCode: emp.pinCode,
          officeName: selectedOffice.name,
          mode: emp.commuteMode,
          isRail: isRail,
          duration: durationMins,
          distance: distanceKm,
          color: color,
          isIsolated: !!selectedEmployee
        }
      };
    }).filter(Boolean);

    const avgMins = targetEmployees.length > 0 ? Math.round(sumMins / targetEmployees.length) : 0;

    routesDataRef.current = { activeRoutesData: { type: 'FeatureCollection', features }, routeStats: { total: targetEmployees.length, under30, between30And45, between45And60, over60, avgMins } };

    return {
      activeRoutesData: { type: 'FeatureCollection', features },
      routeStats: {
        total: targetEmployees.length,
        under30,
        between30And45,
        between45And60,
        over60,
        avgMins
      }
    };
  }, [selectedOffice, employees, selectedEmployee, routeModeFilter, mapTheme]);

  // Window bridge for MapLibre popups
  useEffect(() => {
    window.__selectEmployeeById = (empId) => {
      const found = employees.find(e => e.employeeId === empId);
      if (found && onSelectEmployee) {
        onSelectEmployee(found);
      }
    };
    return () => {
      delete window.__selectEmployeeById;
    };
  }, [employees, onSelectEmployee]);

  // Attach layers to map
  const setupLayers = (map) => {
    // 1. Isochrone Source & Layers
    if (!map.getSource('isochrones-source')) {
      map.addSource('isochrones-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      map.addLayer({
        id: 'isochrones-fill',
        type: 'fill',
        source: 'isochrones-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': ['get', 'opacity']
        }
      });

      map.addLayer({
        id: 'isochrones-line',
        type: 'line',
        source: 'isochrones-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.8,
          'line-opacity': 0.8
        }
      });
    }

    // 2. Real Road & Rail Route Network Source & Layers
    if (!map.getSource('routes-source')) {
      map.addSource('routes-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Ambient corridor glow
      map.addLayer({
        id: 'routes-glow',
        type: 'line',
        source: 'routes-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': selectedEmployee ? 6.0 : 3.5,
          'line-opacity': mapTheme === 'light' ? 0.25 : 0.35,
          'line-blur': 1.5
        }
      });

      // Sharp Route Path Layer
      map.addLayer({
        id: 'routes-line',
        type: 'line',
        source: 'routes-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': selectedEmployee ? 3.2 : 1.6,
          'line-opacity': mapTheme === 'light' ? 0.85 : 0.9
        }
      });

      // Click on Route
      map.on('click', 'routes-line', (e) => {
        if (!e.features || !e.features[0]) return;
        const p = e.features[0].properties;
        new maplibregl.Popup({ offset: 10, className: mapTheme === 'light' ? 'light-popup' : '' })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family: inherit; min-width: 240px;">
              <div style="font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #1C54F4; font-weight: 700; margin-bottom: 2px;">
                COMMUTE ROUTE (${p.isRail ? 'RAIL/METRO' : 'ROAD'})
              </div>
              <div style="font-weight: 600; color: ${mapTheme === 'light' ? '#000759' : '#FFFFFF'}; font-size: 13px; margin-bottom: 3px;">
                ${p.fullName} (${p.employeeId})
              </div>
              <div style="font-size: 11px; color: ${mapTheme === 'light' ? '#000759' : '#FFFFFF'}; line-height: 1.4;">
                Home: <strong>${p.address || p.locality}</strong><br/>
                Destination: <strong style="color: #1C54F4;">${p.officeName}</strong>
              </div>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #EBEBEE; display: flex; justify-content: space-between; font-size: 11px;">
                <span style="font-weight: 600; color: #00BFA5;">${p.mode}</span>
                <span class="tabular-nums" style="font-weight: 700; color: ${p.duration <= 30 ? '#10B981' : p.duration <= 45 ? '#1C54F4' : '#EF4444'};">
                  ${p.duration} mins • ${p.distance} km
                </span>
              </div>
              <button onclick="window.__selectEmployeeById('${p.employeeId}')" style="margin-top: 8px; width: 100%; height: 28px; background: #1C54F4; color: #FFFFFF; border: none; border-radius: 3px; font-weight: 600; font-size: 11px; cursor: pointer;">
                Isolate This Route Only →
              </button>
            </div>
          `)
          .addTo(map);
      });

      map.on('mouseenter', 'routes-line', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'routes-line', () => {
        map.getCanvas().style.cursor = '';
      });
    }

    // 3. Employee Origin Points Source & Layers (All 1,500 employees loaded so nothing disappears during city shifts)
    if (!map.getSource('employees-source')) {
      const initialFeatures = WORKFORCE_1500.map(e => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [e.longitude, e.latitude]
        },
        properties: { ...e }
      }));

      map.addSource('employees-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: initialFeatures }
      });

      // A. Dynamic Workforce Density Heatmap Layer (GPU-accelerated Gaussian density)
      map.addLayer({
        id: 'employee-heatmap',
        type: 'heatmap',
        source: 'employees-source',
        paint: {
          'heatmap-weight': 1.0,
          'heatmap-intensity': [
            'interpolate', ['linear'], ['zoom'],
            8, 0.35,
            11, 0.85,
            14, 1.8
          ],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0, 7, 89, 0)',
            0.15, 'rgba(28, 84, 244, 0.40)',
            0.35, 'rgba(0, 191, 165, 0.60)',
            0.60, 'rgba(245, 158, 11, 0.70)',
            0.85, 'rgba(225, 29, 72, 0.80)',
            1.0, 'rgba(190, 18, 60, 0.90)'
          ],
          'heatmap-radius': [
            'interpolate', ['linear'], ['zoom'],
            8, 10,
            10, 18,
            12, 32,
            14, 50,
            16, 70
          ],
          'heatmap-opacity': selectedEmployee ? 0.1 : (mapTheme === 'light' ? 0.75 : 0.85)
        }
      });

      // B. Sharp Employee Origin Dots on Top of Heatmap
      map.addLayer({
        id: 'employees-circles',
        type: 'circle',
        source: 'employees-source',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            8, 3.2,
            11, 5.0,
            14, 7.5
          ],
          'circle-color': mapTheme === 'light' ? '#1C54F4' : '#00F5D4',
          'circle-opacity': selectedEmployee ? 0.3 : 0.9,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-opacity': 0.95
        }
      });

      map.on('click', 'employees-circles', (e) => {
        if (!e.features || !e.features[0]) return;
        const props = e.features[0].properties;
        new maplibregl.Popup({ offset: 10, className: mapTheme === 'light' ? 'light-popup' : '' })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family: inherit; min-width: 240px;">
              <div style="font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: ${mapTheme === 'light' ? '#1C54F4' : '#DBE5FF'}; font-weight: 700; margin-bottom: 2px;">
                EMPLOYEE RESIDENCE
              </div>
              <div style="font-weight: 600; color: ${mapTheme === 'light' ? '#000759' : '#FFFFFF'}; font-size: 13px; margin-bottom: 3px;">
                ${props.fullName} (${props.employeeId})
              </div>
              <div style="font-size: 11px; color: ${mapTheme === 'light' ? '#000759' : '#FFFFFF'};">Address: <strong>${props.residentialAddress || props.residentialLocality}</strong></div>
              <div style="font-size: 11px; color: ${mapTheme === 'light' ? '#525255' : '#FFFFFF'};">PIN: ${props.pinCode}</div>
              <div style="font-size: 11px; color: #1C54F4; margin-top: 4px; font-weight: 600;">Mode: ${props.commuteMode}</div>
              <button onclick="window.__selectEmployeeById('${props.employeeId}')" style="margin-top: 8px; width: 100%; height: 28px; background: #059669; color: #FFFFFF; border: none; border-radius: 3px; font-weight: 600; font-size: 11px; cursor: pointer;">
                Isolate This Route Only →
              </button>
            </div>
          `)
          .addTo(map);
      });

      map.on('mouseenter', 'employees-circles', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'employees-circles', () => {
        map.getCanvas().style.cursor = '';
      });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES.light, // Default to light mode (CartoDB Positron)
      center: [selectedCity.longitude, selectedCity.latitude],
      zoom: selectedCity.defaultZoom || 11,
      pitch: 45,
      bearing: -12,
      attributionControl: false
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      mapRef.current = map;
      setupLayers(map);
      updateIsochronesLayer(isochronesRef.current);
      updateEmployeesLayer(employeesRef.current);
      updateRoutesLayer(routesDataRef.current?.activeRoutesData || activeRoutesData);
    });

    return () => {
      map.remove();
    };
  }, []);

  // Handle Switch Theme (Light vs Dark)
  const toggleMapTheme = () => {
    if (!mapRef.current) return;
    const nextTheme = mapTheme === 'light' ? 'dark' : 'light';
    setMapTheme(nextTheme);

    mapRef.current.setStyle(MAP_STYLES[nextTheme]);
    mapRef.current.once('style.load', () => {
      setupLayers(mapRef.current);
      updateIsochronesLayer(isochronesRef.current);
      updateEmployeesLayer(employeesRef.current);
      updateRoutesLayer(routesDataRef.current?.activeRoutesData || activeRoutesData);
    });
  };

  // Handle Cinematic Inter-City Flight (Smooth parabolic transition across India)
  useEffect(() => {
    if (!mapRef.current) return;

    const prevCity = prevCityRef.current;
    prevCityRef.current = selectedCity;

    // Skip on first mount or identical city code
    if (!prevCity || prevCity.code === selectedCity.code) {
      return;
    }

    // Geodesic distance in km
    const distKm = Math.round(
      haversineKm(prevCity.longitude, prevCity.latitude, selectedCity.longitude, selectedCity.latitude)
    );

    // Calculate heading vector for realistic aircraft / camera banking
    const rawHeading = calculateHeading(
      prevCity.latitude,
      prevCity.longitude,
      selectedCity.latitude,
      selectedCity.longitude
    );
    const headingNorm = rawHeading > 180 ? rawHeading - 360 : rawHeading;
    // Elegant banking angle aligned with travel trajectory (-22° to +22°)
    const flightBearing = is3D ? Math.max(-22, Math.min(22, headingNorm * 0.18 - 8)) : 0;
    const flightPitch = is3D ? 48 : 0;

    // Slower, deliberate cinematic duration (4.4s to 5.4s) so the flight feels majestic and not rushed
    const flightDuration = Math.min(5400, Math.max(4400, Math.round(distKm * 1.2 + 3600)));

    isCityTransitioningRef.current = true;
    setTransitionFlightInfo({
      fromCity: prevCity.name,
      toCity: selectedCity.name,
      distanceKm: distKm,
      duration: flightDuration,
      status: 'CRUISING'
    });

    // Execute majestic cinematic flight with optimal altitude arc (van Wijk curve)
    mapRef.current.flyTo({
      center: [selectedCity.longitude, selectedCity.latitude],
      zoom: selectedCity.defaultZoom || 11.4,
      pitch: flightPitch,
      bearing: flightBearing,
      duration: flightDuration,
      curve: 1.42,
      minZoom: 8.5, // High enough to eliminate street-level blur, yet close enough so employee dots and tech parks remain in crisp view
      essential: true,
      easing: (t) => {
        // Silky smooth cubic bezier curve (slow graceful start, steady cruise, soft touchdown)
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }
    });

    const touchdownTimer = setTimeout(() => {
      setTransitionFlightInfo((prev) => (prev ? { ...prev, status: 'ARRIVED' } : null));
    }, flightDuration - 350);

    // Unlock office clicks and fade out flight HUD
    const completeTimer = setTimeout(() => {
      isCityTransitioningRef.current = false;
      setTransitionFlightInfo(null);
    }, flightDuration + 900);

    return () => {
      clearTimeout(touchdownTimer);
      clearTimeout(completeTimer);
    };
  }, [selectedCity, is3D]);

  // Handle Office Change (Guarded during Inter-City Flight)
  useEffect(() => {
    if (!mapRef.current || !selectedOffice || selectedEmployee) return;
    if (isCityTransitioningRef.current) return; // Prevent aborting the cinematic city flight
    mapRef.current.flyTo({
      center: [selectedOffice.longitude, selectedOffice.latitude],
      zoom: 11.4,
      pitch: is3D ? 45 : 0,
      bearing: is3D ? -12 : 0,
      essential: true,
      duration: 1000
    });
  }, [selectedOffice, is3D]);

  // Update Routes Layer
  useEffect(() => {
    updateRoutesLayer(activeRoutesData);
  }, [activeRoutesData, visibleLayers?.routes, mapTheme, selectedEmployee]);

  const updateRoutesLayer = (routesData) => {
    if (!mapRef.current || !mapRef.current.getSource('routes-source')) return;
    const isVisible = visibleLayers?.routes !== false;
    mapRef.current.setLayoutProperty('routes-glow', 'visibility', isVisible ? 'visible' : 'none');
    mapRef.current.setLayoutProperty('routes-line', 'visibility', isVisible ? 'visible' : 'none');

    if (mapRef.current.getLayer('routes-line')) {
      mapRef.current.setPaintProperty('routes-line', 'line-width', selectedEmployee ? 3.2 : 1.6);
      mapRef.current.setPaintProperty('routes-glow', 'line-width', selectedEmployee ? 6.0 : 3.5);
    }

    if (routesData && routesData.features) {
      mapRef.current.getSource('routes-source').setData(routesData);
    } else {
      mapRef.current.getSource('routes-source').setData({ type: 'FeatureCollection', features: [] });
    }
  };

  // Update Isochrones (Real Dynamic Employee-Shaped Catchments)
  useEffect(() => {
    updateIsochronesLayer(isochrones);
  }, [isochrones, selectedOffice, employees, visibleLayers?.isochrones, mapTheme, selectedEmployee]);

  const updateIsochronesLayer = (data) => {
    if (!mapRef.current || !mapRef.current.getSource('isochrones-source')) return;
    const isVisible = visibleLayers?.isochrones !== false && !selectedEmployee;
    mapRef.current.setLayoutProperty('isochrones-fill', 'visibility', isVisible ? 'visible' : 'none');
    mapRef.current.setLayoutProperty('isochrones-line', 'visibility', isVisible ? 'visible' : 'none');

    // Use backend employee-aware catchment data, or client-side dynamic catchment engine
    const activeData = (data && data.features && data.features.length > 0)
      ? data
      : (selectedOffice ? generateDynamicCatchments(selectedOffice, employeesRef.current || employees) : null);

    if (activeData && activeData.features) {
      const formattedData = {
        ...activeData,
        features: activeData.features.map(f => ({
          ...f,
          properties: {
            ...f.properties,
            opacity: mapTheme === 'light' ? Math.min((f.properties.opacity || 0.25) + 0.06, 0.45) : (f.properties.opacity || 0.25)
          }
        }))
      };
      mapRef.current.getSource('isochrones-source').setData(formattedData);
    } else {
      mapRef.current.getSource('isochrones-source').setData({ type: 'FeatureCollection', features: [] });
    }
  };

  // Update Employees Layer & Workforce Density Heatmap
  useEffect(() => {
    updateEmployeesLayer(employees);
  }, [employees, visibleLayers?.employees, visibleLayers?.heatmap, mapTheme, selectedEmployee]);

  const updateEmployeesLayer = (empList) => {
    const list = empList || employeesRef.current || employees;
    if (!mapRef.current || !mapRef.current.getSource('employees-source')) return;

    // 1. Toggle Workforce Density Heatmap
    const isHeatmapVisible = visibleLayers?.heatmap !== false && !selectedEmployee;
    if (mapRef.current.getLayer('employee-heatmap')) {
      mapRef.current.setLayoutProperty('employee-heatmap', 'visibility', isHeatmapVisible ? 'visible' : 'none');
      mapRef.current.setPaintProperty(
        'employee-heatmap',
        'heatmap-opacity',
        selectedEmployee ? 0.1 : (mapTheme === 'light' ? 0.75 : 0.85)
      );
    }

    // 2. Toggle Sharp Employee Origin Dots
    const areDotsVisible = visibleLayers?.employees !== false;
    if (mapRef.current.getLayer('employees-circles')) {
      mapRef.current.setLayoutProperty('employees-circles', 'visibility', areDotsVisible ? 'visible' : 'none');
      mapRef.current.setPaintProperty(
        'employees-circles',
        'circle-color',
        mapTheme === 'light' ? '#1C54F4' : '#00F5D4'
      );
      mapRef.current.setPaintProperty(
        'employees-circles',
        'circle-opacity',
        selectedEmployee ? 0.3 : 0.9
      );
      mapRef.current.setPaintProperty(
        'employees-circles',
        'circle-stroke-opacity',
        0.95
      );
      mapRef.current.setPaintProperty(
        'employees-circles',
        'circle-stroke-width',
        1.5
      );
      mapRef.current.setPaintProperty(
        'employees-circles',
        'circle-stroke-color',
        '#FFFFFF'
      );
    }

    // Retain all 1,500 employees loaded so dots and heatmap never disappear during city view shifts!
    const targetList = selectedEmployee ? [selectedEmployee] : WORKFORCE_1500;
    const geojson = {
      type: 'FeatureCollection',
      features: targetList.map(e => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [e.longitude, e.latitude]
        },
        properties: { ...e }
      }))
    };
    mapRef.current.getSource('employees-source').setData(geojson);
  };

  // Render Office & Center of Gravity Markers
  useEffect(() => {
    if (!mapRef.current) return;

    if (hoverPopupRef.current) {
      hoverPopupRef.current.remove();
      hoverPopupRef.current = null;
    }

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add Office Markers across all metro regions so tech parks never disappear during city view shifts
    if (visibleLayers?.offices !== false) {
      // Merge active city offices with ALL_OFFICES to ensure latest backend properties (images, specs)
      const officeMap = new Map();
      ALL_OFFICES.forEach(o => officeMap.set(o.id, o));
      if (Array.isArray(offices)) {
        offices.forEach(o => {
          const fallback = officeMap.get(o.id) || {};
          officeMap.set(o.id, { ...fallback, ...o });
        });
      }
      const officeList = Array.from(officeMap.values());

      officeList.forEach(office => {
        const isSelected = selectedOffice?.id === office.id;
        const el = document.createElement('div');
        el.className = 'marker-office';
        el.innerHTML = `
          <div class="marker-pin ${isSelected ? 'active' : ''}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="1" ry="1"></rect>
              <line x1="9" y1="22" x2="9" y2="22.01"></line>
              <line x1="15" y1="22" x2="15" y2="22.01"></line>
              <line x1="9" y1="6" x2="9" y2="6.01"></line>
              <line x1="15" y1="6" x2="15" y2="6.01"></line>
              <line x1="9" y1="10" x2="9" y2="10.01"></line>
              <line x1="15" y1="10" x2="15" y2="10.01"></line>
              <line x1="9" y1="14" x2="9" y2="14.01"></line>
              <line x1="15" y1="14" x2="15" y2="14.01"></line>
            </svg>
          </div>
          <div class="marker-label">
            ${office.name.split(' (')[0]} <span class="tabular-nums" style="color: #1C54F4; font-weight: 700;">₹${office.rentPerSqft}</span>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (hoverPopupRef.current) {
            hoverPopupRef.current.remove();
            hoverPopupRef.current = null;
          }
          onSelectOffice(office);
        });

        // Hover panel on building icon pin
        const pinEl = el.querySelector('.marker-pin') || el;
        pinEl.addEventListener('mouseenter', () => {
          if (!mapRef.current) return;
          if (hoverPopupRef.current) {
            hoverPopupRef.current.remove();
            hoverPopupRef.current = null;
          }
          hoverPopupRef.current = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: [0, -22],
            className: 'office-hover-popup',
            maxWidth: '320px'
          })
            .setLngLat([office.longitude, office.latitude])
            .setHTML(createOfficeHoverCardHtml(office, mapTheme))
            .addTo(mapRef.current);
        });

        pinEl.addEventListener('mouseleave', () => {
          if (hoverPopupRef.current) {
            hoverPopupRef.current.remove();
            hoverPopupRef.current = null;
          }
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([office.longitude, office.latitude])
          .addTo(mapRef.current);

        markersRef.current.push(marker);
      });
    }

    // Add Center of Gravity Marker
    if (!selectedEmployee && visibleLayers?.centerOfGravity !== false && centerOfGravity && centerOfGravity.geometry) {
      const [cogLng, cogLat] = centerOfGravity.geometry.coordinates;
      const cogEl = document.createElement('div');
      cogEl.className = 'marker-cog';
      cogEl.innerHTML = `
        <div class="cog-circle" title="Workforce Centroid">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="22" y1="12" x2="18" y2="12"></line>
            <line x1="6" y1="12" x2="2" y2="12"></line>
            <line x1="12" y1="6" x2="12" y2="2"></line>
            <line x1="12" y1="22" x2="12" y2="18"></line>
          </svg>
        </div>
      `;

      const cogMarker = new maplibregl.Marker({ element: cogEl })
        .setLngLat([cogLng, cogLat])
        .addTo(mapRef.current);

      markersRef.current.push(cogMarker);
    }

    return () => {
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
        hoverPopupRef.current = null;
      }
    };
  }, [offices, selectedOffice, centerOfGravity, visibleLayers, mapTheme, selectedEmployee]);

  // Handle Single Employee Isolation Marker & Framing
  useEffect(() => {
    if (!mapRef.current) return;

    if (homeMarkerRef.current) {
      homeMarkerRef.current.remove();
      homeMarkerRef.current = null;
    }

    if (selectedEmployee && selectedOffice) {
      const el = document.createElement('div');
      el.className = 'marker-home';
      el.innerHTML = `
        <div class="marker-home-pin" title="Origin: ${selectedEmployee.fullName}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <div class="marker-home-label">
          Home: ${selectedEmployee.fullName}
        </div>
      `;

      homeMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([selectedEmployee.longitude, selectedEmployee.latitude])
        .addTo(mapRef.current);

      const minLng = Math.min(selectedEmployee.longitude, selectedOffice.longitude);
      const maxLng = Math.max(selectedEmployee.longitude, selectedOffice.longitude);
      const minLat = Math.min(selectedEmployee.latitude, selectedOffice.latitude);
      const maxLat = Math.max(selectedEmployee.latitude, selectedOffice.latitude);

      mapRef.current.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: { top: 70, bottom: 70, left: 100, right: 100 }, maxZoom: 14.5, duration: 1000 }
      );
    }
  }, [selectedEmployee, selectedOffice]);

  const toggle3D = () => {
    if (!mapRef.current) return;
    const new3D = !is3D;
    setIs3D(new3D);
    mapRef.current.easeTo({
      pitch: new3D ? 45 : 0,
      bearing: new3D ? -12 : 0,
      duration: 800
    });
  };

  const isLight = mapTheme === 'light';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* CINEMATIC INTER-CITY FLIGHT HUD BADGE */}
      {transitionFlightInfo && (
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            pointerEvents: 'none',
            animation: 'fadeInDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#000759',
              border: isLight ? '1px solid #1C54F4' : '1px solid rgba(28, 84, 244, 0.7)',
              borderRadius: 'var(--colliers-radius-xs)',
              boxShadow: isLight
                ? '0 8px 24px rgba(28, 84, 244, 0.16), 0 2px 6px rgba(0, 7, 89, 0.08)'
                : '0 12px 36px rgba(0, 7, 89, 0.8), 0 0 20px rgba(28, 84, 244, 0.4)',
              padding: '8px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            {/* Pulsing Flight Beacon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: transitionFlightInfo.status === 'ARRIVED' ? '#10B981' : '#00F5D4',
                  boxShadow: transitionFlightInfo.status === 'ARRIVED' ? '0 0 10px #10B981' : '0 0 10px #00F5D4',
                  animation: 'radarPulse 1.2s infinite ease-in-out'
                }}
              />
              <span
                className="colliers-kicker"
                style={{
                  fontSize: '9px',
                  letterSpacing: '1px',
                  color: transitionFlightInfo.status === 'ARRIVED' ? '#10B981' : (isLight ? '#1C54F4' : '#00F5D4'),
                  fontWeight: 700
                }}
              >
                {transitionFlightInfo.status === 'ARRIVED' ? 'ARRIVED' : 'CRUISING'}
              </span>
            </div>

            <div style={{ height: 14, width: 1, backgroundColor: isLight ? '#CCCDD5' : 'rgba(219, 229, 255, 0.25)' }} />

            {/* From City -> To City */}
            <div style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#000759' : '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{transitionFlightInfo.fromCity}</span>
              <span style={{ color: '#1C54F4', fontSize: '12px' }}>→</span>
              <span>{transitionFlightInfo.toCity}</span>
            </div>

            <div style={{ height: 14, width: 1, backgroundColor: isLight ? '#CCCDD5' : 'rgba(219, 229, 255, 0.25)' }} />

            {/* Geodesic Distance */}
            <div className="tabular-nums" style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#525255' : '#DBE5FF' }}>
              {transitionFlightInfo.distanceKm} km
            </div>
          </div>

          {/* Animated Flight Progress Bar */}
          <div
            style={{
              width: '100%',
              height: 2,
              backgroundColor: isLight ? 'rgba(28, 84, 244, 0.15)' : 'rgba(28, 84, 244, 0.3)',
              borderRadius: 1,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: transitionFlightInfo.status === 'ARRIVED' ? '#10B981' : '#1C54F4',
                animation: `flightProgress ${transitionFlightInfo.duration}ms cubic-bezier(0.65, 0, 0.35, 1) forwards`
              }}
            />
          </div>
        </div>
      )}

      {/* TOP-LEFT: Restrained Enterprise Map Control Bar */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          backgroundColor: isLight ? '#FFFFFF' : 'var(--colliers-primary-deep-blue)',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 30,
          border: isLight ? '1px solid var(--colliers-neutral-5)' : '1px solid rgba(219, 229, 255, 0.2)',
          borderRadius: 'var(--colliers-radius-sm)',
          boxShadow: 'var(--colliers-shadow-s)',
          width: 380
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="colliers-kicker" style={{ color: selectedEmployee ? '#059669' : (isLight ? '#000759' : '#DBE5FF') }}>
            {selectedEmployee ? 'SINGLE ROUTE ISOLATION' : 'REAL-WORLD COMMUTE NETWORK'}
          </div>
          <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#000759' : '#FFFFFF' }}>
            {selectedEmployee ? '1 Path' : `${activeRoutesData.features.length} Paths`}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '12px' }}>
          <div style={{ color: isLight ? '#000759' : '#FFFFFF', fontWeight: 600 }}>
            {selectedOffice ? selectedOffice.name : 'Select an Office'}
          </div>
          {selectedOffice && (
            <div className="tabular-nums" style={{ color: '#1C54F4', fontWeight: 600, fontSize: '11px' }}>
              Avg {routeStats.avgMins} mins
            </div>
          )}
        </div>

        {/* Mode filter row (segmented 26px height) */}
        {!selectedEmployee ? (
          <>
            <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
              {['ALL', 'Driving', 'Bike', 'Metro', 'Train', 'Bus'].map(m => {
                const active = routeModeFilter === m;
                return (
                  <button
                    key={m}
                    onClick={() => setRouteModeFilter(m)}
                    style={{
                      flex: 1,
                      height: '24px',
                      borderRadius: 'var(--colliers-radius-xs)',
                      border: 'none',
                      backgroundColor: active ? '#1C54F4' : (isLight ? '#F5F5F7' : 'rgba(37, 64, 143, 0.4)'),
                      color: active ? '#FFFFFF' : (isLight ? '#000759' : '#FFFFFF'),
                      fontSize: '10px',
                      fontWeight: active ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            {/* Quick Employee Select Dropdown (30px height, 3px radius) */}
            <div style={{ marginTop: 2 }}>
              <select
                value={selectedEmployee ? selectedEmployee.employeeId : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    onSelectEmployee(null);
                  } else {
                    const emp = employees.find(x => x.employeeId === val);
                    if (emp) onSelectEmployee(emp);
                  }
                }}
                className="colliers-input"
                style={{
                  height: '28px',
                  fontSize: '11px',
                  padding: '0 8px',
                  backgroundColor: isLight ? '#FFFFFF' : '#000759',
                  color: isLight ? '#000759' : '#FFFFFF',
                  borderColor: isLight ? '#CCCDD5' : 'rgba(219, 229, 255, 0.3)'
                }}
              >
                <option value="" style={{ color: isLight ? '#000759' : '#FFFFFF', backgroundColor: isLight ? '#FFFFFF' : '#000759' }}>
                  -- Isolate a single employee route (500) --
                </option>
                {employees.map(emp => (
                  <option key={emp.employeeId} value={emp.employeeId} style={{ color: isLight ? '#000759' : '#FFFFFF', backgroundColor: isLight ? '#FFFFFF' : '#000759' }}>
                    {emp.fullName} • {emp.residentialLocality} ({emp.commuteMode})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Layer Controls: Heatmap & Catchments */}
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => onToggleLayer && onToggleLayer('heatmap')}
                style={{
                  flex: 1,
                  height: '24px',
                  borderRadius: 'var(--colliers-radius-xs)',
                  border: '1px solid ' + (visibleLayers?.heatmap !== false ? '#1C54F4' : (isLight ? '#CCCDD5' : 'rgba(219, 229, 255, 0.3)')),
                  backgroundColor: visibleLayers?.heatmap !== false ? (isLight ? 'rgba(28, 84, 244, 0.08)' : 'rgba(28, 84, 244, 0.28)') : 'transparent',
                  color: visibleLayers?.heatmap !== false ? (isLight ? '#1C54F4' : '#FFFFFF') : (isLight ? '#525255' : '#DBE5FF'),
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: visibleLayers?.heatmap !== false ? '#00BFA5' : '#888' }} />
                <span>Heatmap: {visibleLayers?.heatmap !== false ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleLayer && onToggleLayer('isochrones')}
                style={{
                  flex: 1,
                  height: '24px',
                  borderRadius: 'var(--colliers-radius-xs)',
                  border: '1px solid ' + (visibleLayers?.isochrones !== false ? '#1C54F4' : (isLight ? '#CCCDD5' : 'rgba(219, 229, 255, 0.3)')),
                  backgroundColor: visibleLayers?.isochrones !== false ? (isLight ? 'rgba(28, 84, 244, 0.08)' : 'rgba(28, 84, 244, 0.28)') : 'transparent',
                  color: visibleLayers?.isochrones !== false ? (isLight ? '#1C54F4' : '#FFFFFF') : (isLight ? '#525255' : '#DBE5FF'),
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: visibleLayers?.isochrones !== false ? '#1C54F4' : '#888' }} />
                <span>Catchments: {visibleLayers?.isochrones !== false ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: isLight ? '1px solid #EBEBEE' : '1px solid rgba(219, 229, 255, 0.16)' }}>
            <span style={{ fontSize: '11px', color: isLight ? '#000759' : '#FFFFFF', fontWeight: 500 }}>
              Viewing: <strong style={{ color: isLight ? '#000759' : '#FFFFFF' }}>{selectedEmployee.fullName}</strong>
            </span>
            <button
              onClick={() => onSelectEmployee(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isLight ? '#1C54F4' : '#DBE5FF',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>← All Routes</span>
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM-LEFT: Single Employee Route Dossier (When Isolated) */}
      {selectedEmployee && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 14,
            backgroundColor: isLight ? '#FFFFFF' : '#000759',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            zIndex: 40,
            border: isLight ? '1px solid #CCCDD5' : '1px solid rgba(219, 229, 255, 0.25)',
            borderLeft: '3px solid #059669',
            borderRadius: 'var(--colliers-radius-sm)',
            boxShadow: 'var(--colliers-shadow-s)',
            width: 420
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="colliers-kicker" style={{ color: '#059669' }}>
              EMPLOYEE COMMUTE DOSSIER
            </div>
            <button
              onClick={() => onSelectEmployee(null)}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: isLight ? '#1C54F4' : '#DBE5FF',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              <ArrowLeft size={12} />
              <span>Show All 500 Routes</span>
            </button>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: isLight ? '#000759' : '#FFFFFF' }}>
              {selectedEmployee.fullName}
            </div>
            <div style={{ fontSize: '11px', color: isLight ? '#525255' : '#DBE5FF' }}>
              {selectedEmployee.jobTitle} • {selectedEmployee.department}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '11px', paddingTop: 6, borderTop: isLight ? '1px solid #EBEBEE' : '1px solid rgba(219, 229, 255, 0.16)' }}>
            <div>
              <span className="colliers-kicker" style={{ display: 'block', marginBottom: 2, color: isLight ? '#525255' : '#DBE5FF' }}>Origin (Doorstep)</span>
              <div style={{ fontWeight: 500, color: isLight ? '#000759' : '#FFFFFF' }}>
                {selectedEmployee.residentialAddress || selectedEmployee.residentialLocality}
              </div>
              <div className="tabular-nums" style={{ color: isLight ? '#525255' : '#DBE5FF', fontSize: '10px' }}>
                PIN: {selectedEmployee.pinCode}
              </div>
            </div>
            <div>
              <span className="colliers-kicker" style={{ display: 'block', marginBottom: 2, color: isLight ? '#525255' : '#DBE5FF' }}>Destination</span>
              <div style={{ fontWeight: 500, color: isLight ? '#000759' : '#FFFFFF' }}>
                {selectedOffice.name}
              </div>
              <div style={{ color: isLight ? '#525255' : '#DBE5FF', fontSize: '10px' }}>
                {selectedOffice.microMarket}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: 6, borderTop: isLight ? '1px solid #EBEBEE' : '1px solid rgba(219, 229, 255, 0.16)' }}>
            <div>
              <span style={{ color: isLight ? '#525255' : '#DBE5FF' }}>Mode: </span>
              <strong style={{ color: '#059669' }}>{selectedEmployee.commuteMode}</strong>
            </div>
            <div className="tabular-nums" style={{ display: 'flex', gap: 10, fontWeight: 600 }}>
              <span style={{ color: isLight ? '#000759' : '#FFFFFF' }}>
                {activeRoutesData.features[0]?.properties.distance || selectedEmployee.commuteDistanceKm} km
              </span>
              <span style={{ color: isLight ? '#1C54F4' : '#00F5D4' }}>
                {activeRoutesData.features[0]?.properties.duration || selectedEmployee.commuteDurationMins} mins
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TOP-RIGHT: Compact Map Tools (30x30px square buttons, 3px radius) */}
      <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 30 }}>
        {/* Light/Dark Toggle */}
        <button
          onClick={toggleMapTheme}
          className="colliers-btn-light"
          style={{ width: '32px', height: '32px', padding: 0 }}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {isLight ? <Moon size={14} color="#1C54F4" /> : <Sun size={14} color="#FEE440" />}
        </button>

        {/* 3D Pitch Toggle */}
        <button
          onClick={toggle3D}
          className="colliers-btn-light"
          style={{ width: '32px', height: '32px', padding: 0 }}
          title="Toggle 3D Perspective"
        >
          <Compass size={14} color="#1C54F4" />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="colliers-btn-light"
          style={{ width: '32px', height: '32px', padding: 0 }}
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="colliers-btn-light"
          style={{ width: '32px', height: '32px', padding: 0 }}
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
      </div>

      {/* BOTTOM-RIGHT: Heatmap Density Scale & Legend (When Heatmap Active) */}
      {visibleLayers?.heatmap !== false && !selectedEmployee && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            right: 14,
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 7, 89, 0.92)',
            padding: '8px 12px',
            border: isLight ? '1px solid var(--colliers-neutral-5)' : '1px solid rgba(219, 229, 255, 0.2)',
            borderRadius: 'var(--colliers-radius-xs)',
            boxShadow: 'var(--colliers-shadow-s)',
            zIndex: 25,
            width: 220
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span className="colliers-kicker" style={{ fontSize: '9px', color: isLight ? '#000759' : '#DBE5FF' }}>
              WORKFORCE DENSITY
            </span>
            <span style={{ fontSize: '9px', color: isLight ? '#525255' : '#DBE5FF', fontWeight: 600 }}>
              500 Active Staff
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 2,
              background: 'linear-gradient(to right, rgba(28, 84, 244, 0.7), rgba(0, 191, 165, 0.8), rgba(245, 158, 11, 0.9), rgba(225, 29, 72, 0.9), rgba(190, 18, 60, 0.95))'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: isLight ? '#525255' : '#DBE5FF', marginTop: 3 }}>
            <span>Dispersed</span>
            <span>Cluster Peak</span>
          </div>
        </div>
      )}
    </div>
  );
}
