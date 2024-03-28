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
  const userRole = login(username, password);

  if (userRole) {
    renderDashboard(userRole);
  } else {
    alert('Invalid username or password');
  }
}

// Function to handle logout
function handleLogout() {
  logout();
  renderDashboard(null);
}

// Function to initialize the app
function initializeApp() {
  if (isAuthenticated()) {
    const user = getUser();
    renderDashboard(user.role);
  } else {
    renderDashboard(null);
  }

  document.getElementById('login-form').addEventListener('submit', handleLoginFormSubmit);

  const logoutButtons = document.querySelectorAll('#logout-btn');
  logoutButtons.forEach(button => {
    button.addEventListener('click', handleLogout);
  });
}

// Function to handle unauthorized access
function handleUnauthorizedAccess() {
  alert('Unauthorized access. Please login with the appropriate role.');
  logout();
  renderDashboard(null);
}

// Function to check user role and handle unauthorized access
function checkUserRole(allowedRoles) {
  const user = getUser();
  if (!user || !allowedRoles.includes(user.role)) {
    handleUnauthorizedAccess();
  }
}

// Check user role for each dashboard
if (employeeDashboard) {
  checkUserRole(['employee']);
}

if (supervisorDashboard) {
  checkUserRole(['supervisor']);
}

if (adminDashboard) {
  checkUserRole(['admin']);
}

// Initialize the app
initializeApp();
