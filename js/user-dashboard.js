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
    const ongoingBtn = document.getElementById("ongoing-btn");
    const upcomingBtn = document.getElementById("upcoming-btn");
    const pastBtn = document.getElementById("past-btn");
    const eventCards = document.querySelectorAll(".event-card");
    const noEventsMsg = document.getElementById("no-events-message");
    const buttons = [allBtn, ongoingBtn, upcomingBtn, pastBtn];

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

    function filterEvents(type) {
        const now = new Date();
        const noEventsMsg = document.getElementById("no-events-message");
        const eventCards = document.querySelectorAll(".event-card");
        
        let anyVisible = false;

        eventCards.forEach((card) => {
            const dateText = card.querySelector(".event-date").textContent;
            const timeText = card.querySelector(".event-time").textContent;
            
            // Parse date
            const [day, month] = dateText.split(" ");
            const currentYear = new Date().getFullYear();
            
            // Create date object with time
            const [hours, minutes] = timeText.match(/(\d+):(\d+)/).slice(1);
            const period = timeText.includes('PM') ? 'PM' : 'AM';
            
            // Convert to 24-hour format
            let hour24 = parseInt(hours);
            if (period === 'PM' && hour24 !== 12) hour24 += 12;
            if (period === 'AM' && hour24 === 12) hour24 = 0;
            
            const eventDate = new Date(`${month} ${day}, ${currentYear} ${hour24}:${minutes}:00`);
            
            // Check if the event is today
            const isToday = eventDate.toDateString() === now.toDateString();
            
            let show = false;
            if (type === "all") {
                show = true;
            } else if (type === "ongoing") {
                show = isToday;
            } else if (type === "upcoming") {
                // Show events that are today (after current time) or in the future
                show = eventDate >= now;
            } else if (type === "past") {
                show = eventDate < now;
            }

            card.style.display = show ? "flex" : "none";
            if (show) anyVisible = true;
        });

        // Update no events message visibility
        if (noEventsMsg) {
            noEventsMsg.style.display = anyVisible ? "none" : "block";
        }
    }

    // Event Filter Button Listeners
    allBtn.addEventListener("click", () => {
        clearActive();
        allBtn.classList.add("active");
        filterEvents("all");
    });

    ongoingBtn.addEventListener("click", () => {
        clearActive();
        ongoingBtn.classList.add("active");
        filterEvents("ongoing");
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
        
        // Get current active filter
        const activeFilterBtn = document.querySelector('.toggle button.active');
        const currentFilter = activeFilterBtn ? activeFilterBtn.id.replace('-btn', '') : 'upcoming';

        // Add loading state
        eventsContainer.innerHTML = '<p style="text-align: center; color: rgba(255, 255, 255, 0.6)">Loading events...</p>';

        eventsRef.on('value', (snapshot) => {
            eventsContainer.innerHTML = '';
            const events = snapshot.val();
            
            if (events) {
                Object.entries(events).forEach(([id, event]) => {
                    event.id = id;
                    const eventCard = createEventCard(event);
                    eventsContainer.appendChild(eventCard);
                });
                // Apply current filter after loading events
                filterEvents(currentFilter);
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
    filterEvents("ongoing"); // Set default filter    // Hamburger Menu

    // Add this inside your DOMContentLoaded event listener
    function updateAuthUI(isLoggedIn) {
        const loginBtn = document.getElementById('login');
        const signupBtn = document.getElementById('signup');
        const userBtn = document.getElementById('userBtn');
        const authButtons = document.querySelector('.auth-buttons');

        if (isLoggedIn) {
            // Hide login/signup buttons
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            // Show avatar
            userBtn.style.display = 'flex';
            authButtons.classList.add('logged-in');
        } else {
            // Show login/signup buttons
            loginBtn.style.display = 'inline-block';
            signupBtn.style.display = 'inline-block';
            // Hide avatar
            userBtn.style.display = 'none';
            authButtons.classList.remove('logged-in');
        }
    }

    // Add this to check login state when page loads
    firebase.auth().onAuthStateChanged((user) => {
        updateAuthUI(!!user);
    });
});

// Global function for event description
function viewEventDescription(eventId) {
    const eventsRef = db.ref('events');
    const modal = document.getElementById('eventModal');
    const span = document.getElementsByClassName('close')[0];

    eventsRef.child(eventId).once('value', (snapshot) => {
        const event = snapshot.val();
        if (event) {
            // Format date
            const eventDate = new Date(event.EventDate);
            const formattedDate = `${eventDate.getDate()} ${eventDate.toLocaleString('default', { month: 'long' })} ${eventDate.getFullYear()}`;

            // Update modal content
            document.getElementById('modal-title').textContent = event.EventName;
            document.getElementById('modal-date').textContent = formattedDate;
            document.getElementById('modal-time').textContent = event.EventTime;
            document.getElementById('modal-venue').textContent = event.EventVenue;
            document.getElementById('modal-type').textContent = event.EventType;
            document.getElementById('modal-description').textContent = event.EventDescription || 'No description available';

            // Show modal with animation
            modal.style.display = "block";
            // Trigger reflow
            modal.offsetHeight;
            modal.classList.add('show');
        }
    });

    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    function closeModal() {
        const modal = document.getElementById('eventModal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    // Close button functionality
    span.onclick = closeModal;

    // Click outside modal to close
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // ESC key to close
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    // Touch event handling for modal
    let touchStartY;
    const modalContent = document.querySelector('.modal-content');

    modalContent.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    modalContent.addEventListener('touchmove', (e) => {
        if (!touchStartY) return;
        
        const touchEndY = e.touches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        // If swiping down and at top of content
        if (diff < -50 && modalContent.scrollTop === 0) {
            closeModal();
            touchStartY = null;
        }
    });

    modalContent.addEventListener('touchend', () => {
        touchStartY = null;
    });
}

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