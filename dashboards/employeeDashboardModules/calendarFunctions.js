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
    const calendarTable = this.renderCalendarTable();

    this.calendarElement.appendChild(calendarHeader);
    this.calendarElement.appendChild(calendarTable);
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

  renderCalendarTable() {
    const calendarTable = document.createElement('table');
    calendarTable.classList.add('calendar-table');

    const calendarHeader = this.renderCalendarTableHeader();
    const calendarBody = this.renderCalendarTableBody();

    calendarTable.appendChild(calendarHeader);
    calendarTable.appendChild(calendarBody);

    return calendarTable;
  }

  renderCalendarTableHeader() {
    const calendarHeader = document.createElement('thead');
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const headerRow = document.createElement('tr');
    daysOfWeek.forEach(day => {
      const th = document.createElement('th');
      th.textContent = day;
      headerRow.appendChild(th);
    });

    calendarHeader.appendChild(headerRow);
    return calendarHeader;
  }

  renderCalendarTableBody() {
    const calendarBody = document.createElement('tbody');

    const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const numDays = endDate.getDate();

    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
      const weekRow = document.createElement('tr');

      for (let j = 0; j < 7; j++) {
        const dayCell = document.createElement('td');
        dayCell.classList.add('calendar-day');

        if ((i === 0 && j < startDate.getDay()) || dayCount > numDays) {
          dayCell.textContent = '';
        } else {
          dayCell.textContent = dayCount;

          if (this.isCurrentDate(dayCount)) {
            dayCell.classList.add('current-day');
          }

          if (this.isPayPeriodDay(dayCount)) {
            dayCell.classList.add('pay-period-day');
          }

          dayCount++;
        }

        weekRow.appendChild(dayCell);
      }

      calendarBody.appendChild(weekRow);
    }

    return calendarBody;
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
    const calendarDays = this.calendarElement.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
      day.addEventListener('click', () => {
        console.log('Clicked on day:', day.textContent);
      });
    });
  }
}
