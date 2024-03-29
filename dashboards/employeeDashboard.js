// employeeDashboard.js

import { getUser, logout } from '../auth.js';
import { getActivityTypes } from '../management/activityTypeManagement.js';
import { getJobs } from '../management/jobManagement.js';
import { clockIn, clockOut, startMeal, endMeal, getTimecard, submitTimecard, submitLeaveHours, updateTimecard } from '../timecard.js';
import { calculateHours } from '../hoursCalculation.js';
import { getPayPeriodStartDate, getPayPeriodEndDate, getNextPayDate } from './employeeDashboardModules/timesheetFunctions.js';
import { Calendar } from './employeeDashboardModules/calendarFunctions.js';
import { updateCurrentTime, updateDailyHoursDisplay, updateWeeklyHoursDisplay, updateTimeClockDisplay } from './employeeDashboardModules/displayFunctions.js';

// Retrieve the necessary elements
const welcomeMessage = document.getElementById('welcome-message');
const currentDateTime = document.getElementById('current-date-time');
const dayStatusDropdown = document.getElementById('day-status-dropdown');
const timeClock = document.getElementById('time-clock');
const activityDropdown = document.getElementById('activity-dropdown');
const jobDropdown = document.getElementById('job-dropdown');
const leaveHoursSection = document.getElementById('leave-hours-section');
const leaveTypeDropdown = document.getElementById('leave-type-dropdown');
const leaveHoursInput = document.getElementById('leave-hours-input');
const timecardNoteInput = document.getElementById('timecard-note-input');
const mealPeriodWaiverCheckbox = document.getElementById('meal-period-waiver-checkbox');
const dailyHoursTable = document.getElementById('daily-hours-table');
const weeklyHoursSummary = document.getElementById('weekly-hours-summary');
const submitButton = document.getElementById('submit-button');
const logoutButton = document.getElementById('logout-button');
const calendarContainer = document.getElementById('calendar-container');

export function renderEmployeeDashboard() {
  // Display the welcome message
  const employee = getUser();
  welcomeMessage.textContent = `Welcome, ${employee.name}!`;

  // Show the current date and time
  const currentTime = updateCurrentTime(employee.state);
  currentDateTime.textContent = currentTime;

  // Populate the day status dropdown
  const dayStatusOptions = ['Working', 'Off', 'Leave'];
  dayStatusDropdown.innerHTML = dayStatusOptions.map(option => `<option value="${option}">${option}</option>`).join('');

  // Initialize the time clock
  updateTimeClockDisplay(employee.id);
  setInterval(() => updateTimeClockDisplay(employee.id), 1000);

  // Populate the activity and job dropdowns
  const activityTypes = getActivityTypes();
  activityDropdown.innerHTML = activityTypes.map(activity => `<option value="${activity.id}">${activity.name}</option>`).join('');
  const jobs = getJobs();
  jobDropdown.innerHTML = jobs.map(job => `<option value="${job.id}">${job.name}</option>`).join('');

  // Show/hide the leave hours section based on day status
  const handleDayStatusChange = () => {
    const selectedStatus = dayStatusDropdown.value;
    leaveHoursSection.style.display = selectedStatus === 'Leave' ? 'block' : 'none';
  };
  dayStatusDropdown.addEventListener('change', handleDayStatusChange);

  // Populate the leave type dropdown
  const leaveTypes = ['Paid Time Off', 'Sick Hours', 'Flex Hours'];
  leaveTypeDropdown.innerHTML = leaveTypes.map(type => `<option value="${type}">${type}</option>`).join('');

  // Show/hide the meal period waiver based on leave type
  const handleLeaveTypeChange = () => {
    const selectedLeaveType = leaveTypeDropdown.value;
    mealPeriodWaiverCheckbox.style.display = selectedLeaveType === 'Sick Hours' ? 'block' : 'none';
  };
  leaveTypeDropdown.addEventListener('change', handleLeaveTypeChange);

  // Populate the daily hours table
  const timecard = getTimecard(employee.id);
  const payPeriodStart = getPayPeriodStartDate(new Date());
  const payPeriodEnd = getPayPeriodEndDate(payPeriodStart);
  const dailyHours = calculateDailyHours(timecard, payPeriodStart, payPeriodEnd);
  dailyHoursTable.innerHTML = `
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
          <td>${day.date}</td>
          <td>${day.hoursWorked}</td>
          <td>${day.leaveHours}</td>
          <td>${day.mealPeriodWaived ? 'Yes' : 'No'}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  // Calculate and display the weekly hours summary
  const weeklyHours = calculateWeeklyHours(dailyHours);
  weeklyHoursSummary.innerHTML = `
    <p>Regular Hours: ${weeklyHours.regularHours}</p>
    <p>Overtime Hours: ${weeklyHours.overtimeHours}</p>
    <p>Double-time Hours: ${weeklyHours.doubleTimeHours}</p>
    <p>Total Hours: ${weeklyHours.totalHours}</p>
  `;

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedTimecard = {
      dayStatus: dayStatusDropdown.value,
      activityType: activityDropdown.value,
      job: jobDropdown.value,
      leaveType: leaveTypeDropdown.value,
      leaveHours: leaveHoursInput.value,
      timecardNote: timecardNoteInput.value,
      mealPeriodWaived: mealPeriodWaiverCheckbox.checked
    };
    updateTimecard(employee.id, updatedTimecard);
    submitTimecard(employee.id);
    alert('Timecard submitted successfully!');
  };
  submitButton.addEventListener('click', handleSubmit);

  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  logoutButton.addEventListener('click', handleLogout);

  // Render the calendar
  const calendar = new Calendar(calendarContainer, payPeriodStart, payPeriodEnd);
  calendar.render();
}

// Render employee dashboard when the page loads
document.addEventListener('DOMContentLoaded', renderEmployeeDashboard);
