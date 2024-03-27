const users = [
  { id: 1, username: 'employee1', password: 'password1', role: 'employee' },
  { id: 2, username: 'admin1', password: 'password2', role: 'admin' },
  { id: 3, username: 'supervisor1', password: 'password3', role: 'supervisor' },
];

export function login(username, password) {
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    return user.role;
  } else {
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
