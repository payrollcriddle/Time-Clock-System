// employeeDashboard.js

import { getUser, logout } from '../auth.js';
import { getActivityTypes } from '../management/activityTypeManagement.js';
import { getJobs } from '../management/jobManagement.js';
import { getTimecardForDateRange, submitTimecard, updateTimecard, clockIn, clockOut, startMeal, endMeal } from '../timecard.js';
import { calculateDailyHours, calculateWeeklyHours } from '../hoursCalculation.js';
import { getPayPeriodStartDate, getPayPeriodEndDate } from './employeeDashboardModules/timesheetFunctions.js';
import { Calendar } from './employeeDashboardModules/calendarFunctions.js';
import { initializeTimeClockDisplay, updateDailyHoursTable, updateWeeklyHoursSummary, displayNotification } from './employeeDashboardModules/displayFunctions.js';
import { handleDayStatusChange, handleLeaveTypeChange } from './employeeDashboardModules/eventHandlers.js';
import { validateForm } from './employeeDashboardModules/formValidation.js';
import { saveData, getData } from '../dataStorage.js';

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

    // Initialize the time clock display
    initializeTimeClockDisplay(employee.state);

    // Populate the day status dropdown
    const dayStatusOptions = ['Select', 'Working', 'Off', 'Leave'];
    employeeDashboardElements.dayStatusDropdown.innerHTML = dayStatusOptions.map(option => `<option value="${option}">${option}</option>`).join('');

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
    const payPeriodStart = getPayPeriodStartDate(new Date());
    const payPeriodEnd = getPayPeriodEndDate(payPeriodStart);
    updateDailyHoursTable(employee.id, payPeriodStart, payPeriodEnd);

    // Calculate and display the weekly hours summary
    updateWeeklyHoursSummary(employee.id, payPeriodStart, payPeriodEnd);

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
        displayNotification('Timecard submitted successfully!');
        saveData('timecard', updatedTimecard); // Save timecard data to local storage
      }
    };
    employeeDashboardElements.submitButton.addEventListener('click', handleSubmit);

    // Handle logout
    const handleLogout = () => {
      logout();
      saveData('timecard', null); // Clear timecard data from local storage on logout
      window.location.href = '/';
    };
    employeeDashboardElements.logoutButton.addEventListener('click', handleLogout);

    // Handle clock in button click
    const handleClockIn = () => {
      const dayStatus = employeeDashboardElements.dayStatusDropdown.value;
      const activityTypeId = employeeDashboardElements.activityDropdown.value;
      const jobId = employeeDashboardElements.jobDropdown.value;
      const timecardNote = employeeDashboardElements.timecardNoteInput.value;
      clockIn(employee.id, dayStatus, activityTypeId, jobId, timecardNote, new Date());
      updateTimeClockDisplay(employee.id);
      displayNotification('Clocked in successfully!');
    };
    employeeDashboardElements.clockInButton.addEventListener('click', handleClockIn);

    // Handle clock out button click
    const handleClockOut = () => {
      clockOut(employee.id, new Date());
      updateTimeClockDisplay(employee.id);
      displayNotification('Clocked out successfully!');
    };
    employeeDashboardElements.clockOutButton.addEventListener('click', handleClockOut);

    // Handle meal start button click
    const handleMealStart = () => {
      startMeal(employee.id, new Date());
      updateTimeClockDisplay(employee.id);
      displayNotification('Meal started successfully!');
    };
    employeeDashboardElements.mealStartButton.addEventListener('click', handleMealStart);

    // Handle meal end button click
    const handleMealEnd = () => {
      endMeal(employee.id, new Date());
      updateTimeClockDisplay(employee.id);
      displayNotification('Meal ended successfully!');
    };
    employeeDashboardElements.mealEndButton.addEventListener('click', handleMealEnd);

    // Render the calendar
    new Calendar(employeeDashboardElements.calendarContainer, payPeriodStart, payPeriodEnd);
    
    // Load timecard data from local storage if available
    const savedTimecard = getData('timecard');
    if (savedTimecard) {
      employeeDashboardElements.dayStatusDropdown.value = savedTimecard.dayStatus;
      employeeDashboardElements.activityDropdown.value = savedTimecard.activityType;
      employeeDashboardElements.jobDropdown.value = savedTimecard.job;
      employeeDashboardElements.leaveTypeDropdown.value = savedTimecard.leaveType;
      employeeDashboardElements.leaveHoursInput.value = savedTimecard.leaveHours;
      employeeDashboardElements.timecardNoteInput.value = savedTimecard.timecardNote;
      employeeDashboardElements.mealPeriodWaiverCheckbox.checked = savedTimecard.mealPeriodWaived;
    }
  } else {
    console.error("User object is null.");
    // Display the login section if it exists
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
      loginSection.style.display = 'block';
    }
  }
}

// Render employee dashboard when the page loads
document.addEventListener('DOMContentLoaded', renderEmployeeDashboard);
