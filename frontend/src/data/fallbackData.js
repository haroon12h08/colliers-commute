export const FALLBACK_CITIES = [
  { code: 'CHE', name: 'Chennai', latitude: 13.0134, longitude: 80.2057, defaultZoom: 11, description: 'Chennai CRE Hub - Guindy Central, OMR Tech Corridor & Porur West' },
  { code: 'BOM', name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, defaultZoom: 11, description: 'Mumbai MMR - BKC Financial District, Lower Parel & Navi Mumbai' },
  { code: 'BLR', name: 'Bengaluru', latitude: 12.9716, longitude: 77.6412, defaultZoom: 11, description: 'Bengaluru Tech Hub - Outer Ring Road, Whitefield & North Hebbal' }
];

export const FALLBACK_OFFICES = {
  CHE: [
    {
      id: 'CHE-OF-1',
      name: 'Olympia Tech Park',
      microMarket: 'Guindy (Central)',
      rentPerSqft: 95.0,
      grade: 'Grade-A',
      latitude: 13.0134,
      longitude: 80.2057,
      avgCommuteMins: 24,
      pctUnder45Mins: 91,
      totalAreaSqft: '1.8M sq.ft',
      leedRating: 'Platinum',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Metro Interchange 200m', 'LEED Platinum', 'Central Connectivity']
    },
    {
      id: 'CHE-OF-2',
      name: 'RMZ Millenia',
      microMarket: 'OMR - Perungudi',
      rentPerSqft: 85.0,
      grade: 'Grade-A+',
      latitude: 12.9664,
      longitude: 80.2484,
      avgCommuteMins: 34,
      pctUnder45Mins: 76,
      totalAreaSqft: '2.2M sq.ft',
      leedRating: 'Gold',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Expressway access', 'Tech Campus Ecosystem', 'Large Amenities']
    },
    {
      id: 'CHE-OF-3',
      name: 'DLF Cybercity',
      microMarket: 'Porur (West Corridor)',
      rentPerSqft: 75.0,
      grade: 'Grade-A',
      latitude: 13.0312,
      longitude: 80.1548,
      avgCommuteMins: 42,
      pctUnder45Mins: 63,
      totalAreaSqft: '3.0M sq.ft',
      leedRating: 'Platinum',
      imageUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Mount-Poonamallee Corridor', 'Cost Efficiency', 'West Talent Catchment']
    },
    {
      id: 'CHE-OF-4',
      name: 'Tidel Park',
      microMarket: 'Taramani (IT Corridor)',
      rentPerSqft: 90.0,
      grade: 'Grade-A+',
      latitude: 12.9892,
      longitude: 80.2478,
      avgCommuteMins: 28,
      pctUnder45Mins: 84,
      totalAreaSqft: '1.28M sq.ft',
      leedRating: 'Gold',
      imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['MRTS Station 150m', 'Pioneer Landmark', 'Dedicated Substation']
    },
    {
      id: 'CHE-OF-5',
      name: 'ASV Suntech Park',
      microMarket: 'OMR - Thoraipakkam',
      rentPerSqft: 70.0,
      grade: 'Grade-A',
      latitude: 12.9358,
      longitude: 80.2325,
      avgCommuteMins: 37,
      pctUnder45Mins: 71,
      totalAreaSqft: '850K sq.ft',
      leedRating: 'Certified',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Velachery Proximity', 'Cost Advantage', 'High Floorplates']
    }
  ],
  BOM: [
    {
      id: 'BOM-OF-1',
      name: 'Maker Maxity / ONE BKC',
      microMarket: 'Bandra-Kurla Complex (BKC)',
      rentPerSqft: 275.0,
      grade: 'Grade-A+',
      latitude: 19.0657,
      longitude: 72.8656,
      avgCommuteMins: 38,
      pctUnder45Mins: 72,
      totalAreaSqft: '1.5M sq.ft',
      leedRating: 'Platinum',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Flagship BFSI Address', 'Upcoming Metro 3 line', 'Prestige Occupiers']
    },
    {
      id: 'BOM-OF-2',
      name: 'One Lodha Place',
      microMarket: 'Lower Parel / Worli',
      rentPerSqft: 220.0,
      grade: 'Grade-A+',
      latitude: 18.9952,
      longitude: 72.8300,
      avgCommuteMins: 44,
      pctUnder45Mins: 59,
      totalAreaSqft: '1.1M sq.ft',
      leedRating: 'Platinum',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Monorail & Western Line', 'South Mumbai Luxury', 'Corporate HQs']
    },
    {
      id: 'BOM-OF-3',
      name: 'Mindspace Airoli',
      microMarket: 'Navi Mumbai (East)',
      rentPerSqft: 70.0,
      grade: 'Grade-A',
      latitude: 19.1579,
      longitude: 73.0011,
      avgCommuteMins: 29,
      pctUnder45Mins: 84,
      totalAreaSqft: '4.5M sq.ft',
      leedRating: 'Gold',
      imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['74% Rent Discount vs BKC', 'Thane / Trans-Harbour Talent', 'Massive Scalability']
    },
    {
      id: 'BOM-OF-4',
      name: 'Nesco IT Park',
      microMarket: 'Goregaon (Western Suburbs)',
      rentPerSqft: 135.0,
      grade: 'Grade-A+',
      latitude: 19.1551,
      longitude: 72.8538,
      avgCommuteMins: 33,
      pctUnder45Mins: 79,
      totalAreaSqft: '3.8M sq.ft',
      leedRating: 'Platinum',
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Direct WEH Flyover Access', 'Ram Mandir Station 300m', 'Integrated Amenities']
    },
    {
      id: 'BOM-OF-5',
      name: 'Hiranandani Business Park',
      microMarket: 'Powai (Central Suburbs)',
      rentPerSqft: 150.0,
      grade: 'Grade-A+',
      latitude: 19.1176,
      longitude: 72.9060,
      avgCommuteMins: 36,
      pctUnder45Mins: 74,
      totalAreaSqft: '2.4M sq.ft',
      leedRating: 'Gold',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Powai Lake Township', 'JVLR Arterial Link', 'Walk-to-Work Community']
    }
  ],
  BLR: [
    {
      id: 'BLR-OF-1',
      name: 'Embassy TechVillage',
      microMarket: 'Outer Ring Road (ORR)',
      rentPerSqft: 115.0,
      grade: 'Grade-A+',
      latitude: 12.9279,
      longitude: 77.6914,
      avgCommuteMins: 46,
      pctUnder45Mins: 55,
      totalAreaSqft: '4.0M sq.ft',
      leedRating: 'Platinum',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Global GCC Concentration', 'Feeder Shuttles', 'High Tech Ecosystem']
    },
    {
      id: 'BLR-OF-2',
      name: 'ITPB',
      microMarket: 'Whitefield (East)',
      rentPerSqft: 80.0,
      grade: 'Grade-A',
      latitude: 12.9855,
      longitude: 77.7412,
      avgCommuteMins: 39,
      pctUnder45Mins: 68,
      totalAreaSqft: '2.5M sq.ft',
      leedRating: 'Gold',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Purple Metro Terminal', 'Integrated Township', 'Resilient Travel Times']
    },
    {
      id: 'BLR-OF-3',
      name: 'Manyata Tech Park',
      microMarket: 'North Bengaluru (Hebbal)',
      rentPerSqft: 105.0,
      grade: 'Grade-A+',
      latitude: 13.0456,
      longitude: 77.6224,
      avgCommuteMins: 31,
      pctUnder45Mins: 81,
      totalAreaSqft: '9.8M sq.ft',
      leedRating: 'Platinum',
      imageUrl: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Airport Corridor', 'Fast North Connectivity', '31m Average Commute']
    },
    {
      id: 'BLR-OF-4',
      name: 'Bagmane Tech Park',
      microMarket: 'CV Raman Nagar / Indiranagar',
      rentPerSqft: 110.0,
      grade: 'Grade-A+',
      latitude: 12.9784,
      longitude: 77.6582,
      avgCommuteMins: 27,
      pctUnder45Mins: 86,
      totalAreaSqft: '3.2M sq.ft',
      leedRating: 'Gold',
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Central Tech Hub', 'Metro Byappanahalli 400m', 'Lush Campus Lake']
    },
    {
      id: 'BLR-OF-5',
      name: 'Prestige Tech Park',
      microMarket: 'ORR - Marathahalli',
      rentPerSqft: 120.0,
      grade: 'Grade-A+',
      latitude: 12.9372,
      longitude: 77.6938,
      avgCommuteMins: 41,
      pctUnder45Mins: 64,
      totalAreaSqft: '2.8M sq.ft',
      leedRating: 'Platinum',
      imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&auto=format&fit=crop&q=80',
      keyFeatures: ['Prime ORR Corridor', 'Direct Flyover Access', 'High Density GCCs']
    }
  ]
};

