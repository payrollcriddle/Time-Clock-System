// app.js

import { isAuthenticated, getUser, login, logout } from './auth.js';
import { renderEmployeeDashboard } from './dashboards/employeeDashboard.js';
import { renderSupervisorDashboard } from './dashboards/supervisorDashboard.js';
import { renderAdminDashboard } from './dashboards/adminDashboard.js';

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
    renderDashboard(null);
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

  if (isAuthenticated()) {
    const user = getUser();
    if (user && user.role) {
      renderDashboard(user.role);
    } else {
      logout();
      renderDashboard(null);
    }
  } else {
    renderDashboard(null);
  }
}

// Initialize the app
initializeApp();
