// app.js

import { isAuthenticated, getUser, login, logout } from './auth.js';
import { renderEmployeeDashboard } from './dashboards/employeeDashboard.js';
import { renderSupervisorDashboard } from './dashboards/supervisorDashboard.js';
import { renderAdminDashboard } from './dashboards/adminDashboard.js';
import { Calendar } from './calendarFunctions.js';

const loginSection = document.getElementById('login-section');
const employeeDashboard = document.getElementById('employee-dashboard');
const supervisorDashboard = document.getElementById('supervisor-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');

// Function to render the appropriate dashboard based on user role
function renderDashboard(userRole) {
  if (!loginSection || !employeeDashboard || !supervisorDashboard || !adminDashboard) {
    console.error('Required elements not found in the DOM');
    return;
  }

  loginSection.style.display = 'none';
  employeeDashboard.style.display = 'none';
  supervisorDashboard.style.display = 'none';
  adminDashboard.style.display = 'none';

  switch (userRole) {
    case 'employee':
      employeeDashboard.style.display = 'block';
      renderEmployeeDashboard();
      break;
    case 'supervisor':
      supervisorDashboard.style.display = 'block';
      renderSupervisorDashboard();
      break;
    case 'admin':
      adminDashboard.style.display = 'block';
      renderAdminDashboard();
      break;
    default:
      loginSection.style.display = 'block';
      // Clear the password field
      document.getElementById('password').value = '';
      break;
  }
}

// Function to handle login form submission
function handleLoginFormSubmit(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  console.log('Username:', username);
  console.log('Password:', password);

  const userRole = login(username, password);
  console.log('User role after login:', userRole);

  if (userRole) {
    renderDashboard(userRole);
  } else {
    alert('Invalid username or password');
    // Clear the password field
    document.getElementById('password').value = '';
  }
}

// Function to handle logout
function handleLogout() {
  logout();
  renderDashboard(null);
}

// Function to initialize the app
function initializeApp() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginFormSubmit);
  } else {
    console.error('Login form not found in the DOM');
  }

  const logoutButtons = document.querySelectorAll('.logout-btn');
  logoutButtons.forEach(button => {
    button.addEventListener('click', handleLogout);
  });

  console.log('Is authenticated:', isAuthenticated());
  if (isAuthenticated()) {
    const user = getUser();
    console.log('User object:', user);
    console.log('User role:', user && user.role);
    if (user && user.role) {
      renderDashboard(user.role);
    } else {
      logout();
      renderDashboard(null);
    }
  } else {
    console.log('User not authenticated');
    renderDashboard(null);
  }

  // Calendar updates
  const calendarContainer = document.getElementById('calendar-container');
  const currentDate = new Date();
  const payPeriodStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const payPeriodEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  if (calendarContainer) {
    new Calendar(calendarContainer, payPeriodStartDate, payPeriodEndDate);
  } else {
    console.error('Calendar container not found');
  }
}

// Initialize the app
initializeApp();
