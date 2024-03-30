// timesheetFunctions.js

export function getPayPeriodStartDate(currentDate) {
    const currentDay = currentDate.getDay(); // Get the day of the week (0-6)
    const daysToSubtract = (currentDay + 6) % 7; // Calculate the number of days to subtract to get to the previous Monday

    const payPeriodStartDate = new Date(currentDate);
    payPeriodStartDate.setDate(currentDate.getDate() - daysToSubtract);

    return payPeriodStartDate;
}

export function getPayPeriodEndDate(startDate) {
    const payPeriodEndDate = new Date(startDate);
    payPeriodEndDate.setDate(startDate.getDate() + 13); // Add 13 days to the start date to get the end date (14 days total)

    return payPeriodEndDate;
}
