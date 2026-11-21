import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Building,
  Navigation,
  Layers,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Compass,
  ArrowRight
} from 'lucide-react';

export const TOUR_STEPS = [
  {
    id: 'welcome',
    targetTab: 'properties',
    title: 'Welcome to Colliers Commute, Ms. Vijaya',
    kicker: 'EXECUTIVE LOCATION INTELLIGENCE & CRE ADVISORY',
    icon: Compass,
    summary:
      'This institutional analytics platform equips you with empirical, data-driven location optimization for corporate real estate relocation decisions across India\'s premier commercial metros.',
    details: [
      'Evaluate 15 Grade-A commercial tech parks across Chennai, Mumbai, and Bengaluru.',
      'Analyze 1,500 real employee doorstep-to-desk transit corridors.',
      'Model 3D travel-time isochrones and spatial center of gravity centroids.',
      'Generate board-ready financial comparisons and ESG-aligned advisory storylines.'
    ],
    advisoryTip: 'Use the top-right Metro Switcher to fly between Chennai, Mumbai, and Bengaluru with smooth cinematic camera transitions.'
  },
  {
    id: 'properties',
    targetTab: 'properties',
    title: 'Candidate Tech Parks & Micro-Market Comparison',
    kicker: 'PORTFOLIO BENCHMARKING (5 GRADE-A HUBS PER METRO)',
    icon: Building,
    summary:
      'In the left panel under "Properties & Hubs", inspect 5 pre-screened Grade-A IT/commercial parks in each metro region with current rental benchmarks, leasable area, and LEED certifications.',
    details: [
      'Hover over any 3D office pin on the GIS map to view architectural photography, floor plates, and transit proximity.',
      'Click any candidate office to immediately re-calculate collective commute times across all 500 employees in that city.',
      'Review real-time metrics showing Average Commute Minutes and Percentage of Workforce within 45 minutes.'
    ],
    advisoryTip: 'Clicking an office dynamically recalibrates all 500 employee transit corridors to terminate at that specific building!'
  },
  {
    id: 'isochrones',
    targetTab: 'isochrones',
    title: 'Dynamic Commute Catchments & 3D Isochrones',
    kicker: 'ACCESSIBILITY MODELING (15M, 30M, 45M, 60M CONTOURS)',
    icon: Layers,
    summary:
      'The "Commute Catchments" tab maps multi-tiered travel-time contours around the selected tech park, visually showing employee coverage across standard commuting intervals.',
    details: [
      'Prime Core Hub (<15 mins): Walking and immediate feeder perimeter.',
      'Optimal Transit (15–30 mins): Primary rapid metro & arterial expressway corridors.',
      'Secondary Reach (30–45 mins): Standard viable urban commuter radius.',
      'Outer Catchment (45–60 mins) & Long-Haul (>60 mins): Extended suburban catchment requiring corporate shuttles.'
    ],
    advisoryTip: 'Isochrone polygons adapt dynamically on the 3D map. Toggle between CartoDB Positron Light Mode and Dark Matter in the map controls.'
  },
  {
    id: 'routes',
    targetTab: 'properties',
    title: '1,500 Real-World Road & Rail Transit Corridors',
    kicker: 'DOORSTEP-TO-DESK TRANSIT ROUTING',
    icon: Navigation,
    summary:
      'Rather than misleading straight lines, every employee is routed along real-world OpenStreetMap (OSRM) road corridors and Suburban EMU / Metro Rail alignments.',
    details: [
      'Cyan & Blue Corridors: Real vehicular routes (Two-Wheeler, Car, Bus, Corporate Shuttle).',
      'Emerald Corridors: High-speed Metro & Suburban Rail alignments.',
      'Single-Route Isolation: Click any employee dot on the map or row in the left panel to isolate their personal home-to-office journey with exact distance (km) and travel duration (mins).'
    ],
    advisoryTip: 'Clicking "Isolate This Route Only" filters out all other lines so you can review a specific employee\'s transit friction.'
  },
  {
    id: 'centroid',
    targetTab: 'isochrones',
    title: 'Workforce Density Heatmap & Centroid Optimization',
    kicker: 'SPATIAL CENTER OF GRAVITY (MINIMUM-DISTANCE ANCHOR)',
    icon: MapPin,
    summary:
      'The golden target pin identifies your mathematical Workforce Center of Gravity—the optimal geographic point that minimizes total commuter hours for your entire organization.',
    details: [
      'GPU-Accelerated Heatmap: Visualizes talent concentration clusters (e.g., Velachery in Chennai, Powai in Mumbai, HSR/Koramangala in Bengaluru).',
      'Centroid Benchmark: Measures the physical distance (km) between any candidate tech park and the optimal employee midpoint.',
      'Relocation Arbitrage: Properties closest to the centroid consistently yield highest retention and lowest commute fatigue.'
    ],
    advisoryTip: 'Look for candidate offices that sit closest to the Golden Centroid Pin on the map to achieve maximum workforce accessibility.'
  },
  {
    id: 'advisory',
    targetTab: 'insights',
    title: 'Market Advisory & Strategic Relocation Business Cases',
    kicker: 'QUANTIFIED CRE DECISION NARRATIVES',
    icon: TrendingUp,
    summary:
      'The "Market Advisory" tab provides strategic storylines comparing rental costs against commute savings for C-suite executive presentations.',
    details: [
      'Chennai Case: Moving to Olympia Tech Park (Guindy) saves 29% transit hours vs OMR toll plaza congestion.',
      'Mumbai Arbitrage: Mindspace Airoli offers a 74% rent reduction vs BKC while retaining 84% sub-45m talent accessibility.',
      'Bengaluru Optimization: North Hebbal (Manyata) and Whitefield Purple Metro relieve the Outer Ring Road congestion bottleneck.',
      'Scorecard Matrix: Click "Site Comparison" to open a comprehensive side-by-side evaluation table with 1-click CSV and print-ready options.'
    ],
    advisoryTip: 'Use the "Site Comparison" matrix modal when presenting multi-site options to tenant clients and investment committees.'
  },
  {
    id: 'database',
    targetTab: 'database',
    title: '1,500 Master Workforce Database & Analytics Suite',
    kicker: 'GRANULAR EMPLOYEE MOBILITY & RECHARTS SUITE',
    icon: FileSpreadsheet,
    summary:
      'Access the full master database of 1,500 employees (500 Chennai, 500 Bengaluru, 500 Mumbai) with complete salary bands, departments, residential localities, travel modes, and carbon footprints.',
    details: [
      'Interactive Spreadsheet: Search by name, employee ID, role, or micro-market; sort columns; filter by transit mode.',
      'Visual Analytics Suite (Recharts): Duration histograms, regional metro benchmarks, transit modal splits, hybrid workplace models, and residential density charts.',
      'Export Data: Download complete datasets with 1-click CSV export.'
    ],
    advisoryTip: 'Click "Spreadsheet" or "Workforce Database" in the top navigation bar at any time to inspect granular employee mobility data.'
  }
];

