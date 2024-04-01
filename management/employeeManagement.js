// employeeManagement.js

import { users } from '../userData.js';

// Function to add a new employee
export function addEmployee(employee) {
  // Validate employee data
  if (!employee.name || !employee.email || !employee.state) {
    throw new Error('Employee name, email, and state are required');
  }

  // Generate a new employee ID
  const newEmployeeId = Math.max(...users.map(user => user.id)) + 1;

  // Create a new employee object
  const newEmployee = {
    id: newEmployeeId,
    username: `employee${newEmployeeId}`,
    password: `password${newEmployeeId}`,
    role: 'employee',
    name: employee.name,
    email: employee.email,
    state: employee.state
  };

  // Add the new employee to the users array
  users.push(newEmployee);

  return newEmployee;
}

// Function to update an employee
export function updateEmployee(employee) {
  // Validate employee data
  if (!employee.id || !employee.name || !employee.email || !employee.state) {
    throw new Error('Employee ID, name, email, and state are required');
  }

  // Find the index of the employee in the users array
  const employeeIndex = users.findIndex(user => user.id === employee.id);

  if (employeeIndex !== -1) {
    // Update the employee data
    users[employeeIndex] = {
      ...users[employeeIndex],
      name: employee.name,
      email: employee.email,
      state: employee.state
    };

    return users[employeeIndex];
  } else {
    throw new Error(`Employee with ID ${employee.id} not found`);
  }
}

// Function to delete an employee
export function deleteEmployee(employeeId) {
  // Validate employee ID
  if (!employeeId) {
    throw new Error('Employee ID is required');
  }

  // Find the index of the employee in the users array
  const employeeIndex = users.findIndex(user => user.id === employeeId);

  if (employeeIndex !== -1) {
    // Remove the employee from the users array
    users.splice(employeeIndex, 1);
    return true;
  } else {
    throw new Error(`Employee with ID ${employeeId} not found`);
  }
}

// Function to get all employees
export function getEmployees() {
  // Filter and return only the employee users
  return users.filter(user => user.role === 'employee');
}
