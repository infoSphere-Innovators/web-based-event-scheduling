// Firebase configuration
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
const auth = firebase.auth();
const db = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const eventsBtn = document.getElementById('events-btn');
    const calendarBtn = document.getElementById('calendar-btn');
    const announcementBtn = document.getElementById('announcement-btn');
    const loginBtn = document.getElementById('login');
    const signupBtn = document.getElementById('signup');
    const userBtn = document.getElementById('userBtn');
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    const modal = document.getElementById('modal');
    const modalCloseBtn = document.getElementById('modal-close-footer');

    // Navigation handlers
    eventsBtn.addEventListener('click', () => {
        window.location.href = '/html/user-dashboard.html';
    });

    calendarBtn.addEventListener('click', () => {
        window.location.href = '/html/calendar.html';
    });

    // Auth button handlers
    loginBtn?.addEventListener('click', () => {
        window.location.href = 'login-page.html';
    });

    signupBtn?.addEventListener('click', () => {
        window.location.href = '/html/signup-page/signup-page.html';
    });

    userBtn?.addEventListener('click', () => {
        const uid = userBtn.dataset.uid;
        window.location.href = `profile-details.html?uid=${uid}`;
    });

    // Notification dropdown handlers
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.style.display = notifDropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.notification-wrapper')) {
            notifDropdown.style.display = 'none';
        }
    });

    // Modal handlers
    modalCloseBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Auth state observer
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const uid = user.uid;
            try {
                const snapshot = await db.ref(`members/${uid}`).once('value');
                if (snapshot.exists() && snapshot.val().Approved === true) {
                    showAuthenticatedView(uid);
                } else {
                    showGuestView();
                }
            } catch (error) {
                console.error('Failed to check user approval:', error);
                showGuestView();
            }
        } else {
            showGuestView();
        }
    });

    // Initialize the page
    initializePage();

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            closeAnnouncementModal();
        });
    } else {
        console.error("Modal close button not found!");
    }

    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLeft = document.querySelector('.nav-left');
    const menuOverlay = document.querySelector('.menu-overlay');

    // Toggle navigation
    hamburgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburgerMenu.classList.toggle('active');
        navLeft.classList.toggle('show');
        menuOverlay.classList.toggle('active');
    });

    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        navLeft.classList.remove('show');
        menuOverlay.classList.remove('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-left') && 
            !event.target.closest('.hamburger-menu')) {
            hamburgerMenu.classList.remove('active');
            navLeft.classList.remove('show');
            menuOverlay.classList.remove('active');
        }
    });

    // Close menu when a nav item is clicked
    navLeft.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navLeft.classList.remove('show');
            menuOverlay.classList.remove('active');
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburgerMenu.classList.remove('active');
            navLeft.classList.remove('show');
            menuOverlay.classList.remove('active');
        }
    });
});

// Helper Functions
function showAuthenticatedView(uid) {
    const loginBtn = document.getElementById('login');
    const signupBtn = document.getElementById('signup');
    const userBtn = document.getElementById('userBtn');
    
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    userBtn.style.display = 'inline-block';
    userBtn.dataset.uid = uid;
}

function showGuestView() {
    const loginBtn = document.getElementById('login');
    const signupBtn = document.getElementById('signup');
    const userBtn = document.getElementById('userBtn');
    
    loginBtn.style.display = 'inline-block';
    signupBtn.style.display = 'inline-block';
    userBtn.style.display = 'none';
}

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

function initializePage() {
    document.getElementById('announcement-btn').classList.add('active-tab');
    updateTime();
    fetchAnnouncements(); // Add this line
}

// Add this new function to fetch and display announcements
async function fetchAnnouncements() {
    const announcementList = document.getElementById('announcement-list');
    
    try {
        const snapshot = await db.ref('announcements').once('value');
        const announcements = snapshot.val();
        
        if (!announcements) {
            announcementList.innerHTML = `
                <div class="announcement-item">
                    <div class="announcement-title">No announcements available</div>
                </div>`;
            return;
        }

        // Convert to array and sort by date (newest first)
        const announcementArray = Object.values(announcements).sort((a, b) => {
            const dateA = new Date(`${a.DateCreated} ${a.TimeCreated}`);
            const dateB = new Date(`${b.DateCreated} ${b.TimeCreated}`);
            return dateB - dateA;
        });

        // Clear existing announcements
        announcementList.innerHTML = '';

        // Create announcement items
        announcementArray.forEach(announcement => {
            const date = new Date(`${announcement.DateCreated} ${announcement.TimeCreated}`);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const announcementItem = document.createElement('div');
            announcementItem.className = 'announcement-item';
            announcementItem.innerHTML = `
                <div class="announcement-title">${announcement.AnnouncementName}</div>
                <div class="announcement-publish">
                    <i class="fas fa-clock"></i> ${formattedDate} at ${formattedTime}
                </div>
                <div class="announcement-status">
                    <span class="status-label">See Details</span>
                </div>
            `;

            // Add click event to show modal
            announcementItem.addEventListener('click', () => {
                showAnnouncementModal(announcement);
            });

            announcementList.appendChild(announcementItem);
        });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        announcementList.innerHTML = `
            <div class="announcement-item">
                <div class="announcement-title">Error loading announcements</div>
            </div>`;
    }
}

