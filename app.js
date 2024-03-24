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

// Event listener for login form submission
loginForm.addEventListener('submit', event => {
  event.preventDefault();
  console.log('Login form submitted');

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const userRole = login(username, password);

  if (userRole) {
    console.log('User role:', userRole);
    loginSection.style.display = 'none';
    console.log('Login section hidden');

    if (userRole === 'employee') {
      console.log('Rendering employee dashboard');
      employeeDashboard.style.display = 'block';
      renderEmployeeDashboard();
    } else if (userRole === 'supervisor') {
      console.log('Rendering supervisor dashboard');
      supervisorDashboard.style.display = 'block';
      renderSupervisorDashboard();
    } else if (userRole === 'admin') {
      console.log('Rendering admin dashboard');
      adminDashboard.style.display = 'block';
      renderAdminDashboard();
    }
  } else {
    alert('Invalid username or password');
  }
});
