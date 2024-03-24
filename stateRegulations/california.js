export function californiaRegulations(dailyHours, weeklyHours) {
  let regularHours = Math.min(40, weeklyHours);
  let overtimeHours = 0;
  let doubleTimeHours = 0;

  if (weeklyHours > 40) {
    overtimeHours = weeklyHours - 40;
  }

  if (dailyHours > 8 && dailyHours <= 12) {
    overtimeHours += dailyHours - 8;
  } else if (dailyHours > 12) {
    overtimeHours += 4;
    doubleTimeHours = dailyHours - 12;
  }

  return { regularHours, overtimeHours, doubleTimeHours };
}
