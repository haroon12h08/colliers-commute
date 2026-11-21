import urllib.request
import json
import random
import time
import math
from concurrent.futures import ThreadPoolExecutor

first_names = [
    "Aarav", "Aditi", "Ananya", "Arjun", "Deepak", "Divya", "Gautam", "Harish", "Ishaan", "Kavya",
    "Manish", "Meera", "Naveen", "Neha", "Pranav", "Pooja", "Rahul", "Rhea", "Rohan", "Sanjay",
    "Shreya", "Siddharth", "Sneha", "Tarun", "Varun", "Vidya", "Vikram", "Yash", "Tanvi", "Kiran",
    "Swathi", "Ramesh", "Priya", "Ashwin", "Karthik", "Lakshmi", "Vignesh", "Anand", "Nisha", "Ganesh",
    "Amit", "Sunita", "Rajesh", "Pooja", "Kunal", "Preeti", "Alok", "Simran", "Nitin", "Anjali"
]

last_names = [
    "Sharma", "Verma", "Patel", "Iyer", "Nair", "Reddy", "Rao", "Menon", "Sundaram", "Krishnan",
    "Bose", "Chatterjee", "Deshmukh", "Kulkarni", "Joshi", "Bhat", "Mehta", "Shah", "Agarwal", "Gupta",
    "Nambiar", "Pillai", "Chauhan", "Bhattacharya", "Sengupta", "Subramanian", "Mukherjee", "Kapoor", "Malhotra", "Shetty",
    "Jadhav", "Sawant", "Fernandes", "Pereira", "D'Souza", "Naik", "Gowda", "Balaji", "Ranganathan", "Nadkarni"
]

depts = [
    "Valuation & Advisory Services", "Capital Markets & Investment", "Occupier Strategy & Solutions",
    "Project & Development Services", "Real Estate Management Services", "Enterprise Technology & GIS",
    "Human Resources & Operations", "Legal & Regulatory Compliance"
]

titles = [
    "Senior Analyst", "Associate Director", "Vice President", "Consultant", "Director",
    "Spatial Data Scientist", "Senior Project Manager", "Research Associate", "Valuation Specialist", "Leasing Manager"
]

modes = [
    "Driving (Car)", "Two-Wheeler (Bike/EV)", "Metro Rail", "Suburban Train", "Bus Transit"
]

OFFICES = {
    'BLR': [
        {'id': 'BLR-OF-1', 'name': 'Embassy TechVillage (ORR)', 'lng': 77.6914, 'lat': 12.9279},
        {'id': 'BLR-OF-2', 'name': 'ITPB (Whitefield)', 'lng': 77.7412, 'lat': 12.9855},
        {'id': 'BLR-OF-3', 'name': 'Manyata Tech Park (Hebbal)', 'lng': 77.6224, 'lat': 13.0456},
        {'id': 'BLR-OF-4', 'name': 'Bagmane Tech Park (CV Raman Nagar)', 'lng': 77.6582, 'lat': 12.9784},
        {'id': 'BLR-OF-5', 'name': 'Prestige Tech Park (ORR)', 'lng': 77.6938, 'lat': 12.9372}
    ],
    'CHE': [
        {'id': 'CHE-OF-1', 'name': 'Olympia Tech Park (Guindy)', 'lng': 80.2057, 'lat': 13.0134},
        {'id': 'CHE-OF-2', 'name': 'RMZ Millenia (OMR)', 'lng': 80.2484, 'lat': 12.9664},
        {'id': 'CHE-OF-3', 'name': 'DLF Cybercity (Porur)', 'lng': 80.1548, 'lat': 13.0312},
        {'id': 'CHE-OF-4', 'name': 'Tidel Park (Taramani)', 'lng': 80.2478, 'lat': 12.9892},
        {'id': 'CHE-OF-5', 'name': 'ASV Suntech Park (OMR)', 'lng': 80.2325, 'lat': 12.9358}
    ],
    'BOM': [
        {'id': 'BOM-OF-1', 'name': 'Maker Maxity / ONE BKC', 'lng': 72.8656, 'lat': 19.0657},
        {'id': 'BOM-OF-2', 'name': 'One Lodha Place (Lower Parel)', 'lng': 72.8300, 'lat': 18.9952},
        {'id': 'BOM-OF-3', 'name': 'Mindspace Airoli (Navi Mumbai)', 'lng': 73.0011, 'lat': 19.1579},
        {'id': 'BOM-OF-4', 'name': 'Nesco IT Park (Goregaon)', 'lng': 72.8538, 'lat': 19.1551},
        {'id': 'BOM-OF-5', 'name': 'Hiranandani Business Park (Powai)', 'lng': 72.9060, 'lat': 19.1176}
    ]
}

