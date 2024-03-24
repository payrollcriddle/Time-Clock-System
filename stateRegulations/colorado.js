export function coloradoRegulations(dailyHours, weeklyHours) {
  let regularHours = Math.min(40, weeklyHours);
  let overtimeHours = 0;

  if (weeklyHours > 40) {
    overtimeHours = weeklyHours - 40;
  }

  if (dailyHours > 12) {
    overtimeHours += dailyHours - 12;
  }

  return { regularHours, overtimeHours };
}
