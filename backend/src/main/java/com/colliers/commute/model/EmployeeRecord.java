package com.colliers.commute.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EmployeeRecord {
    private String employeeId;
    private String fullName;
    private String email;
    private String firmName;
    private String cityCode;
    private String department;
    private String jobTitle;
    private String assignedOffice;
    private String residentialLocality;
    private String residentialAddress;
    private String hubId;
    private String pinCode;
    private double latitude;
    private double longitude;
    private String commuteMode;
    private double commuteDistanceKm;
    private int commuteDurationMins;
    private String workModel; // "Hybrid (3 Days Office)", "Hybrid (2 Days Office)", "Full In-Office"
    private double monthlyCarbonKg;
    private int monthlyCommuteCostInr;
    private int satisfactionScore; // 1 to 5

    public EmployeeRecord() {}

    public EmployeeRecord(String employeeId, String fullName, String email, String firmName,
                          String cityCode, String department, String jobTitle, String assignedOffice,
                          String residentialLocality, String pinCode, double latitude, double longitude,
                          String commuteMode, double commuteDistanceKm, int commuteDurationMins,
                          String workModel, double monthlyCarbonKg, int monthlyCommuteCostInr,
                          int satisfactionScore) {
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.email = email;
        this.firmName = firmName;
        this.cityCode = cityCode;
        this.department = department;
        this.jobTitle = jobTitle;
        this.assignedOffice = assignedOffice;
        this.residentialLocality = residentialLocality;
        this.residentialAddress = residentialLocality;
        this.pinCode = pinCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.commuteMode = commuteMode;
        this.commuteDistanceKm = commuteDistanceKm;
        this.commuteDurationMins = commuteDurationMins;
        this.workModel = workModel;
        this.monthlyCarbonKg = monthlyCarbonKg;
        this.monthlyCommuteCostInr = monthlyCommuteCostInr;
        this.satisfactionScore = satisfactionScore;
    }

    public String getResidentialAddress() { return residentialAddress != null ? residentialAddress : residentialLocality; }
    public void setResidentialAddress(String residentialAddress) { this.residentialAddress = residentialAddress; }

    public String getHubId() { return hubId; }
    public void setHubId(String hubId) { this.hubId = hubId; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirmName() { return firmName; }
    public void setFirmName(String firmName) { this.firmName = firmName; }

    public String getCityCode() { return cityCode; }
    public void setCityCode(String cityCode) { this.cityCode = cityCode; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getAssignedOffice() { return assignedOffice; }
    public void setAssignedOffice(String assignedOffice) { this.assignedOffice = assignedOffice; }

    public String getResidentialLocality() { return residentialLocality; }
    public void setResidentialLocality(String residentialLocality) { this.residentialLocality = residentialLocality; }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getCommuteMode() { return commuteMode; }
    public void setCommuteMode(String commuteMode) { this.commuteMode = commuteMode; }

    public double getCommuteDistanceKm() { return commuteDistanceKm; }
    public void setCommuteDistanceKm(double commuteDistanceKm) { this.commuteDistanceKm = commuteDistanceKm; }

    public int getCommuteDurationMins() { return commuteDurationMins; }
    public void setCommuteDurationMins(int commuteDurationMins) { this.commuteDurationMins = commuteDurationMins; }

    public String getWorkModel() { return workModel; }
    public void setWorkModel(String workModel) { this.workModel = workModel; }

    public double getMonthlyCarbonKg() { return monthlyCarbonKg; }
    public void setMonthlyCarbonKg(double monthlyCarbonKg) { this.monthlyCarbonKg = monthlyCarbonKg; }

    public int getMonthlyCommuteCostInr() { return monthlyCommuteCostInr; }
    public void setMonthlyCommuteCostInr(int monthlyCommuteCostInr) { this.monthlyCommuteCostInr = monthlyCommuteCostInr; }

    public int getSatisfactionScore() { return satisfactionScore; }
    public void setSatisfactionScore(int satisfactionScore) { this.satisfactionScore = satisfactionScore; }
}
