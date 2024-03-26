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
function renderDashboard() {
  const user = getUser();

  if (user && isAuthenticated()) {
    loginSection.style.display = 'none';

    if (user.role === 'employee') {
      employeeDashboard.style.display = 'block';
      supervisorDashboard.style.display = 'none';
      adminDashboard.style.display = 'none';
      renderEmployeeDashboard();
    } else if (user.role === 'supervisor') {
      employeeDashboard.style.display = 'none';
      supervisorDashboard.style.display = 'block';
      adminDashboard.style.display = 'none';
      renderSupervisorDashboard();
    } else if (user.role === 'admin') {
      employeeDashboard.style.display = 'none';
      supervisorDashboard.style.display = 'none';
      adminDashboard.style.display = 'block';
      renderAdminDashboard();
    }
  } else {
    loginSection.style.display = 'block';
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
  const role = login(username, password);

  if (role) {
    renderDashboard();
  } else {
    alert('Invalid username or password');
  }
});

// Event listener for logout
document.addEventListener('click', event => {
  if (event.target.matches('#logout-btn')) {
    logout();
    renderDashboard();
  }
});

// Initial rendering of the dashboard or login section
renderDashboard();
