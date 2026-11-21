package com.colliers.commute.model;

public class EmployeeLocation {
    private String id;
    private String cityCode;
    private String employeeCode;
    private String department;
    private String localityName;
    private String pinCode;
    private double latitude;
    private double longitude;
    private String preferredMode;

    public EmployeeLocation() {}

    public EmployeeLocation(String id, String cityCode, String employeeCode, String department,
                            String localityName, String pinCode, double latitude, double longitude, String preferredMode) {
        this.id = id;
        this.cityCode = cityCode;
        this.employeeCode = employeeCode;
        this.department = department;
        this.localityName = localityName;
        this.pinCode = pinCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.preferredMode = preferredMode;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCityCode() { return cityCode; }
    public void setCityCode(String cityCode) { this.cityCode = cityCode; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getLocalityName() { return localityName; }
    public void setLocalityName(String localityName) { this.localityName = localityName; }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getPreferredMode() { return preferredMode; }
    public void setPreferredMode(String preferredMode) { this.preferredMode = preferredMode; }
}
