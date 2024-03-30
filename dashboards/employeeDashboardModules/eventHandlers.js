// eventHandlers.js

export function handleDayStatusChange(event) {
    const selectedStatus = event.target.value;
    const leaveHoursSection = document.getElementById('leave-hours-section');
    leaveHoursSection.style.display = selectedStatus === 'Leave' ? 'block' : 'none';
}

export function handleLeaveTypeChange(event) {
    const selectedLeaveType = event.target.value;
    const mealPeriodWaiverCheckbox = document.getElementById('meal-period-waiver-checkbox');
    mealPeriodWaiverCheckbox.style.display = selectedLeaveType === 'Sick Hours' ? 'block' : 'none';
}
