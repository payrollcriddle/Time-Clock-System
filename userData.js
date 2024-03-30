// userData.js

export const users = [
  { id: 1, username: 'employee1', password: 'password1', role: 'employee', name: 'John Doe', email: 'johndoe@example.com', state: 'California' },
  { id: 2, username: 'admin1', password: 'password2', role: 'admin', name: 'Jane Smith', email: 'janesmith@example.com', state: 'Oregon' },
  { id: 3, username: 'supervisor1', password: 'password3', role: 'supervisor', name: 'Mike Johnson', email: 'mikejohnson@example.com', state: 'Nevada' },
];

export async function getUserById(userId) {
  // Retrieve user data from the users array based on the userId
  const user = users.find(user => user.id === userId);
  
  if (user) {
    return user;
  } else {
    throw new Error(`User with ID ${userId} not found`);
  }
}
