import json
import random

first_names = [
    "Aarav", "Aditi", "Ananya", "Arjun", "Deepak", "Divya", "Gautam", "Harish", "Ishaan", "Kavya",
    "Manish", "Meera", "Naveen", "Neha", "Pranav", "Pooja", "Rahul", "Rhea", "Rohan", "Sanjay",
    "Shreya", "Siddharth", "Sneha", "Tarun", "Varun", "Vidya", "Vikram", "Yash", "Tanvi", "Kiran",
    "Swathi", "Ramesh", "Priya", "Ashwin", "Karthik", "Lakshmi", "Vignesh", "Anand", "Nisha", "Ganesh"
]
last_names = [
    "Sharma", "Verma", "Patel", "Iyer", "Nair", "Reddy", "Rao", "Menon", "Sundaram", "Krishnan",
    "Bose", "Chatterjee", "Deshmukh", "Kulkarni", "Joshi", "Bhat", "Mehta", "Shah", "Agarwal", "Gupta",
    "Nambiar", "Pillai", "Chauhan", "Bhattacharya", "Sengupta", "Subramanian", "Mukherjee", "Kapoor", "Malhotra", "Shetty"
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
work_models = ["Hybrid (3 Days Office)", "Hybrid (2 Days Office)", "Full In-Office"]
modes = ["Driving (Car)", "Two-Wheeler (Bike/EV)", "Metro Rail", "Suburban Train", "Bus Transit", "Corporate Shuttle"]

cities_info = [
    {
        "city_code": "CHE",
        "firm_name": "Colliers International (Chennai)",
        "start_id": 1000,
        "localities": [
            ("Velachery", "600042", 12.9815, 80.2206),
            ("Tambaram", "600045", 12.9249, 80.1171),
            ("Anna Nagar", "600040", 13.0878, 80.2090),
            ("Adyar", "600020", 13.0012, 80.2570),
            ("Thiruvanmiyur", "600041", 12.9830, 80.2594),
            ("Nungambakkam", "600034", 13.0569, 80.2425),
            ("Medavakkam", "600100", 12.9198, 80.1925),
            ("Porur", "600116", 13.0382, 80.1565),
            ("Mylapore", "600004", 13.0368, 80.2676),
            ("Chromepet", "600044", 12.9516, 80.1462),
            ("Sholinganallur", "600119", 12.9010, 80.2279),
            ("Kilpauk", "600010", 13.0784, 80.2412),
            ("Guindy", "600032", 13.0067, 80.2021),
            ("Alandur", "600016", 13.0033, 80.2014),
            ("Perambur", "600011", 13.1090, 80.2340),
            ("T. Nagar", "600017", 13.0418, 80.2341),
            ("Navalur", "600130", 12.8465, 80.2263)
        ],
        "offices": ["Olympia Tech Park (Guindy)", "RMZ Millenia (OMR)", "DLF Cybercity (Porur)"]
    },
    {
        "city_code": "BLR",
        "firm_name": "Colliers International (Bengaluru)",
        "start_id": 2000,
        "localities": [
            ("HSR Layout", "560102", 12.9121, 77.6389),
            ("Indiranagar", "560038", 12.9784, 77.6412),
            ("Electronic City", "560100", 12.8452, 77.6649),
            ("Yelahanka", "560064", 13.1007, 77.5963),
            ("Whitefield", "560066", 12.9698, 77.7499),
            ("Koramangala", "560034", 12.9352, 77.6245),
            ("Bellandur", "560103", 12.9304, 77.6784),
            ("Malleshwaram", "560003", 13.0031, 77.5643),
            ("Marathahalli", "560037", 12.9591, 77.6974),
            ("Sadashivanagar", "560080", 13.0068, 77.5813),
            ("BTM Layout", "560068", 12.9166, 77.6101),
            ("Hebbal", "560024", 13.0358, 77.5970),
            ("JP Nagar", "560078", 12.9063, 77.5857),
            ("Jayanagar", "560041", 12.9308, 77.5838),
            ("Sarjapur Road", "560035", 12.9103, 77.6850)
        ],
        "offices": ["Embassy TechVillage (ORR)", "ITPB (Whitefield)", "Manyata Tech Park (Hebbal)"]
    },
    {
        "city_code": "BOM",
        "firm_name": "Colliers International (Mumbai)",
        "start_id": 3000,
        "localities": [
            ("Thane West", "400601", 19.2183, 72.9781),
            ("Andheri West", "400053", 19.1363, 72.8311),
            ("Vashi", "400703", 19.0770, 72.9986),
            ("Dadar West", "400028", 19.0178, 72.8353),
            ("Bandra West", "400050", 19.0596, 72.8295),
            ("Ghatkopar East", "400077", 19.0860, 72.9090),
            ("Powai", "400076", 19.1176, 72.9060),
            ("Airoli", "400708", 19.1579, 72.9935),
            ("Borivali West", "400092", 19.2307, 72.8567),
            ("Chembur", "400071", 19.0622, 72.8974),
            ("Worli", "400018", 19.0134, 72.8186),
            ("Mulund West", "400080", 19.1726, 72.9425),
            ("Lower Parel", "400013", 18.9952, 72.8300),
            ("Malad West", "400064", 19.1860, 72.8485),
            ("Nerul", "400706", 19.0330, 73.0180)
        ],
        "offices": ["Maker Maxity / ONE BKC", "One Lodha Place (Lower Parel)", "Mindspace Airoli (Navi Mumbai)"]
    }
]

all_records = []

for c in cities_info:
    rng = random.Random(c["start_id"])
    city_code = c["city_code"]
    firm_name = c["firm_name"]
    start_id = c["start_id"]
    for i in range(500):
        emp_id = f"{city_code}-EMP-{start_id + i}"
        fn = rng.choice(first_names)
        ln = rng.choice(last_names)
        full_name = f"{fn} {ln}"
        email = f"{fn.lower()}.{ln.lower()}@colliers.com"
        dept = rng.choice(depts)
        title = rng.choice(titles)
        office = rng.choice(c["offices"])
        loc_name, pin, b_lat, b_lng = rng.choice(c["localities"])
        lat = round(b_lat + (rng.random() - 0.5) * 0.015, 5)
        lng = round(b_lng + (rng.random() - 0.5) * 0.015, 5)
        mode = rng.choice(modes)
        dist = round(4.0 + rng.random() * 26.0, 1)
        mult = 1.6 if "Metro" in mode else (2.4 if "Car" in mode else 1.9)
        dur = max(14, int(round(dist * mult + rng.randint(0, 7))))
        work_model = rng.choice(work_models)
        factor = 0.17 if "Car" in mode else (0.05 if "Bike" in mode else (0.02 if "Metro" in mode else 0.035))
        days = 13 if "3 Days" in work_model else (9 if "2 Days" in work_model else 21)
        carb = round(dist * 2 * days * factor, 1)
        cost_day = int(dist * 14) if "Car" in mode else (int(dist * 4) if "Bike" in mode else 90)
        cost = cost_day * days + 400
        sat = 3 + rng.randint(0, 2)
        if dur > 50:
            sat = max(1, sat - 1)

        all_records.append({
            "employeeId": emp_id,
            "fullName": full_name,
            "email": email,
            "firmName": firm_name,
            "cityCode": city_code,
            "department": dept,
            "jobTitle": title,
            "assignedOffice": office,
            "residentialLocality": loc_name,
            "pinCode": pin,
            "latitude": lat,
            "longitude": lng,
            "commuteMode": mode,
            "commuteDistanceKm": dist,
            "commuteDurationMins": dur,
            "workModel": work_model,
            "monthlyCarbonKg": carb,
            "monthlyCommuteCostInr": cost,
            "satisfactionScore": sat
        })

print(f"Generated {len(all_records)} records")

with open("/home/haroon/Desktop/colliers-commute/frontend/src/data/workforce1500.json", "w") as f:
    json.dump(all_records, f, indent=2)

print("Saved to workforce1500.json successfully!")
