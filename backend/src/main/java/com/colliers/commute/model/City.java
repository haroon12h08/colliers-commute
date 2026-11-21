package com.colliers.commute.model;

public class City {
    private String code;
    private String name;
    private double latitude;
    private double longitude;
    private int defaultZoom;
    private String description;

    public City() {}

    public City(String code, String name, double latitude, double longitude, int defaultZoom, String description) {
        this.code = code;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.defaultZoom = defaultZoom;
        this.description = description;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public int getDefaultZoom() { return defaultZoom; }
    public void setDefaultZoom(int defaultZoom) { this.defaultZoom = defaultZoom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
