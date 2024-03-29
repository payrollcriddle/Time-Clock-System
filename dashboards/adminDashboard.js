import { getUser, logout } from './auth.js';
import { addEmployee, updateEmployee, deleteEmployee, getEmployees } from '../management/employeeManagement.js';
import { addActivityType, deleteActivityType, getActivityTypes } from '../management/activityTypeManagement.js';
import { addJob, deleteJob, getJobs } from '../management/jobManagement.js';
import { getTimecard, approveTimecardEntry, rejectTimecardEntry } from './timecard.js';

// Function to render admin dashboard
export function renderAdminDashboard() {
  const adminDashboard = document.getElementById('admin-dashboard');
  adminDashboard.innerHTML = `
    <!-- ... (HTML code for admin dashboard) -->
  `;

  const user = getUser();
  renderEmployeeTable();
  renderActivityTypeList();
  renderJobList();
  renderNotificationForm();
  fetchEmployeeTimecards();

  document.getElementById('employee-form').addEventListener('submit', handleEmployeeFormSubmit);
  document.getElementById('activity-type-form').addEventListener('submit', handleActivityTypeFormSubmit);
  document.getElementById('job-form').addEventListener('submit', handleJobFormSubmit);
  document.getElementById('notification-form').addEventListener('submit', handleNotificationFormSubmit);

  document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
    window.location.href = '/';
  });
}

// Function to render employee table
function renderEmployeeTable() {
  const employeeTableBody = document.querySelector('#employee-table tbody');
  const employees = getEmployees();

  employeeTableBody.innerHTML = '';

  employees.forEach(employee => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.username}</td>
      <td>${employee.id}</td>
      <td>${employee.role}</td>
      <td>${employee.state}</td>
      <td>
        <button class="btn btn-edit" data-id="${employee.id}">Edit</button>
        <button class="btn btn-delete" data-id="${employee.id}">Delete</button>
      </td>
    `;
    employeeTableBody.appendChild(row);
  });

  // Add event listeners for edit and delete buttons
  const editButtons = document.querySelectorAll('.btn-edit');
  const deleteButtons = document.querySelectorAll('.btn-delete');

  editButtons.forEach(button => {
    button.addEventListener('click', handleEditEmployee);
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', handleDeleteEmployee);
  });
}

// Function to render activity type list
function renderActivityTypeList() {
  const activityTypeList = document.getElementById('activity-type-list');
  const activityTypes = getActivityTypes();

  activityTypeList.innerHTML = '';

  activityTypes.forEach(activityType => {
    const listItem = document.createElement('li');
    listItem.textContent = activityType.name;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-delete');
    deleteButton.addEventListener('click', () => handleDeleteActivityType(activityType.id));

    listItem.appendChild(deleteButton);
    activityTypeList.appendChild(listItem);
  });
}

// Function to render job list
function renderJobList() {
  const jobList = document.getElementById('job-list');
  const jobs = getJobs();

  jobList.innerHTML = '';

  jobs.forEach(job => {
    const listItem = document.createElement('li');
    listItem.textContent = job.name;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-delete');
    deleteButton.addEventListener('click', () => handleDeleteJob(job.id));

    listItem.appendChild(deleteButton);
    jobList.appendChild(listItem);
  });
}

// Function to render notification form
function renderNotificationForm() {
  // Implement the logic to render the notification form
  // You can fetch existing notifications from the server or database and populate the form fields
  // ...
}

// Function to fetch employee timecards
function fetchEmployeeTimecards() {
  const timecardTableBody = document.querySelector('#timecard-table tbody');
  const employees = getEmployees();

  timecardTableBody.innerHTML = '';

  employees.forEach(employee => {
    const timecard = getTimecard(employee.id);

    timecard.entries.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${employee.name}</td>
        <td>${new Date(entry.startTime).toLocaleDateString()}</td>
        <td>${new Date(entry.startTime).toLocaleTimeString()}</td>
        <td>${entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : '-'}</td>
        <td>${calculateEntryDuration(entry)}</td>
        <td>
          <button class="btn btn-approve" data-id="${entry.id}">Approve</button>
          <button class="btn btn-reject" data-id="${entry.id}">Reject</button>
        </td>
      `;
      timecardTableBody.appendChild(row);
    });
  });

  // Add event listeners for approve and reject buttons
  const approveButtons = document.querySelectorAll('.btn-approve');
  const rejectButtons = document.querySelectorAll('.btn-reject');

  approveButtons.forEach(button => {
    button.addEventListener('click', handleApproveTimecardEntry);
  });

  rejectButtons.forEach(button => {
    button.addEventListener('click', handleRejectTimecardEntry);
  });
}

