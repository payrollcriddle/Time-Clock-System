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

  console.log(`Clocked in at ${timestamp}`);
  if (activityTypeId === 'meal') {
    console.log(`Meal started at ${timestamp}`);
  }
}

// Function to save timecard entry
export function saveTimecardEntry(entry) {
  // Save the timecard entry to the database or data store
  // For demonstration purposes, let's assume we have a static array to store timecard entries
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
    console.log(`Clocked out at ${timestamp}`);
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

// Function to calculate daily hours
export function calculateDailyHours(userId, date) {
  // Calculate daily hours based on timecard data for the specified user and date
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const userTimecardEntries = timecardEntries.filter(entry => entry.userId === userId && entry.startTime.includes(date));

  const dailyHours = userTimecardEntries.reduce((total, entry) => {
    if (entry.endTime) {
      const startTime = new Date(entry.startTime);
      const endTime = new Date(entry.endTime);
      const duration = (endTime - startTime) / 3600000; // Convert milliseconds to hours
      return total + duration;
    }
    return total;
  }, 0);

  return dailyHours;
}

// Function to calculate weekly hours
export function calculateWeeklyHours(userId) {
  // Calculate weekly hours based on timecard data for the specified user
  const timecardEntries = JSON.parse(localStorage.getItem('timecardEntries')) || [];
  const userTimecardEntries = timecardEntries.filter(entry => entry.userId === userId);

  const weeklyHours = userTimecardEntries.reduce((total, entry) => {
    if (entry.endTime) {
      const startTime = new Date(entry.startTime);
      const endTime = new Date(entry.endTime);
      const duration = (endTime - startTime) / 3600000; // Convert milliseconds to hours
      return total + duration;
    }
    return total;
  }, 0);

  return weeklyHours;
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
