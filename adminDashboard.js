// Import necessary functions from other files
import { getUser, logout } from './auth.js';
import { addEmployee, updateEmployee, deleteEmployee, getEmployees } from './employeeManagement.js';
import { addActivityType, deleteActivityType, getActivityTypes } from './activityTypeManagement.js';
import { addJob, deleteJob, getJobs } from './jobManagement.js';

// Function to render admin dashboard
export function renderAdminDashboard() {
  try {
    const adminDashboard = document.getElementById('admin-dashboard');
    adminDashboard.innerHTML = `
      <div class="admin-header">
        <h2>Admin Dashboard</h2>
        <button id="logout-btn" class="btn">Logout</button>
      </div>
      
      <!-- Employee Management -->
      <div class="card">
        <h3>Employee Management</h3>
        <!-- ... -->
      </div>
      
      <!-- Activity Type Management -->
      <div class="card">
        <h3>Activity Type Management</h3>
        <!-- ... -->
      </div>
      
      <!-- Job Management -->
      <div class="card">
        <h3>Job Management</h3>
        <!-- ... -->
      </div>
      
      <!-- Notification Management -->
      <div class="card">
        <h3>Notification Management</h3>
        <!-- ... -->
      </div>
    `;

    const user = getUser();
    renderEmployeeTable();
    renderActivityTypeList();
    renderJobList();
    renderNotificationForm();

    // Event listener for employee form submission
    document.getElementById('employee-form').addEventListener('submit', handleEmployeeFormSubmit);

    // Event listener for activity type form submission
    document.getElementById('activity-type-form').addEventListener('submit', handleActivityTypeFormSubmit);

    // Event listener for job form submission
    document.getElementById('job-form').addEventListener('submit', handleJobFormSubmit);

    // Event listener for notification form submission
    document.getElementById('notification-form').addEventListener('submit', handleNotificationFormSubmit);

    // Event listener for logout button
    document.getElementById('logout-btn').addEventListener('click', logout);
  } catch (error) {
    console.error('Error rendering admin dashboard:', error);
  }
}

// Function to render employee table
function renderEmployeeTable() {
  try {
    const employeeTableBody = document.querySelector('#employee-table tbody');
    const employees = getEmployees();

    employeeTableBody.innerHTML = '';

    employees.forEach(employee => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.username}</td>
        <td>${employee.employeeId}</td>
        <td>${employee.role}</td>
        <td>${employee.state}</td>
        <td>
          <button class="btn btn-edit" data-id="${employee.id}">Edit</button>
          <button class="btn btn-delete" data-id="${employee.id}">Delete</button>
        </td>
      `;
      employeeTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error rendering employee table:', error);
  }
}

// Function to render activity type list
function renderActivityTypeList() {
  try {
    const activityTypeList = document.getElementById('activity-type-list');
    const activityTypes = getActivityTypes();

    activityTypeList.innerHTML = '';

    activityTypes.forEach(activityType => {
      const listItem = document.createElement('li');
      listItem.textContent = activityType.name;
      listItem.innerHTML += ` <button class="btn btn-delete" data-id="${activityType.id}">Delete</button>`;
      activityTypeList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error rendering activity type list:', error);
  }
}

// Function to render job list
function renderJobList() {
  try {
    const jobList = document.getElementById('job-list');
    const jobs = getJobs();

    jobList.innerHTML = '';

    jobs.forEach(job => {
      const listItem = document.createElement('li');
      listItem.textContent = job.name;
      listItem.innerHTML += ` <button class="btn btn-delete" data-id="${job.id}">Delete</button>`;
      jobList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error rendering job list:', error);
  }
}

// Function to render notification form
function renderNotificationForm() {
  try {
    // Add any necessary logic for rendering the notification form
  } catch (error) {
    console.error('Error rendering notification form:', error);
  }
}

// Function to handle employee form submission
function handleEmployeeFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('employee-name').value;
  const username = document.getElementById('employee-username').value;
  const password = document.getElementById('employee-password').value;
  const employeeId = document.getElementById('employee-id').value;
  const role = document.getElementById('employee-role').value;
  const state = document.getElementById('employee-state').value;

  const employee = {
    name,
    username,
    password,
    employeeId,
    role,
    state
  };

  addEmployee(employee);
  renderEmployeeTable();
  document.getElementById('employee-form').reset();
}

// Function to handle activity type form submission
function handleActivityTypeFormSubmit(event) {
  event.preventDefault();

  const activityTypeName = document.getElementById('activity-type-name').value;

  const activityType = {
    id: Date.now(),
    name: activityTypeName
  };

  addActivityType(activityType);
  renderActivityTypeList();
  document.getElementById('activity-type-form').reset();
}

// Function to handle job form submission
function handleJobFormSubmit(event) {
  event.preventDefault();

  const jobName = document.getElementById('job-name').value;

  const job = {
    id: Date.now(),
    name: jobName
  };

  addJob(job);
  renderJobList();
  document.getElementById('job-form').reset();
}

// Function to handle notification form submission
function handleNotificationFormSubmit(event) {
  event.preventDefault();

  const notificationInstance = document.getElementById('notification-instance').value;
  const notificationMessage = document.getElementById('notification-message').value;

  saveNotificationMessage(notificationInstance, notificationMessage);
  document.getElementById('notification-form').reset();
}

// Function to save notification message
function saveNotificationMessage(instance, message) {
  try {
    // Add logic to save the notification message
    console.log('Notification saved:', instance, message);
  } catch (error) {
    console.error('Error saving notification message:', error);
  }
}

// Function to get notification message
function getNotificationMessage(instance) {
  try {
    // Add logic to retrieve the notification message based on the instance
    return 'Sample notification message';
  } catch (error) {
    console.error('Error getting notification message:', error);
  }
}

// Function to handle logout
function handleLogout() {
  logout();
  // Redirect to the login page or perform any necessary actions
  window.location.href = '/';
}