# ==============================================================================
# 50 NEIGHBORHOODS PER CITY WITH REAL LOCALITIES & ADDRESS TEMPLATES
# ==============================================================================
NEIGHBORHOODS = {
    'BLR': [
        ("blr-h01", "HSR Layout Sector 1", "560102", 77.6521, 12.9121, ["Plot 104, 19th Main", "Flat 302, Sobha Classic", "Villa 14, 27th Cross"]),
        ("blr-h02", "HSR Layout Sector 4", "560102", 77.6389, 12.9145, ["Plot 28, 14th Main Rd", "Flat 4B, Green Glen Apts", "Door 55, 5th Cross"]),
        ("blr-h03", "HSR Layout Sector 7", "560102", 77.6295, 12.9080, ["House 12, 17th Cross", "Flat 201, Salarpuria Serenity", "Plot 88, 5th Main"]),
        ("blr-h04", "Koramangala 3rd Block", "560034", 77.6245, 12.9352, ["Flat 402, Raheja Residency", "15, 80 Feet Road", "Plot 9, 12th Main"]),
        ("blr-h05", "Koramangala 5th Block", "560095", 77.6180, 12.9340, ["88, Jyoti Nivas College Rd", "Villa 6, Prestige St. Johns", "Plot 42, 1st Cross"]),
        ("blr-h06", "Koramangala 8th Block", "560095", 77.6120, 12.9405, ["Flat 101, National Games Village", "Plot 18, 80ft Perimeter Rd", "Door 24, 4th Main"]),
        ("blr-h07", "Indiranagar 100ft Rd", "560038", 77.6412, 12.9784, ["14, 100 Feet Road", "Flat 3B, Wood Street Apts", "Plot 102, 12th Main"]),
        ("blr-h08", "Indiranagar Defence Colony", "560038", 77.6450, 12.9720, ["Bungalow 8, 2nd Main Defence Colony", "Villa 17, 6th Cross", "Plot 45, 1st Avenue"]),
        ("blr-h09", "Domlur Layout", "560071", 77.6380, 12.9610, ["Flat 502, Embassy Golf Links View", "House 33, CPWD Quarters", "Door 19, 1st Stage"]),
        ("blr-h10", "Whitefield Main Rd", "560066", 77.7499, 12.9698, ["Flat 804, Prestige Shantiniketan", "Tower 3, Palm Meadows", "Flat 12B, Divyasree Republic"]),
        ("blr-h11", "ITPL Main Road", "560066", 77.7380, 12.9860, ["Sobha Rose, ITPL Road", "Flat 601, Brigade Cosmopolis", "Plot 77, Pattandur Agrahara"]),
        ("blr-h12", "Kadugodi / Hope Farm", "560067", 77.7610, 12.9910, ["Flat 304, Godrej Air", "House 21, Belathur Main Rd", "Plot 5, Kadugodi Station Rd"]),
        ("blr-h13", "Brookefield / AECS", "560037", 77.7150, 12.9680, ["Flat 402, Rohan Viti", "Plot 18, AECS Layout A-Block", "Door 99, Kundalahalli Colony"]),
        ("blr-h14", "Hoodi Circle", "560048", 77.7120, 12.9920, ["Flat 502, Mahaveer Varna", "House 45, Seetharampalya Rd", "Plot 8, Hoodi Industrial Area"]),
        ("blr-h15", "Marathahalli Bridge", "560037", 77.6974, 12.9591, ["Flat 204, Purva Riviera", "Plot 33, Outer Ring Road", "Door 11, Sanjay Nagar Marathahalli"]),
        ("blr-h16", "Kundalahalli Gate", "560037", 77.7080, 12.9620, ["Flat 701, SJR Spencer", "House 14, BEML Layout 3rd Stage", "Plot 66, ITPL Link Rd"]),
        ("blr-h17", "Bellandur Green Glen", "560103", 77.6784, 12.9304, ["Tower 2, Assetz Marq", "Flat 405, Sobha Iris", "Villa 12, Adarsh Palm Retreat"]),
        ("blr-h18", "Sarjapur Rd / Kaikondrahalli", "560035", 77.6850, 12.9103, ["Flat 803, SJR Park Vista", "Plot 19, Total Mall Road", "Door 22, Rainbow Drive Layout"]),
        ("blr-h19", "Kasavanahalli", "560035", 77.6790, 12.8980, ["Flat 304, Salarpuria Sanctum", "House 8, Kasavanahalli Lake Rd", "Plot 44, Central Jail Rd"]),
        ("blr-h20", "Carmelaram", "560035", 77.7050, 12.9050, ["Villa 28, Greenwood High Campus Rd", "Flat 501, Sobha Cinnamon", "House 16, Doddakannelli Rd"]),
        ("blr-h21", "Electronic City Phase 1", "560100", 77.6649, 12.8452, ["Flat 602, Ajmera Infinity", "Tower B, GM Infinite", "Plot 99, Neeladri Road"]),
        ("blr-h22", "Electronic City Phase 2", "560100", 77.6850, 12.8400, ["Flat 401, SJR Parkway", "House 55, Tech Mahindra Rd", "Plot 12, Bettadasanapura Rd"]),
        ("blr-h23", "Begur Road", "560068", 77.6320, 12.8850, ["Flat 202, Classic Paradise", "House 17, Begur Fort Rd", "Plot 30, Akshayanagar Link Rd"]),
        ("blr-h24", "Hulimavu / Bannerghatta", "560076", 77.5990, 12.8780, ["Flat 901, Mantri Residency", "Villa 14, Royal Lakefront", "House 38, Meenakshi Temple Rd"]),
        ("blr-h25", "JP Nagar 2nd Phase", "560078", 77.5910, 12.9150, ["Plot 18, 15th Main Rd", "Flat 4A, Brigade Palmsprings", "Door 62, 24th Cross"]),
        ("blr-h26", "JP Nagar 7th Phase", "560078", 77.5857, 12.9063, ["Flat 1102, Brigade Millennium", "Villa 5, Elita Promenade", "Plot 77, Kothnur Main Rd"]),
        ("blr-h27", "Jayanagar 4th Block", "560011", 77.5838, 12.9308, ["Plot 202, 10th Main Rd", "Door 44, 32nd Cross", "House 18, Shopping Complex Rd"]),
        ("blr-h28", "Jayanagar 9th Block", "560069", 77.5950, 12.9180, ["Flat 301, Ragigudda View Apts", "House 9, 28th Main Rd", "Plot 61, East End Main Rd"]),
        ("blr-h29", "BTM Layout 1st Stage", "560068", 77.6101, 12.9166, ["Plot 11, Outer Ring Road BTM", "Flat 2B, Udupi Garden Apts", "Door 40, 7th Main"]),
        ("blr-h30", "BTM Layout 2nd Stage", "560076", 77.6050, 12.9100, ["Flat 502, Lakeview Enclave", "House 29, 16th Main Rd", "Plot 80, Mico Layout"]),
        ("blr-h31", "Banashankari 2nd Stage", "560070", 77.5680, 12.9250, ["Plot 104, 24th Cross", "Door 15, BSK BDA Complex Rd", "House 42, Kadirenahalli Rd"]),
        ("blr-h32", "Banashankari 3rd Stage", "560085", 77.5500, 12.9320, ["Flat 401, Tata Promont", "Plot 19, Kathriguppe Main Rd", "Door 88, 100ft Ring Rd"]),
        ("blr-h33", "Malleshwaram 8th Main", "560003", 77.5643, 13.0031, ["Heritage House 4, 8th Main Rd", "Flat 302, Salarpuria Luxuria", "Plot 22, Margosa Road"]),
        ("blr-h34", "Rajajinagar 1st Block", "560010", 77.5550, 12.9900, ["Tower 1, Brigade Gateway", "Flat 802, Purva Sunflower", "Plot 45, Dr. Rajkumar Road"]),
        ("blr-h35", "Basaveshwaranagar", "560079", 77.5380, 12.9850, ["House 12, Saneguruvanahalli Rd", "Plot 66, BEML Layout 2nd Stage", "Door 30, Shankar Mutt Rd"]),
        ("blr-h36", "Vijayanagar", "560040", 77.5372, 12.9698, ["Flat 204, Vijayanagar Club Rd", "House 19, Chord Road", "Plot 81, MC Layout"]),
        ("blr-h37", "Yeshwanthpur", "560022", 77.5498, 13.0182, ["Flat 601, Platinum City", "House 33, Station Link Rd", "Plot 10, APMC Yard Rd"]),
        ("blr-h38", "Mathikere", "560054", 77.5580, 13.0320, ["Flat 403, MS Ramaiah Campus Rd", "House 18, Gokula 1st Stage", "Plot 49, BEL Road"]),
        ("blr-h39", "Sadashivanagar", "560080", 77.5813, 13.0068, ["Bungalow 7, Palace Cross Rd", "Villa 11, Sankey Tank View", "House 24, Upper Palace Orchards"]),
        ("blr-h40", "RT Nagar", "560032", 77.5950, 13.0180, ["House 15, HMT Layout", "Flat 302, Dinnur Main Rd", "Plot 72, 80ft Road RT Nagar"]),
        ("blr-h41", "Hebbal Kempapura", "560024", 77.5970, 13.0358, ["Flat 1201, Godrej Platinum", "Tower C, L&T Raintree", "Plot 14, Coffee Board Layout"]),
        ("blr-h42", "Sahakar Nagar", "560092", 77.5880, 13.0620, ["Flat 402, Trio World Apts", "House 19, CQAL Layout", "Plot 51, G-Block Main Rd"]),
        ("blr-h43", "Yelahanka New Town", "560064", 77.5963, 13.1007, ["Tower 4, RMZ Galleria", "Flat 602, Prestige Monte Carlo", "House 38, 4th Phase Main Rd"]),
        ("blr-h44", "Yelahanka Old Town", "560064", 77.6050, 13.1120, ["House 12, Kogilu Cross Rd", "Plot 40, Venkatala Link Rd", "Door 8, BBMP Ward Office Rd"]),
        ("blr-h45", "Jakkur", "560064", 77.6180, 13.0780, ["Villa 9, Jakkur Aerodrome Rd", "Flat 501, Sobha Emerald", "Plot 27, Agrahara Layout"]),
        ("blr-h46", "Thanisandra Main Rd", "560077", 77.6290, 13.0550, ["Tower 2, Bhartiya City Nikoo", "Flat 801, Sobha City", "Plot 104, Manyata Back Gate Rd"]),
        ("blr-h47", "Hennur Gardens", "560043", 77.6350, 13.0320, ["Flat 404, Mantri Webcity", "House 22, Hennur Cross Rd", "Plot 67, Geddalahalli Rd"]),
        ("blr-h48", "Kalyan Nagar / HRBR", "560043", 77.6490, 13.0210, ["House 14, 5th Cross HRBR 1st Block", "Flat 3B, Jal Vayu Vihar", "Plot 90, CMR Road"]),
        ("blr-h49", "Kammanahalli", "560084", 77.6410, 13.0110, ["Flat 202, Empire View Apts", "House 17, Nehru Road", "Plot 43, St. Thomas Town Rd"]),
        ("blr-h50", "Banaswadi", "560043", 77.6520, 13.0010, ["Flat 501, Subhashree Apts", "House 39, OMBR Layout 4th Cross", "Plot 12, Banaswadi Main Rd"])
    ],

    'CHE': [
        ("che-h01", "Velachery Main Rd", "600042", 80.2206, 12.9815, ["Flat 402, Ceebros Boulevard", "Plot 18, Baby Nagar", "House 12, Vijayanagar 1st Main"]),
        ("che-h02", "Velachery Vijayanagar", "600042", 80.2150, 12.9750, ["Flat 201, Phoenix Marketcity View", "House 45, Dhandeeswaram Nagar", "Plot 9, Tansi Nagar"]),
        ("che-h03", "Madipakkam", "600091", 80.1980, 12.9620, ["Flat 304, Kuberan Nagar 4th Street", "House 19, Puzhuthivakkam Rd", "Plot 88, Moovarasampet"]),
        ("che-h04", "Adambakkam", "600088", 80.2010, 12.9890, ["Door 22, NGO Colony 2nd St", "Flat 101, City Light Apts", "Plot 34, Karuneegar St"]),
        ("che-h05", "Thiruvanmiyur Beach Rd", "600041", 80.2594, 12.9830, ["Villa 8, Valmiki Nagar", "Flat 602, Kalakshetra Colony", "Plot 15, Beach Road"]),
        ("che-h06", "Adyar Gandhi Nagar", "600020", 80.2570, 13.0012, ["Flat 502, Crescent Apts", "House 14, 4th Main Road Adyar", "Plot 77, Canal Bank Rd"]),
        ("che-h07", "Besant Nagar", "600090", 80.2680, 12.9980, ["Flat 3B, Elliot's Promenade", "Villa 4, Tiger Varadachari Rd", "Plot 29, 6th Avenue"]),
        ("che-h08", "Kotturpuram", "600085", 80.2420, 13.0180, ["Flat 701, Clover by the River", "House 20, Gandhi Mandapam Rd", "Plot 12, Chitra Nagar"]),
        ("che-h09", "Perungudi OMR", "600096", 80.2450, 12.9650, ["Tower 2, Brigade Vanguard", "Flat 402, RMZ Millenia Link", "Plot 55, Kandanchavadi Rd"]),
        ("che-h10", "Thoraipakkam OMR", "600097", 80.2350, 12.9420, ["Flat 801, BSR Mall Residency", "Plot 19, Radial Road Junction", "House 41, Anand Nagar"]),
        ("che-h11", "Sholinganallur Junction", "600119", 80.2279, 12.9010, ["Tower 4, Ceebros Belvedere", "Flat 303, Baashyaam Pinnacle", "Plot 82, Classic Farms"]),
        ("che-h12", "Karapakkam OMR", "600097", 80.2300, 12.9200, ["Flat 504, Marg Proper Ties", "House 16, TCS Link Rd", "Plot 30, Ganga Nagar"]),
        ("che-h13", "Navalur OMR", "600130", 80.2263, 12.8465, ["Flat 1102, Hiranandani Upscale", "Villa 9, Olympia Opaline", "Plot 67, Marina Mall Rd"]),
        ("che-h14", "Siruseri SIPCOT", "603103", 80.2180, 12.8250, ["Flat 601, Urbanrise Revolution", "House 32, SIPCOT IT Park Gate 2", "Plot 11, Pudupakkam Rd"]),
        ("che-h15", "Medavakkam", "600100", 80.1925, 12.9198, ["Flat 302, Ozone Greens", "House 28, Perumbakkam Main Rd", "Plot 50, Veerabadra Nagar"]),
        ("che-h16", "Pallikaranai", "600100", 80.2120, 12.9380, ["Flat 401, Purva Windermere", "House 11, Marsh View Colony", "Plot 78, Oil Mill Rd"]),
        ("che-h17", "Guindy Industrial Estate", "600032", 80.2021, 13.0067, ["Door 12, Race Course Road", "Flat 204, Olympia Grand View", "Plot 41, CIPET Link Rd"]),
        ("che-h18", "Alandur", "600016", 80.2014, 13.0033, ["House 19, Asan Memorial Rd", "Plot 88, Alandur Metro Station Rd", "Door 5, MKN Road"]),
        ("che-h19", "Nanganallur", "600061", 80.1920, 12.9850, ["Flat 3B, Anjaneyar Temple St", "House 42, 4th Main Nanganallur", "Plot 15, College Road"]),
        ("che-h20", "Meenambakkam", "600027", 80.1812, 12.9875, ["Flat 202, Airport View Apts", "House 16, GST Road Meenambakkam", "Plot 61, Jain College Rd"]),
        ("che-h21", "Pallavaram", "600043", 80.1550, 12.9680, ["Flat 502, Olympia Grande", "House 31, Cantonment Rd", "Plot 92, Zamin Pallavaram"]),
        ("che-h22", "Chromepet", "600044", 80.1462, 12.9516, ["Flat 401, Radha Nagar 2nd Main", "House 17, MIT College Rd", "Plot 38, CLC Works Rd"]),
        ("che-h23", "Tambaram East", "600059", 80.1250, 12.9249, ["Flat 302, Selaiyur Link Rd", "House 55, MCC College Campus", "Plot 14, Rajakilpakkam Main Rd"]),
        ("che-h24", "Tambaram West", "600045", 80.1171, 12.9249, ["House 29, Mudichur Road", "Flat 404, Kishkinta Link Enclave", "Plot 70, Gandhi Road Tambaram"]),
        ("che-h25", "Sanatorium", "600047", 80.1380, 12.9380, ["Flat 201, MEPZ Gate View", "House 18, TB Hospital Rd", "Plot 45, Chitlapakkam Main Rd"]),
        ("che-h26", "Perungalathur", "600063", 80.0950, 12.9050, ["Flat 801, Newry Shanmuga", "House 44, Srinivasa Nagar", "Plot 22, High Way Colony"]),
        ("che-h27", "Selaiyur", "600073", 80.1420, 12.9150, ["Flat 303, Ruby Builders Grand", "House 19, Bharat University Rd", "Plot 80, Velachery Main Rd"]),
        ("che-h28", "Camp Road", "600073", 80.1350, 12.9180, ["Flat 402, Air Force Road Apts", "House 11, Mahalakshmi Nagar", "Plot 54, IAF Station Gate"]),
        ("che-h29", "T. Nagar North Usman", "600017", 80.2341, 13.0418, ["Plot 18, North Usman Road", "Flat 502, Ranganathan St View", "Door 40, Bazullah Road"]),
        ("che-h30", "T. Nagar South Boag Rd", "600017", 80.2390, 13.0350, ["Flat 3B, Boag Road Towers", "House 14, Burkit Road", "Plot 66, CIT Nagar 1st Main"]),
        ("che-h31", "Nungambakkam High Rd", "600034", 80.2425, 13.0569, ["Flat 602, Sterling Road Apts", "House 28, College Road", "Plot 10, Kothari Road"]),
        ("che-h32", "Gopalapuram", "600086", 80.2550, 13.0520, ["Flat 401, Conran Smith Rd", "House 15, Lloyd's Road", "Plot 39, Avvai Shanmugam Salai"]),
        ("che-h33", "Mylapore Kutchery Rd", "600004", 80.2676, 13.0368, ["Door 12, Kutchery Road", "Flat 202, Kapaleeshwarar View", "House 45, Luz Church Road"]),
        ("che-h34", "Mandaveli", "600028", 80.2620, 13.0250, ["Flat 501, Norton Road Residency", "House 19, St. Mary's Road", "Plot 72, Raja Street"]),
        ("che-h35", "Alwarpet TTK Rd", "600018", 80.2510, 13.0320, ["Flat 801, Chamiers Road Apts", "House 33, Oliver Road", "Plot 14, Eldams Road"]),
        ("che-h36", "Kodambakkam", "600024", 80.2220, 13.0510, ["Flat 302, Arcot Road Towers", "House 21, Rangarajapuram Main Rd", "Plot 58, Station View Rd"]),
        ("che-h37", "Ashok Nagar 11th Ave", "600083", 80.2125, 13.0352, ["Flat 402, 11th Avenue Pillars", "House 16, 1st Avenue", "Plot 80, Ashok Pillar Circle"]),
        ("che-h38", "KK Nagar", "600078", 80.1980, 13.0380, ["Flat 501, Munusamy Salai", "House 42, PT Rajan Salai", "Plot 19, Double Tank Colony"]),
        ("che-h39", "Vadapalani", "600026", 80.2112, 13.0505, ["Flat 602, SIMS Hospital View", "House 18, 100ft Road Vadapalani", "Plot 91, Saligramam Link Rd"]),
        ("che-h40", "Porur Roundtana", "600116", 80.1565, 13.0382, ["Flat 401, Mount-Poonamallee Rd", "Tower 1, Prestige Bella Vista", "Plot 55, Kundrathur Main Rd"]),
        ("che-h41", "Ramapuram", "600089", 80.1780, 13.0320, ["Flat 303, DLF IT Park Back Gate", "House 22, SRM University Rd", "Plot 40, Senthamil Nagar"]),
        ("che-h42", "Manapakkam", "600125", 80.1700, 13.0180, ["Flat 502, L&T Eden Park Colony", "House 14, River View Enclave", "Plot 63, Manapakkam Main Rd"]),
        ("che-h43", "Valasaravakkam", "600087", 80.1720, 13.0450, ["Flat 204, Arcot Road Valasai", "House 31, Chowdry Nagar", "Plot 18, Kamarajar Salai"]),
        ("che-h44", "Virugambakkam", "600092", 80.1880, 13.0520, ["Flat 402, Kaliamman Koil St", "House 27, Chinmaya Nagar", "Plot 79, Natesan Nagar"]),
        ("che-h45", "Anna Nagar West", "600040", 80.2010, 13.0880, ["Flat 702, Ozone Metrozone", "Door 45, 18th Main Road", "Plot 12, Millenium Tower Colony"]),
        ("che-h46", "Anna Nagar East", "600102", 80.2185, 13.0842, ["Villa 8, 2nd Avenue Anna Nagar", "Flat 501, Round Table Apts", "Plot 30, Chintamani Circle"]),
        ("che-h47", "Mogappair East", "600037", 80.1820, 13.0820, ["Flat 401, Golden George Nagar", "House 19, Spartan School Rd", "Plot 99, Collector Nagar"]),
        ("che-h48", "Kilpauk Garden Rd", "600010", 80.2412, 13.0784, ["Flat 602, Ormes Road Towers", "House 15, Kilpauk Waterworks Rd", "Plot 42, Halls Road"]),
        ("che-h49", "Perambur", "600011", 80.2340, 13.1090, ["Flat 304, Venus Market Rd", "House 22, Loco Works Link Rd", "Plot 81, Madhavaram High Rd"]),
        ("che-h50", "Ambattur OT", "600053", 80.1510, 13.1150, ["Flat 402, TI Cycles Colony", "House 33, MTH Road Ambattur", "Plot 60, Industrial Estate 3rd Main"])
    ],

    'BOM': [
        ("bom-h01", "Bandra West Pali Hill", "400050", 72.8295, 19.0596, ["Bungalow 4, Zig Zag Road", "Flat 802, Nargis Dutt Rd", "Villa 11, Union Park"]),
        ("bom-h02", "Bandra West Carter Rd", "400050", 72.8220, 19.0650, ["Flat 12A, Sea Face Promenade", "Penthouse 4, Shirley Village", "Flat 601, Perry Cross Rd"]),
        ("bom-h03", "Bandra East Kalanagar", "400051", 72.8520, 19.0580, ["Flat 502, MIG Colony Kalanagar", "House 18, BKC Connector Rd", "Plot 40, Government Colony"]),
        ("bom-h04", "Khar West", "400052", 72.8340, 19.0700, ["Flat 701, 14th Road Khar", "Door 22, Linking Road View", "Plot 55, Chitrakar Dhurandhar Marg"]),
        ("bom-h05", "Santacruz West", "400054", 72.8360, 19.0815, ["Flat 402, Willingdon Club Rd", "House 16, Podar School Marg", "Plot 88, Juhu Tara Link Rd"]),
        ("bom-h06", "Santacruz East Vakola", "400055", 72.8550, 19.0780, ["Flat 304, Datta Mandir Rd", "House 29, Nehru Road Santacruz", "Plot 41, WEH Service Rd"]),
        ("bom-h07", "Vile Parle West", "400056", 72.8390, 19.1020, ["Flat 601, Bajaj Road Towers", "House 14, Irla Lane", "Plot 72, SV Road Vile Parle"]),
        ("bom-h08", "Vile Parle East", "400057", 72.8520, 19.0980, ["Flat 402, Subhash Road Apts", "House 38, Hanuman Road", "Plot 19, Dixit Road"]),
        ("bom-h09", "Andheri West Lokhandwala", "400053", 72.8260, 19.1410, ["Tower 2, Green Acres", "Flat 801, Lokhandwala Complex Rd", "Plot 99, High Street Wing"]),
        ("bom-h10", "Andheri West Oshiwara", "400102", 72.8311, 19.1363, ["Flat 502, Mega Mall Enclave", "House 21, Infinity Link Rd", "Plot 45, Adarsh Nagar"]),
        ("bom-h11", "Andheri West Versova", "400061", 72.8150, 19.1350, ["Flat 702, Yari Road Promenade", "Villa 9, Versova Beach Rd", "Plot 30, Fisheries University Rd"]),
        ("bom-h12", "Andheri East Chakala", "400093", 72.8620, 19.1150, ["Flat 601, Solitaire Corporate Park Rd", "Plot 18, JB Nagar Link", "Door 44, Sahar Cargo Rd"]),
        ("bom-h13", "Andheri East Marol", "400059", 72.8800, 19.1180, ["Flat 402, Marol Military Rd", "Tower 3, Seven Hills Hospital Colony", "Plot 80, Makwana Road"]),
        ("bom-h14", "Jogeshwari West", "400102", 72.8450, 19.1380, ["Flat 304, SV Road Jogeshwari", "House 19, Millat Nagar", "Plot 52, Behram Baug"]),
        ("bom-h15", "Goregaon West Bangur Nagar", "400104", 72.8380, 19.1620, ["Flat 702, Inorbit Mall View", "House 28, Link Road Goregaon", "Plot 61, Motilal Nagar"]),
        ("bom-h16", "Goregaon East Oberoi Woods", "400063", 72.8620, 19.1680, ["Tower C, Oberoi Exquisite", "Flat 1204, Gokuldham Colony", "Plot 15, Film City Road"]),
        ("bom-h17", "Malad West Link Rd", "400064", 72.8350, 19.1820, ["Flat 802, Evershine Nagar", "Tower 1, Mindspace Link Tower", "Plot 40, Chincholi Bunder"]),
        ("bom-h18", "Malad East Dindoshi", "400097", 72.8600, 19.1780, ["Flat 501, Sankalp Enclave", "House 33, Dindoshi Court Rd", "Plot 88, AK Vaidya Marg"]),
        ("bom-h19", "Kandivali West Mahavir Nagar", "400067", 72.8380, 19.2080, ["Flat 901, Mahavir Universe", "House 18, Dahanukar Wadi", "Plot 77, New Link Road Kandivali"]),
        ("bom-h20", "Kandivali East Thakur Village", "400101", 72.8710, 19.2080, ["Tower 4, Thakur Complex Towers", "Flat 602, Sarova Township", "Plot 30, Samata Nagar"]),
        ("bom-h21", "Borivali West IC Colony", "400103", 72.8520, 19.2450, ["Flat 402, Holy Cross Road", "Villa 6, Marian Colony", "Plot 92, Eksar Road"]),
        ("bom-h22", "Borivali West Shimpoli", "400092", 72.8480, 19.2280, ["Flat 701, Kastur Park Apts", "House 22, Shimpoli Link Rd", "Plot 49, Gorai Bridge Rd"]),
        ("bom-h23", "Borivali East Magathane", "400066", 72.8680, 19.2250, ["Flat 502, Tata Steel Quarters Rd", "House 14, Western Express Highway", "Plot 66, National Park Gate"]),
        ("bom-h24", "Dahisar West", "400068", 72.8580, 19.2580, ["Flat 304, Anand Nagar Dahisar", "House 29, Kandarpada Rd", "Plot 18, Rustomjee Complex"]),
        ("bom-h25", "Mira Road Shanti Park", "401107", 72.8682, 19.2815, ["Tower 2, Jangid Enclave", "Flat 601, Shanti Park Sector 4", "Plot 81, Beverly Park Rd"]),
        ("bom-h26", "Colaba Cuffe Parade", "400005", 72.8220, 18.9150, ["Flat 14A, Maker Tower F", "Penthouse 2, Jolly Maker", "Flat 901, World Trade Centre View"]),
        ("bom-h27", "Marine Drive", "400020", 72.8242, 18.9438, ["Flat 502, Sea Face Mansions", "Heritage Flat 3B, Queens Necklace", "Door 12, Veer Nariman Rd"]),
        ("bom-h28", "Malabar Hill", "400006", 72.8050, 18.9550, ["Bungalow 2, Walkeshwar Rd", "Flat 1002, Little Gibbs Rd", "Villa 7, Hanging Garden Enclave"]),
        ("bom-h29", "Worli Sea Face", "400030", 72.8150, 19.0150, ["Flat 1602, Samudra Mahal", "Tower 1, Raheja Legend", "Plot 88, Khan Abdul Ghaffar Khan Rd"]),
        ("bom-h30", "Worli Naka", "400018", 72.8250, 19.0050, ["Flat 701, Dr. Annie Besant Rd", "House 31, BDD Chawl Redevelopment", "Plot 45, Poddar Hospital Link"]),
        ("bom-h31", "Lower Parel Phoenix", "400013", 72.8300, 18.9952, ["Tower 3, One Avighna Park", "Flat 1402, Phoenix Towers", "Plot 20, Senapati Bapat Marg"]),
        ("bom-h32", "Prabhadevi", "400025", 72.8280, 19.0150, ["Tower A, Beaumonde Towers", "Flat 801, Siddhivinayak Temple Rd", "Plot 33, New Prabhadevi Rd"]),
        ("bom-h33", "Dadar West Shivaji Park", "400028", 72.8353, 19.0178, ["Heritage House 14, Shivaji Park", "Flat 402, Cadell Road Towers", "Plot 67, Ranade Road"]),
        ("bom-h34", "Dadar East Hindu Colony", "400014", 72.8480, 19.0200, ["Flat 501, 3rd Lane Hindu Colony", "House 22, Dr. Ambedkar Road", "Plot 90, Tilak Bridge Rd"]),
        ("bom-h35", "Matunga West", "400016", 72.8420, 19.0300, ["Flat 302, Senapati Bapat Marg Matunga", "House 18, Tulsi Pipe Rd", "Plot 44, Manmala Tank Rd"]),
        ("bom-h36", "Wadala Bhakti Park", "400037", 72.8680, 19.0250, ["Tower 5, Ajmera Bhakti Park", "Flat 902, Monorail View", "Plot 19, Imax Cinema Link"]),
        ("bom-h37", "Chembur Diamond Garden", "400071", 72.8974, 19.0622, ["Flat 602, Central Avenue Chembur", "House 35, Sion-Trombay Rd", "Plot 72, Golf Club Road"]),
        ("bom-h38", "Ghatkopar East", "400077", 72.9090, 19.0860, ["Flat 501, Vallabh Baug Lane", "Tower B, Neelkanth Valley", "Plot 30, Tilak Road Ghatkopar"]),
        ("bom-h39", "Ghatkopar West", "400086", 72.8950, 19.0920, ["Flat 402, R City Mall Residency", "House 19, LBS Marg Ghatkopar", "Plot 81, Damodar Park"]),
        ("bom-h40", "Vikhroli East", "400079", 72.9298, 19.1112, ["Tower 2, Godrej The Trees", "Flat 801, Eastern Express Highway", "Plot 15, Kannamwar Nagar"]),
        ("bom-h41", "Powai Hiranandani", "400076", 72.9060, 19.1176, ["Flat 1204, Verona Hiranandani", "Tower 7, Rodas Enclave", "Penthouse 1, Heritage Lake View"]),
        ("bom-h42", "Bhandup West", "400078", 72.9320, 19.1480, ["Flat 401, Dreams Complex", "House 28, LBS Marg Bhandup", "Plot 60, Usha Nagar Rd"]),
        ("bom-h43", "Mulund West", "400080", 72.9425, 19.1726, ["Flat 702, Nirmal Lifestyle", "Tower A, Marathon Monte Carlo", "Plot 42, Zaver Road"]),
        ("bom-h44", "Thane West Majiwada", "400601", 72.9781, 19.2183, ["Tower 6, Rustomjee Urbania", "Flat 901, Lodha Amara", "Plot 104, Pokhran Road 2"]),
        ("bom-h45", "Thane West Ghodbunder", "400615", 72.9650, 19.2550, ["Tower 3, Hiranandani Estate", "Flat 502, Rosa Bella", "Plot 88, Kasarvadavali Link"]),
        ("bom-h46", "Thane West Panchpakhadi", "400602", 72.9620, 19.1950, ["Flat 402, Nitin Company Junction", "House 19, Service Road Thane", "Plot 33, Alok Heights"]),
        ("bom-h47", "Vashi Sector 17", "400703", 72.9986, 19.0770, ["Flat 501, Palm Beach Galleria View", "House 24, Sector 17 Market Rd", "Plot 77, Arenja Corner"]),
        ("bom-h48", "Nerul Palm Beach Rd", "400706", 73.0180, 19.0330, ["Tower 2, Seawoods Grand Central", "Flat 802, Palm Beach Residency", "Plot 12, Sector 28 Nerul"]),
        ("bom-h49", "Kharghar Sector 20", "410210", 73.0650, 19.0450, ["Flat 602, Valley Shilp", "House 18, Central Park View", "Plot 90, Hiranandani Crystal"]),
        ("bom-h50", "Airoli Sector 5", "400708", 72.9935, 19.1579, ["Flat 401, Mindspace Gate 1 Apts", "House 31, Thane-Belapur Link Rd", "Plot 55, Sector 5 Airoli"])
    ]
}

