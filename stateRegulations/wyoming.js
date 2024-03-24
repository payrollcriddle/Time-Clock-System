export function wyomingRegulations(weeklyHours) {
  let regularHours = Math.min(40, weeklyHours);
  let overtimeHours = 0;

  if (weeklyHours > 40) {
    overtimeHours = weeklyHours - 40;
  }

  return { regularHours, overtimeHours };
}
