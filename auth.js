// auth.js

import { getStates as fetchStates } from './stateConfig.js';
import { users } from './userData.js';

export function login(username, password) {
  const user = users.find(user => user.username === username);
  console.log('User:', user); // Add this line
  if (user && verifyPassword(user.password, password)) {
    localStorage.setItem('user', JSON.stringify(user));
    console.log('User role:', user.role); // Add this line
    return user.role;
  } else {
    console.log('Login failed'); // Add this line
    return null;
  }
}

export function logout() {
  localStorage.removeItem('user');
}

export function isAuthenticated() {
  return localStorage.getItem('user') !== null;
}

export function getUser() {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

export function getStates() {
  return fetchStates();
}

// Function to verify password (placeholder for demonstration purposes)
function verifyPassword(storedPassword, enteredPassword) {
  // Replace this with your own password verification logic
  // For example, you can compare the hashed and salted passwords
  return storedPassword === enteredPassword;
}
