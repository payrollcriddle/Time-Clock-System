export function montanaRegulations(weeklyHours) {
  let regularHours = Math.min(40, weeklyHours);
  let overtimeHours = 0;

  if (weeklyHours > 40) {
    overtimeHours = weeklyHours - 40;
  }

  return regularHours;
}

export function montanaOvertimeRegulations(weeklyHours) {
  let overtimeHours = 0;

  if (weeklyHours > 40) {
    overtimeHours = weeklyHours - 40;
  }

  return overtimeHours;
}
