import { getUser, logout } from '../auth.js';
import { addEmployee, updateEmployee, deleteEmployee, getEmployees } from '../management/employeeManagement.js';
import { addActivityType, deleteActivityType, getActivityTypes } from '../management/activityTypeManagement.js';
import { addJob, deleteJob, getJobs } from '../management/jobManagement.js';
import { getTimecard, approveTimecardEntry, rejectTimecardEntry } from '../timecard.js';

// Function to render admin dashboard
export function renderAdminDashboard() {
  const adminDashboard = document.getElementById('admin-dashboard');
  if (!adminDashboard) {
    console.error('Admin dashboard element not found');
    return;
  }

  adminDashboard.innerHTML = `
    <!-- ... (HTML code for admin dashboard) -->
  `;

  const user = getUser();
  renderEmployeeTable();
  renderActivityTypeList();
  renderJobList();
  renderNotificationForm();
  fetchEmployeeTimecards();

  const employeeForm = document.getElementById('employee-form');
  const activityTypeForm = document.getElementById('activity-type-form');
  const jobForm = document.getElementById('job-form');
  const notificationForm = document.getElementById('notification-form');
  const logoutButton = document.getElementById('admin-logout-btn');

  if (employeeForm) {
    employeeForm.addEventListener('submit', handleEmployeeFormSubmit);
  }
  if (activityTypeForm) {
    activityTypeForm.addEventListener('submit', handleActivityTypeFormSubmit);
  }
  if (jobForm) {
    jobForm.addEventListener('submit', handleJobFormSubmit);
  }
  if (notificationForm) {
    notificationForm.addEventListener('submit', handleNotificationFormSubmit);
  }
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
}

// Function to handle logout
function handleLogout() {
  logout();
  window.location.href = '/';
}

// Function to render employee table
function renderEmployeeTable() {
  const employeeTableBody = document.querySelector('#employee-table tbody');
  if (!employeeTableBody) {
    console.error('Employee table body not found');
    return;
  }

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
  const editButtons = employeeTableBody.querySelectorAll('.btn-edit');
  const deleteButtons = employeeTableBody.querySelectorAll('.btn-delete');

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
  if (!activityTypeList) {
    console.error('Activity type list element not found');
    return;
  }

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
  if (!jobList) {
    console.error('Job list element not found');
    return;
  }

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
async function fetchEmployeeTimecards() {
  const timecardTableBody = document.querySelector('#timecard-table tbody');
  if (!timecardTableBody) {
    console.error('Timecard table body not found');
    return;
  }

  const employees = getEmployees();

  timecardTableBody.innerHTML = '';

  for (const employee of employees) {
    const timecard = await getTimecard(employee.id, 'admin'); // Pass 'admin' as the user role

    if (timecard && timecard.entries) {
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
    }
  }

  // Add event listeners for approve and reject buttons
  const approveButtons = timecardTableBody.querySelectorAll('.btn-approve');
  const rejectButtons = timecardTableBody.querySelectorAll('.btn-reject');

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
async function handleEmployeeFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('employee-name');
  const usernameInput = document.getElementById('employee-username');
  const passwordInput = document.getElementById('employee-password');
  const employeeIdInput = document.getElementById('employee-id');
  const roleSelect = document.getElementById('employee-role');
  const stateSelect = document.getElementById('employee-state');

  if (!nameInput || !usernameInput || !passwordInput || !employeeIdInput || !roleSelect || !stateSelect) {
    console.error('Required form elements not found');
    return;
  }

  const name = nameInput.value;
  const username = usernameInput.value;
  const password = passwordInput.value;
  const employeeId = employeeIdInput.value;
  const role = roleSelect.value;
  const state = stateSelect.value;

  try {
    await addEmployee(name, username, password, employeeId, role, state);
    nameInput.value = '';
    usernameInput.value = '';
    passwordInput.value = '';
    employeeIdInput.value = '';
    roleSelect.value = '';
    stateSelect.value = '';
    renderEmployeeTable();
  } catch (error) {
    console.error('Failed to add employee:', error);
    // Display an error message to the user
  }
}

// Event handler for activity type form submit
async function handleActivityTypeFormSubmit(event) {
  event.preventDefault();

  const activityTypeNameInput = document.getElementById('activity-type-name');
  if (!activityTypeNameInput) {
    console.error('Activity type name input not found');
    return;
  }

  const activityTypeName = activityTypeNameInput.value;

  try {
    await addActivityType(activityTypeName);
    activityTypeNameInput.value = '';
    renderActivityTypeList();
  } catch (error) {
    console.error('Failed to add activity type:', error);
    // Display an error message to the user
  }
}

// Event handler for job form submit
async function handleJobFormSubmit(event) {
  event.preventDefault();

  const jobNameInput = document.getElementById('job-name');
  const jobDescriptionInput = document.getElementById('job-description');

  if (!jobNameInput || !jobDescriptionInput) {
    console.error('Required job form elements not found');
    return;
  }

  const job = {
    name: jobNameInput.value,
    description: jobDescriptionInput.value,
  };

  try {
    await addJob(job);
    jobNameInput.value = '';
    jobDescriptionInput.value = '';
    renderJobList();
  } catch (error) {
    console.error('Failed to add job:', error);
    // Display an error message to the user
  }
}

// Event handler for notification form submit
function handleNotificationFormSubmit(event) {
  event.preventDefault();

  const notificationInstanceInput = document.getElementById('notification-instance');
  const notificationMessageInput = document.getElementById('notification-message');

  if (!notificationInstanceInput || !notificationMessageInput) {
    console.error('Required notification form elements not found');
    return;
  }

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
async function handleDeleteEmployee(event) {
  const employeeId = event.target.dataset.id;

  try {
    await deleteEmployee(employeeId);
    renderEmployeeTable();
  } catch (error) {
    console.error('Failed to delete employee:', error);
    // Display an error message to the user
  }
}

// Event handler for delete activity type button click
async function handleDeleteActivityType(activityTypeId) {
  try {
    await deleteActivityType(activityTypeId);
    renderActivityTypeList();
  } catch (error) {
    console.error('Failed to delete activity type:', error);
    // Display an error message to the user
  }
}

// Event handler for delete job button click
async function handleDeleteJob(jobId) {
  try {
    const deletedJob = await deleteJob(jobId);
    if (deletedJob) {
      renderJobList();
    } else {
      console.error('Failed to delete job. Job not found.');
      // Display an error message to the user
    }
  } catch (error) {
    console.error('Failed to delete job:', error);
    // Display an error message to the user
  }
}

// Event handler for approve timecard entry button click
async function handleApproveTimecardEntry(event) {
  const entryId = event.target.dataset.id;

  try {
    await approveTimecardEntry(entryId);
    fetchEmployeeTimecards();
  } catch (error) {
    console.error('Failed to approve timecard entry:', error);
    // Display an error message to the user
  }
}

// Event handler for reject timecard entry button click
async function handleRejectTimecardEntry(event) {
  const entryId = event.target.dataset.id;

  try {
    await rejectTimecardEntry(entryId);
    fetchEmployeeTimecards();
  } catch (error) {
    console.error('Failed to reject timecard entry:', error);
    // Display an error message to the user
  }
}