// Add this function to handle modal display
function showAnnouncementModal(announcement) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalReminders = document.getElementById('modal-reminders');
    const modalNotes = document.getElementById('modal-notes');
    const descriptionSection = document.getElementById('description-section');
    const remindersSection = document.getElementById('reminders-section');
    const notesSection = document.getElementById('notes-section');

    // Set modal content
    modalTitle.textContent = announcement.AnnouncementName;
    
    // Handle description
    if (announcement.Description && announcement.Description.trim() !== '') {
        modalDescription.textContent = announcement.Description;
        descriptionSection.style.display = 'block';
    } else {
        descriptionSection.style.display = 'none';
    }

    // Handle reminders
    modalReminders.innerHTML = '';
    if (announcement.Reminders && announcement.Reminders !== 'None') {
        const reminders = Array.isArray(announcement.Reminders) 
            ? announcement.Reminders 
            : [announcement.Reminders];
        
        reminders.forEach(reminder => {
            const li = document.createElement('li');
            li.textContent = reminder;
            modalReminders.appendChild(li);
        });
        remindersSection.style.display = 'block';
    } else {
        const li = document.createElement('li');
        li.textContent = 'No reminders';
        modalReminders.appendChild(li);
        remindersSection.style.display = 'block';
    }

    // Handle notes
    if (announcement.Notes && announcement.Notes !== 'N/A') {
        modalNotes.textContent = announcement.Notes;
        notesSection.style.display = 'block';
    } else {
        modalNotes.textContent = 'No additional notes';
        notesSection.style.display = 'block';
    }

    // Show modal with animation
    modal.classList.add('show');
    
    // Trap focus inside modal for accessibility
    trapFocus(modal);
    
    // Add ESC key handler
    document.addEventListener('keydown', handleEscKey);
}

// Function to close the modal
function closeAnnouncementModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    
    // Remove ESC key handler
    document.removeEventListener('keydown', handleEscKey);
}

// Handle ESC key
function handleEscKey(event) {
    if (event.key === 'Escape') {
        closeAnnouncementModal();
    }
}

// Trap focus inside modal for accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    firstFocusableElement.focus();

    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Add real-time updates
function setupRealtimeUpdates() {
    db.ref('announcements').on('value', (snapshot) => {
        fetchAnnouncements();
    });
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize real-time updates
    setupRealtimeUpdates();
});

// Add this at the end of your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Your existing code...
    
    // Make sure to get fresh references to these elements
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLeft = document.querySelector('.nav-left');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    console.log('Hamburger menu element:', hamburgerMenu); // Debug log
    console.log('Nav left element:', navLeft); // Debug log
    console.log('Menu overlay element:', menuOverlay); // Debug log
    
    if (hamburgerMenu && navLeft && menuOverlay) {
        // Toggle navigation
        hamburgerMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked'); // Debug log
            
            hamburgerMenu.classList.toggle('active');
            navLeft.classList.toggle('show');
            menuOverlay.classList.toggle('active');
        });
        
        // Close menu when clicking overlay
        menuOverlay.addEventListener('click', function() {
            hamburgerMenu.classList.remove('active');
            navLeft.classList.remove('show');
            menuOverlay.classList.remove('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-left') && 
                !event.target.closest('.hamburger-menu')) {
                hamburgerMenu.classList.remove('active');
                navLeft.classList.remove('show');
                menuOverlay.classList.remove('active');
            }
        });
        
        // Close menu when a nav item is clicked
        const navButtons = navLeft.querySelectorAll('button');
        navButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                navLeft.classList.remove('show');
                menuOverlay.classList.remove('active');
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburgerMenu.classList.remove('active');
                navLeft.classList.remove('show');
                menuOverlay.classList.remove('active');
            }
        });
    } else {
        console.error('Hamburger menu elements not found');
    }
});

document.getElementById("login").addEventListener("click", function () {
    window.location.href = "/html/login-page.html"; // change this to your target page
  });

document.getElementById("signup").addEventListener("click", function () {
    window.location.href = "/html/signup-page/signup-page.html"; // change this to your target page
  });