print("Loaded 50 high-diversity neighborhoods for BLR, CHE, BOM.")

# ==============================================================================
# ROUTE FETCHING WITH OSRM & RAIL FALLBACKS
# ==============================================================================
def haversine(lon1, lat1, lon2, lat2):
    R = 6371
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def fetch_osrm(o_lng, o_lat, d_lng, d_lat):
    url = f"http://router.project-osrm.org/route/v1/driving/{o_lng:.5f},{o_lat:.5f};{d_lng:.5f},{d_lat:.5f}?overview=simplified&geometries=geojson"
    req = urllib.request.Request(url, headers={'User-Agent': 'ColliersCommuteGIS/2.0'})
    for _ in range(2):
        try:
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read().decode())
                if data.get('code') == 'Ok' and data.get('routes'):
                    r = data['routes'][0]
                    coords = r['geometry']['coordinates']
                    dist = round(r['distance'] / 1000.0, 1)
                    dur = max(10, round(r['duration'] / 60.0))
                    return coords, dist, dur
        except Exception:
            time.sleep(0.2)
    # Organic intermediate waypoint fallback if network times out
    crow = haversine(o_lng, o_lat, d_lng, d_lat)
    dist = round(crow * 1.34, 1)
    dur = max(12, round((dist / 24.0) * 60 + 6))
    mid_lng = (o_lng + d_lng) / 2 + (d_lat - o_lat) * 0.08
    mid_lat = (o_lat + d_lat) / 2 - (d_lng - o_lng) * 0.08
    coords = [[o_lng, o_lat], [round(mid_lng, 5), round(mid_lat, 5)], [d_lng, d_lat]]
    return coords, dist, dur

