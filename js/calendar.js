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

// Keep existing calendar variables
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date();
let currentDate = new Date();

// Replace the mock events object with a function to fetch events
let events = {};

// Add these variables near the top after your other declarations
let eventsData = {};
const modal = document.getElementById("eventDetailsModal");
const span = document.getElementsByClassName("close")[0];

async function fetchEvents() {
    try {
        const eventsRef = ref(db, 'events');
        const snapshot = await get(eventsRef);
        
        if (snapshot.exists()) {
            eventsData = snapshot.val(); // Store full event data
            events = {};
            
            Object.values(eventsData).forEach(event => {
                const dateKey = event.EventDate;
                
                if (!events[dateKey]) {
                    events[dateKey] = [];
                }
                events[dateKey].push({
                    id: event.EventID,
                    name: event.EventName
                });
            });
        }
        
        renderCalendar();
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

// Add this new function to show event details
function showEventDetails(eventId) {
    const event = eventsData[eventId];
    if (event) {
        document.getElementById('modalEventName').textContent = event.EventName;
        document.getElementById('modalEventDate').textContent = event.EventDate;
        document.getElementById('modalEventTime').textContent = event.EventTime;
        document.getElementById('modalEventVenue').textContent = event.EventVenue;
        document.getElementById('modalEventType').textContent = event.EventType;
        document.getElementById('modalEventDescription').textContent = event.EventDescription;
        document.getElementById('modalEventPublisher').textContent = event.Published;
        modal.style.display = "block";
    }
}

// Add these DOM element references at the top after Firebase initialization
const monthYearEl = document.getElementById('month-year');
const calendarBody = document.getElementById('calendar-body');
const eventDisplay = document.getElementById('event-display');
const dayNames = document.getElementById('day-names');

// Add this to initialize the day names
function initializeDayNames() {
    days.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        dayNames.appendChild(th);
    });
}

// Update the renderCalendar function
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
                // Empty cells before the first day
                cell.innerHTML = '';
            } else if (day <= daysInMonth) {
                // Create day number container
                const dayContainer = document.createElement('div');
                dayContainer.classList.add('day-container');

                const dayNumber = document.createElement('span');
                dayNumber.classList.add('day-number');
                dayNumber.textContent = day;

                // Check if it's today
                if (day === today.getDate() && 
                    month === today.getMonth() && 
                    year === today.getFullYear()) {
                    cell.classList.add('today');
                }

                // Add events for this day
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvents = events[dateKey];

                // Create events container
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
        if (day > daysInMonth) break; // Stop if we've used all days
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

    initializeDayNames(); // Add this line
    updateTime();
    fetchEvents(); // Instead of renderCalendar, fetch events first

    // Set up the navigation buttons
    document.getElementById('prev-month').addEventListener('click', () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        currentDate = newDate;
        fetchEvents();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        currentDate = newDate;
        fetchEvents();
    });
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

    // Modal close button
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Click outside modal to close
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
