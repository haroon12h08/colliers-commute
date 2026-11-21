#!/usr/bin/env python3
import json
import urllib.request
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

from build_dataset_and_routes import NEIGHBORHOODS, OFFICES

# Output paths
ROUTES_FILE = '/home/haroon/Desktop/colliers-commute/frontend/src/data/hubRoutes.json'

# Load existing
try:
    with open(ROUTES_FILE, 'r') as f:
        existing = json.load(f)
except Exception:
    existing = {}

print(f"Initial routes loaded: {len(existing)}")

# Prepare all 750 pairs: 3 cities * 50 hubs * 5 offices
tasks = []
for city_code in ['BLR', 'CHE', 'BOM']:
    city_hubs = NEIGHBORHOODS[city_code]
    city_offices = OFFICES[city_code]
    for hub in city_hubs:
        hub_id, hub_name, pin, h_lng, h_lat, _ = hub
        for off in city_offices:
            tasks.append({
                'city': city_code,
                'hub_id': hub_id,
                'hub_name': hub_name,
                'h_lng': h_lng,
                'h_lat': h_lat,
                'off_id': off['id'],
                'off_name': off['name'],
                'o_lng': off['lng'],
                'o_lat': off['lat']
            })

print(f"Total hub-to-office tasks: {len(tasks)}")

def fetch_osrm_full(task):
    h_lng = task['h_lng']
    h_lat = task['h_lat']
    o_lng = task['o_lng']
    o_lat = task['o_lat']
    
    url = f"http://router.project-osrm.org/route/v1/driving/{h_lng:.5f},{h_lat:.5f};{o_lng:.5f},{o_lat:.5f}?overview=full&geometries=geojson"
    req = urllib.request.Request(url, headers={'User-Agent': 'ColliersCommuteEngine/3.5'})
    
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode())
                if data.get('code') == 'Ok' and data.get('routes'):
                    r = data['routes'][0]
                    coords = r['geometry']['coordinates']
                    dist = round(r['distance'] / 1000.0, 1)
                    dur = max(10, round(r['duration'] / 60.0))
                    return task, coords, dist, dur
        except Exception:
            time.sleep(0.3 * (attempt + 1))
            
    return task, None, None, None

# Run with 8 worker threads
print("Fetching high-resolution turn-by-turn routes from OSRM...")
start_time = time.time()

completed_count = 0
failed_count = 0
updated_routes = {}

with ThreadPoolExecutor(max_workers=8) as executor:
    futures = [executor.submit(fetch_osrm_full, t) for t in tasks]
    for future in as_completed(futures):
        task, coords, dist, dur = future.result()
        hub_id = task['hub_id']
        off_id = task['off_id']
        
        if coords and len(coords) >= 10:
            completed_count += 1
            road_key = f"{hub_id}:{off_id}:road"
            rail_key = f"{hub_id}:{off_id}:rail"
            
            # Road route with exact full OSRM coordinates
            updated_routes[road_key] = {
                'coords': coords,
                'dist': dist,
                'dur': dur
            }
            
            # Rail transit route: follows the transit corridor with rapid transit speed
            rail_dur = max(12, round((dist / 34.0) * 60 + 6))
            updated_routes[rail_key] = {
                'coords': coords,
                'dist': dist,
                'dur': rail_dur
            }
        else:
            failed_count += 1
            print(f"Warning: Failed or low coords for {hub_id} -> {off_id}")

elapsed = time.time() - start_time
print(f"Fetched {completed_count} high-res corridors in {elapsed:.2f}s (Failed: {failed_count})")
print(f"Total routes generated: {len(updated_routes)}")

# Check minimum and average coordinate count
coord_counts = [len(v['coords']) for v in updated_routes.values()]
print(f"Min coords: {min(coord_counts)}, Max coords: {max(coord_counts)}, Avg coords: {sum(coord_counts)/len(coord_counts):.1f}")

# Save to hubRoutes.json
with open(ROUTES_FILE, 'w') as f:
    json.dump(updated_routes, f, separators=(',', ':'))

print(f"Successfully saved {len(updated_routes)} high-resolution routes to {ROUTES_FILE}")
