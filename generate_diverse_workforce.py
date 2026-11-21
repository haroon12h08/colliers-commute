import urllib.request
import json
import random
import time
from concurrent.futures import ThreadPoolExecutor

# 1. METRO & TRAIN NETWORK GEOMETRIES
# Bangalore Namma Metro
BLR_PURPLE_LINE = [
    ("Whitefield (Kadugodi)", 77.7600, 12.9857),
    ("Hopefarm Channasandra", 77.7533, 12.9855),
    ("Kadugodi Tree Park", 77.7475, 12.9854),
    ("Pattandur Agrahara (ITPB)", 77.7412, 12.9855),
    ("Sri Sathya Sai Hospital", 77.7303, 12.9822),
    ("Nallurhalli", 77.7214, 12.9818),
    ("Kundalahalli", 77.7126, 12.9847),
    ("Seetharampalya", 77.7022, 12.9877),
    ("Hoodi", 77.6934, 12.9902),
    ("Garudacharpalya", 77.6833, 12.9922),
    ("Singayyanapalya", 77.6741, 12.9934),
    ("KR Puram", 77.6651, 12.9942),
    ("Benniganahalli", 77.6565, 12.9933),
    ("Baiyappanahalli", 77.6508, 12.9904),
    ("Swami Vivekananda Rd", 77.6438, 12.9858),
    ("Indiranagar", 77.6384, 12.9784),
    ("Halasuru", 77.6267, 12.9754),
    ("Trinity", 77.6171, 12.9729),
    ("MG Road", 77.6068, 12.9756),
    ("Cubbon Park", 77.5997, 12.9803),
    ("Vidhana Soudha", 77.5925, 12.9797),
    ("Central College", 77.5855, 12.9765),
    ("Kempegowda Majestic", 77.5726, 12.9757),
    ("City Railway Station", 77.5670, 12.9778),
    ("Magadi Road", 77.5539, 12.9755),
    ("Hosahalli", 77.5456, 12.9748),
    ("Vijayanagar", 77.5372, 12.9698),
    ("Attiguppe", 77.5332, 12.9622),
    ("Deepanjali Nagar", 77.5367, 12.9525),
    ("Mysore Road", 77.5312, 12.9468),
    ("Nayandahalli", 77.5255, 12.9405),
    ("Rajarajeshwari Nagar", 77.5188, 12.9348),
    ("Jnanabharathi", 77.5102, 12.9295),
    ("Pattanagere", 77.5005, 12.9234),
    ("Kengeri Bus Terminal", 77.4899, 12.9168),
    ("Kengeri", 77.4788, 12.9098)
]

BLR_GREEN_LINE = [
    ("Nagasandra", 77.5002, 13.0478),
    ("Dasarahalli", 77.5135, 13.0435),
    ("Jalahalli", 77.5218, 13.0392),
    ("Peenya Industry", 77.5262, 13.0327),
    ("Peenya", 77.5335, 13.0285),
    ("Goraguntepalya", 77.5412, 13.0238),
    ("Yeshwanthpur", 77.5498, 13.0182),
    ("Sandal Soap Factory", 77.5538, 13.0145),
    ("Mahalakshmi", 77.5501, 13.0078),
    ("Rajajinagar", 77.5542, 13.0002),
    ("Kuvempu Road", 77.5582, 12.9934),
    ("Srirampura", 77.5621, 12.9868),
    ("Sampige Road", 77.5702, 12.9902),
    ("Kempegowda Majestic", 77.5726, 12.9757),
    ("Chickpet", 77.5742, 12.9678),
    ("KR Market", 77.5761, 12.9612),
    ("National College", 77.5732, 12.9505),
    ("Lalbagh", 77.5802, 12.9462),
    ("South End Circle", 77.5805, 12.9385),
    ("Jayanagar", 77.5802, 12.9308),
    ("RV Road", 77.5801, 12.9215),
    ("Banashankari", 77.5734, 12.9152),
    ("JP Nagar", 77.5702, 12.9075),
    ("Yelachenahalli", 77.5714, 12.8958),
    ("Konanakunte Cross", 77.5698, 12.8852),
    ("Silk Institute", 77.5278, 12.8522)
]