# Metro & Train sequences
BLR_PURPLE = [
    (77.7600, 12.9857), (77.7475, 12.9854), (77.7412, 12.9855), (77.7214, 12.9818),
    (77.7022, 12.9877), (77.6833, 12.9922), (77.6651, 12.9942), (77.6508, 12.9904),
    (77.6384, 12.9784), (77.6171, 12.9729), (77.5997, 12.9803), (77.5726, 12.9757),
    (77.5456, 12.9748), (77.5332, 12.9622), (77.5255, 12.9405), (77.4788, 12.9098)
]

CHE_BLUE = [
    (80.3015, 13.1672), (80.2865, 13.0882), (80.2762, 13.0818), (80.2558, 13.0582),
    (80.2452, 13.0408), (80.2285, 13.0232), (80.2057, 13.0134), (80.2014, 13.0033),
    (80.1812, 12.9875), (80.1705, 12.9812)
]

BOM_WESTERN = [
    (72.8277, 18.9322), (72.8192, 18.9712), (72.8300, 18.9952), (72.8425, 19.0178),
    (72.8402, 19.0552), (72.8398, 19.0815), (72.8465, 19.1198), (72.8488, 19.1645),
    (72.8485, 19.1860), (72.8567, 19.2307), (72.8682, 19.2815)
]

