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

    function createDayCell(dayNumber, events = []) {
        const td = document.createElement('td');
        if (dayNumber === new Date().getDate()) td.classList.add('today');
    
        const daySpan = document.createElement('span');
        daySpan.className = 'day-number';
        daySpan.textContent = dayNumber;
        td.appendChild(daySpan);
    
        if (events.length > 0) {
            const eventIndicator = document.createElement('div');
            eventIndicator.className = 'event-indicator';
            
            events.forEach(event => {
                const eventDot = document.createElement('div');
                eventDot.className = `event-dot ${event.type}`;
                eventDot.textContent = event.title;
    
                const preview = document.createElement('div');
                preview.className = 'event-preview';
                preview.innerHTML = `
                    <strong>${event.title}</strong><br>
                    Time: ${event.time}<br>
                    Location: ${event.location}
                `;
    
                eventDot.appendChild(preview);
                eventIndicator.appendChild(eventDot);
            });
    
            td.appendChild(eventIndicator);
        }
    
        return td;
    }

  document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';
    
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // Only create a new row if there are still days to display
        if (date > totalDays) break;
        
        const row = document.createElement('tr');
        
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            
            if (i === 0 && j < startingDay) {
                // Add inactive class to previous month's days
                cell.classList.add('inactive');
                const prevMonthDays = new Date(year, month, 0).getDate();
                const prevDay = prevMonthDays - (startingDay - j - 1);
                cell.innerHTML = `<span class="day-number">${prevDay}</span>`;
            } else if (date > totalDays) {
                // Add inactive class to next month's days
                cell.classList.add('inactive');
                const nextDay = date - totalDays;
                cell.innerHTML = `<span class="day-number">${nextDay}</span>`;
                date++;
            } else {
                cell.innerHTML = `<span class="day-number">${date}</span>`;
                
                // Add today class if it's today
                if (date === new Date().getDate() && 
                    month === new Date().getMonth() && 
                    year === new Date().getFullYear()) {
                    cell.classList.add('today');
                }
                
                date++;
            }
            
            row.appendChild(cell);
        }
        
        calendarBody.appendChild(row);
    }
}

  // Add navigation event listeners
document.addEventListener('DOMContentLoaded', () => {
    const eventsBtn = document.getElementById('events-btn');
    const calendarBtn = document.getElementById('calendar-btn');
    const announcementBtn = document.getElementById('announcement-btn'); // Updated ID to match HTML

    // Navigation Event Listeners
    eventsBtn.addEventListener('click', () => {
        setActiveTab(eventsBtn);
        window.location.href = '/html/user-dashboard.html';
    });

    calendarBtn.addEventListener('click', () => {
        setActiveTab(calendarBtn);
        // Already on calendar page
    });

    announcementBtn.addEventListener('click', () => {  // Updated variable name
        setActiveTab(announcementBtn);
        window.location.href = '/html/announcements.html';
    });

    // Helper function to set active tab
    function setActiveTab(button) {
        document.querySelectorAll('.nav-left button').forEach(btn => {
            btn.classList.remove('active-tab');
        });
        button.classList.add('active-tab');
    }

    // Set calendar button as active on load
    setActiveTab(calendarBtn);

    updateTime();
    renderCalendar();
});

  function updateTime() {
    const timeElement = document.getElementById('current-time');
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short'
    };
    
    function setTime() {
        const time = new Date().toLocaleString('en-US', options);
        timeElement.textContent = time;
    }

    setTime();
    setInterval(setTime, 60000); // Update every minute
}

  renderCalendar();

// Add to each page's JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLeft = document.querySelector('.nav-left');

    // Toggle navigation
    hamburgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburgerMenu.classList.toggle('active');
        navLeft.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-left') && 
            !event.target.closest('.hamburger-menu')) {
            hamburgerMenu.classList.remove('active');
            navLeft.classList.remove('show');
        }
    });

    // Close menu when a nav item is clicked
    navLeft.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navLeft.classList.remove('show');
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburgerMenu.classList.remove('active');
            navLeft.classList.remove('show');
        }
    });
});
