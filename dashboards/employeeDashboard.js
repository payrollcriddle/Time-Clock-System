// employeeDashboard.js

import { getUser, logout } from '../auth.js';
import { getActivityTypes } from '../management/activityTypeManagement.js';
import { getJobs } from '../management/jobManagement.js';
import { getTimecard, submitTimecard, updateTimecard } from '../timecard.js';
import { calculateDailyHours, calculateWeeklyHours } from '../hoursCalculation.js';
import { getPayPeriodStartDate, getPayPeriodEndDate } from './employeeDashboardModules/timesheetFunctions.js';
import { Calendar } from './employeeDashboardModules/calendarFunctions.js';
import { updateCurrentTime, updateTimeClockDisplay } from './employeeDashboardModules/displayFunctions.js';
import { handleDayStatusChange, handleLeaveTypeChange } from './employeeDashboardModules/eventHandlers.js';
import { validateForm } from './employeeDashboardModules/formValidation.js';
import { getTimecardForDateRange } from '../timecard.js';
import { updateDailyHoursTable, updateWeeklyHoursSummary } from './employeeDashboardModules/displayFunctions.js';

const employeeDashboardElements = {
  welcomeMessage: document.getElementById('welcome-message'),
  currentDateTime: document.getElementById('current-date-time'),
  dayStatusDropdown: document.getElementById('day-status-dropdown'),
  timeClock: document.getElementById('time-clock'),
  activityDropdown: document.getElementById('activity-dropdown'),
  jobDropdown: document.getElementById('job-dropdown'),
  leaveHoursSection: document.getElementById('leave-hours-section'),
  leaveTypeDropdown: document.getElementById('leave-type-dropdown'),
  leaveHoursInput: document.getElementById('leave-hours-input'),
  timecardNoteInput: document.getElementById('timecard-note-input'),
  mealPeriodWaiverCheckbox: document.getElementById('meal-period-waiver-checkbox'),
  dailyHoursTable: document.getElementById('daily-hours-table'),
  weeklyHoursSummary: document.getElementById('weekly-hours-summary'),
  submitButton: document.getElementById('submit-button'),
  logoutButton: document.getElementById('logout-button'),
  calendarContainer: document.getElementById('calendar-container'),
  clockInButton: document.getElementById('clock-in-button'),
  clockOutButton: document.getElementById('clock-out-button'),
  mealStartButton: document.getElementById('meal-start-button'),
  mealEndButton: document.getElementById('meal-end-button')
};