BOM_TRANSHARBOUR = [
    (72.9781, 19.1862), (72.9935, 19.1579), (73.0035, 19.1352), (73.0112, 19.0982),
    (72.9986, 19.0770)
]

def get_rail_route(stations, o_lng, o_lat, d_lng, d_lat):
    def closest_idx(pts, lng, lat):
        return min(range(len(pts)), key=lambda i: (pts[i][0]-lng)**2 + (pts[i][1]-lat)**2)
    s_idx = closest_idx(stations, o_lng, o_lat)
    e_idx = closest_idx(stations, d_lng, d_lat)
    if s_idx <= e_idx:
        seg = [list(stations[i]) for i in range(s_idx, e_idx + 1)]
    else:
        seg = [list(stations[i]) for i in range(s_idx, e_idx - 1, -1)]
    coords = [[o_lng, o_lat]] + seg + [[d_lng, d_lat]]
    dist = round(haversine(o_lng, o_lat, d_lng, d_lat) * 1.25, 1)
    dur = max(14, round((dist / 32.0) * 60 + 8))
    return coords, dist, dur

print("Route functions ready.")

# ==============================================================================
# GENERATE 1500 DIVERSE EMPLOYEES & COMPUTE CORRIDOR ROUTES
# ==============================================================================
import os
ROUTES_FILE = '/home/haroon/Desktop/colliers-commute/frontend/src/data/hubRoutes.json'
if os.path.exists(ROUTES_FILE):
    with open(ROUTES_FILE, 'r') as f:
        hub_routes = json.load(f)
    print(f"Loaded {len(hub_routes)} existing corridor routes from {ROUTES_FILE}")
