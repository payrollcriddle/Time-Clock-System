// Import necessary functions from other files
import { getUser, logout } from './auth.js';
import { getActivityTypes } from './activityTypeManagement.js';
import { getJobs } from './jobManagement.js';
import { clockIn, clockOut, getTimecard, submitTimecard, submitLeaveHours, updateTimecard } from './timecard.js';
import { calculateHours } from './hoursCalculation.js';
import { sendTeamsNotification } from './teamsNotification.js';

// Function to get the pay period start date
function getPayPeriodStartDate(date) {
  const dayOfWeek = date.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to start on Monday
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - daysToSubtract);
  return startDate;
}

// Function to get the pay period end date
function getPayPeriodEndDate(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13); // 14 days including start date
  return endDate;
}

// Function to get the next pay date
function getNextPayDate(endDate) {
  const payDate = new Date(endDate);
  payDate.setDate(endDate.getDate() + 5); // 5 days after the end of the pay period
  return payDate;
}

// Calendar class
class Calendar {
  constructor(calendarElement, payPeriodStartDate, payPeriodEndDate) {
    this.calendarElement = calendarElement;
    this.payPeriodStartDate = payPeriodStartDate;
    this.payPeriodEndDate = payPeriodEndDate;
    this.currentDate = new Date();
    this.renderCalendar();
  }

  renderCalendar() {
    // Clear previous calendar content
    this.calendarElement.innerHTML = '';

    // Create calendar header
    const calendarHeader = document.createElement('div');
    calendarHeader.classList.add('calendar-header');
    calendarHeader.textContent = `${this.currentDate.toLocaleString('default', { month: 'long' })} ${this.currentDate.getFullYear()}`;
    this.calendarElement.appendChild(calendarHeader);

    // Create calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.classList.add('calendar-grid');

    // Generate calendar days
    const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const numDays = endDate.getDate();

    for (let i = 1; i <= numDays; i++) {
      const day = document.createElement('div');
      day.classList.add('calendar-day');
      day.textContent = i;

      // Highlight pay period days
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i);
      if (date >= this.payPeriodStartDate && date <= this.payPeriodEndDate) {
        day.classList.add('pay-period-day');
      }

      // Highlight today's date
      if (i === this.currentDate.getDate()) {
        day.classList.add('today');
      }

      calendarGrid.appendChild(day);
    }

    this.calendarElement.appendChild(calendarGrid);
  }
}

