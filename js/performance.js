// ---- Time Display ----
function updateTime() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('current-time').textContent = `${hh}:${mm}`;
}
setInterval(updateTime, 1000);
updateTime();

// ---- Attendance Chart ----
const ctx = document.getElementById('attendanceChart').getContext('2d');
const attendanceData = [250, 450, 380, 420, 350, 370];
const attendanceChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [{
      label: 'Attendance',
      data: attendanceData,
      backgroundColor: 'rgba(136,132,216,0.2)',
      borderColor: '#8884d8',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    scales: {
      x: { grid: { display: false } },
      y: {
        min: 0, max: 550,
        grid: { color: 'rgba(0,0,0,0.1)', drawBorder: false }
      }
    },
    plugins: {
      tooltip: { enabled: true },
      legend: { display: false }
    }
  }
});

// ---- Calendar Logic ----
const events = {
  '2021-09-03': "Teacher's Meeting",
  '2021-09-10': 'Parent-Teacher Conference',
  '2021-09-17': 'Sports Day',
  '2021-09-19': 'Science Exhibition',
  '2021-09-24': 'Cultural Program',
  '2021-09-25': ['Up coming Examination', 'Basketball Match']
};
const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const daysInMonth = 30;
const monthLabel = document.getElementById('month-label');
const dayLabelsEl = document.querySelector('.day-labels');
const dateGridEl = document.querySelector('.date-grid');
const eventDisplayEl = document.getElementById('event-display');

days.forEach(d => {
  const el = document.createElement('div');
  el.textContent = d;
  dayLabelsEl.appendChild(el);
});

function renderCalendar() {
  dateGridEl.innerHTML = '';
  for (let i = 1; i <= daysInMonth; i++) {
    const cell = document.createElement('div');
    const dateStr = `2021-09-${String(i).padStart(2,'0')}`;
    const dateObj = new Date(2021,8,i);
    const isWeekend = [0,6].includes(dateObj.getDay());
    const isToday = i === 19;
    cell.textContent = i;
    cell.classList.add('date-cell');
    if (isToday) cell.classList.add('today');
    else {
      if (events[dateStr]) cell.classList.add('has-event');
      else if (isWeekend) cell.classList.add('weekend');
    }
    cell.addEventListener('click', () => displayEvents(dateStr, i));
    dateGridEl.appendChild(cell);
  }
}
function displayEvents(dateStr, day) {
  eventDisplayEl.innerHTML = '';
  const header = document.createElement('h4');
  header.textContent = `Events on ${day} Sep 2021:`;
  const content = document.createElement('div');
  if (events[dateStr]) {
    const ev = events[dateStr];
    if (Array.isArray(ev)) {
      const ul = document.createElement('ul');
      ev.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      content.appendChild(ul);
    } else content.textContent = ev;
  } else {
    content.textContent = 'No events scheduled for this date.';
    content.style.color = '#6b7280';
  }
  eventDisplayEl.className = 'event-display';
  eventDisplayEl.append(header, content);
}
renderCalendar();

// ---- Notices ----
const notices = [
  { title: 'Up coming Examination', date: '25 Sep 2021', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400' },
  { title: 'Off day', date: '30 Sep 2021', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400' },
  { title: 'Basketball Match', date: '25 Sep 2021', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400' }
];
const noticeContainer = document.getElementById('notice-container');
notices.forEach(n => {
  const div = document.createElement('div');
  div.className = 'notice-item';
  const img = document.createElement('img');
  img.src = n.image;
  const txt = document.createElement('div');
  txt.innerHTML = `<p class="notice-title">${n.title}</p>
                   <p class="notice-date">${n.date}</p>`;
  div.append(img, txt);
  noticeContainer.appendChild(div);
});

// Updated function to show event popup
function showEventPopup(eventId, buttonElement) {
    // Get event details (your existing code)
    const eventDetails = "Your event details here"; // Replace with your actual event data
    
    // Get the popup element
    const popup = document.getElementById('eventPopup');
    
    // Set the content
    document.getElementById('eventDetails').textContent = eventDetails;
    
    // Position the popup above the button
    if (buttonElement) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const popupHeight = popup.offsetHeight;
        
        // Calculate position
        const top = buttonRect.top - popupHeight - 10; // 10px gap
        const left = buttonRect.left + (buttonRect.width / 2);
        
        // Apply position
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
        popup.style.transform = 'translateX(-50%)';
    }
    
    // Show the popup
    popup.style.display = 'block';
    popup.classList.add('show');
}

// Update your existing event listeners
document.querySelectorAll('.view-event-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const eventId = this.getAttribute('data-event-id');
        showEventPopup(eventId, this); // Pass the button element
    });
});

// Example of dynamically creating a button with the new class
function createViewButton(eventId) {
    const button = document.createElement('button');
    button.className = 'view-event-button';
    button.setAttribute('data-event-id', eventId);
    button.textContent = 'View Event';
    return button;
}