else:
    hub_routes = {}

all_employees = []

tasks = []
for city_code in ['BLR', 'CHE', 'BOM']:
    city_hubs = NEIGHBORHOODS[city_code]
    city_offices = OFFICES[city_code]
    for hub in city_hubs:
        hub_id, hub_name, pin, h_lng, h_lat, addr_templates = hub
        for off in city_offices:
            off_id = off['id']
            o_lng, o_lat = off['lng'], off['lat']
            if f"{hub_id}:{off_id}:road" not in hub_routes or f"{hub_id}:{off_id}:rail" not in hub_routes:
                tasks.append((city_code, hub_id, h_lng, h_lat, off_id, o_lng, o_lat))

print(f"Total new hub-to-office corridor tasks to fetch: {len(tasks)}")

def process_hub_task(task):
    city_code, hub_id, h_lng, h_lat, off_id, o_lng, o_lat = task
    # 1. Road route via OSRM
    road_coords, road_dist, road_dur = fetch_osrm(h_lng, h_lat, o_lng, o_lat)
    
    # 2. Rail route (Metro / Suburban)
    if city_code == 'BLR':
        rail_coords, rail_dist, rail_dur = get_rail_route(BLR_PURPLE, h_lng, h_lat, o_lng, o_lat)
    elif city_code == 'CHE':
        stations = CHE_BLUE
        rail_coords, rail_dist, rail_dur = get_rail_route(stations, h_lng, h_lat, o_lng, o_lat)
    else:
        stations = BOM_TRANSHARBOUR if 'Airoli' in off_id or 'Powai' in off_id or 'BOM-OF-3' in off_id or 'BOM-OF-5' in off_id else BOM_WESTERN
        rail_coords, rail_dist, rail_dur = get_rail_route(stations, h_lng, h_lat, o_lng, o_lat)

    return (
        f"{hub_id}:{off_id}:road", {'coords': road_coords, 'dist': road_dist, 'dur': road_dur},
        f"{hub_id}:{off_id}:rail", {'coords': rail_coords, 'dist': rail_dist, 'dur': rail_dur}
    )

