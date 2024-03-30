// displayFunctions.js

import { calculateDailyHours, calculateWeeklyHours } from '../../hoursCalculation.js';
import { getTimecard } from '../../timecard.js';
import { stateTimeZones } from '../../config/stateTimeZones.js';

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
  const timeclockElement = document.getElementById('timeclock');

  if (lastEntry) {
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
}

export function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleString();
}

export function displayNotification(message) {
  const notificationElement = document.getElementById('notification');
  notificationElement.textContent = message;
  notificationElement.classList.add('show');

  setTimeout(() => {
    notificationElement.classList.remove('show');
  }, 3000);
}

export function updateEmployeeList(employees) {
  const employeeListElement = document.getElementById('employee-list');
  employeeListElement.innerHTML = '';

  employees.forEach(employee => {
    const listItem = document.createElement('li');
    listItem.textContent = employee.name;
    employeeListElement.appendChild(listItem);
  });
}

// Function to get current time adjusted for state time zone
function getCurrentTimeForState(state) {
  const currentTime = new Date();
  const offset = stateTimeZones[state] || 0;
  const adjustedTime = new Date(currentTime.getTime() + offset * 60 * 60 * 1000);
  return adjustedTime.toLocaleTimeString();
}
