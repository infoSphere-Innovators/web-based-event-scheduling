// Firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyC4YDw8dhp1qsJ7BhlNUSNHq3BxYzg6GDI",
    authDomain: "web-based-event-scheduling.firebaseapp.com",
    projectId: "web-based-event-scheduling",
    storageBucket: "web-based-event-scheduling.appspot.com",
    messagingSenderId: "925435406930",
    appId: "1:925435406930:web:48c759977c266a2cedcd8b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const eventsBtn = document.getElementById("events-btn");
    const calendarBtn = document.getElementById("calendar-btn");
    const announcementBtn = document.getElementById("announcement-btn");
    const userBtn = document.getElementById("userBtn");
    const allBtn = document.getElementById("all-btn");
    const ongoingBtn = document.getElementById("ongoing-btn");
    const upcomingBtn = document.getElementById("upcoming-btn");
    const pastBtn = document.getElementById("past-btn");
    const buttons = [allBtn, ongoingBtn, upcomingBtn, pastBtn];
    const eventCards = document.querySelectorAll(".event-card");
    const noEventsMsg = document.getElementById("no-events-message");

    // Navigation Buttons
    if (eventsBtn) {
        eventsBtn.addEventListener("click", () => {
            setActiveTab(eventsBtn);
            window.location.href = "user-dashboard.html";
        });
    }
    if (calendarBtn) {
        calendarBtn.addEventListener("click", () => {
            setActiveTab(calendarBtn);
            window.location.href = "calendar.html";
        });
    }
    if (announcementBtn) {
        announcementBtn.addEventListener("click", () => {
            setActiveTab(announcementBtn);
            window.location.href = "announcements.html";
        });
    }
    if (userBtn) {
        userBtn.addEventListener("click", () => {
            window.location.href = "profile-details.html";
        });
    }

    function setActiveTab(button) {
        document.querySelectorAll(".nav-left button").forEach((btn) => {
            btn.classList.remove("active-tab");
        });
        button.classList.add("active-tab");
    }

    function updateTime() {
        const timeElement = document.getElementById("current-time");
        if (!timeElement) return;

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

    function clearActive() {
        buttons.forEach((btn) => btn?.classList.remove("active"));
    }

    function filterEvents(type) {
        const now = new Date();
        const eventCards = document.querySelectorAll(".event-card");
        let anyVisible = false;

        eventCards.forEach((card) => {
            const dateText = card.querySelector(".event-date")?.textContent;
            const timeText = card.querySelector(".event-time")?.textContent;

            if (!dateText || !timeText) return;

            const [day, month] = dateText.split(" ");
            const currentYear = new Date().getFullYear();
            const [hours, minutes] = timeText.match(/(\d+):(\d+)/)?.slice(1) || [];
            const period = timeText.includes('PM') ? 'PM' : 'AM';

            let hour24 = parseInt(hours);
            if (period === 'PM' && hour24 !== 12) hour24 += 12;
            if (period === 'AM' && hour24 === 12) hour24 = 0;

            const eventDate = new Date(`${month} ${day}, ${currentYear} ${hour24}:${minutes}:00`);
            const isToday = eventDate.toDateString() === now.toDateString();

            let show = false;
            if (type === "all") show = true;
            else if (type === "ongoing") show = isToday;
            else if (type === "upcoming") show = eventDate >= now;
            else if (type === "past") show = eventDate < now;

            card.style.display = show ? "flex" : "none";
            if (show) anyVisible = true;
        });

        if (noEventsMsg) {
            noEventsMsg.style.display = anyVisible ? "none" : "block";
        }
    }

    // Filter Button Event Listeners
    if (allBtn) {
        allBtn.addEventListener("click", () => {
            clearActive();
            allBtn.classList.add("active");
            filterEvents("all");
        });
    }

    if (ongoingBtn) {
        ongoingBtn.addEventListener("click", () => {
            clearActive();
            ongoingBtn.classList.add("active");
            filterEvents("ongoing");
        });
    }

    if (upcomingBtn) {
        upcomingBtn.addEventListener("click", () => {
            clearActive();
            upcomingBtn.classList.add("active");
            filterEvents("upcoming");
        });
    }

    if (pastBtn) {
        pastBtn.addEventListener("click", () => {
            clearActive();
            pastBtn.classList.add("active");
            filterEvents("past");
        });
    }

    function fetchEvents() {
        const eventsRef = db.ref('events');
        const eventsContainer = document.querySelector('.events');

        if (!eventsContainer) return;

        const activeFilterBtn = document.querySelector('.toggle button.active');
        const currentFilter = activeFilterBtn ? activeFilterBtn.id.replace('-btn', '') : 'upcoming';

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
                filterEvents(currentFilter);
            } else if (noEventsMsg) {
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

    // Hamburger Menu Handling
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLeft = document.querySelector('.nav-left');

    if (hamburgerMenu && navLeft) {
        hamburgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburgerMenu.classList.toggle('active');
            navLeft.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.nav-left') && !event.target.closest('.hamburger-menu')) {
                hamburgerMenu.classList.remove('active');
                navLeft.classList.remove('show');
            }
        });

        navLeft.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                navLeft.classList.remove('show');
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                hamburgerMenu.classList.remove('active');
                navLeft.classList.remove('show');
            }
        });
    }

    function updateAuthUI(isLoggedIn) {
        const loginBtn = document.getElementById('login');
        const signupBtn = document.getElementById('signup');
        const userBtn = document.getElementById('userBtn');
        const authButtons = document.querySelector('.auth-buttons');

        if (!loginBtn || !signupBtn || !authButtons || !userBtn) return;

        if (isLoggedIn) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            userBtn.style.display = 'flex';
            authButtons.classList.add('logged-in');
        } else {
            loginBtn.style.display = 'inline-block';
            signupBtn.style.display = 'inline-block';
            userBtn.style.display = 'none';
            authButtons.classList.remove('logged-in');
        }
    }

    firebase.auth().onAuthStateChanged((user) => {
        updateAuthUI(!!user);
    });

    updateTime();
    fetchEvents();
    filterEvents("ongoing");
});

// Global function for event modal
function viewEventDescription(eventId) {
    const modal = document.getElementById('eventModal');
    const span = document.querySelector('.close');
    const modalContent = document.querySelector('.modal-content');

    if (!modal || !span || !modalContent) return;

    db.ref('events').child(eventId).once('value', (snapshot) => {
        const event = snapshot.val();
        if (event) {
            const eventDate = new Date(event.EventDate);
            const formattedDate = `${eventDate.getDate()} ${eventDate.toLocaleString('default', { month: 'long' })} ${eventDate.getFullYear()}`;

            document.getElementById('modal-title').textContent = event.EventName;
            document.getElementById('modal-date').textContent = formattedDate;
            document.getElementById('modal-time').textContent = event.EventTime;
            document.getElementById('modal-venue').textContent = event.EventVenue;
            document.getElementById('modal-type').textContent = event.EventType;
            document.getElementById('modal-description').textContent = event.EventDescription || 'No description available';

            modal.style.display = "block";
            modal.offsetHeight;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => modal.style.display = "none", 300);
    }

    span.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    let touchStartY = null;
    modalContent.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    modalContent.addEventListener('touchmove', (e) => {
        if (!touchStartY) return;
        const touchEndY = e.touches[0].clientY;
        if (touchStartY - touchEndY < -50 && modalContent.scrollTop === 0) {
            closeModal();
            touchStartY = null;
        }
    });

    modalContent.addEventListener('touchend', () => {
        touchStartY = null;
    });
}
