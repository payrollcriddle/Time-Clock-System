// Get DOM elements
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const employeeSection = document.getElementById('employee-section');
const employeeNameElement = document.getElementById('employee-name');
const currentTimeElement = document.getElementById('current-time');
const timeZoneSelect = document.getElementById('time-zone-select');
const workingStatusSelect = document.getElementById('working-status');
const timeEntriesContainer = document.getElementById('time-entries');
const clockInButton = document.getElementById('clock-in-btn');
const clockOutButton = document.getElementById('clock-out-btn');
const startBreakButton = document.getElementById('start-break-btn');
const endBreakButton = document.getElementById('end-break-btn');
const startLunchButton = document.getElementById('start-lunch-btn');
const endLunchButton = document.getElementById('end-lunch-btn');
const logoutButton = document.getElementById('logout-btn');
const commentInput = document.getElementById('comment-input');
const employeeForm = document.getElementById('employee-form');
const employeeTableBody = document.querySelector('#employee-table tbody');
const timecardTable = document.querySelector('#timecard table tbody');

// Sample employee data (replace with actual data from server/database)
let employees = [  {
    name: 'Admin User',
    username: 'admin',
    password: 'adminpassword',
    location: 'Head Office',
    department: 'Administration',
    employeeId: '1001',
    accessLevel: 'admin'
    },
  {
    name: 'Jane Smith',
    username: 'janesmith',
    password: 'password456',
    location: 'Branch B',
    department: 'Marketing',
    employeeId: '1003',
    accessLevel: 'supervisor'
  }
];

// Function to render employee table
function renderEmployeeTable() {
  employeeTableBody.innerHTML = '';
  employees.forEach(employee => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.username}</td>
      <td>${employee.location}</td>
      <td>${employee.department}</td>
      <td>${employee.employeeId}</td>
      <td>${employee.accessLevel}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;
    employeeTableBody.appendChild(row);
  });
}

// Event listener for employee form submission
employeeForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('employee-name').value;
  const username = document.getElementById('employee-username').value;
  const password = document.getElementById('employee-password').value;
  const location = document.getElementById('employee-location').value;
  const department = document.getElementById('employee-department').value;
  const employeeId = document.getElementById('employee-id').value;
  const accessLevel = document.getElementById('employee-access').value;

  const newEmployee = {
    name,
    username,
    password,
    location,
    department,
    employeeId,
    accessLevel
  };

  employees.push(newEmployee);
  renderEmployeeTable();
  employeeForm.reset();
});

// Function to update current time
function updateCurrentTime() {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  currentTimeElement.textContent = currentTime;
}

// Update current time every second
setInterval(updateCurrentTime, 1000);

// Event listener for time zone selection change
timeZoneSelect.addEventListener('change', updateCurrentTime);

// Function to create a time entry
function createTimeEntry(text) {
  const currentTime = new Date().toLocaleString('en-US', { timeZone: timeZoneSelect.value });
  const comment = commentInput.value.trim();
  const timeEntry = document.createElement('div');
  timeEntry.className = 'time-entry';
  timeEntry.textContent = `${text}: ${currentTime}`;
  
  if (comment !== '') {
    const commentElement = document.createElement('p');
    commentElement.className = 'time-entry-comment';
    commentElement.textContent = `Comment: ${comment}`;
    timeEntry.appendChild(commentElement);
  }
  
  timeEntriesContainer.appendChild(timeEntry);
  commentInput.value = '';
}

// Function to render timecard
function renderTimecard() {
  timecardTable.innerHTML = '';
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const formattedDate = date.toLocaleDateString();

    const row = document.createElement('tr');
    row.innerHTML = `<td>${formattedDate}</td>`;
    timecardTable.appendChild(row);
  }
}

// Event listener for working status change
workingStatusSelect.addEventListener('change', function() {
  const selectedStatus = workingStatusSelect.value;
  // Perform actions based on selected status (e.g., enable/disable clock in/out buttons)
});

// Event listener for clock-in button click
clockInButton.addEventListener('click', function() {
  const selectedStatus = workingStatusSelect.value;
  if (selectedStatus === 'working') {
    createTimeEntry('Clocked In');
    renderTimecard();
  }
});

// Event listener for clock-out button click
clockOutButton.addEventListener('click', function() {
  createTimeEntry('Clocked Out');
});

// Event listener for start break button click
startBreakButton.addEventListener('click', function() {
  createTimeEntry('Break Started');
});

// Event listener for end break button click
endBreakButton.addEventListener('click', function() {
  createTimeEntry('Break Ended');
});

// Event listener for start lunch button click
startLunchButton.addEventListener('click', function() {
  createTimeEntry('Lunch Started');
});

// Event listener for end lunch button click
endLunchButton.addEventListener('click', function() {
  createTimeEntry('Lunch Ended');
});

// Function to handle login based on access level
function handleLogin(username, password) {
  const employee = employees.find(emp => emp.username === username && emp.password === password);
  if (employee) {
    loginSection.style.display = 'none';
    if (employee.accessLevel === 'admin') {
      adminSection.style.display = 'block';
      renderEmployeeTable();
    } else if (employee.accessLevel === 'supervisor') {
      // Display supervisor-specific sections and functionality
    } else {
      employeeSection.style.display = 'block';
      employeeNameElement.textContent = employee.name;
      updateCurrentTime();
      renderTimecard();
    }
  } else {
    alert('Invalid username or password');
  }
}

// Event listener for login form submission
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  handleLogin(username, password);
});

// Event listener for logout button click
logoutButton.addEventListener('click', function() {
  loginSection.style.display = 'block';
  adminSection.style.display = 'none';
  employeeSection.style.display = 'none';
  timeEntriesContainer.innerHTML = '';
});
