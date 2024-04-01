// displayFunctions.js

import { calculateDailyHours, calculateWeeklyHours } from '../../hoursCalculation.js';
import { getTimecard } from '../../timecard.js';
import { stateTimeZones } from '../../config/stateTimeZones.js';

// Ensures functions are called after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Place any code here that can execute after DOM is ready
    // For example, initialize UI components or display the current time
    // updateCurrentTime('California'); // Uncomment and replace 'California' with dynamic user state if available on load
});

// This function might be called after dynamic content loading, e.g., upon user login
export function initializeDynamicContent(userState) {
    updateCurrentTime(userState);
    // Add calls to other functions that depend on dynamically loaded content here
}

export function updateCurrentTime(userState) {
    const currentTimeElement = document.getElementById('current-time-display');
    if (currentTimeElement) {
        const currentTime = getCurrentTimeForState(userState);
        currentTimeElement.textContent = currentTime;
    } else {
        console.error("Element with ID 'current-time-display' not found.");
    }
}

export function updateDailyHoursDisplay(userId, date) {
  const dailyHoursElement = document.getElementById('daily-hours-display');
  if (dailyHoursElement) {
    const dailyHours = calculateDailyHours(userId, date.toISOString().split('T')[0]);
    dailyHoursElement.textContent = `${dailyHours} hours`;
  } else {
    console.error("Element with ID 'daily-hours-display' not found.");
  }
}

export function updateWeeklyHoursDisplay(userId) {
  const weeklyHoursElement = document.getElementById('weekly-hours-display');
  if (weeklyHoursElement) {
    const weeklyHours = calculateWeeklyHours(userId);
    weeklyHoursElement.textContent = `${weeklyHours} hours`;
  } else {
    console.error("Element with ID 'weekly-hours-display' not found.");
  }
}

export function updateTimeClockDisplay(userId) {
  const timecard = getTimecard(userId);
  const timeclockElement = document.getElementById('time-clock');
  if (timeclockElement) {
    if (timecard && timecard.entries) {
      const lastEntry = timecard.entries[timecard.entries.length - 1];
      const clockInTime = lastEntry.startTime ? formatDateTime(lastEntry.startTime) : '-';
      const clockOutTime = lastEntry.endTime ? formatDateTime(lastEntry.endTime) : '-';
      const mealStartTime = lastEntry.activityTypeId === 'meal' && lastEntry.startTime ? formatDateTime(lastEntry.startTime) : '-';
      const mealEndTime = lastEntry.activityTypeId === 'meal' && lastEntry.endTime ? formatDateTime(lastEntry.endTime) : '-';
      timeclockElement.innerHTML = `
        <p>Clock In: ${clockInTime}</p>
        <p>Clock Out: ${clockOutTime}</p>
        <p>Meal Start: ${mealStartTime}</p>
        <p>Meal End: ${mealEndTime}</p>
      `;
    } else {
      timeclockElement.innerHTML = `
        <p>Clock In: -</p>
        <p>Clock Out: -</p>
        <p>Meal Start: -</p>
        <p>Meal End: -</p>
      `;
    }
  } else {
    console.error("Element with ID 'time-clock' not found.");
  }
}

export function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleString();
}

export function displayNotification(message) {
  const notificationElement = document.getElementById('notification');
  if (notificationElement) {
    notificationElement.textContent = message;
    notificationElement.classList.add('show');
    setTimeout(() => {
      notificationElement.classList.remove('show');
    }, 3000);
  } else {
    console.error("Element with ID 'notification' not found.");
  }
}

export function updateEmployeeList(employees) {
  const employeeListElement = document.getElementById('employee-list');
  if (employeeListElement) {
    employeeListElement.innerHTML = '';
    employees.forEach(employee => {
      const listItem = document.createElement('li');
      listItem.textContent = employee.name;
      employeeListElement.appendChild(listItem);
    });
  } else {
    console.error("Element with ID 'employee-list' not found.");
  }
}

// Function to get current time adjusted for state time zone
function getCurrentTimeForState(state) {
  const currentTime = new Date();
  const offset = stateTimeZones[state] || 0;
  const adjustedTime = new Date(currentTime.getTime() + offset * 60 * 60 * 1000);
  return adjustedTime.toLocaleTimeString();
}