// Function to render employee dashboard
export function renderEmployeeDashboard() {
  const employeeDashboard = document.getElementById('employee-dashboard');
  employeeDashboard.innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-main">
        <h2>Employee Dashboard</h2>
        <p>Welcome, <span id="employee-name"></span>!</p>
        
        <!-- Current Time -->
        <div id="current-time" class="card">
          <h3>Current Time</h3>
          <p id="current-time-display"></p>
        </div>
        
        <!-- State Selection -->
        <div id="state-selection" class="card">
          <label for="state">Select State:</label>
          <select id="state">
            <option value="">Select State</option>
            <option value="California">California</option>
            <option value="Oregon">Oregon</option>
            <option value="Washington">Washington</option>
            <option value="Nevada">Nevada</option>
            <option value="Idaho">Idaho</option>
            <option value="Montana">Montana</option>
            <option value="Wyoming">Wyoming</option>
            <option value="Colorado">Colorado</option>
          </select>
        </div>
        
        <!-- Pay Period and Payday -->
        <div id="pay-period-info" class="card">
          <h3>Pay Period and Payday</h3>
          <p id="pay-period"></p>
          <p id="payday"></p>
        </div>
        
        <!-- Rest of the employee dashboard HTML... -->
        
        <!-- Logout Button -->
        <button id="logout-btn" class="btn">Logout</button>
      </div>
      
      <!-- Calendar Sidebar -->
      <div class="dashboard-sidebar">
        <div id="calendar" class="card"></div>
      </div>
    </div>
  `;

  // Get user details and populate the welcome message
  const user = getUser();
  if (user) {
    document.getElementById('employee-name').textContent = user.name;
  }

  // Get activity types and populate the dropdown
  const activityTypeSelect = document.getElementById('activity-type');
  getActivityTypes().forEach(activity => {
    const option = document.createElement('option');
    option.value = activity.id;
    option.textContent = activity.name;
    activityTypeSelect.appendChild(option);
  });

  // Get jobs and populate the dropdown
  const jobSelect = document.getElementById('job');
  getJobs().forEach(job => {
    const option = document.createElement('option');
    option.value = job.id;
    option.textContent = job.name;
    jobSelect.appendChild(option);
  });

  // Calculate and display pay period and payday
  const today = new Date();
  const payPeriodStartDate = getPayPeriodStartDate(today);
  const payPeriodEndDate = getPayPeriodEndDate(payPeriodStartDate);
  const payDate = getNextPayDate(payPeriodEndDate);

  const payPeriodElement = document.getElementById('pay-period');
  const paydayElement = document.getElementById('payday');

  payPeriodElement.textContent = `Pay Period: ${payPeriodStartDate.toLocaleDateString()} - ${payPeriodEndDate.toLocaleDateString()}`;
  paydayElement.textContent = `Next Pay Date: ${payDate.toLocaleDateString()}`;

  // Initialize the calendar
  const calendar = new Calendar(document.getElementById('calendar'), payPeriodStartDate, payPeriodEndDate);

  // Get current time and display based on selected state
  function updateCurrentTime() {
    const stateSelect = document.getElementById('state');
    const state = stateSelect.value || 'California'; // Default to California if no state is selected

    const currentTimeElement = document.getElementById('current-time-display');
    const currentTime = getCurrentTimeForState(state);
    currentTimeElement.textContent = currentTime.toLocaleString();
  }

  // Update current time every second
  setInterval(updateCurrentTime, 1000);

  // Event listener for state selection change
  document.getElementById('state').addEventListener('change', updateCurrentTime);

  // Event listeners for clock in, clock out, meal start, and meal end buttons
  document.getElementById('clock-in-btn').addEventListener('click', () => {
    const timestamp = new Date().toISOString();
    clockIn(user.id, getDayStatus(), getSelectedActivityTypeId(), getSelectedJobId(), getTimecardNote(), timestamp);
  });

  document.getElementById('clock-out-btn').addEventListener('click', () => {
    const timestamp = new Date().toISOString();
    clockOut(user.id, timestamp);
  });

  document.getElementById('meal-start-btn').addEventListener('click', () => {
    const timestamp = new Date().toISOString();
    startMeal(user.id, timestamp);
  });

  document.getElementById('meal-end-btn').addEventListener('click', () => {
    const timestamp = new Date().toISOString();
    endMeal(user.id, timestamp);
  });

  // Event listener for day status change
  document.getElementById('day-status').addEventListener('change', (event) => {
    const status = event.target.value;
    handleDayStatusChange(status);
  });

  // Event listener for leave type change
  document.getElementById('leave-type').addEventListener('change', (event) => {
    const leaveType = event.target.value;
    handleLeaveTypeChange(leaveType);
  });

  // Event listener for submit button
  document.getElementById('submit-btn').addEventListener('click', () => {
    submitTimecard();
  });

  // Event listener for logout button
  document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
    window.location.href = '/'; // Redirect to the login page after logout
  });
}

// Function to get the current time for a given state
function getCurrentTimeForState(state) {
  const timezones = {
    California: 'America/Los_Angeles',
    Oregon: 'America/Los_Angeles',
    Washington: 'America/Los_Angeles',
    Nevada: 'America/Los_Angeles',
    Idaho: 'America/Boise',
    Montana: 'America/Denver',
    Wyoming: 'America/Denver',
    Colorado: 'America/Denver',
  };

  const timezone = timezones[state] || 'America/Los_Angeles'; // Default to California timezone if state is not found

  return new Date().toLocaleString('en-US', { timeZone: timezone });
}

// Function to get the selected day status
function getDayStatus() {
  const dayStatusSelect = document.getElementById('day-status');
  return dayStatusSelect.value;
}

// Function to get the selected activity type ID
function getSelectedActivityTypeId() {
  const activityTypeSelect = document.getElementById('activity-type');
  return activityTypeSelect.value;
}

// Function to get the selected job ID
function getSelectedJobId() {
  const jobSelect = document.getElementById('job');
  return jobSelect.value;
}

// Function to get the timecard note
function getTimecardNote() {
  const timecardNoteInput = document.getElementById('timecard-note');
  return timecardNoteInput.value;
}

// Function to handle day status change
function handleDayStatusChange(status) {
  // ...
}

// Function to handle leave type change
function handleLeaveTypeChange(leaveType) {
  // ...
}

// Function to start meal
function startMeal(userId, timestamp) {
  // Log meal start timestamp
  console.log('Meal started at:', timestamp);
  // Perform any necessary actions or updates
}

// Function to end meal
function endMeal(userId, timestamp) {
  // Log meal end timestamp
  console.log('Meal ended at:', timestamp);
  // Perform any necessary actions or updates
}

// Render employee dashboard when the page loads
document.addEventListener('DOMContentLoaded', renderEmployeeDashboard);
