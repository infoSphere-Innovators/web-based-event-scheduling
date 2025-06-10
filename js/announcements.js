document.addEventListener('DOMContentLoaded', () => {
  const eventsBtn = document.getElementById('events-btn');
  const calendarBtn = document.getElementById('calendar-btn');
  const announcementBtn = document.getElementById('announcement-btn');

  // Navigation Event Listeners
  eventsBtn.addEventListener('click', () => {
    setActiveTab(eventsBtn);
    window.location.href = '/html/user-dashboard.html';
  });

  calendarBtn.addEventListener('click', () => {
    setActiveTab(calendarBtn);
    window.location.href = '/html/calendar.html';
  });

  announcementBtn.addEventListener('click', () => {
    setActiveTab(announcementBtn);
    // Already on announcements page
  });

  // Helper function to set active tab
  function setActiveTab(button) {
    document.querySelectorAll('.nav-left button').forEach(btn => {
      btn.classList.remove('active-tab');
    });
    button.classList.add('active-tab');
  }

  // Update current time
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
      timeElement.innerHTML = `<strong>${time}</strong>`;
    }

    setTime();
    setInterval(setTime, 60000); // Update every minute
  }

  // Initialize active tab and time
  setActiveTab(announcementBtn);
  updateTime();
});

// --- Announcements Logic ---
const mockAnnouncements = [
  {
    id: 1,
    title: "Custom Domain Name Support",
    publishInfo: "Custom Domain Names",
    status: "Published",
    description: "We're excited to announce that custom domain name support is now available for all premium users...",
    reminders: [
      "Domain verification process takes up to 24 hours",
      "SSL certificates are automatically generated",
      "DNS settings need to be updated on your domain provider"
    ],
    notes: "This feature is only available for premium tier users. Please contact support if you need assistance."
  },
  {
    id: 2,
    title: "Multiple Workspaces",
    publishInfo: "Multiple Accounts Under One Login",
    status: "Published",
    description: "You can now create and manage multiple workspaces under a single account...",
    reminders: [
      "Up to 5 workspaces per account on Pro plan",
      "Each workspace has separate billing",
      "Team members can be invited to specific workspaces"
    ],
    notes: "Use different workspaces for different projects to stay organized."
  },
  {
    id: 3,
    title: "IdeaPlan API",
    publishInfo: "",
    status: "Published",
    description: "Our new API allows developers to integrate IdeaPlan functionality into their own applications...",
    reminders: [
      "API keys can be generated in the settings panel",
      "Rate limits apply based on your plan",
      "Documentation is available at api.ideaplan.com"
    ],
    notes: "The API is currently in beta. Report issues to support."
  },
  // Additional announcements omitted for brevity...
];

const announcementList = document.getElementById('announcement-list');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalReminders = document.getElementById('modal-reminders');
const modalNotes = document.getElementById('modal-notes');

// ✅ Safe modal close listener setup (avoids null errors)
document.querySelectorAll('#modal-close, #modal-close-footer')
  .forEach(btn => btn.addEventListener('click', closeModal));

function openModal(announcement) {
  modalTitle.textContent = announcement.title;
  modalDescription.textContent = announcement.description;

  modalReminders.innerHTML = '';
  announcement.reminders.forEach(reminder => {
    const li = document.createElement('li');
    li.textContent = reminder;
    modalReminders.appendChild(li);
  });

  modalNotes.textContent = announcement.notes;
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

// Clicking outside modal content closes the modal
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

function renderAnnouncements() {
  announcementList.innerHTML = '';
  mockAnnouncements.forEach(ann => {
    const item = document.createElement('div');
    item.className = 'announcement-item';
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-pressed', 'false');
    item.setAttribute('aria-label', `Announcement: ${ann.title}, status: ${ann.status}`);

    item.innerHTML = `
      <div class="announcement-title">${ann.title}</div>
      <div class="announcement-publish">${ann.publishInfo || 'N/A'}</div>
      <div class="announcement-status"><span class="status-label">${ann.status}</span></div>
    `;

    item.addEventListener('click', () => openModal(ann));
    item.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        openModal(ann);
      }
    });

    announcementList.appendChild(item);
  });
}

// Initialize list
renderAnnouncements();
