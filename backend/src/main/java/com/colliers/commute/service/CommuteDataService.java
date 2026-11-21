package com.colliers.commute.service;

import com.colliers.commute.model.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommuteDataService {

    private final Map<String, City> cities = new LinkedHashMap<>();
    private final Map<String, List<CandidateOffice>> officesByCity = new LinkedHashMap<>();
    private final Map<String, List<EmployeeLocation>> employeesByCity = new LinkedHashMap<>();
    private final List<EmployeeRecord> fullWorkforceDatabase = new ArrayList<>();

    public CommuteDataService() {
        initializeData();
        generate1500EmployeeDatabase();
    }

    private void initializeData() {
        // 1. Cities
        cities.put("CHE", new City("CHE", "Chennai", 13.0134, 80.2057, 11,
                "Chennai CRE Hub - High concentration across Guindy Central, OMR Tech Corridor & Porur West"));
        cities.put("BOM", new City("BOM", "Mumbai", 19.0760, 72.8777, 11,
                "Mumbai MMR - High-value BKC financial district, Lower Parel CBD & Navi Mumbai back-office tech"));
        cities.put("BLR", new City("BLR", "Bengaluru", 12.9716, 77.6412, 11,
                "Bengaluru Tech Hub - Outer Ring Road (ORR) GCC cluster, Whitefield & North Bengaluru (Hebbal)"));

        // 2. Candidate Offices (5 Prime Tech Parks Per City)
        officesByCity.put("CHE", List.of(
                new CandidateOffice("CHE-OF-1", "CHE", "Olympia Tech Park", "Guindy (Central)", 95.0, "Grade-A",
                        13.0134, 80.2057, List.of("Metro Interchange 200m", "LEED Platinum", "Multi-corridor transit hub"), 24, 91,
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80", "1.8M sq.ft", "Platinum"),
                new CandidateOffice("CHE-OF-2", "CHE", "RMZ Millenia", "OMR - Perungudi", 85.0, "Grade-A+",
                        12.9664, 80.2484, List.of("Expressway access", "Campus amenity zone", "High tech cluster"), 34, 76,
                        "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80", "2.2M sq.ft", "Gold"),
                new CandidateOffice("CHE-OF-3", "CHE", "DLF Cybercity", "Porur (West Corridor)", 75.0, "Grade-A",
                        13.0312, 80.1548, List.of("Mount-Poonamallee Road", "Large floorplates", "Proximity to manufacturing & tech"), 42, 63,
                        "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&auto=format&fit=crop&q=80", "3.0M sq.ft", "Platinum"),
                new CandidateOffice("CHE-OF-4", "CHE", "Tidel Park", "Taramani (IT Corridor)", 90.0, "Grade-A+",
                        12.9892, 80.2478, List.of("MRTS Station 150m", "Pioneer Tech Landmark", "Dedicated Substation"), 28, 84,
                        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&auto=format&fit=crop&q=80", "1.28M sq.ft", "Gold"),
                new CandidateOffice("CHE-OF-5", "CHE", "ASV Suntech Park", "OMR - Thoraipakkam", 70.0, "Grade-A",
                        12.9358, 80.2325, List.of("Velachery Proximity", "Cost Advantage", "High Floorplates"), 37, 71,
                        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80", "850K sq.ft", "Certified")
        ));

        officesByCity.put("BOM", List.of(
                new CandidateOffice("BOM-OF-1", "BOM", "Maker Maxity / ONE BKC", "Bandra-Kurla Complex (BKC)", 275.0, "Grade-A+",
                        19.0657, 72.8656, List.of("Financial hub", "Upcoming Metro 3 line", "Prestige occupier ecosystem"), 38, 72,
                        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80", "1.5M sq.ft", "Platinum"),
                new CandidateOffice("BOM-OF-2", "BOM", "One Lodha Place", "Lower Parel / Worli", 220.0, "Grade-A+",
                        18.9952, 72.8300, List.of("Monorail & Western Line", "Ultra-luxury retail", "South Mumbai access"), 44, 59,
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80", "1.1M sq.ft", "Platinum"),
                new CandidateOffice("BOM-OF-3", "BOM", "Mindspace Airoli", "Navi Mumbai (East)", 70.0, "Grade-A",
                        19.1579, 73.0011, List.of("Trans-Harbour rail", "Value pricing", "Scalable SEZ campuses"), 29, 84,
                        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop&q=80", "4.5M sq.ft", "Gold"),
                new CandidateOffice("BOM-OF-4", "BOM", "Nesco IT Park", "Goregaon (Western Suburbs)", 135.0, "Grade-A+",
                        19.1551, 72.8538, List.of("Direct WEH Flyover Access", "Ram Mandir Station 300m", "Integrated Amenities"), 33, 79,
                        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&auto=format&fit=crop&q=80", "3.8M sq.ft", "Platinum"),
                new CandidateOffice("BOM-OF-5", "BOM", "Hiranandani Business Park", "Powai (Central Suburbs)", 150.0, "Grade-A+",
                        19.1176, 72.9060, List.of("Powai Lake Township", "JVLR Arterial Link", "Walk-to-Work Community"), 36, 74,
                        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80", "2.4M sq.ft", "Gold")
        ));

        officesByCity.put("BLR", List.of(
                new CandidateOffice("BLR-OF-1", "BLR", "Embassy TechVillage", "Outer Ring Road (ORR)", 115.0, "Grade-A+",
                        12.9279, 77.6914, List.of("Global Capability Center (GCC) cluster", "Dedicated feeder buses", "Prime talent catchment"), 46, 55,
                        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80", "4.0M sq.ft", "Platinum"),
                new CandidateOffice("BLR-OF-2", "BLR", "ITPB", "Whitefield (East)", 80.0, "Grade-A",
                        12.9855, 77.7412, List.of("Purple Metro Line terminus", "Integrated township", "Established IT corridor"), 39, 68,
                        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80", "2.5M sq.ft", "Gold"),
                new CandidateOffice("BLR-OF-3", "BLR", "Manyata Tech Park", "North Bengaluru (Hebbal)", 105.0, "Grade-A+",
                        13.0456, 77.6224, List.of("Airport expressway", "Peripheral ring connectivity", "Emerging executive residential"), 31, 81,
                        "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&auto=format&fit=crop&q=80", "9.8M sq.ft", "Platinum"),
                new CandidateOffice("BLR-OF-4", "BLR", "Bagmane Tech Park", "CV Raman Nagar / Indiranagar", 110.0, "Grade-A+",
                        12.9784, 77.6582, List.of("Central Tech Hub", "Metro Byappanahalli 400m", "Lush Campus Lake"), 27, 86,
                        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80", "3.2M sq.ft", "Gold"),
                new CandidateOffice("BLR-OF-5", "BLR", "Prestige Tech Park", "ORR - Marathahalli", 120.0, "Grade-A+",
                        12.9372, 77.6938, List.of("Prime ORR Corridor", "Direct Flyover Access", "High Density GCCs"), 41, 64,
                        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&auto=format&fit=crop&q=80", "2.8M sq.ft", "Platinum")
        ));

        // Basic Sample Employee Clusters
        employeesByCity.put("CHE", generateChennaiEmployees());
        employeesByCity.put("BOM", generateMumbaiEmployees());
        employeesByCity.put("BLR", generateBengaluruEmployees());
    }

    private void generate1500EmployeeDatabase() {
        // Try loading pre-generated diverse workforce dataset with exact addresses and coordinates
        try {
            java.io.InputStream is = getClass().getResourceAsStream("/workforce1500.json");
            if (is != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                List<EmployeeRecord> records = mapper.readValue(is, new com.fasterxml.jackson.core.type.TypeReference<List<EmployeeRecord>>() {});
                if (records != null && !records.isEmpty()) {
                    fullWorkforceDatabase.addAll(records);
                    return;
                }
            }
        } catch (Exception e) {
            System.err.println("Could not load workforce1500.json from resources, falling back to programmatic generation: " + e.getMessage());
        }

        String[] firstNames = {
                "Aarav", "Aditi", "Ananya", "Arjun", "Deepak", "Divya", "Gautam", "Harish", "Ishaan", "Kavya",
                "Manish", "Meera", "Naveen", "Neha", "Pranav", "Pooja", "Rahul", "Rhea", "Rohan", "Sanjay",
                "Shreya", "Siddharth", "Sneha", "Tarun", "Varun", "Vidya", "Vikram", "Yash", "Tanvi", "Kiran",
                "Swathi", "Ramesh", "Priya", "Ashwin", "Karthik", "Lakshmi", "Vignesh", "Anand", "Nisha", "Ganesh"
        };
        String[] lastNames = {
                "Sharma", "Verma", "Patel", "Iyer", "Nair", "Reddy", "Rao", "Menon", "Sundaram", "Krishnan",
                "Bose", "Chatterjee", "Deshmukh", "Kulkarni", "Joshi", "Bhat", "Mehta", "Shah", "Agarwal", "Gupta",
                "Nambiar", "Pillai", "Chauhan", "Bhattacharya", "Sengupta", "Subramanian", "Mukherjee", "Kapoor", "Malhotra", "Shetty"
        };
        String[] depts = {
                "Valuation & Advisory Services", "Capital Markets & Investment", "Occupier Strategy & Solutions",
                "Project & Development Services", "Real Estate Management Services", "Enterprise Technology & GIS",
                "Human Resources & Operations", "Legal & Regulatory Compliance"
        };
        String[] titles = {
                "Senior Analyst", "Associate Director", "Vice President", "Consultant", "Director",
                "Spatial Data Scientist", "Senior Project Manager", "Research Associate", "Valuation Specialist", "Leasing Manager"
        };
        String[] workModels = {
                "Hybrid (3 Days Office)", "Hybrid (2 Days Office)", "Full In-Office"
        };
        String[] modes = {
                "Driving (Car)", "Two-Wheeler (Bike/EV)", "Metro Rail", "Suburban Train", "Bus Transit", "Corporate Shuttle"
        };

        // 1. CHENNAI FIRM: 500 Employees
        String[][] cheLocalities = {
                {"Velachery", "600042", "12.9815", "80.2206"},
                {"Tambaram", "600045", "12.9249", "80.1171"},
                {"Anna Nagar", "600040", "13.0878", "80.2090"},
                {"Adyar", "600020", "13.0012", "80.2570"},
                {"Thiruvanmiyur", "600041", "12.9830", "80.2594"},
                {"Nungambakkam", "600034", "13.0569", "80.2425"},
                {"Medavakkam", "600100", "12.9198", "80.1925"},
                {"Porur", "600116", "13.0382", "80.1565"},
                {"Mylapore", "600004", "13.0368", "80.2676"},
                {"Chromepet", "600044", "12.9516", "80.1462"},
                {"Sholinganallur", "600119", "12.9010", "80.2279"},
                {"Kilpauk", "600010", "13.0784", "80.2412"},
                {"Guindy", "600032", "13.0067", "80.2021"},
                {"Alandur", "600016", "13.0033", "80.2014"},
                {"Perambur", "600011", "13.1090", "80.2340"},
                {"T. Nagar", "600017", "13.0418", "80.2341"},
                {"Navalur", "600130", "12.8465", "80.2263"}
        };
        String[] cheOffices = {"Olympia Tech Park (Guindy)", "RMZ Millenia (OMR)", "DLF Cybercity (Porur)"};

        populateFirmEmployees("CHE", "Colliers International (Chennai)", 1000, 500,
                cheLocalities, cheOffices, firstNames, lastNames, depts, titles, workModels, modes);

        // 2. BENGALURU FIRM: 500 Employees
        String[][] blrLocalities = {
                {"HSR Layout", "560102", "12.9121", "77.6389"},
                {"Indiranagar", "560038", "12.9784", "77.6412"},
                {"Electronic City", "560100", "12.8452", "77.6649"},
                {"Yelahanka", "560064", "13.1007", "77.5963"},
                {"Whitefield", "560066", "12.9698", "77.7499"},
                {"Koramangala", "560034", "12.9352", "77.6245"},
                {"Bellandur", "560103", "12.9304", "77.6784"},
                {"Malleshwaram", "560003", "13.0031", "77.5643"},
                {"Marathahalli", "560037", "12.9591", "77.6974"},
                {"Sadashivanagar", "560080", "13.0068", "77.5813"},
                {"BTM Layout", "560068", "12.9166", "77.6101"},
                {"Hebbal", "560024", "13.0358", "77.5970"},
                {"JP Nagar", "560078", "12.9063", "77.5857"},
                {"Jayanagar", "560041", "12.9308", "77.5838"},
                {"Sarjapur Road", "560035", "12.9103", "77.6850"}
        };
        String[] blrOffices = {"Embassy TechVillage (ORR)", "ITPB (Whitefield)", "Manyata Tech Park (Hebbal)"};

        populateFirmEmployees("BLR", "Colliers International (Bengaluru)", 2000, 500,
                blrLocalities, blrOffices, firstNames, lastNames, depts, titles, workModels, modes);

        // 3. MUMBAI FIRM: 500 Employees
        String[][] bomLocalities = {
                {"Thane West", "400601", "19.2183", "72.9781"},
                {"Andheri West", "400053", "19.1363", "72.8311"},
                {"Vashi", "400703", "19.0770", "72.9986"},
                {"Dadar West", "400028", "19.0178", "72.8353"},
                {"Bandra West", "400050", "19.0596", "72.8295"},
                {"Ghatkopar East", "400077", "19.0860", "72.9090"},
                {"Powai", "400076", "19.1176", "72.9060"},
                {"Airoli", "400708", "19.1579", "72.9935"},
                {"Borivali West", "400092", "19.2307", "72.8567"},
                {"Chembur", "400071", "19.0622", "72.8974"},
                {"Worli", "400018", "19.0134", "72.8186"},
                {"Mulund West", "400080", "19.1726", "72.9425"},
                {"Lower Parel", "400013", "18.9952", "72.8300"},
                {"Malad West", "400064", "19.1860", "72.8485"},
                {"Nerul", "400706", "19.0330", "73.0180"}
        };
        String[] bomOffices = {"Maker Maxity / ONE BKC", "One Lodha Place (Lower Parel)", "Mindspace Airoli (Navi Mumbai)"};

        populateFirmEmployees("BOM", "Colliers International (Mumbai)", 3000, 500,
                bomLocalities, bomOffices, firstNames, lastNames, depts, titles, workModels, modes);
    }

    private void populateFirmEmployees(String cityCode, String firmName, int startId, int count,
                                       String[][] localities, String[] offices, String[] firstNames,
                                       String[] lastNames, String[] depts, String[] titles,
                                       String[] workModels, String[] modes) {
        Random rng = new Random(startId); // Deterministic seed for repeatable test data
        for (int i = 0; i < count; i++) {
            String empId = cityCode + "-EMP-" + (startId + i);
            String fn = firstNames[rng.nextInt(firstNames.length)];
            String ln = lastNames[rng.nextInt(lastNames.length)];
            String fullName = fn + " " + ln;
            String email = fn.toLowerCase() + "." + ln.toLowerCase() + "@colliers.com";

            String dept = depts[rng.nextInt(depts.length)];
            String title = titles[rng.nextInt(titles.length)];
            String office = offices[rng.nextInt(offices.length)];

            String[] loc = localities[rng.nextInt(localities.length)];
            String localityName = loc[0];
            String pinCode = loc[1];
            double baseLat = Double.parseDouble(loc[2]);
            double baseLng = Double.parseDouble(loc[3]);
            // Jitter by ~500m to 1km around neighborhood centroid
            double lat = baseLat + (rng.nextDouble() - 0.5) * 0.015;
            double lng = baseLng + (rng.nextDouble() - 0.5) * 0.015;

            String mode = modes[rng.nextInt(modes.length)];
            double distanceKm = Math.round((4.0 + rng.nextDouble() * 26.0) * 10.0) / 10.0;
            int durationMins = (int) Math.round(distanceKm * (mode.contains("Metro") ? 1.6 : mode.contains("Car") ? 2.4 : 1.9) + rng.nextInt(8));
            if (durationMins < 14) durationMins = 14;

            String workModel = workModels[rng.nextInt(workModels.length)];

            // Realistic Carbon Footprint (kg CO2 per month based on mode and distance)
            double carbonFactor = mode.contains("Car") ? 0.17 : mode.contains("Bike") ? 0.05 : mode.contains("Metro") ? 0.02 : 0.035;
            int daysPerMonth = workModel.contains("3 Days") ? 13 : workModel.contains("2 Days") ? 9 : 21;
            double monthlyCarbon = Math.round(distanceKm * 2 * daysPerMonth * carbonFactor * 10.0) / 10.0;

            // Monthly Cost in INR
            int costPerDay = mode.contains("Car") ? (int)(distanceKm * 14) : mode.contains("Bike") ? (int)(distanceKm * 4) : 90;
            int monthlyCost = costPerDay * daysPerMonth + 400;

            int satisfaction = 3 + rng.nextInt(3);
            if (durationMins > 50) satisfaction = Math.max(1, satisfaction - 1);

            fullWorkforceDatabase.add(new EmployeeRecord(
                    empId, fullName, email, firmName, cityCode, dept, title, office,
                    localityName, pinCode, lat, lng, mode, distanceKm, durationMins,
                    workModel, monthlyCarbon, monthlyCost, satisfaction
            ));
        }
    }

    public List<EmployeeRecord> getWorkforceDatabase(String cityCode, String department, String commuteMode, String search) {
        return fullWorkforceDatabase.stream()
                .filter(e -> cityCode == null || cityCode.equalsIgnoreCase("ALL") || e.getCityCode().equalsIgnoreCase(cityCode))
                .filter(e -> department == null || department.equalsIgnoreCase("ALL") || e.getDepartment().equalsIgnoreCase(department))
                .filter(e -> commuteMode == null || commuteMode.equalsIgnoreCase("ALL") || e.getCommuteMode().equalsIgnoreCase(commuteMode))
                .filter(e -> {
                    if (search == null || search.trim().isEmpty()) return true;
                    String s = search.toLowerCase();
                    return e.getFullName().toLowerCase().contains(s) ||
                            e.getEmployeeId().toLowerCase().contains(s) ||
                            e.getResidentialLocality().toLowerCase().contains(s) ||
                            e.getDepartment().toLowerCase().contains(s) ||
                            e.getAssignedOffice().toLowerCase().contains(s) ||
                            e.getPinCode().contains(s);
                })
                .collect(Collectors.toList());
    }

    public WorkforceStats getWorkforceStats(String cityCode) {
        List<EmployeeRecord> records = getWorkforceDatabase(cityCode, "ALL", "ALL", null);
        if (records.isEmpty()) return new WorkforceStats();

        double totalMins = 0;
        double totalDist = 0;
        double totalCarbon = 0;
        double totalCost = 0;

        Map<String, Integer> modeCount = new LinkedHashMap<>();
        Map<String, Integer> deptCount = new LinkedHashMap<>();
        Map<String, Integer> workModelCount = new LinkedHashMap<>();
        Map<String, Integer> durationBands = new LinkedHashMap<>();
        durationBands.put("< 30 Mins", 0);
        durationBands.put("30 - 45 Mins", 0);
        durationBands.put("45 - 60 Mins", 0);
        durationBands.put("> 60 Mins", 0);

        for (EmployeeRecord r : records) {
            totalMins += r.getCommuteDurationMins();
            totalDist += r.getCommuteDistanceKm();
            totalCarbon += r.getMonthlyCarbonKg();
            totalCost += r.getMonthlyCommuteCostInr();

            modeCount.put(r.getCommuteMode(), modeCount.getOrDefault(r.getCommuteMode(), 0) + 1);
            deptCount.put(r.getDepartment(), deptCount.getOrDefault(r.getDepartment(), 0) + 1);
            workModelCount.put(r.getWorkModel(), workModelCount.getOrDefault(r.getWorkModel(), 0) + 1);

            int dur = r.getCommuteDurationMins();
            if (dur < 30) durationBands.put("< 30 Mins", durationBands.get("< 30 Mins") + 1);
            else if (dur <= 45) durationBands.put("30 - 45 Mins", durationBands.get("30 - 45 Mins") + 1);
            else if (dur <= 60) durationBands.put("45 - 60 Mins", durationBands.get("45 - 60 Mins") + 1);
            else durationBands.put("> 60 Mins", durationBands.get("> 60 Mins") + 1);
        }

        int count = records.size();
        return new WorkforceStats(
                count,
                Math.round((totalMins / count) * 10.0) / 10.0,
                Math.round((totalDist / count) * 10.0) / 10.0,
                Math.round(totalCarbon * 10.0) / 10.0,
                Math.round(totalCost / count),
                modeCount, deptCount, durationBands, workModelCount
        );
    }

    public String generateCsv(String cityCode) {
        List<EmployeeRecord> records = getWorkforceDatabase(cityCode, "ALL", "ALL", null);
        StringBuilder sb = new StringBuilder();
        sb.append("Employee ID,Full Name,Email,Firm,City,Department,Job Title,Assigned Office,Locality,PIN Code,Latitude,Longitude,Commute Mode,Distance (km),Duration (mins),Work Model,Monthly Carbon (kg CO2),Monthly Cost (INR),Satisfaction (1-5)\n");
        for (EmployeeRecord r : records) {
            sb.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.5f,%.5f,\"%s\",%.1f,%d,\"%s\",%.1f,%d,%d\n",
                    r.getEmployeeId(), r.getFullName(), r.getEmail(), r.getFirmName(), r.getCityCode(),
                    r.getDepartment(), r.getJobTitle(), r.getAssignedOffice(), r.getResidentialLocality(),
                    r.getPinCode(), r.getLatitude(), r.getLongitude(), r.getCommuteMode(),
                    r.getCommuteDistanceKm(), r.getCommuteDurationMins(), r.getWorkModel(),
                    r.getMonthlyCarbonKg(), r.getMonthlyCommuteCostInr(), r.getSatisfactionScore()));
        }
        return sb.toString();
    }

    private List<EmployeeLocation> generateChennaiEmployees() {
        return List.of(
                new EmployeeLocation("E-CHE-1", "CHE", "EMP-101", "Engineering", "Velachery", "600042", 12.9815, 80.2206, "driving"),
                new EmployeeLocation("E-CHE-2", "CHE", "EMP-102", "Engineering", "Tambaram", "600045", 12.9249, 80.1171, "transit"),
                new EmployeeLocation("E-CHE-3", "CHE", "EMP-103", "Operations", "Anna Nagar", "600040", 13.0878, 80.2090, "driving"),
                new EmployeeLocation("E-CHE-4", "CHE", "EMP-104", "Sales", "Adyar", "600020", 13.0012, 80.2570, "driving"),
                new EmployeeLocation("E-CHE-5", "CHE", "EMP-105", "Product", "Thiruvanmiyur", "600041", 12.9830, 80.2594, "two-wheeler"),
                new EmployeeLocation("E-CHE-6", "CHE", "EMP-106", "Leadership", "Nungambakkam", "600034", 13.0569, 80.2425, "driving"),
                new EmployeeLocation("E-CHE-7", "CHE", "EMP-107", "Data Science", "Medavakkam", "600100", 12.9198, 80.1925, "two-wheeler"),
                new EmployeeLocation("E-CHE-8", "CHE", "EMP-108", "Consulting", "Porur", "600116", 13.0382, 80.1565, "driving"),
                new EmployeeLocation("E-CHE-9", "CHE", "EMP-109", "HR", "Mylapore", "600004", 13.0368, 80.2676, "transit"),
                new EmployeeLocation("E-CHE-10", "CHE", "EMP-110", "Finance", "Chromepet", "600044", 12.9516, 80.1462, "transit")
        );
    }

    private List<EmployeeLocation> generateMumbaiEmployees() {
        return List.of(
                new EmployeeLocation("E-BOM-1", "BOM", "EMP-201", "BFSI Advisory", "Thane West", "400601", 19.2183, 72.9781, "transit"),
                new EmployeeLocation("E-BOM-2", "BOM", "EMP-202", "Consulting", "Andheri West", "400053", 19.1363, 72.8311, "driving"),
                new EmployeeLocation("E-BOM-3", "BOM", "EMP-203", "Tech", "Vashi", "400703", 19.0770, 72.9986, "driving"),
                new EmployeeLocation("E-BOM-4", "BOM", "EMP-204", "Leadership", "Dadar West", "400028", 19.0178, 72.8353, "transit"),
                new EmployeeLocation("E-BOM-5", "BOM", "EMP-205", "Finance", "Bandra West", "400050", 19.0596, 72.8295, "driving"),
                new EmployeeLocation("E-BOM-6", "BOM", "EMP-206", "Operations", "Ghatkopar East", "400077", 19.0860, 72.9090, "transit")
        );
    }

    private List<EmployeeLocation> generateBengaluruEmployees() {
        return List.of(
                new EmployeeLocation("E-BLR-1", "BLR", "EMP-301", "GCC Tech", "HSR Layout", "560102", 12.9121, 77.6389, "two-wheeler"),
                new EmployeeLocation("E-BLR-2", "BLR", "EMP-302", "GCC Tech", "Indiranagar", "560038", 12.9784, 77.6412, "driving"),
                new EmployeeLocation("E-BLR-3", "BLR", "EMP-303", "Product", "Electronic City", "560100", 12.8452, 77.6649, "driving"),
                new EmployeeLocation("E-BLR-4", "BLR", "EMP-304", "Analytics", "Yelahanka", "560064", 13.1007, 77.5963, "transit"),
                new EmployeeLocation("E-BLR-5", "BLR", "EMP-305", "Engineering", "Whitefield", "560066", 12.9698, 77.7499, "two-wheeler"),
                new EmployeeLocation("E-BLR-6", "BLR", "EMP-306", "Consulting", "Koramangala", "560034", 12.9352, 77.6245, "driving")
        );
    }

    public List<City> getAllCities() { return new ArrayList<>(cities.values()); }
    public City getCity(String code) { return cities.getOrDefault(code.toUpperCase(), cities.get("CHE")); }
    public List<CandidateOffice> getOffices(String cityCode) { return officesByCity.getOrDefault(cityCode.toUpperCase(), officesByCity.get("CHE")); }
    public List<EmployeeLocation> getEmployees(String cityCode) { return employeesByCity.getOrDefault(cityCode.toUpperCase(), employeesByCity.get("CHE")); }

    public List<OfficeScorecard> getScorecards(String cityCode) {
        List<CandidateOffice> offices = getOffices(cityCode);
        List<OfficeScorecard> scorecards = new ArrayList<>();

        for (CandidateOffice off : offices) {
            Map<String, Integer> dist = new LinkedHashMap<>();
            if (off.getId().contains("CHE-OF-1")) { // Guindy
                dist.put("<15m", 35); dist.put("15-30m", 42); dist.put("30-45m", 14); dist.put("45-60m", 7); dist.put(">60m", 2);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "77%", 9.2, 9.6,
                        "Optimal central location. Sits at the confluence of Anna Salai and Inner Ring Road, cutting transit time for South & West Chennai by ~35%.", dist));
            } else if (off.getId().contains("CHE-OF-2")) { // OMR
                dist.put("<15m", 22); dist.put("15-30m", 30); dist.put("30-45m", 24); dist.put("45-60m", 16); dist.put(">60m", 8);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "52%", 7.8, 7.5,
                        "High tech talent density in South Chennai, but creates severe bottleneck for West & Central employees due to toll plaza congestion.", dist));
            } else if (off.getId().contains("CHE-OF-3")) { // Porur
                dist.put("<15m", 18); dist.put("15-30m", 25); dist.put("30-45m", 20); dist.put("45-60m", 22); dist.put(">60m", 15);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "43%", 7.1, 6.8,
                        "Cost-effective rental profile (₹75/sqft). Strong appeal for West Chennai talent pool; long haul for OMR/ECR employees.", dist));
            } else if (off.getId().contains("CHE-OF-4")) { // Tidel Park
                dist.put("<15m", 30); dist.put("15-30m", 38); dist.put("30-45m", 16); dist.put("45-60m", 11); dist.put(">60m", 5);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "68%", 8.8, 9.1,
                        "Premier IT landmark in Taramani with direct MRTS station access. Fast connectivity for South & Coastal Chennai talent.", dist));
            } else if (off.getId().contains("CHE-OF-5")) { // ASV Suntech Park
                dist.put("<15m", 20); dist.put("15-30m", 28); dist.put("30-45m", 23); dist.put("45-60m", 18); dist.put(">60m", 11);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "50%", 7.4, 7.2,
                        "Competitive rental terms in mid-OMR (₹70/sqft). Well-positioned for Medavakkam & South Chennai tech talent.", dist));
            } else if (off.getId().contains("BOM-OF-1")) { // BKC
                dist.put("<15m", 15); dist.put("15-30m", 32); dist.put("30-45m", 25); dist.put("45-60m", 18); dist.put(">60m", 10);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "47%", 8.5, 8.8,
                        "Premier business address with highest executive prestige; central node connecting Western & Central rail lines via SCLR.", dist));
            } else if (off.getId().contains("BOM-OF-2")) { // Lower Parel
                dist.put("<15m", 10); dist.put("15-30m", 24); dist.put("30-45m", 25); dist.put("45-60m", 22); dist.put(">60m", 19);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "34%", 7.2, 7.9,
                        "South Mumbai proximity and lifestyle amenities, but high peak-hour bottleneck for Northern suburban workforce.", dist));
            } else if (off.getId().contains("BOM-OF-3")) { // Airoli
                dist.put("<15m", 38); dist.put("15-30m", 32); dist.put("30-45m", 14); dist.put("45-60m", 11); dist.put(">60m", 5);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "70%", 8.9, 7.4,
                        "High affordability (₹70/sqft) with 84% of Central Line & Thane workforce within 45 mins. 74% rent reduction vs BKC.", dist));
            } else if (off.getId().contains("BOM-OF-4")) { // Nesco Goregaon
                dist.put("<15m", 22); dist.put("15-30m", 35); dist.put("30-45m", 22); dist.put("45-60m", 14); dist.put(">60m", 7);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "64%", 8.6, 8.4,
                        "Direct Western Express Highway & Ram Mandir railway connectivity. Captures North & Western suburban talent without South Mumbai premiums.", dist));
            } else if (off.getId().contains("BOM-OF-5")) { // Hiranandani Powai
                dist.put("<15m", 25); dist.put("15-30m", 30); dist.put("30-45m", 19); dist.put("45-60m", 16); dist.put(">60m", 10);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "58%", 8.3, 8.7,
                        "Integrated mixed-use township with JVLR arterial connectivity. Strong live-work-play ecosystem.", dist));
            } else if (off.getId().contains("BLR-OF-1")) { // ORR
                dist.put("<15m", 12); dist.put("15-30m", 22); dist.put("30-45m", 21); dist.put("45-60m", 26); dist.put(">60m", 19);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "34%", 6.8, 6.2,
                        "Unbeatable GCC talent concentration, but highest commute variability due to Silk Board and Marathahalli peak choke-points.", dist));
            } else if (off.getId().contains("BLR-OF-2")) { // Whitefield
                dist.put("<15m", 24); dist.put("15-30m", 26); dist.put("30-45m", 18); dist.put("45-60m", 18); dist.put(">60m", 14);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "50%", 8.1, 8.4,
                        "Purple Metro connectivity provides resilient commute times for East & Central Bangalore workforce.", dist));
            } else if (off.getId().contains("BLR-OF-3")) { // Hebbal
                dist.put("<15m", 28); dist.put("15-30m", 34); dist.put("30-45m", 19); dist.put("45-60m", 12); dist.put(">60m", 7);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "62%", 8.7, 8.1,
                        "Fastest corridor to Kempegowda Airport and emerging northern residential clusters; 31 mins average commute.", dist));
            } else if (off.getId().contains("BLR-OF-4")) { // Bagmane Tech Park
                dist.put("<15m", 32); dist.put("15-30m", 38); dist.put("30-45m", 16); dist.put("45-60m", 9); dist.put(">60m", 5);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "72%", 9.0, 9.3,
                        "Central tech park near Byappanahalli Metro. 86% of workforce within 45 mins with 27m average commute.", dist));
            } else { // Prestige Tech Park
                dist.put("<15m", 16); dist.put("15-30m", 26); dist.put("30-45m", 22); dist.put("45-60m", 21); dist.put(">60m", 15);
                scorecards.add(new OfficeScorecard(off.getId(), off.getName(), off.getMicroMarket(), off.getRentPerSqft(),
                        off.getAvgCommuteMins(), off.getPctUnder45Mins() + "%", "44%", 7.5, 7.0,
                        "Flagship ORR GCC campus with direct flyover frontage. High prestige occupier ecosystem.", dist));
            }
        }
        return scorecards;
    }

    public Map<String, Object> getCenterOfGravity(String cityCode) {
        List<EmployeeLocation> emps = getEmployees(cityCode);
        if (emps.isEmpty()) return Collections.emptyMap();

        double sumLat = 0, sumLng = 0;
        for (EmployeeLocation e : emps) {
            sumLat += e.getLatitude();
            sumLng += e.getLongitude();
        }
        double avgLat = sumLat / emps.size();
        double avgLng = sumLng / emps.size();

        Map<String, Object> feature = new LinkedHashMap<>();
        feature.put("type", "Feature");
        feature.put("geometry", Map.of("type", "Point", "coordinates", List.of(avgLng, avgLat)));
        feature.put("properties", Map.of(
                "title", "Workforce Center of Gravity (" + cityCode.toUpperCase() + ")",
                "description", "Geographic optimal coordinate minimizing collective employee transit distance.",
                "totalEmployeesSampled", emps.size(),
                "latitude", avgLat,
                "longitude", avgLng
        ));
        return feature;
    }

    public Map<String, Object> getIsochrones(String cityCode, String officeId) {
        List<CandidateOffice> offices = getOffices(cityCode);
        CandidateOffice target = null;
        for (CandidateOffice off : offices) {
            if (off.getId().equalsIgnoreCase(officeId)) { target = off; break; }
        }
        if (target == null && !offices.isEmpty()) target = offices.get(0);
        if (target == null) return Map.of("type", "FeatureCollection", "features", List.of());

        double cLat = target.getLatitude();
        double cLng = target.getLongitude();

        List<EmployeeRecord> emps = getWorkforceDatabase(cityCode, "ALL", "ALL", null);

        List<Map<String, Object>> features = new ArrayList<>();
        int[] minutes = {60, 45, 30, 15};
        String[] colors = {"#7C3AED", "#D97706", "#1C54F4", "#059669"};
        double[] opacities = {0.18, 0.22, 0.28, 0.35};
        double[] elevations = {10.0, 30.0, 60.0, 100.0};
        String[] labels = {
                "60 Mins (Outer Commute Catchment)",
                "45 Mins (Extended Regional Catchment)",
                "30 Mins (Optimal Commute Zone)",
                "15 Mins (Prime Walk & Short Transit Reach)"
        };

        for (int i = 0; i < minutes.length; i++) {
            List<List<Double>> ring = createEmployeeAwareCatchmentPolygon(cLat, cLng, emps, minutes[i]);
            Map<String, Object> feature = new LinkedHashMap<>();
            feature.put("type", "Feature");
            feature.put("geometry", Map.of("type", "Polygon", "coordinates", List.of(ring)));
            feature.put("properties", Map.of(
                    "minutes", minutes[i],
                    "color", colors[i],
                    "opacity", opacities[i],
                    "elevation", elevations[i],
                    "label", labels[i],
                    "officeId", target.getId(),
                    "officeName", target.getName()
            ));
            features.add(feature);
        }

        return Map.of("type", "FeatureCollection", "features", features);
    }

    private List<List<Double>> createEmployeeAwareCatchmentPolygon(double centerLat, double centerLng, List<EmployeeRecord> emps, int maxMinutes) {
        int numSectors = 36;
        double kmPerLat = 110.574;
        double kmPerLng = 111.320 * Math.cos(Math.toRadians(centerLat));

        double baseRadiusKm = 16.0;
        if (maxMinutes == 15) baseRadiusKm = 2.5;
        else if (maxMinutes == 30) baseRadiusKm = 5.5;
        else if (maxMinutes == 45) baseRadiusKm = 10.0;

        double[] sectorMaxR = new double[numSectors];
        Arrays.fill(sectorMaxR, baseRadiusKm * 0.35); // baseline minimum envelope

        for (EmployeeRecord emp : emps) {
            double dLatKm = (emp.getLatitude() - centerLat) * kmPerLat;
            double dLngKm = (emp.getLongitude() - centerLng) * kmPerLng;
            double distKm = Math.sqrt(dLatKm * dLatKm + dLngKm * dLngKm);

            double estMins = (distKm / 32.0) * 60.0;
            if (emp.getCommuteDurationMins() > 0) {
                estMins = emp.getCommuteDurationMins();
            }

            if (estMins <= maxMinutes) {
                double angle = Math.atan2(dLatKm, dLngKm);
                if (angle < 0) angle += 2 * Math.PI;

                int sIdx = (int) Math.round((angle / (2 * Math.PI)) * numSectors) % numSectors;
                if (distKm > sectorMaxR[sIdx]) {
                    sectorMaxR[sIdx] = Math.min(distKm, baseRadiusKm * 1.5);
                }
            }
        }

        // Apply 3-tap smoothing across sectors
        double[] smoothed = new double[numSectors];
        for (int i = 0; i < numSectors; i++) {
            double prevR = sectorMaxR[(i - 1 + numSectors) % numSectors];
            double currR = sectorMaxR[i];
            double nextR = sectorMaxR[(i + 1) % numSectors];
            smoothed[i] = 0.25 * prevR + 0.5 * currR + 0.25 * nextR;
        }

        List<List<Double>> coords = new ArrayList<>();
        for (int i = 0; i <= numSectors; i++) {
            int idx = i % numSectors;
            double angle = (2 * Math.PI * idx) / numSectors;
            double r = smoothed[idx];
            double dLat = (r * Math.sin(angle)) / kmPerLat;
            double dLng = (r * Math.cos(angle)) / kmPerLng;
            coords.add(List.of(centerLng + dLng, centerLat + dLat));
        }

        return coords;
    }
}
