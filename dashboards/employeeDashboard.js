// employeeDashboard.js

import { getUser, logout } from '../auth.js';
import { getActivityTypes } from '../management/activityTypeManagement.js';
import { getJobs } from '../management/jobManagement.js';
import { getTimecard, submitTimecard, updateTimecard } from '../timecard.js';
import { calculateDailyHours, calculateWeeklyHours } from '../hoursCalculation.js';
import { getPayPeriodStartDate, getPayPeriodEndDate } from './employeeDashboardModules/timesheetFunctions.js';
import { renderCalendar } from './employeeDashboardModules/calendarFunctions.js';
import { updateCurrentTime, updateTimeClockDisplay } from './employeeDashboardModules/displayFunctions.js';
import { handleDayStatusChange, handleLeaveTypeChange } from './employeeDashboardModules/eventHandlers.js';
import { validateForm } from './employeeDashboardModules/formValidation.js';

const employeeDashboardElements = {
    welcomeMessage: document.getElementById('welcome-message'),
    currentDateTime: document.getElementById('current-date-time'),
    dayStatusDropdown: document.getElementById('day-status-dropdown'),
    timeClock: document.getElementById('time-clock'),
    activityDropdown: document.getElementById('activity-dropdown'),
    jobDropdown: document.getElementById('job-dropdown'),
    leaveHoursSection: document.getElementById('leave-hours-section'),
    leaveTypeDropdown: document.getElementById('leave-type-dropdown'),
    leaveHoursInput: document.getElementById('leave-hours-input'),
    timecardNoteInput: document.getElementById('timecard-note-input'),
    mealPeriodWaiverCheckbox: document.getElementById('meal-period-waiver-checkbox'),
    dailyHoursTable: document.getElementById('daily-hours-table'),
    weeklyHoursSummary: document.getElementById('weekly-hours-summary'),
    submitButton: document.getElementById('submit-button'),
    logoutButton: document.getElementById('logout-button'),
    calendarContainer: document.getElementById('calendar-container')
};

export function renderEmployeeDashboard() {
    const employee = getUser();
    if (employee) {
        // Render welcome message
        employeeDashboardElements.welcomeMessage.textContent = `Welcome, ${employee.name}!`;

        // Show the current date and time
        const currentTime = updateCurrentTime(employee.state);
        employeeDashboardElements.currentDateTime.textContent = currentTime;

        // Populate the day status dropdown
        const dayStatusOptions = ['Working', 'Off', 'Leave'];
        employeeDashboardElements.dayStatusDropdown.innerHTML = dayStatusOptions.map(option => `<option value="${option}">${option}</option>`).join('');

        // Initialize the time clock
        updateTimeClockDisplay(employee.id);
        setInterval(() => updateTimeClockDisplay(employee.id), 1000);

        // Populate the activity and job dropdowns
        const activityTypes = getActivityTypes();
        employeeDashboardElements.activityDropdown.innerHTML = activityTypes.map(activity => `<option value="${activity.id}">${activity.name}</option>`).join('');
        const jobs = getJobs();
        employeeDashboardElements.jobDropdown.innerHTML = jobs.map(job => `<option value="${job.id}">${job.name}</option>`).join('');

        // Show/hide the leave hours section based on day status
        employeeDashboardElements.dayStatusDropdown.addEventListener('change', handleDayStatusChange);

        // Populate the leave type dropdown
        const leaveTypes = ['Paid Time Off', 'Sick Hours', 'Flex Hours'];
        employeeDashboardElements.leaveTypeDropdown.innerHTML = leaveTypes.map(type => `<option value="${type}">${type}</option>`).join('');

        // Show/hide the meal period waiver based on leave type
        employeeDashboardElements.leaveTypeDropdown.addEventListener('change', handleLeaveTypeChange);

        // Populate the daily hours table
        const timecard = getTimecard(employee.id, employee.role); // Pass the user's role as an argument
        const payPeriodStart = getPayPeriodStartDate(new Date());
        const payPeriodEnd = getPayPeriodEndDate(payPeriodStart);
        const dailyHours = calculateDailyHours(timecard, payPeriodStart, payPeriodEnd);
        employeeDashboardElements.dailyHoursTable.innerHTML = renderDailyHoursTable(dailyHours);


        // Calculate and display the weekly hours summary
        const weeklyHours = calculateWeeklyHours(dailyHours);
        employeeDashboardElements.weeklyHoursSummary.innerHTML = renderWeeklyHoursSummary(weeklyHours);

        // Handle form submission
        const handleSubmit = (event) => {
            event.preventDefault();
            if (validateForm()) {
                const updatedTimecard = {
                    dayStatus: employeeDashboardElements.dayStatusDropdown.value,
                    activityType: employeeDashboardElements.activityDropdown.value,
                    job: employeeDashboardElements.jobDropdown.value,
                    leaveType: employeeDashboardElements.leaveTypeDropdown.value,
                    leaveHours: employeeDashboardElements.leaveHoursInput.value,
                    timecardNote: employeeDashboardElements.timecardNoteInput.value,
                    mealPeriodWaived: employeeDashboardElements.mealPeriodWaiverCheckbox.checked
                };
                updateTimecard(employee.id, updatedTimecard);
                submitTimecard(employee.id);
                alert('Timecard submitted successfully!');
            }
        };
        employeeDashboardElements.submitButton.addEventListener('click', handleSubmit);

        // Handle logout
        const handleLogout = () => {
            logout();
            window.location.href = '/';
        };
        employeeDashboardElements.logoutButton.addEventListener('click', handleLogout);

        // Render the calendar
        renderCalendar(employeeDashboardElements.calendarContainer, payPeriodStart, payPeriodEnd);

    } else {
        // Handle the case where the user object is null
        console.error("User object is null.");
        // You can redirect the user to the login page or display an error message
    }
}

function renderDailyHoursTable(dailyHours) {
    return `
        <thead>
            <tr>
                <th>Date</th>
                <th>Hours Worked</th>
                <th>Leave Hours</th>
                <th>Meal Period Waived</th>
            </tr>
        </thead>
        <tbody>
            ${dailyHours.map(day => `
                <tr>
                    <td>${day.date}</td>
                    <td>${day.hoursWorked}</td>
                    <td>${day.leaveHours}</td>
                    <td>${day.mealPeriodWaived ? 'Yes' : 'No'}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

function renderWeeklyHoursSummary(weeklyHours) {
    return `
        <p>Regular Hours: ${weeklyHours.regularHours}</p>
        <p>Overtime Hours: ${weeklyHours.overtimeHours}</p>
        <p>Double-time Hours: ${weeklyHours.doubleTimeHours}</p>
        <p>Total Hours: ${weeklyHours.totalHours}</p>
    `;
}

// Render employee dashboard when the page loads
document.addEventListener('DOMContentLoaded', renderEmployeeDashboard);
