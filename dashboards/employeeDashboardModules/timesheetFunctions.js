export function getPayPeriodStartDate(currentDate) {
    // Reference start date for pay periods (March 25th, 2024)
    const referenceStartDate = new Date('2024-03-25');
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
    const difference = currentDate - referenceStartDate;

    // Calculate the number of fortnights (two-week periods) since the reference start date
    const fortnightsSinceReference = Math.floor(difference / (14 * oneDay));

    // Calculate the start date of the current pay period
    const payPeriodStartDate = new Date(referenceStartDate.getTime() + fortnightsSinceReference * 14 * oneDay);

    // If the current date is before the start date of the current pay period, move back one pay period
    if (currentDate < payPeriodStartDate) {
        payPeriodStartDate.setTime(payPeriodStartDate.getTime() - 14 * oneDay);
    }

    return payPeriodStartDate;
}

export function getPayPeriodEndDate(startDate) {
    const payPeriodEndDate = new Date(startDate);
    payPeriodEndDate.setDate(startDate.getDate() + 13); // Add 13 days to the start date to get the end date (14 days total)
    return payPeriodEndDate;
}
