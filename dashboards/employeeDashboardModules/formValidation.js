// formValidation.js

export function validateForm() {
  const dayStatusDropdown = document.getElementById('day-status-dropdown');
  const activityDropdown = document.getElementById('activity-dropdown');
  const jobDropdown = document.getElementById('job-dropdown');
  const leaveTypeDropdown = document.getElementById('leave-type-dropdown');
  const leaveHoursInput = document.getElementById('leave-hours-input');
  const timecardNoteInput = document.getElementById('timecard-note-input');

  if (dayStatusDropdown.value === '') {
    alert('Please select a day status.');
    return false;
  }

  if (dayStatusDropdown.value === 'Working') {
    if (activityDropdown.value === '') {
      alert('Please select an activity.');
      return false;
    }
    if (jobDropdown.value === '') {
      alert('Please select a job.');
      return false;
    }
  }

  if (dayStatusDropdown.value === 'Leave') {
    if (leaveTypeDropdown.value === '') {
      alert('Please select a leave type.');
      return false;
    }
    if (leaveHoursInput.value === '') {
      alert('Please enter leave hours.');
      return false;
    }
  }

  if (timecardNoteInput.value === '') {
    alert('Please enter a timecard note.');
    return false;
  }

  return true;
}
