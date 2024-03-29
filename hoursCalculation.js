import { californiaRegulations } from '../stateRegulations/california.js';
import { coloradoRegulations } from '../stateRegulations/colorado.js';
import { nevadaRegulations } from '../stateRegulations/nevada.js';
import { oregonRegulations } from '../stateRegulations/oregon.js';
import { washingtonRegulations } from '../stateRegulations/washington.js';
import { montanaRegulations } from '../stateRegulations/montana.js';
import { wyomingRegulations } from '../stateRegulations/wyoming.js';
import { idahoRegulations } from '../stateRegulations/idaho.js';

// Function to calculate hours based on state regulations
export function calculateHours(state, timecard) {
  let regularHours = 0;
  let overtimeHours = 0;
  let doubleTimeHours = 0;

  // Calculate daily hours and weekly hours from the timecard data
  const dailyHours = timecard.entries.reduce((total, entry) => total + entry.hours, 0);
  const weeklyHours = dailyHours; // Assuming the timecard represents a single week

  // Get the hourly rate from the user or timecard data
  const hourlyRate = timecard.hourlyRate || 0;

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
    regularHours,
    overtimeHours,
    doubleTimeHours
  };
}

// Function to calculate daily hours
export function calculateDailyHours(userId, date) {
  // Calculate daily hours based on timecard data for the specified user and date
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const userTimecardEntries = timecardEntries.filter(entry => entry.userId === userId && entry.startTime.includes(date));

  const dailyHours = userTimecardEntries.reduce((total, entry) => {
    if (entry.endTime) {
      const startTime = new Date(entry.startTime);
      const endTime = new Date(entry.endTime);
      const duration = (endTime - startTime) / 3600000; // Convert milliseconds to hours
      return total + duration;
    }
    return total;
  }, 0);

  return dailyHours;
}

// Function to calculate weekly hours
export function calculateWeeklyHours(userId) {
  // Calculate weekly hours based on timecard data for the specified user
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const userTimecardEntries = timecardEntries.filter(entry => entry.userId === userId);

  const weeklyHours = userTimecardEntries.reduce((total, entry) => {
    if (entry.endTime) {
      const startTime = new Date(entry.startTime);
      const endTime = new Date(entry.endTime);
      const duration = (endTime - startTime) / 3600000; // Convert milliseconds to hours
      return total + duration;
    }
    return total;
  }, 0);

  return weeklyHours;
}
