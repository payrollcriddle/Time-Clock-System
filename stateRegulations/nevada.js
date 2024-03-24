export function nevadaRegulations(dailyHours, weeklyHours, hourlyRate) {
  let regularHours = 0;
  let overtimeHours = 0;

  if (hourlyRate < 1.5 * 8.25) { // Assuming minimum wage is $8.25
    regularHours = Math.min(8, dailyHours);
    if (dailyHours > 8) {
      overtimeHours = dailyHours - 8;
    }
  } else {
    regularHours = Math.min(40, weeklyHours);
    if (weeklyHours > 40) {
      overtimeHours = weeklyHours - 40;
    }
  }

  return { regularHours, overtimeHours };
}