if tasks:
    print(f"Fetching {len(tasks)} new road routes from OSRM in parallel...")
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(process_hub_task, tasks))
    t1 = time.time()
    print(f"All {len(tasks)} hub corridors fetched in {t1-t0:.2f} seconds!")

    for r1_key, r1_val, r2_key, r2_val in results:
        hub_routes[r1_key] = r1_val
        hub_routes[r2_key] = r2_val

# Now generate 500 employees per city (10 from each of the 50 neighborhoods)
city_configs = [
    {
        'code': 'CHE',
        'firm': 'Colliers International (Chennai)',
        'id_base': 1000,
        'mode_weights': ['Two-Wheeler (Bike/EV)', 'Driving (Car)', 'Metro Rail', 'Suburban Train', 'Bus Transit'],
        'weights': [0.32, 0.28, 0.22, 0.10, 0.08]
    },
    {
        'code': 'BLR',
        'firm': 'Colliers International (Bengaluru)',
        'id_base': 2000,
        'mode_weights': ['Two-Wheeler (Bike/EV)', 'Driving (Car)', 'Metro Rail', 'Bus Transit'],
        'weights': [0.34, 0.30, 0.24, 0.12]
    },
    {
        'code': 'BOM',
        'firm': 'Colliers International (Mumbai)',
        'id_base': 3000,
        'mode_weights': ['Suburban Train', 'Driving (Car)', 'Two-Wheeler (Bike/EV)', 'Metro Rail', 'Bus Transit'],
        'weights': [0.35, 0.25, 0.20, 0.12, 0.08]
    }
]

