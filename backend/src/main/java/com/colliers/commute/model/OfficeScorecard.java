package com.colliers.commute.model;

import java.util.Map;

public class OfficeScorecard {
    private String officeId;
    private String officeName;
    private String microMarket;
    private double rentPerSqft;
    private int avgCommuteMins;
    private String pctUnder45Mins;
    private String pctUnder30Mins;
    private double sustainabilityScore; // 1 to 10
    private double transitAccessibilityScore; // 1 to 10
    private String recommendationSummary;
    private Map<String, Integer> commuteDistribution; // "<15m", "15-30m", "30-45m", "45-60m", ">60m"

    public OfficeScorecard() {}

    public OfficeScorecard(String officeId, String officeName, String microMarket, double rentPerSqft,
                           int avgCommuteMins, String pctUnder45Mins, String pctUnder30Mins,
                           double sustainabilityScore, double transitAccessibilityScore,
                           String recommendationSummary, Map<String, Integer> commuteDistribution) {
        this.officeId = officeId;
        this.officeName = officeName;
        this.microMarket = microMarket;
        this.rentPerSqft = rentPerSqft;
        this.avgCommuteMins = avgCommuteMins;
        this.pctUnder45Mins = pctUnder45Mins;
        this.pctUnder30Mins = pctUnder30Mins;
        this.sustainabilityScore = sustainabilityScore;
        this.transitAccessibilityScore = transitAccessibilityScore;
        this.recommendationSummary = recommendationSummary;
        this.commuteDistribution = commuteDistribution;
    }

    public String getOfficeId() { return officeId; }
    public void setOfficeId(String officeId) { this.officeId = officeId; }

    public String getOfficeName() { return officeName; }
    public void setOfficeName(String officeName) { this.officeName = officeName; }

    public String getMicroMarket() { return microMarket; }
    public void setMicroMarket(String microMarket) { this.microMarket = microMarket; }

    public double getRentPerSqft() { return rentPerSqft; }
    public void setRentPerSqft(double rentPerSqft) { this.rentPerSqft = rentPerSqft; }

    public int getAvgCommuteMins() { return avgCommuteMins; }
    public void setAvgCommuteMins(int avgCommuteMins) { this.avgCommuteMins = avgCommuteMins; }

    public String getPctUnder45Mins() { return pctUnder45Mins; }
    public void setPctUnder45Mins(String pctUnder45Mins) { this.pctUnder45Mins = pctUnder45Mins; }

    public String getPctUnder30Mins() { return pctUnder30Mins; }
    public void setPctUnder30Mins(String pctUnder30Mins) { this.pctUnder30Mins = pctUnder30Mins; }

    public double getSustainabilityScore() { return sustainabilityScore; }
    public void setSustainabilityScore(double sustainabilityScore) { this.sustainabilityScore = sustainabilityScore; }

    public double getTransitAccessibilityScore() { return transitAccessibilityScore; }
    public void setTransitAccessibilityScore(double transitAccessibilityScore) { this.transitAccessibilityScore = transitAccessibilityScore; }

    public String getRecommendationSummary() { return recommendationSummary; }
    public void setRecommendationSummary(String recommendationSummary) { this.recommendationSummary = recommendationSummary; }

    public Map<String, Integer> getCommuteDistribution() { return commuteDistribution; }
    public void setCommuteDistribution(Map<String, Integer> commuteDistribution) { this.commuteDistribution = commuteDistribution; }
}
