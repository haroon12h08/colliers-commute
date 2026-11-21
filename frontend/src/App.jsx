import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import ScorecardModal from './components/ScorecardModal';
import WorkforceDatabase from './components/WorkforceDatabase';
import UserTourGuide from './components/UserTourGuide';
import { FALLBACK_CITIES, FALLBACK_OFFICES, FALLBACK_SCORECARDS } from './data/fallbackData';
import { WORKFORCE_1500 } from './data/workforceData';

export default function App() {
  const [cities, setCities] = useState(FALLBACK_CITIES);
  const [selectedCity, setSelectedCity] = useState(FALLBACK_CITIES[0]);
  const [offices, setOffices] = useState(FALLBACK_OFFICES.CHE);
  const [selectedOffice, setSelectedOffice] = useState(FALLBACK_OFFICES.CHE[0]);
  const [employees, setEmployees] = useState(() => WORKFORCE_1500.filter(e => e.cityCode === FALLBACK_CITIES[0].code));
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [scorecards, setScorecards] = useState(() => FALLBACK_SCORECARDS.CHE || []);
  const [isochrones, setIsochrones] = useState(null);
  const [centerOfGravity, setCenterOfGravity] = useState(() => {
    const initialEmployees = WORKFORCE_1500.filter(e => e.cityCode === FALLBACK_CITIES[0].code);
    if (initialEmployees.length > 0) {
      const avgLat = initialEmployees.reduce((sum, e) => sum + e.latitude, 0) / initialEmployees.length;
      const avgLng = initialEmployees.reduce((sum, e) => sum + e.longitude, 0) / initialEmployees.length;
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [avgLng, avgLat] },
        properties: {
          title: `Workforce Center of Gravity (${FALLBACK_CITIES[0].code})`,
          latitude: avgLat,
          longitude: avgLng,
          totalEmployeesSampled: initialEmployees.length,
          description: 'Geographic optimal coordinate minimizing collective employee transit distance.'
        }
      };
    }
    return null;
  });
  const [travelMode, setTravelMode] = useState('driving');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [isTourOpen, setIsTourOpen] = useState(() => {
    try {
      return !localStorage.getItem('colliers_commute_tour_v1');
    } catch (_) {
      return true;
    }
  });

  const [visibleLayers, setVisibleLayers] = useState({
    heatmap: true,
    routes: true,
    isochrones: true,
    offices: true,
    employees: true,
    centerOfGravity: true
  });

  // 1. Fetch Cities on mount
  useEffect(() => {
    fetch('/api/v1/commute/cities')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCities(data);
          setSelectedCity(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  // 2. Fetch Data when Selected City Changes
  useEffect(() => {
    setSelectedEmployee(null);
    const cityCode = selectedCity.code;

    // Immediately update candidate offices and scorecards synchronously
    // This guarantees zero lag frames and 100% free hosting self-sufficiency
    const localOffices = FALLBACK_OFFICES[cityCode] || FALLBACK_OFFICES.CHE;
    setOffices(localOffices);
    setSelectedOffice(localOffices[0]);
    setScorecards(FALLBACK_SCORECARDS[cityCode] || []);

    // Immediately update local employees and calculate Center of Gravity
    const localEmployees = WORKFORCE_1500.filter(e => e.cityCode === cityCode);
    setEmployees(localEmployees);
    if (localEmployees.length > 0) {
      const avgLat = localEmployees.reduce((sum, e) => sum + e.latitude, 0) / localEmployees.length;
      const avgLng = localEmployees.reduce((sum, e) => sum + e.longitude, 0) / localEmployees.length;
      setCenterOfGravity({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [avgLng, avgLat] },
        properties: {
          title: `Workforce Center of Gravity (${cityCode})`,
          latitude: avgLat,
          longitude: avgLng,
          totalEmployeesSampled: localEmployees.length,
          description: 'Geographic optimal coordinate minimizing collective employee transit distance.'
        }
      });
    }

    // Fetch Offices from backend to get live data if available
    fetch(`/api/v1/commute/offices?cityCode=${cityCode}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setOffices(data);
          setSelectedOffice(data[0]);
        }
      })
      .catch(() => {});

    // Fetch Scorecards
    fetch(`/api/v1/commute/scorecard?cityCode=${cityCode}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.scorecard) {
          setScorecards(data.scorecard);
        }
      })
      .catch(() => {});

    // Fetch Employees (all 500 employees for the active city)
    fetch(`/api/v1/commute/workforce?cityCode=${cityCode}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEmployees(data);
        }
      })
      .catch(() => {});

    // Fetch Center of Gravity
    fetch(`/api/v1/commute/center-of-gravity?cityCode=${cityCode}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.geometry) {
          setCenterOfGravity(data);
        }
      })
      .catch(() => {});

  }, [selectedCity]);

  // 3. Fetch Isochrones when Selected Office or City Changes
  useEffect(() => {
    if (!selectedOffice) return;

    fetch(`/api/v1/commute/isochrones?cityCode=${selectedCity.code}&officeId=${selectedOffice.id}&mode=${travelMode}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.features) {
          setIsochrones(data);
        }
      })
      .catch(() => {});
  }, [selectedCity, selectedOffice, travelMode]);

  const handleToggleLayer = (layerId) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Colliers Global Brand Header (64px) with Database Tab */}
      <Navbar
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartTour={() => setIsTourOpen(true)}
      />

      {/* Main GIS Map & Dynamic Left Panel Workspace */}
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <Sidebar
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={(city) => setSelectedCity(city)}
          offices={offices}
          selectedOffice={selectedOffice}
          onSelectOffice={(office) => setSelectedOffice(office)}
          scorecards={scorecards}
          travelMode={travelMode}
          setTravelMode={setTravelMode}
          visibleLayers={visibleLayers}
          onToggleLayer={handleToggleLayer}
          onOpenComparison={() => setIsComparisonOpen(true)}
          onOpenDatabase={() => setIsDatabaseModalOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          employees={employees}
          selectedEmployee={selectedEmployee}
          onSelectEmployee={setSelectedEmployee}
          centerOfGravity={centerOfGravity}
          onStartTour={() => setIsTourOpen(true)}
        />

        <div style={{ flex: 1, height: '100%', position: 'relative' }}>
          <MapView
            selectedCity={selectedCity}
            offices={offices}
            selectedOffice={selectedOffice}
            onSelectOffice={(office) => setSelectedOffice(office)}
            employees={employees}
            selectedEmployee={selectedEmployee}
            onSelectEmployee={setSelectedEmployee}
            isochrones={isochrones}
            centerOfGravity={centerOfGravity}
            visibleLayers={visibleLayers}
            onToggleLayer={handleToggleLayer}
          />
        </div>
      </div>

      {/* Interactive Guided Product Tour for Ms. Vijaya */}
      <UserTourGuide
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Full-Screen Master Spreadsheet & Analytics Modal Overlay */}
      {isDatabaseModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0, 7, 89, 0.98)' }}>
          <WorkforceDatabase
            selectedCity={selectedCity}
            onSelectCity={(city) => setSelectedCity(city)}
            onBackToMap={() => setIsDatabaseModalOpen(false)}
            onSelectEmployee={(emp) => {
              setSelectedEmployee(emp);
              setIsDatabaseModalOpen(false);
              setActiveTab('database');
            }}
          />
        </div>
      )}

      {/* Comparative Analysis Modal */}
      <ScorecardModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        selectedCity={selectedCity}
        offices={offices}
        scorecards={scorecards}
      />
    </div>
  );
}
