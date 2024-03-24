// Update these variables with your current pay period and next pay date
const currentPayPeriodStartDate = new Date('2024-03-11');
const currentPayPeriodEndDate = new Date('2024-03-24');
const nextPayDate = new Date('2024-03-29');

// Get DOM elements
const calendarElement = document.getElementById('calendar');
const payPeriodDatesElement = document.getElementById('pay-period-dates');
const nextPayDateElement = document.getElementById('next-pay-date');
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const employeeDashboard = document.getElementById('employee-dashboard');
const supervisorDashboard = document.getElementById('supervisor-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');

// Render calendar
renderCalendar(calendarElement, currentPayPeriodStartDate, currentPayPeriodEndDate);

// Display pay period dates and next pay date
payPeriodDatesElement.textContent = `${formatDate(currentPayPeriodStartDate)} - ${formatDate(currentPayPeriodEndDate)}`;
nextPayDateElement.textContent = formatDate(nextPayDate);

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
}

// Function to display current time
function displayCurrentTime() {
  const currentTimeElement = document.getElementById('current-time');
  const currentTime = new Date().toLocaleString();
  currentTimeElement.textContent = currentTime;
}

// Update current time every second
setInterval(displayCurrentTime, 1000);

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
    clockIn(user.id, dayStatus, activityTypeId, jobId, timecardNote, timestamp);
    document.getElementById('clock-in-btn').disabled = true;
    document.getElementById('clock-out-btn').disabled = false;
    document.getElementById('meal-start-btn').disabled = false;
    renderWeeklyHoursTable();
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
}

// Function to handle timecard submission
function handleTimecardSubmission() {
  const timecardSubmissionDialog = document.getElementById('timecard-submission-dialog');
  timecardSubmissionDialog.style.display = 'block';
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
  renderNotificationForm();
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
      <td>${employee.employeeId}</td>
      <td>${employee.role}</td>
      <td>${employee.state}</td>
      <td>
        <button class="edit-btn" data-employee-id="${employee.id}">Edit</button>
        <button class="delete-btn" data-employee-id="${employee.id}">Delete</button>
      </td>
    `;
    employeeTableBody.appendChild(row);
  });
}

// Function to render notification form
function renderNotificationForm() {
  const notificationForm = document.getElementById('notification-form');

  notificationForm.addEventListener('submit', event => {
    event.preventDefault();

    const notificationInstance = document.getElementById('notification-instance').value;
    const notificationMessage = document.getElementById('notification-message').value;

    // Save the notification message for the specific instance
    saveNotificationMessage(notificationInstance, notificationMessage);

    alert('Notification message saved successfully.');
    notificationForm.reset();
  });
}

// Function to save notification message
function saveNotificationMessage(instance, message) {
  // Save the notification message in the database or data store
  // ...
}

// Function to get notification message
function getNotificationMessage(instance) {
  // Retrieve the notification message from the database or data store based on the instance
  // ...
  // Return the notification message
  return notificationMessage;
}

// Function to send notification
function sendNotification(recipient, message) {
  // Placeholder function for sending notifications
  console.log(`Sending notification to ${recipient}: ${message}`);
  // Replace this with the actual implementation using the Teams API or any other notification system
}

// Function to render the calendar
function renderCalendar(calendarElement, startDate, endDate) {
  // Clear existing calendar content
  calendarElement.innerHTML = '';

  // Create a new calendar instance
  const calendar = new Calendar(calendarElement, startDate, endDate);

  // Highlight the current day
  const currentDate = new Date();
  calendar.highlightDay(currentDate);

  // Highlight the pay period dates
  calendar.highlightDates(startDate, endDate);
}

// Function to format dates
function formatDate(date) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Calendar class
class Calendar {
  constructor(calendarElement, startDate, endDate) {
    this.calendarElement = calendarElement;
    this.startDate = startDate;
    this.endDate = endDate;
    this.renderCalendar();
  }

  renderCalendar() {
    const currentDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    while (currentDate <= endDate) {
      const day = document.createElement('div');
      day.classList.add('day');
      day.textContent = currentDate.getDate();
      this.calendarElement.appendChild(
