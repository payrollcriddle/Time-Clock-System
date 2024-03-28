// Function to handle clock in
export function clockIn(userId, dayStatus, activityTypeId, jobId, timecardNote, timestamp) {
  // Record clock in entry in the database or data store
  const entry = {
    userId,
    dayStatus,
    activityTypeId,
    jobId,
    timecardNote,
    startTime: timestamp,
    endTime: null,
  };

  saveTimecardEntry(entry);
  console.log(`Clocked in at ${new Date(timestamp).toLocaleString()}`);
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
  const lastEntry = timecardEntries[timecardEntries.length - 1];

  if (lastEntry && lastEntry.userId === userId && !lastEntry.endTime) {
    lastEntry.endTime = timestamp;
    localStorage.setItem('timecardEntries', JSON.stringify(timecardEntries));
    console.log(`Clocked out at ${new Date(timestamp).toLocaleString()}`);
  }
}

// Function to handle meal start
export function startMeal(userId, timestamp) {
  // Record meal start entry in the database or data store
  const entry = {
    userId,
    activityTypeId: 'meal',
    startTime: timestamp,
    endTime: null,
  };

  saveTimecardEntry(entry);
  console.log(`Meal started at ${new Date(timestamp).toLocaleString()}`);
}

// Function to handle meal end
export function endMeal(userId, timestamp) {
  // Record meal end entry in the database or data store
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const lastEntry = timecardEntries[timecardEntries.length - 1];

  if (lastEntry && lastEntry.userId === userId && lastEntry.activityTypeId === 'meal' && !lastEntry.endTime) {
    lastEntry.endTime = timestamp;
    localStorage.setItem('timecardEntries', JSON.stringify(timecardEntries));
    console.log(`Meal ended at ${new Date(timestamp).toLocaleString()}`);
  }
}

// Function to get timecard data
export function getTimecard(userId) {
  // Retrieve timecard data from the database or data store for the specified user
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const userTimecardEntries = timecardEntries.filter(entry => entry.userId === userId);

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
    userId,
    leaveType,
    leaveHours,
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
