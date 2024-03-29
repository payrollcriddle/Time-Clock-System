import { calculateDailyHours, calculateWeeklyHours } from '../../hoursCalculation.js';
import { getTimecard } from '../../timecard.js';

// Define time zone offsets for the states
const stateTimeZones = {
    'California': -7, // Pacific Time (PDT)
    'Idaho': -6,      // Mountain Time (MDT)
    'Washington': -7, // Pacific Time (PDT)
    'Oregon': -7,     // Pacific Time (PDT)
    'Nevada': -7,     // Pacific Time (PDT)
    'Montana': -6,    // Mountain Time (MDT)
    'Wyoming': -6,    // Mountain Time (MDT)
    'Colorado': -6    // Mountain Time (MDT)
};

// Function to get current time adjusted for state time zone
function getCurrentTimeForState(state) {
    const currentTime = new Date();
    const offset = stateTimeZones[state] || -7; // Default to Pacific Time (California)
    const adjustedTime = new Date(currentTime.getTime() + offset * 60 * 60 * 1000); // Adjust for time zone offset
    return adjustedTime.toLocaleTimeString();
}

export function updateCurrentTime(userState) {
    const currentTimeElement = document.getElementById('current-time-display');
    const currentTime = getCurrentTimeForState(userState);
    currentTimeElement.textContent = currentTime;
}

export function updateDailyHoursDisplay(userId, date) {
    const dailyHoursElement = document.getElementById('daily-hours-display');
    const dailyHours = calculateDailyHours(userId, date.toISOString().split('T')[0]);
    dailyHoursElement.textContent = `${dailyHours} hours`;
}

export function updateWeeklyHoursDisplay(userId) {
    const weeklyHoursElement = document.getElementById('weekly-hours-display');
    const weeklyHours = calculateWeeklyHours(userId);
    weeklyHoursElement.textContent = `${weeklyHours} hours`;
}

export function updateTimeClockDisplay(userId) {
    const timecard = getTimecard(userId);
    const lastEntry = timecard.entries[timecard.entries.length - 1];

    const clockInTimeElement = document.getElementById('clock-in-time');
    const clockOutTimeElement = document.getElementById('clock-out-time');
    const mealStartTimeElement = document.getElementById('meal-start-time');
    const mealEndTimeElement = document.getElementById('meal-end-time');

    if (lastEntry) {
        clockInTimeElement.textContent = lastEntry.startTime ? `Clocked In: ${new Date(lastEntry.startTime).toLocaleString()}` : '';
        clockOutTimeElement.textContent = lastEntry.endTime ? `Clocked Out: ${new Date(lastEntry.endTime).toLocaleString()}` : '';
        mealStartTimeElement.textContent = lastEntry.activityTypeId === 'meal' && lastEntry.startTime ? `Meal Started: ${new Date(lastEntry.startTime).toLocaleString()}` : '';
        mealEndTimeElement.textContent = lastEntry.activityTypeId === 'meal' && lastEntry.endTime ? `Meal Ended: ${new Date(lastEntry.endTime).toLocaleString()}` : '';
    } else {
        clockInTimeElement.textContent = '';
        clockOutTimeElement.textContent = '';
        mealStartTimeElement.textContent = '';
        mealEndTimeElement.textContent = '';
    }
}
