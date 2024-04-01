// adminDashboard.js

import { getUser, logout } from '../auth.js';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../management/employeeManagement.js';
import { getActivityTypes, createActivityType, updateActivityType, deleteActivityType } from '../management/activityTypeManagement.js';
import { getJobs, addJob, updateJob, deleteJob } from '../management/jobManagement.js';

// Function to render admin dashboard
export function renderAdminDashboard() {
  // Wait for the DOM content to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    const adminDashboard = document.getElementById('admin-dashboard');
    if (!adminDashboard) {
      console.error('Admin dashboard element not found');
      return;
    }

    adminDashboard.innerHTML = `
      <!-- ... (HTML code for admin dashboard) -->
    `;

    const user = getUser();
    fetchEmployees();
    fetchActivityTypes();
    fetchJobs();

    const createEmployeeForm = document.getElementById('create-employee-form');
    if (createEmployeeForm) {
      createEmployeeForm.addEventListener('submit', handleCreateEmployee);
    }

    const createActivityTypeForm = document.getElementById('create-activity-type-form');
    if (createActivityTypeForm) {
      createActivityTypeForm.addEventListener('submit', handleCreateActivityType);
    }

    const createJobForm = document.getElementById('create-job-form');
    if (createJobForm) {
      createJobForm.addEventListener('submit', handleCreateJob);
    }

    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  });
}

// Function to handle logout
function handleLogout() {
  logout();
  window.location.href = '/';
}

// Function to fetch employees
function fetchEmployees() {
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
      <td>${employee.email}</td>
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

// Function to fetch activity types
function fetchActivityTypes() {
  const activityTypeTableBody = document.querySelector('#activity-type-table tbody');
  if (!activityTypeTableBody) {
    console.error('Activity type table body not found');
    return;
  }

  const activityTypes = getActivityTypes();

  activityTypeTableBody.innerHTML = '';

  activityTypes.forEach(activityType => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${activityType.name}</td>
      <td>
        <button class="btn btn-edit" data-id="${activityType.id}">Edit</button>
        <button class="btn btn-delete" data-id="${activityType.id}">Delete</button>
      </td>
    `;
    activityTypeTableBody.appendChild(row);
  });

  // Add event listeners for edit and delete buttons
  const editButtons = document.querySelectorAll('.btn-edit');
  const deleteButtons = document.querySelectorAll('.btn-delete');

  editButtons.forEach(button => {
    button.addEventListener('click', handleEditActivityType);
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', handleDeleteActivityType);
  });
}

// Function to fetch jobs
function fetchJobs() {
  const jobTableBody = document.querySelector('#job-table tbody');
  if (!jobTableBody) {
    console.error('Job table body not found');
    return;
  }

  const jobs = getJobs();

  jobTableBody.innerHTML = '';

  jobs.forEach(job => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${job.name}</td>
      <td>
        <button class="btn btn-edit" data-id="${job.id}">Edit</button>
        <button class="btn btn-delete" data-id="${job.id}">Delete</button>
      </td>
    `;
    jobTableBody.appendChild(row);
  });

  // Add event listeners for edit and delete buttons
  const editButtons = document.querySelectorAll('.btn-edit');
  const deleteButtons = document.querySelectorAll('.btn-delete');

  editButtons.forEach(button => {
    button.addEventListener('click', handleEditJob);
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', handleDeleteJob);
  });
}

// Event handler for create employee form submission
function handleCreateEmployee(event) {
  event.preventDefault();

  const nameInput = document.getElementById('employee-name-input');
  const emailInput = document.getElementById('employee-email-input');

  if (nameInput && emailInput) {
    const name = nameInput.value;
    const email = emailInput.value;

    const newEmployee = addEmployee(name, email);
    if (newEmployee) {
      fetchEmployees();
      nameInput.value = '';
      emailInput.value = '';
    }
  }
}

// Event handler for create activity type form submission
function handleCreateActivityType(event) {
  event.preventDefault();

  const nameInput = document.getElementById('activity-type-name-input');

  if (nameInput) {
    const name = nameInput.value;

    const newActivityType = createActivityType(name);
    if (newActivityType) {
      fetchActivityTypes();
      nameInput.value = '';
    }
  }
}

// Event handler for create job form submission
function handleCreateJob(event) {
  event.preventDefault();

  const nameInput = document.getElementById('job-name-input');

  if (nameInput) {
    const name = nameInput.value;

    const newJob = addJob(name);
    if (newJob) {
      fetchJobs();
      nameInput.value = '';
    }
  }
}

// Event handler for edit employee button click
function handleEditEmployee(event) {
  const employeeId = event.target.dataset.id;

  // Implement the logic to edit the employee using the employeeId
  // You can prompt the user for updated employee details and call the updateEmployee function
  // ...

  fetchEmployees();
}

// Event handler for delete employee button click
function handleDeleteEmployee(event) {
  const employeeId = event.target.dataset.id;

  if (deleteEmployee(employeeId)) {
    fetchEmployees();
  }
}

// Event handler for edit activity type button click
function handleEditActivityType(event) {
  const activityTypeId = event.target.dataset.id;

  // Implement the logic to edit the activity type using the activityTypeId
  // You can prompt the user for updated activity type details and call the updateActivityType function
  // ...

  fetchActivityTypes();
}

// Event handler for delete activity type button click
function handleDeleteActivityType(event) {
  const activityTypeId = event.target.dataset.id;

  if (deleteActivityType(activityTypeId)) {
    fetchActivityTypes();
  }
}

// Event handler for edit job button click
function handleEditJob(event) {
  const jobId = event.target.dataset.id;

  // Implement the logic to edit the job using the jobId
  // You can prompt the user for updated job details and call the updateJob function
  // ...

  fetchJobs();
}

// Event handler for delete job button click
function handleDeleteJob(event) {
  const jobId = event.target.dataset.id;

  if (deleteJob(jobId)) {
    fetchJobs();
  }
}