export const STORYLINES = {
  CHE: {
    headline: 'Guindy Central vs OMR Toll Corridor',
    narrative: 'Relocating to Olympia Tech Park (Guindy) cuts collective commute times by 35% compared to deep OMR. Employees from Velachery, Anna Nagar, and West Chennai avoid the OMR bottleneck, bringing 91% of workforce within a 45-minute travel radius.',
    statHighlight: '-29% Transit Hours Saved'
  },
  BOM: {
    headline: 'BKC Prestige vs Navi Mumbai Cost-Catchment Arbitrage',
    narrative: 'While BKC commands ₹275/sqft, Mindspace Airoli at ₹70/sqft achieves an 84% under-45m commute accessibility for the massive Central Line, Thane, and Navi Mumbai engineering workforce, delivering a 74% real-estate cost savings.',
    statHighlight: '74% Rent Reduction'
  },
  BLR: {
    headline: 'ORR Bottleneck Mitigation via North Bengaluru & Whitefield',
    narrative: 'Severe peak congestion around Outer Ring Road (Silk Board to Marathahalli) leaves only 55% of employees within 45 mins. Whitefield with Purple Metro and Manyata (Hebbal) improve accessibility to 81% with 31 min average commutes.',
    statHighlight: '+26% On-Time Commuters'
  }
};

