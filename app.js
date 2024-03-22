// Import necessary modules and functions
import { login, logout, isAuthenticated, getUser } from './auth.js';
import { addEmployee, updateEmployee, deleteEmployee, getEmployees } from './employeeManagement.js';
import { addActivityType, deleteActivityType, getActivityTypes } from './activityTypeManagement.js';
import { addJob, deleteJob, getJobs } from './jobManagement.js';
import { clockIn, clockOut, getTimecard, submitTimecard, calculateDailyHours, calculateWeeklyHours } from './timecard.js';
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
  renderJobList();
  renderActivityTypeList();
  renderTimecard();
  renderDailyHoursTable();
  renderWeeklyHoursTable();
}

// Function to render job list
function renderJobList() {
  const jobSelect = document.getElementById('job-select');
  const jobs = getJobs();
  jobs.forEach(job => {
    const option = document.createElement('option');
    option.value = job.id;
    option.textContent = job.name;
    jobSelect.appendChild(option);
  });
}

// Function to render activity type list
function renderActivityTypeList() {
  const activityTypeSelect = document.getElementById('activity-type-select');
  const activityTypes = getActivityTypes();
  activityTypes.forEach(activityType => {
    const option = document.createElement('option');
    option.value = activityType.id;
    option.textContent = activityType.name;
    activityTypeSelect.appendChild(option);
  });
}

// Function to render timecard
function renderTimecard() {
  const user = getUser();
  const timecard = getTimecard(user.id);
  const timecardTableBody = document.getElementById('timecard-table').getElementsByTagName('tbody')[0];
  timecardTableBody.innerHTML = '';

  timecard.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.job}</td>
      <td>${entry.activityType}</td>
      <td>${entry.clockInTime}</td>
      <td>${entry.clockOutTime}</td>
      <td>${entry.duration}</td>
    `;
    timecardTableBody.appendChild(row);
  });
}

// Function to render daily hours table
function renderDailyHoursTable() {
  const user = getUser();
  const dailyHours = calculateDailyHours(user.id);
  const dailyHoursTableBody = document.getElementById('daily-hours-table').getElementsByTagName('tbody')[0];
  dailyHoursTableBody.innerHTML = '';

  dailyHours.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.regularHours}</td>
      <td>${entry.overtimeHours}</td>
      <td>${entry.doubleTimeHours}</td>
    `;
    dailyHoursTableBody.appendChild(row);
  });
}

// Function to render weekly hours table
function renderWeeklyHoursTable() {
  const user = getUser();
  const weeklyHours = calculateWeeklyHours(user.id);
  const weeklyHoursTableBody = document.getElementById('weekly-hours-table').getElementsByTagName('tbody')[0];
  weeklyHoursTableBody.innerHTML = '';

  weeklyHours.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.week}</td>
      <td>${entry.regularHours}</td>
      <td>${entry.overtimeHours}</td>
      <td>${entry.doubleTimeHours}</td>
    `;
    weeklyHoursTableBody.appendChild(row);
  });
}

// Function to handle clock in
function handleClockIn() {
  const user = getUser();
  const jobId = document.getElementById('job-select').value;
  const activityTypeId = document.getElementById('activity-type-select').value;

  if (jobId && activityTypeId) {
    const timestamp = new Date().toLocaleString();
    clockIn(user.id, jobId, activityTypeId, timestamp);
    renderTimecard();
  } else {
    alert('Please select a job and activity type.');
  }
}

// Function to handle clock out
function handleClockOut() {
  const user = getUser();
  const timestamp = new Date().toLocaleString();
  clockOut(user.id, timestamp);
  renderTimecard();
  renderDailyHoursTable();
  renderWeeklyHoursTable();
}

// Function to handle meal period waiver
function handleMealPeriodWaiver() {
  const user = getUser();
  const state = user.state;
  const mealPeriodPolicy = mealPeriodPolicies[state];

  if (mealPeriodPolicy && mealPeriodPolicy.waivable) {
    const waived = document.getElementById('meal-period-waiver-checkbox').checked;
    // Handle meal period waiver logic based on state policy
    // ...
  }
}

// Function to handle timecard submission
function handleTimecardSubmission() {
  const user = getUser();
  const confirmed = confirm('Are you sure you want to submit your timecard?');

  if (confirmed) {
    submitTimecard(user.id);
    alert('Timecard submitted successfully.');
    // Send notification to supervisor
    const supervisor = getSupervisor(user.id);
    sendTeamsNotification(supervisor, `${user.name} has submitted their timecard.`);
  }
}

// Function to render supervisor dashboard
function renderSupervisorDashboard() {
  const user = getUser();
  const timecardReviewTableBody = document.getElementById('timecard-review-table').getElementsByTagName('tbody')[0];
  timecardReviewTableBody.innerHTML = '';

  const timecards = getTimecards(); // Get all timecards for review
  timecards.forEach(timecard => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${timecard.employeeName}</td>
      <td>${timecard.startDate}</td>
      <td>${timecard.endDate}</td>
      <td>${timecard.status}</td>
      <td>
        <button class="review-btn" data-timecard-id="${timecard.id}">Review</button>
        <button class="approve-btn" data-timecard-id="${timecard.id}">Approve</button>
        <button class="reject-btn" data-timecard-id="${timecard.id}">Reject</button>
      </td>
    `;
    timecardReviewTableBody.appendChild(row);
  });
}

// Function to render admin dashboard
function renderAdminDashboard() {
  const user = getUser();
  renderEmployeeTable();
  renderActivityTypeList();
  renderJobList();
}

// Function to render employee table
function renderEmployeeTable() {
  const employeeTableBody = document.getElementById('employee-table').getElementsByTagName('tbody')[0];
  const employees = getEmployees();
  employeeTableBody.innerHTML = '';

  employees.forEach(employee => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.username}</td>
