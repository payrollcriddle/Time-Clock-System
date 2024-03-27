// Import necessary functions from other files
import { getUser, logout } from './auth.js';
import { getActivityTypes } from './activityTypeManagement.js';
import { getJobs } from './jobManagement.js';
import { clockIn, clockOut, startMeal, endMeal, getTimecard, submitTimecard, submitLeaveHours, updateTimecard } from './timecard.js';
import { calculateHours, calculateDailyHours, calculateWeeklyHours } from './hoursCalculation.js';

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
        
        <!-- Time Clock -->
        <div id="time-clock" class="card">
          <h3>Time Clock</h3>
          <p>Current Time: <span id="current-time-display"></span></p>
          <div class="time-clock-container">
            <div class="btn-group">
              <button id="clock-in-btn" class="btn" disabled>Clock In</button>
              <button id="clock-out-btn" class="btn" disabled>Clock Out</button>
              <button id="meal-start-btn" class="btn" disabled>Meal Start</button>
              <button id="meal-end-btn" class="btn" disabled>Meal End</button>
            </div>
            <div id="day-status-section">
              <label for="day-status">Day Status:</label>
              <select id="day-status" required>
                <option value="">Select Day Status</option>
                <option value="working">Working</option>
                <option value="off">Off</option>
                <option value="leave">Leave</option>
              </select>
            </div>
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
        
        <!-- Daily Hours -->
        <div id="daily-hours" class="card">
          <h3>Daily Hours</h3>
          <table id="daily-hours-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Mon 3/18</th>
                <th>Tue 3/19</th>
                <th>Wed 3/20</th>
                <th>Thu 3/21</th>
                <th>Fri 3/22</th>
                <th>Sat 3/23</th>
                <th>Sun 3/24</th>
                <th>Weekly Totals</th>
              </tr>
            </thead>
            <tbody id="daily-hours-body">
              <!-- Daily hours will be dynamically populated here -->
            </tbody>
          </table>
        </div>
        
        <!-- Weekly Hours -->
        <div id="weekly-hours" class="card">
          <h3>Weekly Hours</h3>
          <table id="weekly-hours-table">
            <thead>
              <tr>
                <th>Total Hours:</th>
                <th>Regular Hours</th>
                <th>OT Hours</th>
                <th>DT Hours</th>
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
        
        <!-- Pay Period and Payday -->
        <div id="pay-period-info" class="card">
          <h3>Pay Period and Payday</h3>
          <p id="pay-period"></p>
          <p id="payday"></p>
        </div>
      </div>
    </div>
  `;
  
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

  // Get current time and display based on employee's state
  function updateCurrentTime() {
    const employeeState = user.state || 'California'; // Default to California if no state is assigned

    const currentTimeElement = document.getElementById('current-time-display');
    const currentTime = getCurrentTimeForState(employeeState);
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
    updateTimeClockDisplay();
  });

  document.getElementById('clock-out-btn').addEventListener('click', () => {
    const timestamp = new Date().toISOString();
    clockOut(user.id, timestamp);
    updateTimeClockDisplay();
  });

  document.getElementById('meal-start-btn').addEventListener('click', () => {
    const timestamp = new Date().toISOString();
    startMeal(user.id, timestamp);
    updateTimeClockDisplay();
  });

  document.getElementById('meal-end-btn').addEventListener('click', () => {
    const timestamp = new Date().toISOString();
    endMeal(user.id, timestamp);
    updateTimeClockDisplay();
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
    submitTimecard(user.id);
    submitLeaveHours(user.id, getSelectedLeaveType(), getLeaveHours());
    updateDailyHoursDisplay();
    updateWeeklyHoursDisplay();
  });

  // Event listener for logout button
  document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
    window.location.href = '/'; // Redirect to the login page after logout
  });

  // Update daily hours display
  function updateDailyHoursDisplay() {
    const dailyHoursElement = document.getElementById('daily-hours-display');
    const dailyHours = calculateDailyHours(user.id, today.toISOString().split('T')[0]);
    dailyHoursElement.textContent = `${dailyHours} hours`;
  }

  // Update weekly hours display
  function updateWeeklyHoursDisplay() {
    const weeklyHoursElement = document.getElementById('weekly-hours-display');
    const weeklyHours = calculateWeeklyHours(user.id);
    weeklyHoursElement.textContent = `${weeklyHours} hours`;
  }

  // Update time clock display
  function updateTimeClockDisplay() {
    const timecard = getTimecard(user.id);
    const lastEntry = timecard.entries[timecard.entries.length - 1];

    const clockInTimeElement = document.getElementById('clock-in-time');
    const clockOutTimeElement = document.getElementById('clock-out-time');
    const mealStartTimeElement = document.getElementById('meal-start-time');
    const mealEndTimeElement = document.getElementById('meal-end-time');

    clockInTimeElement.textContent = lastEntry && lastEntry.startTime ? `Clocked In: ${new Date(lastEntry.startTime).toLocaleString()}` : '';
    clockOutTimeElement.textContent = lastEntry && lastEntry.endTime ? `Clocked Out: ${new Date(lastEntry.endTime).toLocaleString()}` : '';
    mealStartTimeElement.textContent = lastEntry && lastEntry.activityTypeId === 'meal' && lastEntry.startTime ? `Meal Started: ${new Date(lastEntry.startTime).toLocaleString()}` : '';
    mealEndTimeElement.textContent = lastEntry && lastEntry.activityTypeId === 'meal' && lastEntry.endTime ? `Meal Ended: ${new Date(lastEntry.endTime).toLocaleString()}` : '';
  }

  // Initialize the dashboard
  updateCurrentTime();
  updateDailyHoursDisplay();
  updateWeeklyHoursDisplay();
  updateTimeClockDisplay();
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

// Function to get the selected leave type
function getSelectedLeaveType() {
  const leaveTypeSelect = document.getElementById('leave-type');
  return leaveTypeSelect.value;
}

// Function to get the leave hours
function getLeaveHours() {
  const leaveHoursInput = document.getElementById('leave-hours');
  return parseFloat(leaveHoursInput.value);
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

// Render employee dashboard when the page loads
document.addEventListener('DOMContentLoaded', renderEmployeeDashboard);
