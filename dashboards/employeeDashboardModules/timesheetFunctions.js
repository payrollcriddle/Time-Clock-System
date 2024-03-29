// employeeDashboardModules/timesheetFunctions.js

export function getPayPeriodStartDate(date) {
  const dayOfWeek = date.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - daysToSubtract);
  return startDate;
}

export function getPayPeriodEndDate(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13);
  return endDate;
}

export function getNextPayDate(endDate) {
  const payDate = new Date(endDate);
  payDate.setDate(endDate.getDate() + 5);
  return payDate;
}
