// auth.js

// Simulate user data retrieval from a database or API
const users = [
  { id: 1, username: 'employee1', password: 'password1', role: 'employee' },
  { id: 2, username: 'admin1', password: 'password2', role: 'admin' },
  { id: 3, username: 'supervisor1', password: 'password3', role: 'supervisor' },
];

// Function to handle user login
export function login(username, password) {
  console.log('Inside login function'); // Add this line
  console.log('Username:', username); // Add this line
  console.log('Password:', password); // Add this line

  // Find the user with the provided username and password
  const user = users.find(user => user.username === username && user.password === password);

  console.log('User:', user); // Add this line

  if (user) {
    // Store the user object in local storage or session storage
    localStorage.setItem('user', JSON.stringify(user));
    return user.role;
  } else {
    return null;
  }
}

// Function to handle user logout
export function logout() {
  // Remove the user object from local storage or session storage
  localStorage.removeItem('user');
}

// Function to check if the user is authenticated
export function isAuthenticated() {
  // Check if the user object exists in local storage or session storage
  return localStorage.getItem('user') !== null;
}

// Function to get the authenticated user
export function getUser() {
  // Retrieve the user object from local storage or session storage
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}
