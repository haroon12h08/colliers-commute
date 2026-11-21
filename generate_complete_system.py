import urllib.request
import json
import random
import time
import math
from concurrent.futures import ThreadPoolExecutor

# ==============================================================================
# 1. CANDIDATE OFFICE LOCATIONS
# ==============================================================================
OFFICES = {
    'BLR': [
        {'id': 'BLR-OF-1', 'name': 'Embassy TechVillage (ORR)', 'lng': 77.6914, 'lat': 12.9279, 'microMarket': 'Outer Ring Road (ORR)'},
        {'id': 'BLR-OF-2', 'name': 'ITPB (Whitefield)', 'lng': 77.7412, 'lat': 12.9855, 'microMarket': 'Whitefield (East)'},
        {'id': 'BLR-OF-3', 'name': 'Manyata Tech Park (Hebbal)', 'lng': 77.6224, 'lat': 13.0456, 'microMarket': 'North Bengaluru (Hebbal)'}
    ],
    'CHE': [
        {'id': 'CHE-OF-1', 'name': 'Olympia Tech Park (Guindy)', 'lng': 80.2057, 'lat': 13.0134, 'microMarket': 'Guindy (Central)'},
        {'id': 'CHE-OF-2', 'name': 'RMZ Millenia (OMR)', 'lng': 80.2484, 'lat': 12.9664, 'microMarket': 'OMR - Perungudi'},
        {'id': 'CHE-OF-3', 'name': 'DLF Cybercity (Porur)', 'lng': 80.1548, 'lat': 13.0312, 'microMarket': 'Porur (West)'}
    ],
    'BOM': [
        {'id': 'BOM-OF-1', 'name': 'Maker Maxity / ONE BKC', 'lng': 72.8656, 'lat': 19.0657, 'microMarket': 'Bandra-Kurla Complex (BKC)'},
        {'id': 'BOM-OF-2', 'name': 'One Lodha Place (Lower Parel)', 'lng': 72.8300, 'lat': 18.9952, 'microMarket': 'Lower Parel / Worli'},
        {'id': 'BOM-OF-3', 'name': 'Mindspace Airoli (Navi Mumbai)', 'lng': 73.0011, 'lat': 19.1579, 'microMarket': 'Navi Mumbai (East)'}
    ]
}

# ==============================================================================
# 2. METRO & TRAIN SEQUENCES (For Real Rail Transit Routes)
# ==============================================================================
BLR_PURPLE_STATIONS = [
    (77.7600, 12.9857), (77.7533, 12.9855), (77.7475, 12.9854), (77.7412, 12.9855),
    (77.7303, 12.9822), (77.7214, 12.9818), (77.7126, 12.9847), (77.7022, 12.9877),
    (77.6934, 12.9902), (77.6833, 12.9922), (77.6741, 12.9934), (77.6651, 12.9942),
    (77.6565, 12.9933), (77.6508, 12.9904), (77.6438, 12.9858), (77.6384, 12.9784),
    (77.6267, 12.9754), (77.6171, 12.9729), (77.6068, 12.9756), (77.5997, 12.9803),
    (77.5925, 12.9797), (77.5855, 12.9765), (77.5726, 12.9757), (77.5670, 12.9778),
    (77.5539, 12.9755), (77.5456, 12.9748), (77.5372, 12.9698), (77.5332, 12.9622),
    (77.5367, 12.9525), (77.5312, 12.9468), (77.5255, 12.9405), (77.5188, 12.9348),
    (77.5102, 12.9295), (77.5005, 12.9234), (77.4899, 12.9168), (77.4788, 12.9098)
]

CHE_BLUE_STATIONS = [
    (80.3015, 13.1672), (80.2982, 13.1554), (80.2895, 13.1098), (80.2865, 13.0882),
    (80.2762, 13.0818), (80.2735, 13.0701), (80.2662, 13.0645), (80.2558, 13.0582),
    (80.2482, 13.0485), (80.2452, 13.0408), (80.2398, 13.0315), (80.2285, 13.0232),
    (80.2221, 13.0185), (80.2057, 13.0134), (80.2014, 13.0033), (80.1945, 12.9934),
    (80.1812, 12.9875), (80.1705, 12.9812)
]

CHE_GREEN_STATIONS = [
    (80.2762, 13.0818), (80.2612, 13.0782), (80.2412, 13.0784), (80.2265, 13.0768),
    (80.2090, 13.0878), (80.1985, 13.0852), (80.1912, 13.0725), (80.1982, 13.0672),
    (80.2055, 13.0612), (80.2112, 13.0505), (80.2125, 13.0352), (80.2072, 13.0225),
    (80.2014, 13.0033), (80.1942, 12.9952)
]

BOM_WESTERN_STATIONS = [
    (72.8277, 18.9322), (72.8242, 18.9438), (72.8188, 18.9515), (72.8162, 18.9632),
    (72.8192, 18.9712), (72.8245, 18.9825), (72.8300, 18.9952), (72.8325, 19.0062),
    (72.8425, 19.0178), (72.8432, 19.0412), (72.8402, 19.0552), (72.8378, 19.0682),
    (72.8398, 19.0815), (72.8442, 19.0988), (72.8465, 19.1198), (72.8492, 19.1362),
    (72.8488, 19.1645), (72.8485, 19.1860), (72.8512, 19.2045), (72.8567, 19.2307),
    (72.8598, 19.2552), (72.8682, 19.2815), (72.8525, 19.3012)
]

BOM_TRANSHARBOUR_STATIONS = [
    (72.9781, 19.1862), (72.9912, 19.1712), (72.9935, 19.1579), (73.0035, 19.1352),
    (73.0085, 19.1182), (73.0112, 19.0982), (73.0152, 19.0752), (72.9986, 19.0770)
]

def get_closest_station_index(stations, lng, lat):
    best_idx = 0
    best_dist = 999999
    for i, (slng, slat) in enumerate(stations):
        d = (slng - lng)**2 + (slat - lat)**2
        if d < best_dist:
            best_dist = d
            best_idx = i
    return best_idx

def get_rail_path(stations, start_lng, start_lat, end_lng, end_lat):
    start_idx = get_closest_station_index(stations, start_lng, start_lat)
    end_idx = get_closest_station_index(stations, end_lng, end_lat)
    if start_idx <= end_idx:
        seg = [list(stations[i]) for i in range(start_idx, end_idx + 1)]
    else:
        seg = [list(stations[i]) for i in range(start_idx, end_idx - 1, -1)]
    # First and last mile walk
    return [[start_lng, start_lat]] + seg + [[end_lng, end_lat]]

# Helper distance
def haversine(lon1, lat1, lon2, lat2):
    R = 6371
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

# OSRM road fetcher with retries
def fetch_osrm_route(origin_lng, origin_lat, dest_lng, dest_lat):
    url = f"http://router.project-osrm.org/route/v1/driving/{origin_lng},{origin_lat};{dest_lng},{dest_lat}?overview=simplified&geometries=geojson"
    req = urllib.request.Request(url, headers={'User-Agent': 'ColliersCommuteGIS/1.0'})
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=6) as resp:
                data = json.loads(resp.read().decode())
                if data.get('code') == 'Ok' and data.get('routes'):
                    r = data['routes'][0]
                    return {
                        'coords': r['geometry']['coordinates'],
                        'distanceKm': round(r['distance'] / 1000.0, 1),
                        'durationMins': max(10, round(r['duration'] / 60.0))
                    }
        except Exception:
            time.sleep(0.3)
    # Fallback to realistic interpolated waypoint corridor
    return None

print("OSRM routing helper initialized.")
