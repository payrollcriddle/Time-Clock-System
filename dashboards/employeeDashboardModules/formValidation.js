// formValidation.js

import { getMealPeriodPolicy } from './mealPeriodPolicies/mealPeriodPolicyUtils.js';

export function validateForm(userId, dailyTimecard) {
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

  const state = getUserState(userId);
  const mealPeriodPolicy = getMealPeriodPolicy(state);

  if (mealPeriodPolicy) {
    const { shouldPromptForMealPeriodWaiver } = mealPeriodPolicy;

    if (shouldPromptForMealPeriodWaiver(dailyTimecard)) {
      const mealPeriodWaiverCheckbox = document.getElementById('meal-period-waiver-checkbox');

      if (!mealPeriodWaiverCheckbox.checked) {
        alert('Please select the meal period waiver checkbox.');
        return false;
      }
    }
  }

  return true;
}