export default function UserTourGuide({
  isOpen,
  onClose,
  activeTab,
  setActiveTab
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Synchronize active left panel tab with tour step
  useEffect(() => {
    if (!isOpen) return;
    const currentStep = TOUR_STEPS[currentStepIndex];
    if (currentStep && currentStep.targetTab && setActiveTab) {
      setActiveTab(currentStep.targetTab);
    }
  }, [isOpen, currentStepIndex, setActiveTab]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;
  const StepIcon = step.icon;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('colliers_commute_tour_v1', 'completed');
    } catch (_) {}
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 7, 89, 0.72)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 620,
          backgroundColor: '#FFFFFF',
          borderRadius: 4,
          border: '1px solid #C6D7FE',
          boxShadow: '0 20px 50px rgba(0, 7, 89, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Top Executive Header Banner */}
        <div
          style={{
            backgroundColor: '#000759',
            padding: '16px 24px',
            borderBottom: '2px solid #1C54F4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                backgroundColor: '#1C54F4',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1px',
                padding: '3px 8px',
                borderRadius: 2,
                textTransform: 'uppercase'
              }}
            >
              Ms. Vijaya&apos;s User Guide
            </span>
            <span style={{ fontSize: '11px', color: '#DBE5FF' }}>
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={handleComplete}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#DBE5FF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 4
            }}
            title="Skip Tour"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tour Body */}
        <div style={{ padding: '24px 28px', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Kicker & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 3,
                backgroundColor: '#EDF2FF',
                border: '1px solid #DBE5FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1C54F4',
                flexShrink: 0
              }}
            >
              <StepIcon size={20} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: '#25408F',
                  textTransform: 'uppercase'
                }}
              >
                {step.kicker}
              </div>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000759',
                  lineHeight: 1.3,
                  marginTop: 2
                }}
              >
                {step.title}
              </h2>
            </div>
          </div>

          {/* High-level Summary Paragraph */}
          <p
            style={{
              fontSize: '13px',
              color: '#272B30',
              lineHeight: 1.55,
              marginTop: 12,
              marginBottom: 16
            }}
          >
            {step.summary}
          </p>

          {/* Key Bullet Points */}
          <div
            style={{
              backgroundColor: '#F8F9FA',
              border: '1px solid #EBEBEE',
              borderRadius: 3,
              padding: '12px 16px',
              marginBottom: 16
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.8px',
                color: '#525255',
                textTransform: 'uppercase',
                marginBottom: 8
              }}
            >
              Key Capabilities &amp; Observations
            </div>
            <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {step.details.map((detail, idx) => (
                <li
                  key={idx}
                  style={{
                    fontSize: '12px',
                    color: '#272B30',
                    lineHeight: 1.45
                  }}
                >
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {/* Executive Advisory Tip Box */}
          <div
            style={{
              backgroundColor: '#EDF2FF',
              borderLeft: '4px solid #1C54F4',
              borderTop: '1px solid #DBE5FF',
              borderRight: '1px solid #DBE5FF',
              borderBottom: '1px solid #DBE5FF',
              borderRadius: 3,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10
            }}
          >
            <Sparkles size={16} color="#1C54F4" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: '11px', color: '#000759', lineHeight: 1.45 }}>
              <strong style={{ fontWeight: 700 }}>Pro-Tip for Ms. Vijaya: </strong>
              {step.advisoryTip}
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#F8F9FA',
            borderTop: '1px solid #EBEBEE',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Progress Dots Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                style={{
                  width: idx === currentStepIndex ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: idx === currentStepIndex ? '#1C54F4' : '#CCCDD5',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s ease'
                }}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleComplete}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#7A7B80',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0 8px'
              }}
            >
              Skip Tour
            </button>

            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="colliers-btn-secondary"
                style={{
                  height: '32px',
                  padding: '0 12px',
                  fontSize: '11px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="colliers-btn-primary"
              style={{
                height: '32px',
                padding: '0 16px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>{isLastStep ? 'Complete Guide' : 'Next Step'}</span>
              {isLastStep ? <CheckCircle2 size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
