export function nevadaRegulations(dailyHours, weeklyHours, hourlyRate) {
  let regularHours = 0;
  let overtimeHours = 0;

  if (hourlyRate < 1.5 * 8.25) { // Assuming minimum wage is $8.25
    regularHours = Math.min(8, dailyHours);
  } else {
    regularHours = Math.min(40, weeklyHours);
  }

  return regularHours;
}

export function nevadaOvertimeRegulations(dailyHours, weeklyHours, hourlyRate) {
  let overtimeHours = 0;

  if (hourlyRate < 1.5 * 8.25) { // Assuming minimum wage is $8.25
    if (dailyHours > 8) {
      overtimeHours = dailyHours - 8;
    }
  } else {
    if (weeklyHours > 40) {
      overtimeHours = weeklyHours - 40;
    }
  }

  return overtimeHours;
}
