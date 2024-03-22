// Get DOM elements
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const employeeNameElement = document.getElementById('employee-name');
const currentTimeElement = document.getElementById('current-time');
const timeZoneSelect = document.getElementById('time-zone-select');
const timeEntriesContainer = document.getElementById('time-entries');
const clockInButton = document.getElementById('clock-in-btn');
const clockOutButton = document.getElementById('clock-out-btn');
const startBreakButton = document.getElementById('start-break-btn');
const endBreakButton = document.getElementById('end-break-btn');
const startLunchButton = document.getElementById('start-lunch-btn');
const endLunchButton = document.getElementById('end-lunch-btn');
const logoutButton = document.getElementById('logout-btn');

// Event listener for login form submission
loginForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  // Get input values
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Perform login validation (replace with your own logic)
  if (username === 'admin' && password === 'password') {
    // Successful login
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    employeeNameElement.textContent = username;
    updateCurrentTime(); // Update current time immediately after login
  } else {
    // Invalid login
    alert('Invalid username or password');
  }
});

// Function to update current time
function updateCurrentTime() {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  currentTimeElement.textContent = currentTime;
}

// Update current time every second
setInterval(updateCurrentTime, 1000);

// Event listener for time zone selection change
timeZoneSelect.addEventListener('change', updateCurrentTime);

// Function to create a time entry
function createTimeEntry(text) {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  const timeEntry = document.createElement('div');
  timeEntry.className = 'time-entry';
  timeEntry.textContent = `${text}: ${currentTime}`;
  timeEntriesContainer.appendChild(timeEntry);
}

// Event listener for clock-in button click
clockInButton.addEventListener('click', function() {
  createTimeEntry('Clocked In');
});

// Event listener for clock-out button click
clockOutButton.addEventListener('click', function() {
  createTimeEntry('Clocked Out');
});

// Event listener for start break button click
startBreakButton.addEventListener('click', function() {
  createTimeEntry('Break Started');
});

// Event listener for end break button click
endBreakButton.addEventListener('click', function() {
  createTimeEntry('Break Ended');
});

// Event listener for start lunch button click
startLunchButton.addEventListener('click', function() {
  createTimeEntry('Lunch Started');
});

// Event listener for end lunch button click
endLunchButton.addEventListener('click', function() {
  createTimeEntry('Lunch Ended');
});

// Event listener for logout button click
logoutButton.addEventListener('click', function() {
  // Perform logout logic
  loginSection.style.display = 'block';
  dashboardSection.style.display = 'none';
  timeEntriesContainer.innerHTML = ''; // Clear time entries
});
// Add event listeners and functions for new features

// Employee comments
const commentInput = document.getElementById('comment-input');
function saveComment() {
  const comment = commentInput.value;
  // Save the comment with the time entry
}

// Work type selection
const workTypeSelect = document.getElementById('work-type-select');
function saveWorkType() {
  const workType = workTypeSelect.value;
  // Save the selected work type with the time entry
}

// Supervisor review and approval
function reviewTimecard(timecardId) {
  // Retrieve the timecard data based on the timecardId
  // Display the timecard details for review
  // Allow the supervisor to approve or reject the timecard
}

// Admin manage work types
function addWorkType() {
  // Add a new work type to the list
}

function deleteWorkType(workTypeId) {
  // Remove a work type from the list
}

// Reporting
function generateReport() {
  // Retrieve the relevant timecard data based on filters
  // Process the data and generate visual representations
  // Display the report
}
