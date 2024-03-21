// script.js

// Get DOM elements
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const employeeNameElement = document.getElementById('employee-name');
const clockInButton = document.getElementById('clock-in-btn');
const clockOutButton = document.getElementById('clock-out-btn');
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
  } else {
    // Invalid login
    alert('Invalid username or password');
  }
});

// Event listener for clock-in button click
clockInButton.addEventListener('click', function() {
  // Perform clock-in logic (replace with your own logic)
  alert('Clocked in!');
});

// Event listener for clock-out button click
clockOutButton.addEventListener('click', function() {
  // Perform clock-out logic (replace with your own logic)
  alert('Clocked out!');
});

// Event listener for logout button click
logoutButton.addEventListener('click', function() {
  // Perform logout logic (replace with your own logic)
  loginSection.style.display = 'block';
  dashboardSection.style.display = 'none';
});
// Existing code remains the same

// Get additional DOM elements
const currentTimeElement = document.getElementById('current-time');
const timeZoneSelect = document.getElementById('time-zone-select');
const timeEntriesContainer = document.getElementById('time-entries');
const startBreakButton = document.getElementById('start-break-btn');
const endBreakButton = document.getElementById('end-break-btn');
const startLunchButton = document.getElementById('start-lunch-btn');
const endLunchButton = document.getElementById('end-lunch-btn');

// Function to update current time
function updateCurrentTime() {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  currentTimeElement.textContent = currentTime;
}

// Update current time every second
setInterval(updateCurrentTime, 1000);

// Event listener for time zone selection change
timeZoneSelect.addEventListener('change', updateCurrentTime);

// Event listener for clock-in button click
clockInButton.addEventListener('click', function() {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  const timeEntry = document.createElement('div');
  timeEntry.className = 'time-entry';
  timeEntry.textContent = `Clocked In: ${currentTime}`;
  timeEntriesContainer.appendChild(timeEntry);
});

// Event listener for clock-out button click
clockOutButton.addEventListener('click', function() {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  const timeEntry = document.createElement('div');
  timeEntry.className = 'time-entry';
  timeEntry.textContent = `Clocked Out: ${currentTime}`;
  timeEntriesContainer.appendChild(timeEntry);
});

// Event listener for start break button click
startBreakButton.addEventListener('click', function() {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  const timeEntry = document.createElement('div');
  timeEntry.className = 'time-entry';
  timeEntry.textContent = `Break Started: ${currentTime}`;
  timeEntriesContainer.appendChild(timeEntry);
});

// Event listener for end break button click
endBreakButton.addEventListener('click', function() {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  const timeEntry = document.createElement('div');
  timeEntry.className = 'time-entry';
  timeEntry.textContent = `Break Ended: ${currentTime}`;
  timeEntriesContainer.appendChild(timeEntry);
});

// Event listener for start lunch button click
startLunchButton.addEventListener('click', function() {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  const timeEntry = document.createElement('div');
  timeEntry.className = 'time-entry';
  timeEntry.textContent = `Lunch Started: ${currentTime}`;
  timeEntriesContainer.appendChild(timeEntry);
});

// Event listener for end lunch button click
endLunchButton.addEventListener('click', function() {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  const timeEntry = document.createElement('div');
  timeEntry.className = 'time-entry';
  timeEntry.textContent = `Lunch Ended: ${currentTime}`;
  timeEntriesContainer.appendChild(timeEntry);
});
