// employeeDashboardModules/calendarFunctions.js

export class Calendar {
  constructor(calendarElement, payPeriodStartDate, payPeriodEndDate) {
    this.calendarElement = calendarElement;
    this.payPeriodStartDate = payPeriodStartDate;
    this.payPeriodEndDate = payPeriodEndDate;
    this.currentDate = new Date();
    this.renderCalendar();
  }

  renderCalendar() {
    // Clear previous calendar content
    this.calendarElement.innerHTML = '';

    // Create calendar header
    const calendarHeader = document.createElement('div');
    calendarHeader.classList.add('calendar-header');
    calendarHeader.textContent = `${this.currentDate.toLocaleString('default', { month: 'long' })} ${this.currentDate.getFullYear()}`;
    this.calendarElement.appendChild(calendarHeader);

    // Create calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.classList.add('calendar-grid');

    // Generate calendar days
    const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const numDays = endDate.getDate();

    for (let i = 1; i <= numDays; i++) {
      const day = document.createElement('div');
      day.classList.add('calendar-day');
      day.textContent = i;

      // Highlight pay period days
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i);
      if (date >= this.payPeriodStartDate && date <= this.payPeriodEndDate) {
        day.classList.add('pay-period-day');
      }

      // Highlight today's date
      if (i === this.currentDate.getDate()) {
        day.classList.add('today');
      }

      calendarGrid.appendChild(day);
    }

    this.calendarElement.appendChild(calendarGrid);
  }
}
