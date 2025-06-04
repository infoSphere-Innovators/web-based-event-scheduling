  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  let currentDate = new Date();

  const events = {
    '2025-06-03': ['Mid-Year Tech Summit'],
    '2025-06-10': ['Dev Conference', 'UI/UX Workshop'],
    '2025-06-15': ['Company Picnic'],
    '2025-06-25': ['Hackathon Demo Day']
  };

  const dayNamesEl = document.getElementById('day-names');
  const calendarBody = document.getElementById('calendar-body');
  const monthYearEl = document.getElementById('month-year');
  const eventDisplay = document.getElementById('event-display');

  days.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day;
    dayNamesEl.appendChild(th);
  });

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYearEl.textContent = `${months[month]} ${year}`;
    calendarBody.innerHTML = '';

    let day = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
        const cell = document.createElement('td');
        if (i === 0 && j < firstDayOfMonth) {
            cell.innerHTML = '';
        } else if (day <= daysInMonth) {
            const span = document.createElement('span');
            span.textContent = day;

            const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
            if (isToday) span.classList.add('today');

            // Pass a fresh copy of year/month/day to avoid mutation issues
            const dayCopy = day;
            const monthCopy = month;
            const yearCopy = year;

            span.addEventListener('click', () => showEvent(yearCopy, monthCopy, dayCopy));
            cell.appendChild(span);
            day++;
        }
        row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
    }

    function showEvent(year, month, day) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const eventList = events[key];
    eventDisplay.innerHTML = `<h3>Events on ${months[month]} ${day}, ${year}:</h3>`;
    if (eventList) {
        eventList.forEach(e => {
        const p = document.createElement('p');
        p.textContent = `• ${e}`;
        eventDisplay.appendChild(p);
        });
    } else {
        eventDisplay.innerHTML += `<p>No events on this day.</p>`;
    }
    }


  document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();