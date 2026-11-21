import urllib.request
import json
import time
from concurrent.futures import ThreadPoolExecutor

def fetch_osrm_route(origin_lng, origin_lat, dest_lng, dest_lat):
    url = f"http://router.project-osrm.org/route/v1/driving/{origin_lng},{origin_lat};{dest_lng},{dest_lat}?overview=simplified&geometries=geojson"
    req = urllib.request.Request(url, headers={'User-Agent': 'ColliersCommute/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
            if data.get('code') == 'Ok' and data.get('routes'):
                r = data['routes'][0]
                return {
                    'coords': r['geometry']['coordinates'],
                    'distanceKm': round(r['distance'] / 1000.0, 1),
                    'durationMins': max(10, round(r['duration'] / 60.0))
                }
    except Exception as e:
        print(f"OSRM error ({origin_lng},{origin_lat}): {e}")
    return None

res = fetch_osrm_route(77.6389, 12.9121, 77.6224, 13.0456)
print("HSR to Manyata result:", res['distanceKm'], "km,", res['durationMins'], "mins, coords count:", len(res['coords']))
