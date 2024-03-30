// formValidation.js

export function validateForm() {
    const dayStatusDropdown = document.getElementById('day-status-dropdown');
    const leaveHoursInput = document.getElementById('leave-hours-input');
    const timecardNoteInput = document.getElementById('timecard-note-input');

    if (dayStatusDropdown.value === '') {
        alert('Please select a day status.');
        return false;
    }

    if (dayStatusDropdown.value === 'Leave' && leaveHoursInput.value === '') {
        alert('Please enter leave hours.');
        return false;
    }

    if (timecardNoteInput.value === '') {
        alert('Please enter a timecard note.');
        return false;
    }

    return true;
}