export function renderEmployeeDashboard() {
  const employee = getUser();
  if (employee) {
    // Check if all required DOM elements are found
    if (!employeeDashboardElements.welcomeMessage || !employeeDashboardElements.currentDateTime ||
      !employeeDashboardElements.dayStatusDropdown || !employeeDashboardElements.timeClock ||
      !employeeDashboardElements.activityDropdown || !employeeDashboardElements.jobDropdown ||
      !employeeDashboardElements.leaveHoursSection || !employeeDashboardElements.leaveTypeDropdown ||
      !employeeDashboardElements.leaveHoursInput || !employeeDashboardElements.timecardNoteInput ||
      !employeeDashboardElements.mealPeriodWaiverCheckbox || !employeeDashboardElements.dailyHoursTable ||
      !employeeDashboardElements.weeklyHoursSummary || !employeeDashboardElements.submitButton ||
      !employeeDashboardElements.logoutButton || !employeeDashboardElements.calendarContainer ||
      !employeeDashboardElements.clockInButton || !employeeDashboardElements.clockOutButton ||
      !employeeDashboardElements.mealStartButton || !employeeDashboardElements.mealEndButton) {
      console.error("Required DOM elements not found.");
      return;
    }

    // Render welcome message
    employeeDashboardElements.welcomeMessage.textContent = `Welcome, ${employee.name}!`;

    // Show the current date and time
    const currentTime = updateCurrentTime(employee.state);
    employeeDashboardElements.currentDateTime.textContent = currentTime;

    // Populate the day status dropdown
    const dayStatusOptions = ['Select', 'Working', 'Off', 'Leave'];
    employeeDashboardElements.dayStatusDropdown.innerHTML = dayStatusOptions.map(option => `<option value="${option}">${option}</option>`).join('');

    // Initialize the time clock
    updateTimeClockDisplay(employee.id);
    setInterval(() => updateTimeClockDisplay(employee.id), 1000);

    // Populate the activity and job dropdowns
    const activityTypes = getActivityTypes();
    const activityOptions = ['Select', ...activityTypes.map(activity => activity.name)];
    employeeDashboardElements.activityDropdown.innerHTML = activityOptions.map((option, index) => `<option value="${index === 0 ? '' : activityTypes[index - 1].id}">${option}</option>`).join('');

    const jobs = getJobs();
    const jobOptions = ['Select', ...jobs.map(job => job.name)];
    employeeDashboardElements.jobDropdown.innerHTML = jobOptions.map((option, index) => `<option value="${index === 0 ? '' : jobs[index - 1].id}">${option}</option>`).join('');

    // Show/hide the leave hours section based on day status
    employeeDashboardElements.dayStatusDropdown.addEventListener('change', handleDayStatusChange);

    // Populate the leave type dropdown
    const leaveTypes = ['Select', 'Paid Time Off', 'Sick Hours', 'Flex Hours'];
    employeeDashboardElements.leaveTypeDropdown.innerHTML = leaveTypes.map(type => `<option value="${type}">${type}</option>`).join('');

    // Show/hide the meal period waiver based on leave type
    employeeDashboardElements.leaveTypeDropdown.addEventListener('change', handleLeaveTypeChange);

    // Populate the daily hours table
    const timecard = getTimecard(employee.id);
    const payPeriodStart = getPayPeriodStartDate(new Date());
    const payPeriodEnd = getPayPeriodEndDate(payPeriodStart);
    const dailyHours = calculateDailyHours(timecard, payPeriodStart, payPeriodEnd);
    if (Array.isArray(dailyHours)) {
      employeeDashboardElements.dailyHoursTable.innerHTML = renderDailyHoursTable(dailyHours);
    } else {
      console.warn("dailyHours is not an array:", dailyHours);
      employeeDashboardElements.dailyHoursTable.innerHTML = "<tr><td colspan='4'>No daily hours data available</td></tr>";
    }

    // Calculate and display the weekly hours summary
    const weeklyHours = calculateWeeklyHours(dailyHours);
    employeeDashboardElements.weeklyHoursSummary.innerHTML = renderWeeklyHoursSummary(weeklyHours);

    // Handle form submission
    const handleSubmit = (event) => {
      event.preventDefault();
      if (validateForm()) {
        const updatedTimecard = {
          dayStatus: employeeDashboardElements.dayStatusDropdown.value,
          activityType: employeeDashboardElements.activityDropdown.value,
          job: employeeDashboardElements.jobDropdown.value,
          leaveType: employeeDashboardElements.leaveTypeDropdown.value,
          leaveHours: employeeDashboardElements.leaveHoursInput.value,
          timecardNote: employeeDashboardElements.timecardNoteInput.value,
          mealPeriodWaived: employeeDashboardElements.mealPeriodWaiverCheckbox.checked
        };
        updateTimecard(employee.id, updatedTimecard);
        submitTimecard(employee.id);
        alert('Timecard submitted successfully!');
      }
    };
    employeeDashboardElements.submitButton.addEventListener('click', handleSubmit);

    // Handle logout
    const handleLogout = () => {
      logout();
      window.location.href = '/';
    };
    employeeDashboardElements.logoutButton.addEventListener('click', handleLogout);

    // Handle clock in button click
    const handleClockIn = () => {
      // Implement the clock in functionality
      console.log("Clocked in");
    };
    employeeDashboardElements.clockInButton.addEventListener('click', handleClockIn);

    // Handle clock out button click
    const handleClockOut = () => {
      // Implement the clock out functionality
      console.log("Clocked out");
    };
    employeeDashboardElements.clockOutButton.addEventListener('click', handleClockOut);

    // Handle meal start button click
    const handleMealStart = () => {
      // Implement the meal start functionality
      console.log("Meal started");
    };
    employeeDashboardElements.mealStartButton.addEventListener('click', handleMealStart);

    // Handle meal end button click
    const handleMealEnd = () => {
      // Implement the meal end functionality
      console.log("Meal ended");
    };
    employeeDashboardElements.mealEndButton.addEventListener('click', handleMealEnd);

    // Render the calendar
    new Calendar(employeeDashboardElements.calendarContainer, payPeriodStart, payPeriodEnd);
  } else {
    console.error("User object is null.");
    // Display the login section if it exists
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
      loginSection.style.display = 'block';
    }
  }
}

function renderDailyHoursTable(dailyHours) {
  return `
    <thead>
      <tr>
        <th>Date</th>
        <th>Hours Worked</th>
        <th>Leave Hours</th>
        <th>Meal Period Waived</th>
      </tr>
    </thead>
    <tbody>
      ${dailyHours.map(day => `
        <tr>
          <td>${new Date(day.date).toLocaleDateString()}</td>
          <td>${day.hoursWorked}</td>
          <td>${day.leaveHours}</td>
          <td>${day.mealPeriodWaived ? 'Yes' : 'No'}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function renderWeeklyHoursSummary(weeklyHours) {
  return `
    <p>Regular Hours: ${weeklyHours.regularHours}</p>
    <p>Overtime Hours: ${weeklyHours.overtimeHours}</p>
    <p>Double-time Hours: ${weeklyHours.doubleTimeHours}</p>
    <p>Total Hours: ${weeklyHours.totalHours}</p>
  `;
}

// Render employee dashboard when the page loads
document.addEventListener('DOMContentLoaded', renderEmployeeDashboard);
