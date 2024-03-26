// Import necessary functions from other files
import { login, logout, isAuthenticated, getUser } from './auth.js';
import { renderEmployeeDashboard } from './employeeDashboard.js';
import { renderSupervisorDashboard } from './supervisorDashboard.js';
import { renderAdminDashboard } from './adminDashboard.js';

// Get DOM elements
const loginForm = document.getElementById('login-form');
const loginPage = document.getElementById('login-page');
const employeeDashboard = document.getElementById('employee-dashboard');
const supervisorDashboard = document.getElementById('supervisor-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');

// Function to render the appropriate dashboard based on user role
function renderDashboard() {
  const user = getUser();
  if (user) {
    loginPage.style.display = 'none';
    if (user.role === 'employee') {
      employeeDashboard.style.display = 'block';
      renderEmployeeDashboard();
    } else if (user.role === 'supervisor') {
      supervisorDashboard.style.display = 'block';
      renderSupervisorDashboard();
    } else if (user.role === 'admin') {
      adminDashboard.style.display = 'block';
      renderAdminDashboard();
    }
  } else {
    loginPage.style.display = 'block';
    employeeDashboard.style.display = 'none';
    supervisorDashboard.style.display = 'none';
    adminDashboard.style.display = 'none';
  }
}

// Event listener for login form submission
loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  login(username, password);
  renderDashboard();
});

// Initial rendering of the dashboard or login page
renderDashboard();
