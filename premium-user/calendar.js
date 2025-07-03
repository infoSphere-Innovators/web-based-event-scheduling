// Import Firebase modules at the top
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4YDw8dhp1qsJ7BhlNUSNHq3BxYzg6GDI",
  authDomain: "web-based-event-scheduling.firebaseapp.com",
  projectId: "web-based-event-scheduling",
  storageBucket: "web-based-event-scheduling.appspot.com",
  messagingSenderId: "925435406930",
  appId: "1:925435406930:web:48c759977c266a2cedcd8b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Calendar constants
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date();
let currentDate = new Date();
let events = {};
let eventsData = {};

// DOM references
const modal = document.getElementById("eventDetailsModal");
const span = document.getElementsByClassName("close")[0];
const monthYearEl = document.getElementById('month-year');
const calendarBody = document.getElementById('calendar-body');
const eventDisplay = document.getElementById('event-display');
const dayNames = document.getElementById('day-names');

// Fetch events from Firebase
async function fetchEvents() {
  try {
    const eventsRef = ref(db, 'events');
    const snapshot = await get(eventsRef);

    if (snapshot.exists()) {
      eventsData = snapshot.val();
      events = {};

      Object.values(eventsData).forEach(event => {
        const dateKey = event.EventDate;
        if (!events[dateKey]) events[dateKey] = [];
        events[dateKey].push({ id: event.EventID, name: event.EventName });
      });
    }
    renderCalendar();
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

// Update showEventDetails function
function showEventDetails(eventId) {
  const event = eventsData[eventId];
  if (event) {
    // Make sure the modal exists
    const modal = document.getElementById('eventDetailsModal');
    if (!modal) {
      console.error("Modal element not found");
      return;
    }

    document.getElementById('modalEventName').textContent = event.EventName;
    document.getElementById('modalEventDate').textContent = event.EventDate;
    document.getElementById('modalEventTime').textContent = event.EventTime;
    document.getElementById('modalEventVenue').textContent = event.EventVenue;
    document.getElementById('modalEventType').textContent = event.EventType;
    document.getElementById('modalEventDescription').textContent = event.EventDescription;
    document.getElementById('modalEventPublisher').textContent = event.Published;
    
    // Make the modal visible with important flags
    modal.style.display = "block !important";
    modal.style.opacity = "1 !important";
    modal.style.zIndex = "9999 !important";
    
    // Force display with attribute
    modal.setAttribute('style', 'display: block !important; opacity: 1 !important; z-index: 9999 !important');
    
    // Also ensure the modal content is visible
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.opacity = "1";
      modalContent.style.transform = "translateY(0)";
    }
    
    // Remove any conflicting classes
    modal.classList.remove('hidden', 'invisible');
  }
}

// Initialize weekday headers
function initializeDayNames() {
  days.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day;
    dayNames.appendChild(th);
  });
}

// Render calendar view
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYearEl.textContent = `${months[month]} ${year}`;
  calendarBody.innerHTML = '';

  let day = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      if (i === 0 && j < firstDay) {
        cell.innerHTML = '';
      } else if (day <= daysInMonth) {
        const dayContainer = document.createElement('div');
        dayContainer.classList.add('day-container');

        const dayNumber = document.createElement('span');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = day;

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          cell.classList.add('today');
        }

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events[dateKey];
        const eventsContainer = document.createElement('div');
        eventsContainer.classList.add('events-container');

        if (dayEvents) {
          dayEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card-mini');
            eventCard.textContent = event.name;
            eventCard.addEventListener('click', (e) => {
              e.stopPropagation();
              showEventDetails(event.id);
            });
            eventsContainer.appendChild(eventCard);
          });
        }

        dayContainer.appendChild(dayNumber);
        dayContainer.appendChild(eventsContainer);
        cell.appendChild(dayContainer);
        cell.addEventListener('click', () => showEvent(year, month, day));
        day++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
    if (day > daysInMonth) break;
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
        Location: ${event.location}`;

      eventDot.appendChild(preview);
      eventIndicator.appendChild(eventDot);
    });
    td.appendChild(eventIndicator);
  }
  return td;
}

function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  calendarBody.innerHTML = '';
  let date = 1;

  for (let i = 0; i < 6; i++) {
    if (date > totalDays) break;
    const row = document.createElement('tr');

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      if (i === 0 && j < startingDay) {
        cell.classList.add('inactive');
        const prevMonthDays = new Date(year, month, 0).getDate();
        const prevDay = prevMonthDays - (startingDay - j - 1);
        cell.innerHTML = `<span class="day-number">${prevDay}</span>`;
      } else if (date > totalDays) {
        cell.classList.add('inactive');
        const nextDay = date - totalDays;
        cell.innerHTML = `<span class="day-number">${nextDay}</span>`;
        date++;
      } else {
        cell.innerHTML = `<span class="day-number">${date}</span>`;
        if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          cell.classList.add('today');
        }
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Inject the styles first before anything else
  const modalStyles = `
    .modal {
      display: none !important;
      position: fixed !important;
      z-index: 9999 !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      height: 100% !important;
      overflow: auto !important;
      background-color: rgba(0,0,0,0.6) !important;
    }
    
    .modal[style*="display: block"] {
      display: block !important;
    }
    
    .modal-content {
      background-color: #fefefe !important;
      margin: 10% auto !important;
      padding: 20px !important;
      border: 1px solid #888 !important;
      width: 80% !important;
      max-width: 600px !important;
      border-radius: 8px !important;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
      position: relative !important;
    }
  `;

  // Create and append style element
  const styleEl = document.createElement('style');
  styleEl.textContent = modalStyles;
  document.head.appendChild(styleEl);

  // Initialize other elements
  initializeDayNames();
  updateTime();
  fetchEvents();

  // Set up month navigation
  document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    fetchEvents();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    fetchEvents();
  });

  // Modal setup - more robust
  const modal = document.getElementById("eventDetailsModal");
  const span = document.querySelector("#eventDetailsModal .close");
  
  if (span && modal) {
    // Close button handler
    span.addEventListener('click', () => {
      modal.setAttribute('style', 'display: none !important');
    });
    
    // Click outside modal to close
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.setAttribute('style', 'display: none !important');
      }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        modal.setAttribute('style', 'display: none !important');
      }
    });
  }
});

// Fix modal styling with JavaScript
function updateTime() {
  const timeElement = document.getElementById('current-time');
  const options = {
    hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short'
  };

  function setTime() {
    const time = new Date().toLocaleString('en-US', options);
    timeElement.textContent = time;
  }

  setTime();
  setInterval(setTime, 60000);
}

renderCalendar();
