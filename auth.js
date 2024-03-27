const users = [
  { id: 1, username: 'employee1', password: 'password1', role: 'employee', name: 'John Doe' },
  { id: 2, username: 'admin1', password: 'password2', role: 'admin', name: 'Jane Smith' },
  { id: 3, username: 'supervisor1', password: 'password3', role: 'supervisor', name: 'Mike Johnson' },
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
