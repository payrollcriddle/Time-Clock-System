// calendarFunctions.js

export class Calendar {
  constructor(calendarElement, payPeriodStartDate, payPeriodEndDate) {
    this.calendarElement = calendarElement;
    this.payPeriodStartDate = payPeriodStartDate;
    this.payPeriodEndDate = payPeriodEndDate;
    this.currentDate = new Date();
    this.renderCalendar();
    this.addEventListeners();
  }

  renderCalendar() {
    if (!this.calendarElement) {
      console.error('Calendar element not found');
      return;
    }

    this.calendarElement.innerHTML = '';

    const calendarHeader = this.renderCalendarHeader();
    const calendarGrid = this.renderCalendarGrid();

    this.calendarElement.appendChild(calendarHeader);
    this.calendarElement.appendChild(calendarGrid);
  }

  renderCalendarHeader() {
    const calendarHeader = document.createElement('div');
    calendarHeader.classList.add('calendar-header');

    const prevMonthButton = document.createElement('button');
    prevMonthButton.classList.add('prev-month-button');
    prevMonthButton.textContent = '<';
    prevMonthButton.addEventListener('click', () => this.navigateToPreviousMonth());

    const nextMonthButton = document.createElement('button');
    nextMonthButton.classList.add('next-month-button');
    nextMonthButton.textContent = '>';
    nextMonthButton.addEventListener('click', () => this.navigateToNextMonth());

    const calendarTitle = document.createElement('span');
    calendarTitle.classList.add('calendar-title');
    calendarTitle.textContent = this.getCalendarTitle();

    calendarHeader.appendChild(prevMonthButton);
    calendarHeader.appendChild(calendarTitle);
    calendarHeader.appendChild(nextMonthButton);

    return calendarHeader;
  }

  renderCalendarGrid() {
    const calendarGrid = document.createElement('div');
    calendarGrid.classList.add('calendar-grid');

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Create a row for days of the week
    const daysOfWeekRow = document.createElement('div');
    daysOfWeekRow.classList.add('days-of-week');
    daysOfWeek.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day-of-week');
      dayElement.textContent = day;
      daysOfWeekRow.appendChild(dayElement);
    });
    calendarGrid.appendChild(daysOfWeekRow);

    const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const numDays = endDate.getDate();

    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
      const weekRow = document.createElement('div');
      weekRow.classList.add('week-row');

      for (let j = 0; j < 7; j++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');

        if ((i === 0 && j < startDate.getDay()) || dayCount > numDays) {
          // Render empty days for days before the start of the month or after the end of the month
          dayElement.classList.add('empty-day');
        } else {
          // Render actual calendar days
          dayElement.textContent = dayCount;

          if (this.isCurrentDate(dayCount)) {
            dayElement.classList.add('current-day');
          }

          if (this.isPayPeriodDay(dayCount)) {
            dayElement.classList.add('pay-period-day');
          }

          dayCount++;
        }

        weekRow.appendChild(dayElement);
      }

      calendarGrid.appendChild(weekRow);
    }

    return calendarGrid;
  }

  getCalendarTitle() {
    const options = { month: 'long', year: 'numeric' };
    return this.currentDate.toLocaleDateString(undefined, options);
  }

  isCurrentDate(day) {
    const currentDate = new Date();
    return (
      day === currentDate.getDate() &&
      this.currentDate.getMonth() === currentDate.getMonth() &&
      this.currentDate.getFullYear() === currentDate.getFullYear()
    );
  }

  isPayPeriodDay(day) {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    return date >= this.payPeriodStartDate && date <= this.payPeriodEndDate;
  }

  navigateToPreviousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.renderCalendar();
  }

  navigateToNextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.renderCalendar();
  }

  addEventListeners() {
    // Add any necessary event listeners here
    // For example, you can add click events to calendar days
    const calendarDays = this.calendarElement.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
      day.addEventListener('click', () => {
        console.log('Clicked on day:', day.textContent);
        // Handle the click event based on your requirements
      });
    });
  }
}
