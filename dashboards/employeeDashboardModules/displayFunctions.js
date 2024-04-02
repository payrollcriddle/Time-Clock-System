// displayFunctions.js

import { calculateDailyHours, calculateWeeklyHours } from '../../hoursCalculation.js';
import { getTimecardForDateRange } from '../../timecard.js';
import { stateTimeZones } from '../../config/stateTimeZones.js';

export function initializeTimeClockDisplay(state) {
  const currentTimeElement = document.getElementById('current-time-display');
  if (currentTimeElement) {
    const updateTime = () => {
      const currentTime = getCurrentTimeForState(state);
      currentTimeElement.textContent = currentTime;
    };

    updateTime();
    setInterval(updateTime, 1000);
  } else {
    console.error("Element with ID 'current-time-display' not found.");
  }
}

export function updateDailyHoursTable(userId, startDate, endDate) {
  const dailyHoursTableBody = document.getElementById('daily-hours-table-body');
  if (dailyHoursTableBody) {
    getTimecardForDateRange(userId, startDate, endDate)
      .then(timecard => {
        const dailyHours = calculateDailyHours(userId, timecard, startDate, endDate);
        dailyHoursTableBody.innerHTML = '';
        dailyHours.forEach(day => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${formatDate(day.date)}</td>
            <td>${day.hoursWorked}</td>
            <td>${day.mealPeriodHours}</td>
            <td>${day.leaveHours || '-'}</td>
            <td>${day.mealPeriodWaived ? 'Yes' : 'No'}</td>
          `;
          dailyHoursTableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error updating daily hours table:', error);
      });
  } else {
    console.error("Element with ID 'daily-hours-table-body' not found.");
  }
}

export function updateWeeklyHoursSummary(userId, startDate, endDate) {
  const weeklyHoursSummaryElement = document.getElementById('weekly-hours-summary');
  if (weeklyHoursSummaryElement) {
    getTimecardForDateRange(userId, startDate, endDate)
      .then(timecard => {
        const dailyHours = calculateDailyHours(userId, timecard, startDate, endDate);
        const weeklyHours = calculateWeeklyHours(dailyHours);
        weeklyHoursSummaryElement.innerHTML = `
          <p>Regular Hours: ${weeklyHours.regularHours}</p>
          <p>Overtime Hours: ${weeklyHours.overtimeHours}</p>
          <p>Double-time Hours: ${weeklyHours.doubleTimeHours}</p>
          <p>Total Working Hours: ${weeklyHours.totalWorkingHours}</p>
          <p>Total Meal Period Hours: ${weeklyHours.totalMealPeriodHours}</p>
          <p>Total Hours: ${weeklyHours.totalHours}</p>
        `;
      })
      .catch(error => {
        console.error('Error updating weekly hours summary:', error);
      });
  } else {
    console.error("Element with ID 'weekly-hours-summary' not found.");
  }
}

// Rest of the code remains the same...

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

// Function to get current time adjusted for state time zone
export function getCurrentTimeForState(state) {
  const currentTime = new Date();
  const offset = stateTimeZones[state] || 0;
  const adjustedTime = new Date(currentTime.getTime() + offset * 60 * 60 * 1000);
  return adjustedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
