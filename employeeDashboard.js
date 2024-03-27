import { getUser, logout } from './auth.js';
import { getActivityTypes } from './activityTypeManagement.js';
import { getJobs } from './jobManagement.js';
import { clockIn, clockOut, getTimecard, submitTimecard, submitLeaveHours, updateTimecard } from './timecard.js';
import { calculateHours } from './hoursCalculation.js';

export function renderEmployeeDashboard() {
  const employeeDashboard = document.getElementById('employee-dashboard');
  employeeDashboard.innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-main">
        <h2>Employee Dashboard</h2>
        <p>Welcome, <span id="employee-name"></span>!</p>
        
        <!-- Day Status -->
        <div id="day-status-section" class="card">
          <label for="day-status">Day Status:</label>
          <select id="day-status" required>
            <option value="">Select Day Status</option>
            <option value="working">Working</option>
            <option value="off">Off</option>
            <option value="leave">Leave</option>
          </select>
        </div>
        
        <!-- Time Clock -->
        <div id="time-clock" class="card">
          <h3>Time Clock</h3>
          <p>Current Time: <span id="current-time"></span></p>
          <div class="btn-group">
            <button id="clock-in-btn" class="btn" disabled>Clock In</button>
            <button id="clock-out-btn" class="btn" disabled>Clock Out</button>
            <button id="meal-start-btn" class="btn" disabled>Meal Start</button>
            <button id="meal-end-btn" class="btn" disabled>Meal End</button>
          </div>
          <div id="clock-in-time"></div>
          <div id="clock-out-time"></div>
          <div id="meal-start-time"></div>
          <div id="meal-end-time"></div>
        </div>
        
        <!-- Activity and Job (Optional) -->
        <div id="activity-job-section" class="card" style="display: none;">
          <label for="activity-type">Activity (Optional):</label>
          <select id="activity-type">
            <option value="">Select Activity</option>
            <!-- Dynamically populate activity types -->
          </select>
          
          <label for="job">Job (Optional):</label>
          <select id="job">
            <option value="">Select Job</option>
            <!-- Dynamically populate jobs -->
          </select>
        </div>
        
        <!-- Leave Hours -->
        <div id="leave-hours-section" class="card" style="display: none;">
          <label for="leave-type">Leave Type:</label>
          <select id="leave-type" required>
            <option value="">Select Leave Type</option>
            <option value="paid-time-off">Paid Time Off</option>
            <option value="bonus-pto">Bonus PTO</option>
            <option value="sick-hours">Sick Hours</option>
            <option value="flex-hours">Flex Hours</option>
          </select>
          
          <label for="leave-hours">Leave Hours:</label>
          <input type="number" id="leave-hours" placeholder="Enter Leave Hours" min="0" step="0.01" required>
        </div>
        
        <!-- Timecard Note -->
        <div id="timecard-note-section" class="card">
          <label for="timecard-note">Timecard Note:</label>
          <input type="text" id="timecard-note" placeholder="Enter a note">
        </div>
        
        <!-- Meal Period Waiver -->
        <div id="meal-period-waiver" class="card" style="display: none;">
          <h3>Meal Period Waiver</h3>
          <input type="checkbox" id="meal-period-waiver-checkbox">
          <label for="meal-period-waiver-checkbox">Waive Meal Period</label>
        </div>
        
        <!-- Weekly Hours Table -->
        <div class="card">
          <h3>Weekly Hours</h3>
          <table id="weekly-hours-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody id="weekly-hours-body">
              <!-- Weekly hours will be dynamically populated here -->
            </tbody>
          </table>
        </div>
        
        <!-- Submit Button -->
        <button id="submit-btn" class="btn" disabled>Submit</button>
        
        <!-- Logout Button -->
        <button id="logout-btn" class="btn">Logout</button>
      </div>
      
      <!-- Calendar Sidebar -->
      <div class="dashboard-sidebar">
        <div id="calendar" class="card"></div>
      </div>
    </div>
  `;

  const user = getUser();
  if (user) {
    document.getElementById('employee-name').textContent = user.name;
  }

  // Populate activity types and jobs dropdowns
  const activityTypeSelect = document.getElementById('activity-type');
  getActivityTypes().forEach(activity => {
    const option = document.createElement('option');
    option.value = activity.id;
    option.textContent = activity.name;
    activityTypeSelect.appendChild(option);
  });

  const jobSelect = document.getElementById('job');
  getJobs().forEach(job => {
    const option = document.createElement('option');
    option.value = job.id;
    option.textContent = job.name;
    jobSelect.appendChild(option);
  });

  // Initialize calendar
  const calendar = new Calendar(document.getElementById('calendar'));

  // Display current time
  setInterval(() => {
    const currentTime = new Date();
    document.getElementById('current-time').textContent = currentTime.toLocaleTimeString();
  }, 1000);

  // Event listeners for clock in, clock out, meal start, and meal end buttons
  document.getElementById('clock-in-btn').addEventListener('click', () => {
    clockIn();
  });

  document.getElementById('clock-out-btn').addEventListener('click', () => {
    clockOut();
  });

  document.getElementById('meal-start-btn').addEventListener('click', () => {
    startMeal();
  });

  document.getElementById('meal-end-btn').addEventListener('click', () => {
    endMeal();
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
    window.location.href = '/';
  });
}

// Function to handle day status change
function handleDayStatusChange(status) {
  const clockInBtn = document.getElementById('clock-in-btn');
  const clockOutBtn = document.getElementById('clock-out-btn');
  const mealStartBtn = document.getElementById('meal-start-btn');
  const mealEndBtn = document.getElementById('meal-end-btn');
  const activityJobSection = document.getElementById('activity-job-section');
  const leaveHoursSection = document.getElementById('leave-hours-section');

  switch (status) {
    case 'working':
      clockInBtn.disabled = false;
      clockOutBtn.disabled = true;
      mealStartBtn.disabled = true;
      mealEndBtn.disabled = true;
      activityJobSection.style.display = 'block';
      leaveHoursSection.style.display = 'none';
      break;
    case 'off':
      clockInBtn.disabled = true;
      clockOutBtn.disabled = true;
      mealStartBtn.disabled = true;
      mealEndBtn.disabled = true;
      activityJobSection.style.display = 'none';
      leaveHoursSection.style.display = 'none';
      break;
    case 'leave':
      clockInBtn.disabled = true;
      clockOutBtn.disabled = true;
      mealStartBtn.disabled = true;
      mealEndBtn.disabled = true;
      activityJobSection.style.display = 'none';
      leaveHoursSection.style.display = 'block';
      break;
    default:
      break;
  }
}

// Function to handle leave type change
function handleLeaveTypeChange(leaveType) {
  const mealPeriodWaiver = document.getElementById('meal-period-waiver');

  if (leaveType === 'sick-hours' || leaveType === 'flex-hours') {
    mealPeriodWaiver.style.display = 'block';
  } else {
    mealPeriodWaiver.style.display = 'none';
  }
}

// Function to start meal
function startMeal() {
  const mealStart = new Date().toLocaleTimeString();
  document.getElementById('meal-start-time').textContent = `Meal Start: ${mealStart}`;
}

// Function to end meal
function endMeal() {
  const mealEnd = new Date().toLocaleTimeString();
  document.getElementById('meal-end-time').textContent = `Meal End: ${mealEnd}`;
}
