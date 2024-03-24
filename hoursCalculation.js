import { californiaRegulations } from './stateRegulations/california.js';
import { coloradoRegulations } from './stateRegulations/colorado.js';
import { nevadaRegulations } from './stateRegulations/nevada.js';
import { oregonRegulations } from './stateRegulations/oregon.js';
import { washingtonRegulations } from './stateRegulations/washington.js';
import { montanaRegulations } from './stateRegulations/montana.js';
import { wyomingRegulations } from './stateRegulations/wyoming.js';
import { idahoRegulations } from './stateRegulations/idaho.js';

// Function to calculate hours based on state regulations
export function calculateHours(state, dailyHours, weeklyHours, hourlyRate) {
  let regularHours = 0;
  let overtimeHours = 0;
  let doubleTimeHours = 0;

  switch (state) {
    case 'California':
      // Apply California regulations
      ({ regularHours, overtimeHours, doubleTimeHours } = californiaRegulations(dailyHours, weeklyHours));
      break;
    case 'Colorado':
      // Apply Colorado regulations
      ({ regularHours, overtimeHours } = coloradoRegulations(dailyHours, weeklyHours));
      break;
    case 'Nevada':
      // Apply Nevada regulations
      ({ regularHours, overtimeHours } = nevadaRegulations(dailyHours, weeklyHours, hourlyRate));
      break;
    case 'Oregon':
    case 'Washington':
    case 'Montana':
      // Apply Oregon, Washington, and Montana regulations
      ({ regularHours, overtimeHours } = oregonRegulations(weeklyHours));
      break;
    case 'Wyoming':
    case 'Idaho':
      // Apply Wyoming and Idaho regulations (follow FLSA)
      ({ regularHours, overtimeHours } = wyomingRegulations(weeklyHours));
      break;
    default:
      // Default labor regulations (follow FLSA)
      ({ regularHours, overtimeHours } = wyomingRegulations(weeklyHours));
  }

  return {
    regularHours: regularHours,
    overtimeHours: overtimeHours,
    doubleTimeHours: doubleTimeHours
  };
}
