import { isAuthenticated, getUser, login, logout } from './auth.js';
import { renderEmployeeDashboard } from './employeeDashboard.js';
import { renderSupervisorDashboard } from './supervisorDashboard.js';
import { renderAdminDashboard } from './adminDashboard.js';

const loginSection = document.getElementById('login-section');
const employeeDashboard = document.getElementById('employee-dashboard');
const supervisorDashboard = document.getElementById('supervisor-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');

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

document.getElementById('login-form').addEventListener('submit', function(event) {
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

if (isAuthenticated()) {
  const user = getUser();
  renderDashboard(user.role);
} else {
  loginSection.style.display = 'block';
}

// Logout functionality
const logoutButtons = document.querySelectorAll('#logout-btn');
logoutButtons.forEach(button => {
  button.addEventListener('click', function() {
    logout();
    window.location.href = '/';
  });
});

// Function to handle unauthorized access
function handleUnauthorizedAccess() {
  alert('Unauthorized access. Please login with the appropriate role.');
  logout();
  window.location.href = '/';
}

// Check user role and handle unauthorized access
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
