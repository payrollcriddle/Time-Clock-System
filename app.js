// Import necessary functions from other files
import { login, logout, isAuthenticated, getUser } from './auth.js';
import { renderEmployeeDashboard } from './employeeDashboard.js';
import { renderSupervisorDashboard } from './supervisorDashboard.js';
import { renderAdminDashboard } from './adminDashboard.js';

// Get DOM elements
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const employeeDashboard = document.getElementById('employee-dashboard');
const supervisorDashboard = document.getElementById('supervisor-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');

// Function to render the appropriate dashboard based on user role
function renderDashboard(userRole) {
  loginSection.style.display = 'none';
  employeeDashboard.style.display = 'none';
  supervisorDashboard.style.display = 'none';
  adminDashboard.style.display = 'none';

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
}

// Event listener for login form submission
loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const userRole = login(username, password);
  if (userRole) {
    renderDashboard(userRole);
  } else {
    alert('Invalid username or password');
  }
});

// Event listener for logout
document.addEventListener('click', event => {
  if (event.target.matches('#logoutButton')) {
    logout();
    loginSection.style.display = 'block';
    employeeDashboard.style.display = 'none';
    supervisorDashboard.style.display = 'none';
    adminDashboard.style.display = 'none';
  }
});

// Check if the user is already logged in
if (isAuthenticated()) {
  const user = getUser();
  renderDashboard(user.role);
} else {
  loginSection.style.display = 'block';
}
