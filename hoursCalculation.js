// Function to calculate hours based on state regulations
export function calculateHours(state, dailyHours, weeklyHours, hourlyRate) {
  let regularHours = 0;
  let overtimeHours = 0;
  let doubleTimeHours = 0;

  switch (state) {
    case 'Oregon':
    case 'Washington':
    case 'Montana':
      // Oregon, Washington, and Montana labor regulations
      regularHours = Math.min(40, weeklyHours);
      if (weeklyHours > 40) {
        overtimeHours = weeklyHours - 40;
      }
      break;

    case 'Wyoming':
    case 'Idaho':
      // Wyoming and Idaho labor regulations (follow FLSA)
      regularHours = Math.min(40, weeklyHours);
      if (weeklyHours > 40) {
        overtimeHours = weeklyHours - 40;
      }
      break;

    case 'Nevada':
      // Nevada labor regulations
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
      break;

    case 'California':
      // California labor regulations
      regularHours = Math.min(40, weeklyHours);
      if (weeklyHours > 40) {
        overtimeHours = weeklyHours - 40;
      }
      if (dailyHours > 8 && dailyHours <= 12) {
        overtimeHours += dailyHours - 8;
      } else if (dailyHours > 12) {
        overtimeHours += 4;
        doubleTimeHours = dailyHours - 12;
      }
      break;

    case 'Colorado':
      // Colorado labor regulations
      regularHours = Math.min(40, weeklyHours);
      if (weeklyHours > 40) {
        overtimeHours = weeklyHours - 40;
      }
      if (dailyHours > 12) {
        overtimeHours += dailyHours - 12;
      }
      break;

    default:
      // Default labor regulations (follow FLSA)
      regularHours = Math.min(40, weeklyHours);
      if (weeklyHours > 40) {
        overtimeHours = weeklyHours - 40;
      }
  }

  return {
    regularHours: regularHours,
    overtimeHours: overtimeHours,
    doubleTimeHours: doubleTimeHours
  };
}
