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
