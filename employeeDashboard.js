// Import necessary functions from other files
import { getUser, logout } from './auth.js';
import { getActivityTypes } from './activityTypeManagement.js';
import { getJobs } from './jobManagement.js';
import { clockIn, clockOut, getTimecard, submitTimecard, submitLeaveHours } from './timecard.js';
import { calculateHours } from './hoursCalculation.js';
import { sendTeamsNotification } from './teamsNotification.js';

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
    const monthYear = document.createElement('div');
    monthYear.classList.add('month-year');
    monthYear.textContent = `${this.getMonthName()} ${this.currentDate.getFullYear()}`;
    this.calendarElement.appendChild(monthYear);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysOfWeekElement = document.createElement('div');
    daysOfWeekElement.classList.add('days-of-week');
    daysOfWeek.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.textContent = day;
      daysOfWeekElement.appendChild(dayElement);
    });
    this.calendarElement.appendChild(daysOfWeekElement);

    const daysElement = document.createElement('div');
    daysElement.classList.add('days');

    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const prevMonthDays = firstDay.getDay();
    const nextMonthDays = 6 - lastDay.getDay();

    for (let i = 1; i <= prevMonthDays; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('prev-month');
      daysElement.appendChild(dayElement);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayElement = document.createElement('div');
      dayElement.textContent = i;
      dayElement.dataset.date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i).toISOString();

      if (i === this.currentDate.getDate()) {
        dayElement.classList.add('current-day');
      }

      if (
        new Date(dayElement.dataset.date) >= this.payPeriodStartDate &&
        new Date(dayElement.dataset.date) <= this.payPeriodEndDate
      ) {
        dayElement.classList.add('pay-period');
      }

      daysElement.appendChild(dayElement);
    }

    for (let i = 1; i <= nextMonthDays; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('next-month');
      daysElement.appendChild(dayElement);
    }

    this.calendarElement.appendChild(daysElement);
  }

  getMonthName() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[this.currentDate.getMonth()];
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
          <p>Current Time: <span id="current-time"></span></p>
          <p>Time Zone: <span id="time-zone"></span></p>
          <div class="btn-group">
            <button id="clock-in-btn" class="btn">Clock In</button>
            <button id="clock-out-btn" class="btn" disabled>Clock Out</button>
            <button id="meal-start-btn" class="btn" disabled>Meal Start</button>
            <button id="meal-end-btn" class="btn" disabled>Meal End</button>
          </div>
        </div>
        
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
                <th>Activity</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
                <th>Sun</th>
                <th>Weekly Totals</th>
              </tr>
            </thead>
            <tbody>
              <!-- Dynamically populate table rows based on activities and hours -->
            </tbody>
            <tfoot>
              <tr>
                <td>Daily Totals</td>
                <td id="mon-total">0</td>
                <td id="tue-total">0</td>
                <td id="wed-total">0</td>
                <td id="thu-total">0</td>
                <td id="fri-total">0</td>
                <td id="sat-total">0</td>
                <td id="sun-total">0</td>
                <td id="weekly-total">0</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <!-- Total Weekly Hours -->
        <div id="total-weekly-hours" class="card">
          <h3>Total Weekly Hours</h3>
          <p>Total Hours: <span id="total-hours">0</span></p>
          <p>Regular Hours: <span id="regular-hours">0</span></p>
          <p>OT Hours: <span id="ot-hours">0</span></p>
          <p>DT Hours: <span id="dt-hours">0</span></p>
        </div>
        
        <!-- Timecard Submission -->
        <button id="submit-timecard-btn" class="btn">Submit Timecard</button>

        <!-- Logout Button -->
        <button id="logout-btn" class="btn">Logout</button>
        
        <!-- Timecard Submission Dialog -->
        <div id="timecard-submission-dialog" class="modal" style="display: none;">
          <div class="modal-content">
            <h3>Timecard Submission</h3>
            <p>By submitting this timecard, you acknowledge that all information provided is accurate and complete.</p>
            <div class="btn-group">
              <button id="confirm-submission-btn" class="btn">Confirm</button>
              <button id="cancel-submission-btn" class="btn">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <div class="dashboard-sidebar">
        <div class="card">
          <h3>Calendar</h3>
          <div id="calendar"></div>
          <div id="pay-period-info">
            <p>Pay Period: <span id="pay-period-dates"></span></p>
            <p>Next Pay Date: <span id="next-pay-date"></span></p>
          </div>
        </div>
      </div>
    </div>
  `;

  const user = getUser();
  document.getElementById('employee-name').textContent = user.name;
  document.getElementById('time-zone').textContent = getTimeZone(user.state);
  
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

  // Event listener for logout button click
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  // Render calendar
  const calendarElement = document.getElementById('calendar');
  const payPeriodDatesElement = document.getElementById('pay-period-dates');
  const nextPayDateElement = document.getElementById('next-pay-date');

  const currentDate = new Date();
  const payPeriodStartDate = getPayPeriodStartDate(currentDate);
  const payPeriodEndDate = getPayPeriodEndDate(payPeriodStartDate);
  const nextPayDate = getNextPayDate(payPeriodEndDate);

   const calendar = new Calendar(calendarElement, payPeriodStartDate, payPeriodEndDate);
  calendar.renderCalendar();

  payPeriodDatesElement.textContent = `${formatDate(payPeriodStartDate)} - ${formatDate(payPeriodEndDate)}`;
  nextPayDateElement.textContent = formatDate(nextPayDate);

  // Update calendar after the end of the pay period
  const updateCalendar = () => {
    const today = new Date();
    if (today > payPeriodEndDate) {
      const newPayPeriodStartDate = getPayPeriodStartDate(today);
      const newPayPeriodEndDate = getPayPeriodEndDate(newPayPeriodStartDate);
      const newNextPayDate = getNextPayDate(newPayPeriodEndDate);

      calendar.payPeriodStartDate = newPayPeriodStartDate;
      calendar.payPeriodEndDate = newPayPeriodEndDate;
      calendar.currentDate = today;
      calendar.renderCalendar();

      payPeriodDatesElement.textContent = `${formatDate(newPayPeriodStartDate)} - ${formatDate(newPayPeriodEndDate)}`;
      nextPayDateElement.textContent = formatDate(newNextPayDate);
    }
  };

  setInterval(updateCalendar, 24 * 60 * 60 * 1000); // Update every 24 hours

  // Display current time
  displayCurrentTime();
  setInterval(displayCurrentTime, 1000);
}

// Function to display current time
function displayCurrentTime() {
  const currentTimeElement = document.getElementById('current-time');
  const currentTime = new Date().toLocaleString('en-US', { timeZone: getTimeZone(getUser().state) });
  currentTimeElement.textContent = currentTime;
}

// Function to get the time zone based on the employee's state
function getTimeZone(state) {
  // Define the time zone mapping for each state
  const timeZoneMap = {
    California: 'America/Los_Angeles',
    Oregon: 'America/Los_Angeles',
    Washington: 'America/Los_Angeles',
    Montana: 'America/Denver',
    Wyoming: 'America/Denver',
    Nevada: 'America/Los_Angeles',
    Idaho: 'America/Boise',
    Colorado: 'America/Denver',
    New_York: 'America/New_York',
    // Add more states and their corresponding time zones
  };

  return timeZoneMap[state] || 'America/New_York'; // Default to Eastern Time if state is not found
}

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
  const activityJobSection = document.getElementById('activity-job-section');
  const leaveHoursSection = document.getElementById('leave-hours-section');
  const mealPeriodWaiver = document.getElementById('meal-period-waiver');

  if (dayStatus === 'working') {
    activityJobSection.style.display = 'block';
    leaveHoursSection.style.display = 'none';
    mealPeriodWaiver.style.display = 'block';
  } else if (dayStatus === 'leave') {
    activityJobSection.style.display = 'none';
    leaveHoursSection.style.display = 'block';
    mealPeriodWaiver.style.display = 'none';
  } else {
    activityJobSection.style.display = 'none';
    leaveHoursSection.style.display = 'none';
    mealPeriodWaiver.style.display = 'none';
  }
}

// Function to handle clock in
function handleClockIn() {
  const user = getUser();
  const dayStatus = document.getElementById('day-status').value;
  const activityTypeId = document.getElementById('activity-type').value || 'working';
  const jobId = document.getElementById('job').value;
  const timecardNote = document.getElementById('timecard-note').value;

  if (dayStatus) {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: getTimeZone(user.state) });
    
    // Check if the employee is already clocked in
    const timecard = getTimecard(user.id);
    const lastEntry = timecard.entries[timecard.entries.length - 1];
    if (lastEntry && !lastEntry.endTime) {
      // Record the ending time stamp for the previous clock-in entry
      lastEntry.endTime = timestamp;
      updateTimecard(user.id, timecard);
    }
    
    // Start a new clock-in entry
    clockIn(user.id, dayStatus, activityTypeId, jobId, timecardNote, timestamp);
    document.getElementById('clock-in-btn').disabled = true;
    document.getElementById('clock-out-btn').disabled = false;
    document.getElementById('meal-start-btn').disabled = false;
    renderWeeklyHoursTable();
    displayTimestamp('Clock In', timestamp);
  } else {
    alert('Please select a day status.');
  }
}

// Function to handle clock out
function handleClockOut() {
  const user = getUser();
  const timestamp = new Date().toLocaleString('en-US', { timeZone: getTimeZone(user.state) });
  clockOut(user.id, timestamp);
  document.getElementById('clock-in-btn').disabled = false;
  document.getElementById('clock-out-btn').disabled = true;
  document.getElementById('meal-start-btn').disabled = true;
  document.getElementById('meal-end-btn').disabled = true;
  renderWeeklyHoursTable();
  displayTimestamp('Clock Out', timestamp);
}

// Function to handle meal start
function handleMealStart() {
  const user = getUser();
  const timestamp = new Date().toLocaleString('en-US', { timeZone: getTimeZone(user.state) });
  const activityTypeId = 'meal';
  clockIn(user.id, 'working', activityTypeId, null, null, timestamp);
  document.getElementById('meal-start-btn').disabled = true;
  document.getElementById('meal-end-btn').disabled = false;
  renderWeeklyHoursTable();
  displayTimestamp('Meal Start', timestamp);
}

// Function to handle meal end
function handleMealEnd() {
  const user = getUser();
  const timestamp = new Date().toLocaleString('en-US', { timeZone: getTimeZone(user.state) });
  const activityTypeId = 'working';
  clockIn(user.id, 'working', activityTypeId, null, null, timestamp);
  document.getElementById('meal-start-btn').disabled = false;
  document.getElementById('meal-end-btn').disabled = true;
  renderWeeklyHoursTable();
  displayTimestamp('Meal End', timestamp);
}

// Function to handle timecard submission
function handleTimecardSubmission() {
  const timecardSubmissionDialog = document.getElementById('timecard-submission-dialog');
  timecardSubmissionDialog.style.display = 'block';
}

// Function to display timestamp
function displayTimestamp(type, timestamp) {
  const timestampElement = document.createElement('p');
  timestampElement.textContent = `${type} Timestamp: ${timestamp}`;
  document.getElementById('time-clock').appendChild(timestampElement);
}

// Function to confirm timecard submission
function confirmTimecardSubmission() {
  const user = getUser();
  const leaveType = document.getElementById('leave-type').value;
  const leaveHours = document.getElementById('leave-hours').value;

  if (leaveType && leaveHours) {
    submitLeaveHours(user.id, leaveType, leaveHours);
  }

  submitTimecard(user.id);
  alert('Timecard submitted successfully.');
  closeTimecardSubmissionDialog();
  
  // Send notification to supervisor
  const supervisor = getSupervisor(user.id);
  const notificationMessage = getNotificationMessage('timecardSubmitted');
  sendTeamsNotification(supervisor, notificationMessage);
}

// Function to cancel timecard submission
function cancelTimecardSubmission() {
  closeTimecardSubmissionDialog();
}

// Function to close timecard submission dialog
function closeTimecardSubmissionDialog() {
  const timecardSubmissionDialog = document.getElementById('timecard-submission-dialog');
  timecardSubmissionDialog.style.display = 'none';
}

// Function to update total weekly hours
function updateTotalWeeklyHours() {
  const user = getUser();
  const timecard = getTimecard(user.id);
  const { regularHours, overtimeHours, doubleTimeHours } = calculateHours(user.state, timecard);

  document.getElementById('total-hours').textContent = regularHours + overtimeHours + doubleTimeHours;
  document.getElementById('regular-hours').textContent = regularHours;
  document.getElementById('ot-hours').textContent = overtimeHours;
  document.getElementById('dt-hours').textContent = doubleTimeHours;
}

// Function to handle logout
function handleLogout() {
  logout();
  // Redirect to the login page or clear the dashboard
  employeeDashboard.style.display = 'none';
  loginSection.style.display = 'block';
}

// Function to get the pay period start date
function getPayPeriodStartDate(date) {
  const dayOfWeek = date.getDay();
  const daysToSubtract = (dayOfWeek + 6) % 7; // Adjust to start on Monday
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

// Function to format dates
function formatDate(date) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
