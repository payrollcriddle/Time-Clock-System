import { getUser, logout } from './auth.js';
import { getEmployees } from './employeeManagement.js';
import { getTimecard } from './timecard.js';

// Function to render supervisor dashboard
export function renderSupervisorDashboard() {
  const supervisorDashboard = document.getElementById('supervisor-dashboard');
  supervisorDashboard.innerHTML = `
    <div class="supervisor-header">
      <h2>Supervisor Dashboard</h2>
      <button id="logout-btn" class="btn">Logout</button>
    </div>
    
    <!-- Employee Timecard Review -->
    <div class="card">
      <h3>Employee Timecard Review</h3>
      <table id="employee-timecard-table">
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
    
    <!-- Employee Performance Reports -->
    <div class="card">
      <h3>Employee Performance Reports</h3>
      <select id="employee-select">
        <option value="">Select Employee</option>
      </select>
      <button id="generate-report-btn" class="btn">Generate Report</button>
      <div id="performance-report"></div>
    </div>
  `;

  const user = getUser();
  populateEmployeeSelect();
  fetchEmployeeTimecards();

  document.getElementById('generate-report-btn').addEventListener('click', generatePerformanceReport);

  document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
    window.location.href = '/';
  });
}

// Function to populate employee select dropdown
function populateEmployeeSelect() {
  const employeeSelect = document.getElementById('employee-select');
  const employees = getEmployees();

  employees.forEach(employee => {
    const option = document.createElement('option');
    option.value = employee.id;
    option.textContent = employee.name;
    employeeSelect.appendChild(option);
  });
}

// Function to fetch employee timecards
function fetchEmployeeTimecards() {
  const employeeTimecardTable = document.getElementById('employee-timecard-table');
  const employees = getEmployees();

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
          <button class="btn btn-approve">Approve</button>
          <button class="btn btn-reject">Reject</button>
        </td>
      `;
      employeeTimecardTable.appendChild(row);
    });
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

// Function to generate performance report
function generatePerformanceReport() {
  const employeeSelect = document.getElementById('employee-select');
  const employeeId = employeeSelect.value;
  const performanceReport = document.getElementById('performance
