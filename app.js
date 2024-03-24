// Import necessary modules and functions
import { login, logout, isAuthenticated, getUser } from './auth.js';
import { addEmployee, updateEmployee, deleteEmployee, getEmployees } from './employeeManagement.js';
import { addActivityType, deleteActivityType, getActivityTypes } from './activityTypeManagement.js';
import { addJob, deleteJob, getJobs } from './jobManagement.js';
import { clockIn, clockOut, getTimecard, submitTimecard, calculateDailyHours, calculateWeeklyHours, submitLeaveHours } from './timecard.js';
import { reviewTimecard, approveTimecard, rejectTimecard } from './timecardReview.js';
import { calculateHours } from './hoursCalculation.js';
import mealPeriodPolicies from './mealPeriodPolicies.js';
import { sendTeamsNotification } from './teamsNotification.js';

// Get DOM elements
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const employeeDashboard = document.getElementById('employee-dashboard');
const supervisorDashboard = document.getElementById('supervisor-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');

// Event listener for login form submission
loginForm.addEventListener('submit', event => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const userRole = login(username, password);

  if (userRole) {
    loginSection.style.display = 'none';

    if (userRole === 'employee') {
      employeeDashboard.style.display = 'block';
      renderEmployeeDashboard();
    } else if (userRole === 'supervisor') {
      supervisorDashboard.style.display = 'block';
      renderSupervisorDashboard();
    } else if (userRole === 'admin') {
      adminDashboard.style.display = 'block';
      renderAdminDashboard();
    }
  } else {
    alert('Invalid username or password');
  }
});

// Function to render employee dashboard
function renderEmployeeDashboard() {
  const user = getUser();
  document.getElementById('employee-name').textContent = user.name;
  
  renderActivityTypeSelect();
  renderJobSelect();
  renderWeeklyHoursTable();

  // Event listener for day status change
  document.getElementById('day-status').addEventListener('change', handleDayStatusChange);

  // Event listener for clock in button click
  document.getElementById('clock-in-btn').addEventListener('click', handleClockIn);

  // Event listener for clock out button click
  document.getElementById('clock-out-btn').addEventListener('click', handleClockOut);

  // Event listener for meal start button click
  document.getElementById('meal-start-btn').addEventListener('click', handleMealStart);

  // Event listener for meal end button click
  document.getElementById('meal-end-btn').addEventListener('click', handleMealEnd);

  // Event listener for timecard submission
  document.getElementById('submit-timecard-btn').addEventListener('click', handleTimecardSubmission);

  // Event listener for timecard submission confirmation
  document.getElementById('confirm-submission-btn').addEventListener('click', confirmTimecardSubmission);

  // Event listener for timecard submission cancellation
  document.getElementById('cancel-submission-btn').addEventListener('click', cancelTimecardSubmission);
}

// Function to display current time
function displayCurrentTime() {
  const currentTimeElement = document.getElementById('current-time');
  const currentTime = new Date().toLocaleString();
  currentTimeElement.textContent = currentTime;
}

// Update current time every second
setInterval(displayCurrentTime, 1000);

// Function to render activity type select options
function renderActivityTypeSelect() {
  const activityTypeSelect = document.getElementById('activity-type');
  const activityTypes = getActivityTypes();
  
  activityTypes.forEach(activityType => {
    const option = document.createElement('option');
    option.value = activityType.id;
    option.textContent = activityType.name;
    activityTypeSelect.appendChild(option);
  });
}

// Function to render job select options
function renderJobSelect() {
  const jobSelect = document.getElementById('job');
  const jobs = getJobs();
  
  jobs.forEach(job => {
    const option = document.createElement('option');
    option.value = job.id;
    option.textContent = job.name;
    jobSelect.appendChild(option);
  });
}

// Function to render weekly hours table
function renderWeeklyHoursTable() {
  const user = getUser();
  const timecard = getTimecard(user.id);
  const weeklyHoursTableBody = document.getElementById('weekly-hours-table').getElementsByTagName('tbody')[0];
  weeklyHoursTableBody.innerHTML = '';

  // Render table rows based on activities and hours
  // ...

  updateTotalWeeklyHours();
}

// Function to handle day status change
function handleDayStatusChange() {
  const dayStatus = document.getElementById('day-status').value;
  const leaveHoursSection = document.getElementById('leave-hours');
  const jobSelect = document.getElementById('job');

  if (dayStatus === 'leave') {
    leaveHoursSection.style.display = 'block';
    jobSelect.style.display = 'none';
  } else {
    leaveHoursSection.style.display = 'none';
    jobSelect.style.display = 'block';
  }
}

// Function to handle clock in
function handleClockIn() {
  const user = getUser();
  const dayStatus = document.getElementById('day-status').value;
  const activityTypeId = document.getElementById('activity-type').value;
  const jobId = document.getElementById('job').value;
  const timecardNote = document.getElementById('timecard-note').value;

  if (dayStatus && activityTypeId) {
    clockIn(user.id, dayStatus, activityTypeId, jobId, timecardNote);
    document.getElementById('clock-in-btn').disabled = true;
    document.getElementById('clock-out-btn').disabled = false;
    document.getElementById('meal-start-btn').disabled = false;
    document.getElementById('meal-end-btn').disabled = true;
    renderWeeklyHoursTable();
  } else {
    alert('Please select a day status and activity type.');
  }
}

// Function to handle clock out
function handleClockOut() {
  const user = getUser();
  clockOut(user.id);
  document.getElementById('clock-in-btn').disabled = false;
  document.getElementById('clock-out-btn').disabled = true;
  document.getElementById('meal-start-btn').disabled = true;
  document.getElementById('meal-end-btn').disabled = true;
  renderWeeklyHoursTable();
}

// Function to handle meal start
function handleMealStart() {
  const user = getUser();
  const timestamp = new Date().toLocaleString();
  // Record meal start entry in the database or data store
  // ...
  document.getElementById('meal-start-btn').disabled = true;
  document.getElementById('meal-end-btn').disabled = false;
  renderWeeklyHoursTable();
}

// Function to handle meal end
function handleMealEnd() {
  const user = getUser();
  const timestamp = new Date().toLocaleString();
  // Record meal end entry in the database or data store
  // ...
  document.getElementById('meal-start-btn').disabled = false;
  document.getElementById('meal-end-btn').disabled = true;
  renderWeeklyHoursTable();
}

// Function to handle timecard
