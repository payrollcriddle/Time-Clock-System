import { getUser, logout } from './auth.js';

export function renderSupervisorDashboard() {
  const supervisorDashboard = document.getElementById('supervisor-dashboard');
  supervisorDashboard.innerHTML = `
    <div class="dashboard-header">
      <h2>Supervisor Dashboard</h2>
      <button id="logout-btn" class="btn">Logout</button>
    </div>
    
    <!-- Timecard Review and Approval -->
    <div class="card">
      <h3>Timecard Review and Approval</h3>
      <table id="timecard-review-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;

  fetchTimecardsForReview();

  document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
    window.location.href = '/';
  });
}

function fetchTimecardsForReview() {
  // Fetch timecards for review from the server or database
  // Update the table with the fetched data
}
