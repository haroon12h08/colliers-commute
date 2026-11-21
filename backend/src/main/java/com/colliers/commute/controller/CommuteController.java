package com.colliers.commute.controller;

import com.colliers.commute.model.*;
import com.colliers.commute.service.CommuteDataService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/commute")
@CrossOrigin(origins = "*")
public class CommuteController {

    private final CommuteDataService dataService;

    public CommuteController(CommuteDataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Colliers Commute Location Intelligence API",
                "version", "1.0.0",
                "timestamp", new Date()
        ));
    }

    @GetMapping("/cities")
    public ResponseEntity<List<City>> getCities() {
        return ResponseEntity.ok(dataService.getAllCities());
    }

    @GetMapping("/city")
    public ResponseEntity<City> getCity(@RequestParam(defaultValue = "CHE") String cityCode) {
        return ResponseEntity.ok(dataService.getCity(cityCode));
    }

    @GetMapping("/offices")
    public ResponseEntity<List<CandidateOffice>> getOffices(@RequestParam(defaultValue = "CHE") String cityCode) {
        return ResponseEntity.ok(dataService.getOffices(cityCode));
    }

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeLocation>> getEmployees(@RequestParam(defaultValue = "CHE") String cityCode) {
        return ResponseEntity.ok(dataService.getEmployees(cityCode));
    }

    @GetMapping("/scorecard")
    public ResponseEntity<?> getCityScorecard(@RequestParam(defaultValue = "CHE") String cityCode) {
        List<OfficeScorecard> scorecards = dataService.getScorecards(cityCode);
        return ResponseEntity.ok(Map.of(
                "cityCode", cityCode.toUpperCase(),
                "timestamp", new Date(),
                "officesEvaluated", scorecards.size(),
                "scorecard", scorecards
        ));
    }

    @GetMapping("/isochrones")
    public ResponseEntity<?> getIsochrones(
            @RequestParam(defaultValue = "CHE") String cityCode,
            @RequestParam(required = false) String officeId) {
        return ResponseEntity.ok(dataService.getIsochrones(cityCode, officeId));
    }

    @GetMapping("/center-of-gravity")
    public ResponseEntity<?> getCenterOfGravity(@RequestParam(defaultValue = "CHE") String cityCode) {
        return ResponseEntity.ok(dataService.getCenterOfGravity(cityCode));
    }

    // 1,500 Employee Workforce Database Endpoints
    @GetMapping("/workforce")
    public ResponseEntity<List<EmployeeRecord>> getWorkforce(
            @RequestParam(required = false, defaultValue = "ALL") String cityCode,
            @RequestParam(required = false, defaultValue = "ALL") String department,
            @RequestParam(required = false, defaultValue = "ALL") String commuteMode,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(dataService.getWorkforceDatabase(cityCode, department, commuteMode, search));
    }

    @GetMapping("/workforce/stats")
    public ResponseEntity<WorkforceStats> getWorkforceStats(
            @RequestParam(required = false, defaultValue = "ALL") String cityCode) {
        return ResponseEntity.ok(dataService.getWorkforceStats(cityCode));
    }

    @GetMapping(value = "/workforce/export", produces = "text/csv")
    public ResponseEntity<String> exportWorkforceCsv(
            @RequestParam(required = false, defaultValue = "ALL") String cityCode) {
        String csvData = dataService.generateCsv(cityCode);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=colliers_workforce_" + cityCode.toLowerCase() + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