export const FALLBACK_SCORECARDS = {
  CHE: [
    {
      officeId: "CHE-OF-1",
      officeName: "Olympia Tech Park",
      microMarket: "Guindy (Central)",
      rentPerSqft: 95.0,
      avgCommuteMins: 24,
      pctUnder45Mins: "91%",
      pctUnder30Mins: "77%",
      sustainabilityScore: 9.2,
      transitAccessibilityScore: 9.6,
      recommendationSummary: "Optimal central location. Sits at the confluence of Anna Salai and Inner Ring Road, cutting transit time for South & West Chennai by ~35%.",
      commuteDistribution: {
        "<15m": 35,
        "15-30m": 42,
        "30-45m": 14,
        "45-60m": 7,
        ">60m": 2
      }
    },
    {
      officeId: "CHE-OF-2",
      officeName: "RMZ Millenia",
      microMarket: "OMR - Perungudi",
      rentPerSqft: 85.0,
      avgCommuteMins: 34,
      pctUnder45Mins: "76%",
      pctUnder30Mins: "52%",
      sustainabilityScore: 7.8,
      transitAccessibilityScore: 7.5,
      recommendationSummary: "High tech talent density in South Chennai, but creates severe bottleneck for West & Central employees due to toll plaza congestion.",
      commuteDistribution: {
        "<15m": 22,
        "15-30m": 30,
        "30-45m": 24,
        "45-60m": 16,
        ">60m": 8
      }
    },
    {
      officeId: "CHE-OF-3",
      officeName: "DLF Cybercity",
      microMarket: "Porur (West Corridor)",
      rentPerSqft: 75.0,
      avgCommuteMins: 42,
      pctUnder45Mins: "63%",
      pctUnder30Mins: "43%",
      sustainabilityScore: 7.1,
      transitAccessibilityScore: 6.8,
      recommendationSummary: "Cost-effective rental profile (₹75/sqft). Strong appeal for West Chennai talent pool; long haul for OMR/ECR employees.",
      commuteDistribution: {
        "<15m": 18,
        "15-30m": 25,
        "30-45m": 20,
        "45-60m": 22,
        ">60m": 15
      }
    },
    {
      officeId: "CHE-OF-4",
      officeName: "Tidel Park",
      microMarket: "Taramani (IT Corridor)",
      rentPerSqft: 90.0,
      avgCommuteMins: 28,
      pctUnder45Mins: "84%",
      pctUnder30Mins: "68%",
      sustainabilityScore: 8.8,
      transitAccessibilityScore: 9.1,
      recommendationSummary: "Premier IT landmark in Taramani with direct MRTS station access. Fast connectivity for South & Coastal Chennai talent.",
      commuteDistribution: {
        "<15m": 30,
        "15-30m": 38,
        "30-45m": 16,
        "45-60m": 11,
        ">60m": 5
      }
    },
    {
      officeId: "CHE-OF-5",
      officeName: "ASV Suntech Park",
      microMarket: "OMR - Thoraipakkam",
      rentPerSqft: 70.0,
      avgCommuteMins: 37,
      pctUnder45Mins: "71%",
      pctUnder30Mins: "50%",
      sustainabilityScore: 7.4,
      transitAccessibilityScore: 7.2,
      recommendationSummary: "Competitive rental terms in mid-OMR (₹70/sqft). Well-positioned for Medavakkam & South Chennai tech talent.",
      commuteDistribution: {
        "<15m": 20,
        "15-30m": 28,
        "30-45m": 23,
        "45-60m": 18,
        ">60m": 11
      }
    }
  ],
  BOM: [
    {
      officeId: "BOM-OF-1",
      officeName: "Maker Maxity / ONE BKC",
      microMarket: "Bandra-Kurla Complex (BKC)",
      rentPerSqft: 275.0,
      avgCommuteMins: 38,
      pctUnder45Mins: "72%",
      pctUnder30Mins: "47%",
      sustainabilityScore: 8.5,
      transitAccessibilityScore: 8.8,
      recommendationSummary: "Premier business address with highest executive prestige; central node connecting Western & Central rail lines via SCLR.",
      commuteDistribution: {
        "<15m": 15,
        "15-30m": 32,
        "30-45m": 25,
        "45-60m": 18,
        ">60m": 10
      }
    },
    {
      officeId: "BOM-OF-2",
      officeName: "One Lodha Place",
      microMarket: "Lower Parel / Worli",
      rentPerSqft: 220.0,
      avgCommuteMins: 44,
      pctUnder45Mins: "59%",
      pctUnder30Mins: "34%",
      sustainabilityScore: 7.2,
      transitAccessibilityScore: 7.9,
      recommendationSummary: "South Mumbai proximity and lifestyle amenities, but high peak-hour bottleneck for Northern suburban workforce.",
      commuteDistribution: {
        "<15m": 10,
        "15-30m": 24,
        "30-45m": 25,
        "45-60m": 22,
        ">60m": 19
      }
    },
    {
      officeId: "BOM-OF-3",
      officeName: "Mindspace Airoli",
      microMarket: "Navi Mumbai (East)",
      rentPerSqft: 70.0,
      avgCommuteMins: 29,
      pctUnder45Mins: "84%",
      pctUnder30Mins: "70%",
      sustainabilityScore: 8.9,
      transitAccessibilityScore: 7.4,
      recommendationSummary: "High affordability (₹70/sqft) with 84% of Central Line & Thane workforce within 45 mins. 74% rent reduction vs BKC.",
      commuteDistribution: {
        "<15m": 38,
        "15-30m": 32,
        "30-45m": 14,
        "45-60m": 11,
        ">60m": 5
      }
    },
    {
      officeId: "BOM-OF-4",
      officeName: "Nesco IT Park",
      microMarket: "Goregaon (Western Suburbs)",
      rentPerSqft: 135.0,
      avgCommuteMins: 33,
      pctUnder45Mins: "79%",
      pctUnder30Mins: "64%",
      sustainabilityScore: 8.6,
      transitAccessibilityScore: 8.4,
      recommendationSummary: "Direct Western Express Highway & Ram Mandir railway connectivity. Captures North & Western suburban talent without South Mumbai premiums.",
      commuteDistribution: {
        "<15m": 22,
        "15-30m": 35,
        "30-45m": 22,
        "45-60m": 14,
        ">60m": 7
      }
    },
    {
      officeId: "BOM-OF-5",
      officeName: "Hiranandani Business Park",
      microMarket: "Powai (Central Suburbs)",
      rentPerSqft: 150.0,
      avgCommuteMins: 36,
      pctUnder45Mins: "74%",
      pctUnder30Mins: "58%",
      sustainabilityScore: 8.3,
      transitAccessibilityScore: 8.7,
      recommendationSummary: "Integrated mixed-use township with JVLR arterial connectivity. Strong live-work-play ecosystem.",
      commuteDistribution: {
        "<15m": 25,
        "15-30m": 30,
        "30-45m": 19,
        "45-60m": 16,
        ">60m": 10
      }
    }
  ],
  BLR: [
    {
      officeId: "BLR-OF-1",
      officeName: "Embassy TechVillage",
      microMarket: "Outer Ring Road (ORR)",
      rentPerSqft: 115.0,
      avgCommuteMins: 46,
      pctUnder45Mins: "55%",
      pctUnder30Mins: "34%",
      sustainabilityScore: 6.8,
      transitAccessibilityScore: 6.2,
      recommendationSummary: "Unbeatable GCC talent concentration, but highest commute variability due to Silk Board and Marathahalli peak choke-points.",
      commuteDistribution: {
        "<15m": 12,
        "15-30m": 22,
        "30-45m": 21,
        "45-60m": 26,
        ">60m": 19
      }
    },
    {
      officeId: "BLR-OF-2",
      officeName: "ITPB",
      microMarket: "Whitefield (East)",
      rentPerSqft: 80.0,
      avgCommuteMins: 39,
      pctUnder45Mins: "68%",
      pctUnder30Mins: "50%",
      sustainabilityScore: 8.1,
      transitAccessibilityScore: 8.4,
      recommendationSummary: "Purple Metro connectivity provides resilient commute times for East & Central Bangalore workforce.",
      commuteDistribution: {
        "<15m": 24,
        "15-30m": 26,
        "30-45m": 18,
        "45-60m": 18,
        ">60m": 14
      }
    },
    {
      officeId: "BLR-OF-3",
      officeName: "Manyata Tech Park",
      microMarket: "North Bengaluru (Hebbal)",
      rentPerSqft: 105.0,
      avgCommuteMins: 31,
      pctUnder45Mins: "81%",
      pctUnder30Mins: "62%",
      sustainabilityScore: 8.7,
      transitAccessibilityScore: 8.1,
      recommendationSummary: "Fastest corridor to Kempegowda Airport and emerging northern residential clusters; 31 mins average commute.",
      commuteDistribution: {
        "<15m": 28,
        "15-30m": 34,
        "30-45m": 19,
        "45-60m": 12,
        ">60m": 7
      }
    },
    {
      officeId: "BLR-OF-4",
      officeName: "Bagmane Tech Park",
      microMarket: "CV Raman Nagar / Indiranagar",
      rentPerSqft: 110.0,
      avgCommuteMins: 27,
      pctUnder45Mins: "86%",
      pctUnder30Mins: "72%",
      sustainabilityScore: 9.0,
      transitAccessibilityScore: 9.3,
      recommendationSummary: "Central tech park near Byappanahalli Metro. 86% of workforce within 45 mins with 27m average commute.",
      commuteDistribution: {
        "<15m": 32,
        "15-30m": 38,
        "30-45m": 16,
        "45-60m": 9,
        ">60m": 5
      }
    },
    {
      officeId: "BLR-OF-5",
      officeName: "Prestige Tech Park",
      microMarket: "ORR - Marathahalli",
      rentPerSqft: 120.0,
      avgCommuteMins: 41,
      pctUnder45Mins: "64%",
      pctUnder30Mins: "44%",
      sustainabilityScore: 7.5,
      transitAccessibilityScore: 7.0,
      recommendationSummary: "Flagship ORR GCC campus with direct flyover frontage. High prestige occupier ecosystem.",
      commuteDistribution: {
        "<15m": 16,
        "15-30m": 26,
        "30-45m": 22,
        "45-60m": 21,
        ">60m": 15
      }
    }
  ]
};
