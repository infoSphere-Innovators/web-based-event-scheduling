// Firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyC4YDw8dhp1qsJ7BhlNUSNHq3BxYzg6GDI",
    authDomain: "web-based-event-scheduling.firebaseapp.com",
    projectId: "web-based-event-scheduling",
    storageBucket: "web-based-event-scheduling.appspot.com",
    messagingSenderId: "925435406930",
    appId: "1:925435406930:web:48c759977c266a2cedcd8b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const eventsBtn = document.getElementById("events-btn");
    const calendarBtn = document.getElementById("calendar-btn");
    const announcementBtn = document.getElementById("announcement-btn");
    const notifBtn = document.getElementById("notifBtn");
    const userBtn = document.getElementById("userBtn");
    const notifDropdown = document.getElementById("notifDropdown");
    const allBtn = document.getElementById("all-btn");
    const upcomingBtn = document.getElementById("upcoming-btn");
    const pastBtn = document.getElementById("past-btn");
    const eventCards = document.querySelectorAll(".event-card");
    const noEventsMsg = document.getElementById("no-events-message");
    const buttons = [allBtn, upcomingBtn, pastBtn];

    // Navigation Functions
    function setActiveTab(button) {
        document.querySelectorAll(".nav-left button").forEach((btn) => {
            btn.classList.remove("active-tab");
        });
        button.classList.add("active-tab");
    }

    // Navigation Event Listeners
    eventsBtn.addEventListener("click", () => {
        setActiveTab(eventsBtn);
        window.location.href = "user-dashboard.html";
    });

    calendarBtn.addEventListener("click", () => {
        setActiveTab(calendarBtn);
        window.location.href = "calendar.html";
    });

    announcementBtn.addEventListener("click", () => {
        setActiveTab(announcementBtn);
        window.location.href = "announcements.html";
    });

    // Notification Dropdown
    notifBtn.addEventListener("click", () => {
        notifDropdown.style.display = notifDropdown.style.display === "block" ? "none" : "block";
    });

    // Close dropdown when clicking outside
    window.addEventListener("click", (event) => {
        if (!event.target.closest(".notification-wrapper")) {
            notifDropdown.style.display = "none";
        }
    });

    // User Profile Navigation
    userBtn.addEventListener("click", () => {
        window.location.href = "profile-details.html";
    });

    // Time Update Function
    function updateTime() {
        const timeElement = document.getElementById("current-time");
        const options = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZoneName: "short",
        };

        function setTime() {
            const time = new Date().toLocaleString("en-US", options);
            timeElement.textContent = time;
        }

        setTime();
        setInterval(setTime, 60000);
    }

    // Event Filtering Functions
    function clearActive() {
        buttons.forEach((btn) => btn.classList.remove("active"));
    }

    function parseDateFromText(text) {
        const currentYear = new Date().getFullYear();
        const fullText = `${text} ${currentYear}`;
        return new Date(fullText);
    }

    function filterEvents(type) {
        const now = new Date();
        let anyVisible = false;

        eventCards.forEach((card) => {
            const timeDiv = card.querySelector(".event-date");
            const eventDate = parseDateFromText(timeDiv.textContent.trim());

            let show = false;
            if (type === "all") {
                show = true;
            } else if (type === "upcoming") {
                show = eventDate > now;
            } else if (type === "past") {
                show = eventDate < now;
            }

            card.style.display = show ? "flex" : "none";
            if (show) anyVisible = true;
        });

        noEventsMsg.style.display = anyVisible ? "none" : "block";
    }

    // Event Filter Button Listeners
    allBtn.addEventListener("click", () => {
        clearActive();
        allBtn.classList.add("active");
        filterEvents("all");
    });

    upcomingBtn.addEventListener("click", () => {
        clearActive();
        upcomingBtn.classList.add("active");
        filterEvents("upcoming");
    });

    pastBtn.addEventListener("click", () => {
        clearActive();
        pastBtn.classList.add("active");
        filterEvents("past");
    });

    // Firebase Functions
    function fetchEvents() {
        const eventsRef = db.ref('events');
        const eventsContainer = document.querySelector('.events');

        // Add loading state
        eventsContainer.innerHTML = '<p style="text-align: center; color: rgba(255, 255, 255, 0.6)">Loading events...</p>';

        eventsRef.on('value', (snapshot) => {
            eventsContainer.innerHTML = '';
            const events = snapshot.val();
            console.log('Fetched events:', events); // Debug log

            if (events) {
                Object.entries(events).forEach(([id, event]) => {
                    event.id = id; // Add ID to event object
                    const eventCard = createEventCard(event);
                    eventsContainer.appendChild(eventCard);
                });
                noEventsMsg.style.display = "none";
            } else {
                noEventsMsg.style.display = "block";
            }
        }, (error) => {
            console.error('Error fetching events:', error);
            eventsContainer.innerHTML = '<p style="text-align: center; color: rgba(255, 255, 255, 0.6)">Error loading events</p>';
        });
    }

    function createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        const eventDate = new Date(event.EventDate);
        const formattedDate = `${eventDate.getDate()} ${eventDate.toLocaleString('default', { month: 'long' })}`;
        const formattedTime = event.EventTime;

        card.innerHTML = `
            <div class="event-info">
                <div class="event-left">
                    <div class="event-date">${formattedDate}</div>
                    <div class="event-time">${formattedTime}</div>
                </div>
                <div class="divider"></div>
                <div class="event-right">
                    <h3>${event.EventName || 'Untitled Event'}</h3>
                    <div class="meta">
                        <div><i class="fas fa-location-dot"></i> ${event.EventVenue || 'Location TBA'}</div>
                        <div><i class="fas fa-tag"></i> ${event.EventType || 'No category'}</div>
                    </div>
                </div>
            </div>
            <div class="card-image">
                <div class="buttons">
                    <button class="checkin" onclick="viewEventDescription('${event.EventID}')">View Description</button>
                </div>
            </div>
        `;

        return card;
    }

    // Initialize
    updateTime();
    fetchEvents();
    filterEvents("upcoming"); // Set default filter
});

// Global function for event description
function viewEventDescription(eventId) {
    console.log(`Viewing event: ${eventId}`);
    // Implement modal or redirect logic here
}