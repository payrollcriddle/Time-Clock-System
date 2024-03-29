import { getUser, logout } from '../auth.js';
import { getEmployees } from '../management/employeeManagement.js';
import { getTimecard, approveTimecardEntry, rejectTimecardEntry } from '../timecard.js';

// Function to render supervisor dashboard
export function renderSupervisorDashboard() {
  const supervisorDashboard = document.getElementById('supervisor-dashboard');
  supervisorDashboard.innerHTML = `
    <!-- ... (HTML code for supervisor dashboard) -->
  `;

  const user = getUser();
  populateEmployeeSelect();
  fetchEmployeeTimecards();

  document.getElementById('generate-report-btn').addEventListener('click', generatePerformanceReport);

  // Updated event listener to target the correct ID for the logout button
  document.getElementById('supervisor-logout-btn').addEventListener('click', () => {
    logout();
    window.location.href = '/';
  });
}

// Function to populate employee select dropdown
function populateEmployeeSelect() {
  const employeeSelect = document.getElementById('employee-select');
  const employees = getEmployees();

  employeeSelect.innerHTML = '<option value="">Select Employee</option>';

  employees.forEach(employee => {
    const option = document.createElement('option');
    option.value = employee.id;
    option.textContent = employee.name;
    employeeSelect.appendChild(option);
  });
}

// Function to fetch employee timecards
function fetchEmployeeTimecards() {
  const employeeTimecardTableBody = document.querySelector('#employee-timecard-table tbody');
  const employees = getEmployees();

  employeeTimecardTableBody.innerHTML = '';

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
      employeeTimecardTableBody.appendChild(row);
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

// Function to generate performance report
function generatePerformanceReport() {
  const employeeSelect = document.getElementById('employee-select');
  const employeeId = employeeSelect.value;
  const performanceReportElement = document.getElementById('performance-report');

  if (employeeId) {
    const employee = getEmployees().find(emp => emp.id === employeeId);
    const timecard = getTimecard(employeeId);

    // Implement the logic to generate the performance report based on the employee's timecard data
    // You can calculate metrics like total hours worked, average daily hours, etc.
    // ...

    performanceReportElement.innerHTML = `
      <h4>Performance Report for ${employee.name}</h4>
      <!-- Display the generated performance report data -->
    `;
  } else {
    performanceReportElement.textContent = 'Please select an employee to generate the performance report.';
  }
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
