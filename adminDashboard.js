import { getUser, logout } from './auth.js';
import { addEmployee, updateEmployee, deleteEmployee, getEmployees } from './employeeManagement.js';
import { addActivityType, deleteActivityType, getActivityTypes } from './activityTypeManagement.js';
import { addJob, deleteJob, getJobs } from './jobManagement.js';

// Function to render admin dashboard
export function renderAdminDashboard() {
  const adminDashboard = document.getElementById('admin-dashboard');
  adminDashboard.innerHTML = `
    <div class="admin-header">
      <h2>Admin Dashboard</h2>
      <button id="logout-btn" class="btn">Logout</button>
    </div>
    
    <!-- Employee Management -->
    <div class="card">
      <h3>Employee Management</h3>
      <form id="employee-form">
        <label for="employee-name">Name:</label>
        <input type="text" id="employee-name" placeholder="Name" required>

        <label for="employee-username">Username:</label>
        <input type="text" id="employee-username" placeholder="Username" required>

        <label for="employee-password">Password:</label>
        <input type="password" id="employee-password" placeholder="Password" autocomplete="new-password" required>

        <label for="employee-id">Employee ID:</label>
        <input type="text" id="employee-id" placeholder="Employee ID" required>

        <label for="employee-role">Role:</label>
        <select id="employee-role" required>
          <option value="">Select Role</option>
          <option value="employee">Employee</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>

        <label for="employee-state">State:</label>
        <select id="employee-state" required>
          <option value="">Select State</option>
          <option value="California">California</option>
          <option value="Oregon">Oregon</option>
          <option value="Washington">Washington</option>
          <option value="Nevada">Nevada</option>
          <option value="Idaho">Idaho</option>
          <option value="Montana">Montana</option>
          <option value="Wyoming">Wyoming</option>
          <option value="Colorado">Colorado</option>
        </select>

        <button type="submit" class="btn">Add Employee</button>
      </form>

      <table id="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Employee ID</th>
            <th>Role</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    
    <!-- Activity Type Management -->
    <div class="card">
      <h3>Activity Type Management</h3>
      <form id="activity-type-form">
        <input type="text" id="activity-type-name" placeholder="Activity Type" required>
        <button type="submit" class="btn">Add Activity Type</button>
      </form>
      <ul id="activity-type-list"></ul>
    </div>
    
    <!-- Job Management -->
    <div class="card">
      <h3>Job Management</h3>
      <form id="job-form">
        <input type="text" id="job-name" placeholder="Job Name" required>
        <button type="submit" class="btn">Add Job</button>
      </form>
      <ul id="job-list"></ul>
    </div>
    
    <!-- Notification Management -->
    <div class="card">
      <h3>Notification Management</h3>
      <form id="notification-form">
        <label for="notification-instance">Notification Instance:</label>
        <input type="text" id="notification-instance" placeholder="Enter notification instance" required>
        
        <label for="notification-message">Notification Message:</label>
        <textarea id="notification-message" placeholder="Enter notification message" required></textarea>
        
        <button type="submit" class="btn">Save Notification</button>
      </form>
    </div>
    
    <!-- Employee Timecard Management -->
    <div class="card">
      <h3>Employee Timecard Management</h3>
      <table id="timecard-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Hours Worked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
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

// Function to fetch employee timecards
function fetchEmployeeTimecards() {
  // Fetch employee timecard data from the server or database
  // Update the timecard table with the fetched data
  // ...
}

// Function to approve timecard entry
function approveTimecardEntry(entryId) {
  // Update the timecard entry status to "approved"
  // ...
}

// Function to reject timecard entry
function rejectTimecardEntry(entryId) {
  // Update the timecard entry status to "rejected"
  // ...
}

// Other functions...