for cfg in city_configs:
    c_code = cfg['code']
    rng = random.Random(cfg['id_base'])
    hubs = NEIGHBORHOODS[c_code]
    offices = OFFICES[c_code]
    
    emp_counter = 0
    # 10 employees per neighborhood = 500 employees per city
    for hub_idx, hub in enumerate(hubs):
        hub_id, hub_name, pin, h_lng, h_lat, addr_templates = hub
        for i in range(10):
            emp_counter += 1
            emp_id = f"{c_code}-EMP-{cfg['id_base'] + emp_counter}"
            fn = rng.choice(first_names)
            ln = rng.choice(last_names)
            full_name = f"{fn} {ln}"
            email = f"{fn.lower()}.{ln.lower()}@colliers.com"
            dept = rng.choice(depts)
            title = rng.choice(titles)
            assigned_off = rng.choice(offices)['name']
            
            # Diverse realistic street address
            base_addr = rng.choice(addr_templates)
            flat_no = rng.randint(101, 1404)
            address = f"Flat {flat_no}, {base_addr}, {hub_name}"
            
            # Natural spatial dispersal (+/- 0.003 to 0.008 deg along neighborhood streets)
            lat = round(h_lat + (rng.random() - 0.5) * 0.012, 5)
            lng = round(h_lng + (rng.random() - 0.5) * 0.012, 5)
            
            # Commute mode
            mode = rng.choices(cfg['mode_weights'], weights=cfg['weights'])[0]
            
            # Calculate distance and duration to assigned office
            assigned_off_obj = next(o for o in offices if o['name'] == assigned_off)
            route_type = 'rail' if 'Metro' in mode or 'Train' in mode else 'road'
            route_key = f"{hub_id}:{assigned_off_obj['id']}:{route_type}"
            route_info = hub_routes.get(route_key, {'dist': 14.5, 'dur': 28})
            
            # Slight individual variation (+/- 1.5 km and +/- 3 mins)
            dist_km = max(2.5, round(route_info['dist'] + (rng.random() - 0.5) * 2.0, 1))
            dur_mins = max(12, round(route_info['dur'] + (rng.random() - 0.5) * 4.0))
            
            work_model = rng.choice(["Hybrid (3 Days Office)", "Hybrid (2 Days Office)", "Full In-Office"])
            carbon = round(dist_km * 0.14 * (12 if "Hybrid (3" in work_model else 8 if "Hybrid (2" in work_model else 20), 1)
            cost = int(dist_km * 8.5 * (12 if "Hybrid (3" in work_model else 8 if "Hybrid (2" in work_model else 20) + rng.randint(400, 900))
            satisfaction = 5 if dur_mins <= 28 else 4 if dur_mins <= 42 else 3 if dur_mins <= 55 else 2

            emp_record = {
                "employeeId": emp_id,
                "fullName": full_name,
                "email": email,
                "firmName": cfg['firm'],
                "cityCode": c_code,
                "department": dept,
                "jobTitle": title,
                "assignedOffice": assigned_off,
                "hubId": hub_id,
                "residentialLocality": hub_name,
                "residentialAddress": address,
                "pinCode": pin,
                "latitude": lat,
                "longitude": lng,
                "commuteMode": mode,
                "commuteDistanceKm": dist_km,
                "commuteDurationMins": dur_mins,
                "workModel": work_model,
                "monthlyCarbonKg": carbon,
                "monthlyCommuteCostInr": cost,
                "satisfactionScore": satisfaction
            }
            all_employees.append(emp_record)

print(f"Total employees generated: {len(all_employees)}")
print("Sample employee:", json.dumps(all_employees[0], indent=2))

# Save workforce1500.json
with open('/home/haroon/Desktop/colliers-commute/frontend/src/data/workforce1500.json', 'w') as f:
    json.dump(all_employees, f, indent=2)

with open('/home/haroon/Desktop/colliers-commute/backend/src/main/resources/workforce1500.json', 'w') as f:
    json.dump(all_employees, f, indent=2)

# Save hubRoutes.json
with open('/home/haroon/Desktop/colliers-commute/frontend/src/data/hubRoutes.json', 'w') as f:
    json.dump(hub_routes, f)

print("Saved workforce1500.json and hubRoutes.json successfully!")
