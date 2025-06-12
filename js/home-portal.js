const firebaseConfig = {
    apiKey: "AIzaSyC4YDw8dhp1qsJ7BhlNUSNHq3BxYzg6GDI",
    authDomain: "web-based-event-scheduling.firebaseapp.com",
    projectId: "web-based-event-scheduling",
    storageBucket: "web-based-event-scheduling.appspot.com",
    messagingSenderId: "925435406930",
    appId: "1:925435406930:web:48c759977c266a2cedcd8b"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Function to fetch and display announcements
function fetchAnnouncements() {
    const announcementsList = document.querySelector('#announcements-tab .announcement-list');
    if (!announcementsList) {
        console.error("Announcements container not found");
        return;
    }
    
    db.ref('announcements')
        .orderByChild('DateCreated')
        .limitToLast(3)
        .once('value')
        .then((snapshot) => {
            const announcements = [];
            snapshot.forEach((childSnapshot) => {
                announcements.unshift(childSnapshot.val());
            });

            if (announcements.length === 0) {
                announcementsList.innerHTML = `
                    <div class="announcement-item">
                        <div class="announcement-content">
                            <h3>No announcements available</h3>
                            <p>Check back later for updates.</p>
                        </div>
                    </div>`;
                return;
            }

            announcementsList.innerHTML = announcements.map(announcement => {
                const date = new Date(announcement.DateCreated);
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                }).toUpperCase();

                return `
                    <div class="announcement-item">
                        <div class="announcement-date">${formattedDate}</div>
                        <div class="announcement-content">
                            <h3>${announcement.AnnouncementName}</h3>
                            <p>${announcement.Description}</p>
                        </div>
                    </div>`;
            }).join('');
        })
        .catch((error) => {
            console.error("Error fetching announcements:", error);
            announcementsList.innerHTML = `
                <div class="announcement-item">
                    <div class="announcement-content">
                        <h3>Error loading announcements</h3>
                        <p>Please try again later.</p>
                    </div>
                </div>`;
        });
}

// Function to fetch and display latest events
function fetchLatestEvents() {
    const newsItems = document.querySelector('#events-tab .news-items');
    if (!newsItems) {
        console.error("News items container not found");
        return;
    }

    db.ref('events')
        .orderByChild('EventDate')
        .limitToLast(3)
        .once('value')
        .then((snapshot) => {
            const events = [];
            snapshot.forEach((childSnapshot) => {
                const event = childSnapshot.val();
                if (event.EventDate) {
                    events.unshift(event);
                }
            });

            if (events.length === 0) {
                newsItems.innerHTML = `
                    <div class="news-item">
                        <div class="news-content">
                            <h3>No events available</h3>
                            <p>Check back later for upcoming events.</p>
                        </div>
                    </div>`;
                return;
            }

            newsItems.innerHTML = events.map(event => {
                const eventDate = new Date(event.EventDate);
                const formattedDate = eventDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                }).toUpperCase();

                return `
                    <div class="news-item">
                        <div class="news-date">${formattedDate}</div>
                        <div class="news-content">
                            <h3>${event.EventName || 'Untitled Event'}</h3>
                            <p>${event.EventDescription || 'No description available'}</p>
                        </div>
                    </div>`;
            }).join('');
        })
        .catch((error) => {
            console.error("Error fetching events:", error);
            newsItems.innerHTML = `
                <div class="news-item">
                    <div class="news-content">
                        <h3>Error loading events</h3>
                        <p>Please try again later.</p>
                    </div>
                </div>`;
        });
}

// Initialize tabs and fetch data
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(`${tab}-tab`).classList.add('active');

            // Fetch appropriate data when tab is clicked
            if (tab === 'events') {
                fetchLatestEvents();
            } else if (tab === 'announcements') {
                fetchAnnouncements();
            }
        });
    });

    // Initial data fetch based on active tab
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    if (activeTab === 'events') {
        fetchLatestEvents();
    } else if (activeTab === 'announcements') {
        fetchAnnouncements();
    }

    // FAQ Accordion functionality
    const faqBoxes = document.querySelectorAll('.faq-box');
    
    faqBoxes.forEach(box => {
        box.addEventListener('click', () => {
            // Close all other boxes
            faqBoxes.forEach(otherBox => {
                if (otherBox !== box && otherBox.classList.contains('active')) {
                    otherBox.classList.remove('active');
                }
            });
            // Toggle current box
            box.classList.toggle('active');
        });
    });
});

// Update the HTML structure for announcements tab
