// Function to handle clock in
export function clockIn(userId, dayStatus, activityTypeId, jobId, timecardNote, timestamp) {
  // Record clock in entry in the database or data store
  const entry = {
    id: generateEntryId(), // Generate a unique ID for the entry
    userId,
    dayStatus,
    activityTypeId,
    jobId,
    timecardNote,
    startTime: timestamp,
    endTime: null,
    status: 'pending', // Set initial status as "pending"
  };

  saveTimecardEntry(entry);
  console.log(`Clocked in at ${new Date(timestamp).toLocaleString()}`);
}

// Function to generate a unique entry ID
function generateEntryId() {
  // Implement your logic to generate a unique ID for timecard entries
  // For example, you can use a combination of timestamp and random number
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Function to save timecard entry
export function saveTimecardEntry(entry) {
  // Save the timecard entry to the database or data store
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  timecardEntries.push(entry);
  localStorage.setItem('timecardEntries', JSON.stringify(timecardEntries));
}

// Function to handle clock out
export function clockOut(userId, timestamp) {
  // Record clock out entry in the database or data store
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const lastEntry = timecardEntries.find(entry => entry.userId === userId && !entry.endTime);

  if (lastEntry) {
    lastEntry.endTime = timestamp;
    localStorage.setItem('timecardEntries', JSON.stringify(timecardEntries));
    console.log(`Clocked out at ${new Date(timestamp).toLocaleString()}`);
  }
}

// Function to handle meal start
export function startMeal(userId, timestamp) {
  // Record meal start entry in the database or data store
  const entry = {
    id: generateEntryId(), // Generate a unique ID for the entry
    userId,
    activityTypeId: 'meal',
    startTime: timestamp,
    endTime: null,
    status: 'pending', // Set initial status as "pending"
  };

  saveTimecardEntry(entry);
  console.log(`Meal started at ${new Date(timestamp).toLocaleString()}`);
}

// Function to handle meal end
export function endMeal(userId, timestamp) {
  // Record meal end entry in the database or data store
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const lastEntry = timecardEntries.find(entry => entry.userId === userId && entry.activityTypeId === 'meal' && !entry.endTime);

  if (lastEntry) {
    lastEntry.endTime = timestamp;
    localStorage.setItem('timecardEntries', JSON.stringify(timecardEntries));
    console.log(`Meal ended at ${new Date(timestamp).toLocaleString()}`);
  }
}

// Function to get timecard data
export function getTimecard(userId, userRole) {
  // Retrieve timecard data from the database or data store for the specified user
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  let userTimecardEntries = timecardEntries.filter(entry => entry.userId === userId);

  // Filter timecard data based on user role and permissions
  if (userRole === 'employee') {
    userTimecardEntries = userTimecardEntries.filter(entry => {
      return entry.userId === userId;
    });
  } else if (userRole === 'supervisor') {
    // Filter timecard data for supervisor's direct reports
    // Implement your logic here based on supervisor's permissions
  }

  const timecardData = {
    userId: userId,
    entries: userTimecardEntries,
  };

  return timecardData;
}

// Function to submit timecard
export function submitTimecard(userId) {
  // Submit timecard data to the server or perform necessary actions
  const timecardData = getTimecard(userId);
  // Perform submission logic here
  console.log('Timecard submitted:', timecardData);
  // Update the timecard status to "submitted"
  // ...
}

// Function to submit leave hours
export function submitLeaveHours(userId, leaveType, leaveHours) {
  // Submit leave hours data to the server or perform necessary actions
  const leaveEntry = {
    id: generateEntryId(), // Generate a unique ID for the leave entry
    userId,
    leaveType,
    leaveHours,
    status: 'pending', // Set initial status as "pending"
  };
  // Perform submission logic here
  console.log('Leave hours submitted:', leaveEntry);
  // Save the leave hours entry for the user
  // ...
}

// Function to update timecard data
export function updateTimecard(userId, timecard) {
  // Update the timecard data in the database or data store for the specified user
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const updatedEntries = timecardEntries.map(entry => {
    if (entry.userId === userId) {
      return { ...entry, ...timecard };
    }
    return entry;
  });
  localStorage.setItem('timecardEntries', JSON.stringify(updatedEntries));
}

// Function to approve timecard entry
export function approveTimecardEntry(entryId) {
  // Update the timecard entry status to "approved" in the database or data store
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const updatedEntries = timecardEntries.map(entry => {
    if (entry.id === entryId) {
      return { ...entry, status: 'approved' };
    }
    return entry;
  });
  localStorage.setItem('timecardEntries', JSON.stringify(updatedEntries));
}

// Function to reject timecard entry
export function rejectTimecardEntry(entryId) {
  // Update the timecard entry status to "rejected" in the database or data store
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const updatedEntries = timecardEntries.map(entry => {
    if (entry.id === entryId) {
      return { ...entry, status: 'rejected' };
    }
    return entry;
  });
  localStorage.setItem('timecardEntries', JSON.stringify(updatedEntries));
}