# Chennai Metro Blue Line
CHE_BLUE_LINE = [
    ("Wimco Nagar", 80.3015, 13.1672),
    ("Washermanpet", 80.2895, 13.1098),
    ("Mannadi", 80.2882, 13.0954),
    ("High Court", 80.2865, 13.0882),
    ("Chennai Central", 80.2762, 13.0818),
    ("Government Estate", 80.2735, 13.0701),
    ("LIC", 80.2662, 13.0645),
    ("Thousand Lights", 80.2558, 13.0582),
    ("AG-DMS", 80.2482, 13.0485),
    ("Teynampet", 80.2452, 13.0408),
    ("Nandanam", 80.2398, 13.0315),
    ("Saidapet", 80.2285, 13.0232),
    ("Little Mount", 80.2221, 13.0185),
    ("Guindy (Olympia)", 80.2057, 13.0134),
    ("Alandur Interchange", 80.2014, 13.0033),
    ("Nanganallur Road", 80.1945, 12.9934),
    ("Meenambakkam", 80.1812, 12.9875),
    ("Airport", 80.1705, 12.9812)
]

# Chennai Metro Green Line
CHE_GREEN_LINE = [
    ("Chennai Central", 80.2762, 13.0818),
    ("Egmore", 80.2612, 13.0782),
    ("Nehru Park", 80.2514, 13.0792),
    ("Kilpauk", 80.2412, 13.0784),
    ("Shenoy Nagar", 80.2265, 13.0768),
    ("Anna Nagar East", 80.2185, 13.0842),
    ("Anna Nagar Tower", 80.2090, 13.0878),
    ("Thirumangalam", 80.1985, 13.0852),
    ("Koyambedu", 80.1912, 13.0725),
    ("CMBT", 80.1982, 13.0672),
    ("Arumbakkam", 80.2055, 13.0612),
    ("Vadapalani", 80.2112, 13.0505),
    ("Ashok Nagar", 80.2125, 13.0352),
    ("Ekkattuthangal", 80.2072, 13.0225),
    ("Alandur Interchange", 80.2014, 13.0033),
    ("St. Thomas Mount", 80.1942, 12.9952)
]

# Mumbai Western Line (Suburban Railway)
BOM_WESTERN_LINE = [
    ("Churchgate", 72.8277, 18.9322),
    ("Marine Lines", 72.8242, 18.9438),
    ("Charni Road", 72.8188, 18.9515),
    ("Grant Road", 72.8162, 18.9632),
    ("Mumbai Central", 72.8192, 18.9712),
    ("Mahalaxmi", 72.8245, 18.9825),
    ("Lower Parel (One Lodha)", 72.8300, 18.9952),
    ("Prabhadevi", 72.8325, 19.0062),
    ("Dadar Western", 72.8425, 19.0178),
    ("Matunga Road", 72.8445, 19.0285),
    ("Mahim", 72.8432, 19.0412),
    ("Bandra (ONE BKC)", 72.8402, 19.0552),
    ("Khar Road", 72.8378, 19.0682),
    ("Santacruz", 72.8398, 19.0815),
    ("Vile Parle", 72.8442, 19.0988),
    ("Andheri", 72.8465, 19.1198),
    ("Jogeshwari", 72.8492, 19.1362),
    ("Ram Mandir", 72.8512, 19.1512),
    ("Goregaon", 72.8488, 19.1645),
    ("Malad", 72.8485, 19.1860),
    ("Kandivali", 72.8512, 19.2045),
    ("Borivali", 72.8567, 19.2307),
    ("Dahisar", 72.8598, 19.2552),
    ("Mira Road", 72.8682, 19.2815),
    ("Bhayandar", 72.8525, 19.3012)
]

# Mumbai Central Line (Suburban Railway)
BOM_CENTRAL_LINE = [
    ("CSMT", 72.8354, 18.9402),
    ("Byculla", 72.8322, 18.9754),
    ("Currey Road (Lower Parel)", 72.8340, 18.9945),
    ("Dadar Central", 72.8435, 19.0182),
    ("Kurla (ONE BKC)", 72.8798, 19.0652),
    ("Ghatkopar", 72.9082, 19.0862),
    ("Vikhroli", 72.9298, 19.1112),
    ("Kanjurmarg", 72.9352, 19.1285),
    ("Bhandup", 72.9385, 19.1452),
    ("Mulund", 72.9425, 19.1726),
    ("Thane", 72.9781, 19.1862)
]

# Mumbai Trans-Harbour Line (Direct to Mindspace Airoli)
BOM_TRANSHARBOUR_LINE = [
    ("Thane", 72.9781, 19.1862),
    ("Digha Gaon", 72.9912, 19.1712),
    ("Airoli (Mindspace Airoli)", 72.9935, 19.1579),
    ("Rabale", 73.0035, 19.1352),
    ("Ghansoli", 73.0085, 19.1182),
    ("Kopar Khairane", 73.0112, 19.0982),
    ("Turbhe", 73.0152, 19.0752),
    ("Vashi", 72.9986, 19.0770)
]

print("Transit network definitions loaded successfully.")
