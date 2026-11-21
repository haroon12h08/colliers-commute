import WORKFORCE_1500 from './workforce1500.json';
import HUB_ROUTES from './hubRoutes.json';

export { WORKFORCE_1500, HUB_ROUTES };

export function calculateWorkforceStats(records) {
  if (!records || records.length === 0) return null;

  let totalMins = 0;
  let totalDist = 0;
  let totalCarbon = 0;
  let totalCost = 0;

  const modeBreakdown = {};
  const departmentBreakdown = {};
  const workModelBreakdown = {};
  const durationBands = {
    '< 30 Mins': 0,
    '30 - 45 Mins': 0,
    '45 - 60 Mins': 0,
    '> 60 Mins': 0
  };

  records.forEach(r => {
    totalMins += r.commuteDurationMins;
    totalDist += r.commuteDistanceKm;
    totalCarbon += r.monthlyCarbonKg;
    totalCost += r.monthlyCommuteCostInr;

    modeBreakdown[r.commuteMode] = (modeBreakdown[r.commuteMode] || 0) + 1;
    departmentBreakdown[r.department] = (departmentBreakdown[r.department] || 0) + 1;
    workModelBreakdown[r.workModel] = (workModelBreakdown[r.workModel] || 0) + 1;

    const dur = r.commuteDurationMins;
    if (dur < 30) durationBands['< 30 Mins']++;
    else if (dur <= 45) durationBands['30 - 45 Mins']++;
    else if (dur <= 60) durationBands['45 - 60 Mins']++;
    else durationBands['> 60 Mins']++;
  });

  const count = records.length;
  return {
    totalHeadcount: count,
    avgCommuteMinutes: Math.round((totalMins / count) * 10) / 10,
    avgCommuteDistanceKm: Math.round((totalDist / count) * 10) / 10,
    totalMonthlyCarbonKg: Math.round(totalCarbon * 10) / 10,
    avgMonthlyCostInr: Math.round(totalCost / count),
    modeBreakdown,
    departmentBreakdown,
    durationBands,
    workModelBreakdown
  };
}

export function exportToCsvClient(records, filename = 'colliers_workforce_1500.csv') {
  const headers = [
    'Employee ID', 'Full Name', 'Email', 'Firm Name', 'City Code',
    'Department', 'Job Title', 'Assigned Office', 'Residential Locality',
    'PIN Code', 'Latitude', 'Longitude', 'Commute Mode', 'Distance (km)',
    'Duration (mins)', 'Work Model', 'Monthly Carbon (kg CO2)', 'Monthly Cost (INR)', 'Satisfaction (1-5)'
  ];

  const rows = records.map(r => [
    `"${r.employeeId}"`,
    `"${r.fullName}"`,
    `"${r.email}"`,
    `"${r.firmName}"`,
    `"${r.cityCode}"`,
    `"${r.department}"`,
    `"${r.jobTitle}"`,
    `"${r.assignedOffice}"`,
    `"${r.residentialLocality}"`,
    `"${r.pinCode}"`,
    r.latitude,
    r.longitude,
    `"${r.commuteMode}"`,
    r.commuteDistanceKm,
    r.commuteDurationMins,
    `"${r.workModel}"`,
    r.monthlyCarbonKg,
    r.monthlyCommuteCostInr,
    r.satisfactionScore
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