// Function to calculate entry duration in hours
function calculateEntryDuration(entry) {
  if (entry.endTime) {
    const startTime = new Date(entry.startTime);
    const endTime = new Date(entry.endTime);
    const duration = (endTime - startTime) / 3600000; // Convert milliseconds to hours
    return duration.toFixed(2);
  }
  return '-';
}

// Event handler for employee form submit
function handleEmployeeFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('employee-name');
  const usernameInput = document.getElementById('employee-username');
  const passwordInput = document.getElementById('employee-password');
  const employeeIdInput = document.getElementById('employee-id');
  const roleSelect = document.getElementById('employee-role');
  const stateSelect = document.getElementById('employee-state');

  const name = nameInput.value;
  const username = usernameInput.value;
  const password = passwordInput.value;
  const employeeId = employeeIdInput.value;
  const role = roleSelect.value;
  const state = stateSelect.value;

  addEmployee(name, username, password, employeeId, role, state);

  nameInput.value = '';
  usernameInput.value = '';
  passwordInput.value = '';
  employeeIdInput.value = '';
  roleSelect.value = '';
  stateSelect.value = '';

  renderEmployeeTable();
}

// Event handler for activity type form submit
function handleActivityTypeFormSubmit(event) {
  event.preventDefault();

  const activityTypeNameInput = document.getElementById('activity-type-name');
  const activityTypeName = activityTypeNameInput.value;

  addActivityType(activityTypeName);

  activityTypeNameInput.value = '';

  renderActivityTypeList();
}

// Event handler for job form submit
function handleJobFormSubmit(event) {
  event.preventDefault();

  const jobNameInput = document.getElementById('job-name');
  const jobName = jobNameInput.value;

  addJob(jobName);

  jobNameInput.value = '';

  renderJobList();
}

// Event handler for notification form submit
function handleNotificationFormSubmit(event) {
  event.preventDefault();

  const notificationInstanceInput = document.getElementById('notification-instance');
  const notificationMessageInput = document.getElementById('notification-message');

  const notificationInstance = notificationInstanceInput.value;
  const notificationMessage = notificationMessageInput.value;

  // Implement the logic to save the notification
  // You can send the notification data to the server or store it in the database
  // ...

  notificationInstanceInput.value = '';
  notificationMessageInput.value = '';
}

// Event handler for edit employee button click
function handleEditEmployee(event) {
  const employeeId = event.target.dataset.id;

  // Implement the logic to populate the employee form with the selected employee's data
  // You can fetch the employee details from the server or retrieve it from the client-side data
  // ...

  // Show the employee form in edit mode
  // ...
}

// Event handler for delete employee button click
function handleDeleteEmployee(event) {
  const employeeId = event.target.dataset.id;

  deleteEmployee(employeeId);

  renderEmployeeTable();
}

// Event handler for delete activity type button click
function handleDeleteActivityType(activityTypeId) {
  deleteActivityType(activityTypeId);

  renderActivityTypeList();
}

// Event handler for delete job button click
function handleDeleteJob(jobId) {
  deleteJob(jobId);

  renderJobList();
}

// Event handler for approve timecard entry button click
function handleApproveTimecardEntry(event) {
  const entryId = event.target.dataset.id;

  approveTimecardEntry(entryId);

  fetchEmployeeTimecards();
}

// Event handler for reject timecard entry button click
function handleRejectTimecardEntry(event) {
  const entryId = event.target.dataset.id;

  rejectTimecardEntry(entryId);

  fetchEmployeeTimecards();
}
