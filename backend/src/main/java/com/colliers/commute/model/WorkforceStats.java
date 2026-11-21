package com.colliers.commute.model;

import java.util.Map;

public class WorkforceStats {
    private int totalHeadcount;
    private double avgCommuteMinutes;
    private double avgCommuteDistanceKm;
    private double totalMonthlyCarbonKg;
    private double avgMonthlyCostInr;
    private Map<String, Integer> modeBreakdown;
    private Map<String, Integer> departmentBreakdown;
    private Map<String, Integer> durationBands;
    private Map<String, Integer> workModelBreakdown;

    public WorkforceStats() {}

    public WorkforceStats(int totalHeadcount, double avgCommuteMinutes, double avgCommuteDistanceKm,
                          double totalMonthlyCarbonKg, double avgMonthlyCostInr,
                          Map<String, Integer> modeBreakdown, Map<String, Integer> departmentBreakdown,
                          Map<String, Integer> durationBands, Map<String, Integer> workModelBreakdown) {
        this.totalHeadcount = totalHeadcount;
        this.avgCommuteMinutes = avgCommuteMinutes;
        this.avgCommuteDistanceKm = avgCommuteDistanceKm;
        this.totalMonthlyCarbonKg = totalMonthlyCarbonKg;
        this.avgMonthlyCostInr = avgMonthlyCostInr;
        this.modeBreakdown = modeBreakdown;
        this.departmentBreakdown = departmentBreakdown;
        this.durationBands = durationBands;
        this.workModelBreakdown = workModelBreakdown;
    }

    public int getTotalHeadcount() { return totalHeadcount; }
    public void setTotalHeadcount(int totalHeadcount) { this.totalHeadcount = totalHeadcount; }

    public double getAvgCommuteMinutes() { return avgCommuteMinutes; }
    public void setAvgCommuteMinutes(double avgCommuteMinutes) { this.avgCommuteMinutes = avgCommuteMinutes; }

    public double getAvgCommuteDistanceKm() { return avgCommuteDistanceKm; }
    public void setAvgCommuteDistanceKm(double avgCommuteDistanceKm) { this.avgCommuteDistanceKm = avgCommuteDistanceKm; }

    public double getTotalMonthlyCarbonKg() { return totalMonthlyCarbonKg; }
    public void setTotalMonthlyCarbonKg(double totalMonthlyCarbonKg) { this.totalMonthlyCarbonKg = totalMonthlyCarbonKg; }

    public double getAvgMonthlyCostInr() { return avgMonthlyCostInr; }
    public void setAvgMonthlyCostInr(double avgMonthlyCostInr) { this.avgMonthlyCostInr = avgMonthlyCostInr; }

    public Map<String, Integer> getModeBreakdown() { return modeBreakdown; }
    public void setModeBreakdown(Map<String, Integer> modeBreakdown) { this.modeBreakdown = modeBreakdown; }

    public Map<String, Integer> getDepartmentBreakdown() { return departmentBreakdown; }
    public void setDepartmentBreakdown(Map<String, Integer> departmentBreakdown) { this.departmentBreakdown = departmentBreakdown; }

    public Map<String, Integer> getDurationBands() { return durationBands; }
    public void setDurationBands(Map<String, Integer> durationBands) { this.durationBands = durationBands; }

    public Map<String, Integer> getWorkModelBreakdown() { return workModelBreakdown; }
    public void setWorkModelBreakdown(Map<String, Integer> workModelBreakdown) { this.workModelBreakdown = workModelBreakdown; }
}
