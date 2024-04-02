// hoursCalculation.js

import { californiaRegulations, californiaOvertimeRegulations } from './stateRegulations/california.js';
import { coloradoRegulations, coloradoOvertimeRegulations } from './stateRegulations/colorado.js';
import { nevadaRegulations, nevadaOvertimeRegulations } from './stateRegulations/nevada.js';
import { oregonRegulations, oregonOvertimeRegulations } from './stateRegulations/oregon.js';
import { washingtonRegulations, washingtonOvertimeRegulations } from './stateRegulations/washington.js';
import { montanaRegulations, montanaOvertimeRegulations } from './stateRegulations/montana.js';
import { wyomingRegulations, wyomingOvertimeRegulations } from './stateRegulations/wyoming.js';
import { idahoRegulations, idahoOvertimeRegulations } from './stateRegulations/idaho.js';

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
      regularHours = californiaRegulations(dailyHours, weeklyHours);
      ({ overtimeHours, doubleTimeHours } = californiaOvertimeRegulations(dailyHours, weeklyHours));
      break;
    case 'Colorado':
      // Apply Colorado regulations
      regularHours = coloradoRegulations(dailyHours, weeklyHours);
      ({ overtimeHours, doubleTimeHours } = coloradoOvertimeRegulations(dailyHours, weeklyHours));
      break;
    case 'Nevada':
      // Apply Nevada regulations
      regularHours = nevadaRegulations(dailyHours, weeklyHours);
      ({ overtimeHours, doubleTimeHours } = nevadaOvertimeRegulations(dailyHours, weeklyHours));
      break;
    case 'Oregon':
      // Apply Oregon regulations
      regularHours = oregonRegulations(dailyHours, weeklyHours);
      ({ overtimeHours, doubleTimeHours } = oregonOvertimeRegulations(dailyHours, weeklyHours));
      break;
    case 'Washington':
      // Apply Washington regulations
      regularHours = washingtonRegulations(dailyHours, weeklyHours);
      ({ overtimeHours, doubleTimeHours } = washingtonOvertimeRegulations(dailyHours, weeklyHours));
      break;
    case 'Montana':
      // Apply Montana regulations
      regularHours = montanaRegulations(dailyHours, weeklyHours);
      ({ overtimeHours, doubleTimeHours } = montanaOvertimeRegulations(dailyHours, weeklyHours));
      break;
    case 'Wyoming':
      // Apply Wyoming regulations
      regularHours = wyomingRegulations(dailyHours, weeklyHours);
      ({ overtimeHours, doubleTimeHours } = wyomingOvertimeRegulations(dailyHours, weeklyHours));
      break;
    case 'Idaho':
      // Apply Idaho regulations
      regularHours = idahoRegulations(dailyHours, weeklyHours);
      ({ overtimeHours, doubleTimeHours } = idahoOvertimeRegulations(dailyHours, weeklyHours));
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
export function calculateDailyHours(userId, timecard, startDate, endDate) {
  const dailyHours = [];

  // Iterate over each date between startDate and endDate
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Filter timecard entries for the current date and user ID
    const filteredEntries = timecard.filter(entry => entry.userId === userId && entry.startTime.includes(formattedDate));

    // Calculate total working hours and meal period hours for the current date
    let totalWorkingHours = 0;
    let totalMealPeriodHours = 0;
    filteredEntries.forEach(entry => {
      if (entry.endTime) {
        const startTime = new Date(entry.startTime);
        const endTime = new Date(entry.endTime);
        const duration = (endTime - startTime) / 3600000; // Convert milliseconds to hours

        if (entry.activityTypeId === 'meal') {
          totalMealPeriodHours += duration;
        } else {
          totalWorkingHours += duration;
        }
      }
    });

    // Add daily hours data to the array
    dailyHours.push({
      date: formattedDate,
      hoursWorked: totalWorkingHours,
      leaveHours: 0, // Add logic to calculate leave hours if applicable
      mealPeriodHours: totalMealPeriodHours,
      mealPeriodWaived: false // Add logic to determine if meal period was waived
    });

    // Move to the next date
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dailyHours;
}

// Function to calculate weekly hours
export function calculateWeeklyHours(dailyHours) {
  const weeklyHours = {
    regularHours: 0,
    overtimeHours: 0,
    doubleTimeHours: 0,
    totalWorkingHours: 0,
    totalMealPeriodHours: 0
  };

  // Sum up the hours from daily hours data
  dailyHours.forEach(day => {
    weeklyHours.regularHours += day.hoursWorked;
    weeklyHours.totalWorkingHours += day.hoursWorked;
    weeklyHours.totalMealPeriodHours += day.mealPeriodHours;
  });

  // Apply state-specific regulations to calculate overtime and double-time hours
  // Add logic based on the state regulations

  return weeklyHours;
}
