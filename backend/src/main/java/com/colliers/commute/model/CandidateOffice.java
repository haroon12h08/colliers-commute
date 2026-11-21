package com.colliers.commute.model;

import java.util.List;

public class CandidateOffice {
    private String id;
    private String cityCode;
    private String name;
    private String microMarket;
    private double rentPerSqft;
    private String grade;
    private double latitude;
    private double longitude;
    private List<String> keyFeatures;
    private int avgCommuteMins;
    private int pctUnder45Mins;
    private String imageUrl;
    private String totalAreaSqft;
    private String leedRating;

    public CandidateOffice() {}

    public CandidateOffice(String id, String cityCode, String name, String microMarket, double rentPerSqft,
                           String grade, double latitude, double longitude, List<String> keyFeatures,
                           int avgCommuteMins, int pctUnder45Mins) {
        this(id, cityCode, name, microMarket, rentPerSqft, grade, latitude, longitude, keyFeatures, avgCommuteMins, pctUnder45Mins, null, null, null);
    }

    public CandidateOffice(String id, String cityCode, String name, String microMarket, double rentPerSqft,
                           String grade, double latitude, double longitude, List<String> keyFeatures,
                           int avgCommuteMins, int pctUnder45Mins, String imageUrl, String totalAreaSqft, String leedRating) {
        this.id = id;
        this.cityCode = cityCode;
        this.name = name;
        this.microMarket = microMarket;
        this.rentPerSqft = rentPerSqft;
        this.grade = grade;
        this.latitude = latitude;
        this.longitude = longitude;
        this.keyFeatures = keyFeatures;
        this.avgCommuteMins = avgCommuteMins;
        this.pctUnder45Mins = pctUnder45Mins;
        this.imageUrl = imageUrl;
        this.totalAreaSqft = totalAreaSqft;
        this.leedRating = leedRating;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCityCode() { return cityCode; }
    public void setCityCode(String cityCode) { this.cityCode = cityCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMicroMarket() { return microMarket; }
    public void setMicroMarket(String microMarket) { this.microMarket = microMarket; }

    public double getRentPerSqft() { return rentPerSqft; }
    public void setRentPerSqft(double rentPerSqft) { this.rentPerSqft = rentPerSqft; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public List<String> getKeyFeatures() { return keyFeatures; }
    public void setKeyFeatures(List<String> keyFeatures) { this.keyFeatures = keyFeatures; }

    public int getAvgCommuteMins() { return avgCommuteMins; }
    public void setAvgCommuteMins(int avgCommuteMins) { this.avgCommuteMins = avgCommuteMins; }

    public int getPctUnder45Mins() { return pctUnder45Mins; }
    public void setPctUnder45Mins(int pctUnder45Mins) { this.pctUnder45Mins = pctUnder45Mins; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTotalAreaSqft() { return totalAreaSqft; }
    public void setTotalAreaSqft(String totalAreaSqft) { this.totalAreaSqft = totalAreaSqft; }

    public String getLeedRating() { return leedRating; }
    public void setLeedRating(String leedRating) { this.leedRating = leedRating; }
}
