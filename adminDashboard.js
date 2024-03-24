// Import necessary functions from other files
import { getUser } from './auth.js';
import { addEmployee, updateEmployee, deleteEmployee, getEmployees } from './employeeManagement.js';
import { addActivityType, deleteActivityType, getActivityTypes } from './activityTypeManagement.js';
import { addJob, deleteJob, getJobs } from './jobManagement.js';

// Function to render admin dashboard
export function renderAdminDashboard() {
  const adminDashboard = document.getElementById('admin-dashboard');
  adminDashboard.innerHTML = `
    <h2>Admin Dashboard</h2>
    
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
          <option value="supervisor">Supervisor</
