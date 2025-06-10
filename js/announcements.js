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

    // Set announcement button as active on load and start time updates
    setActiveTab(announcementBtn);
    updateTime();
});

const mockAnnouncements = [
{
    id: 1,
    title: "Custom Domain Name Support",
    publishInfo: "Custom Domain Names",
    status: "Published",
    description: "We're excited to announce that custom domain name support is now available for all premium users. This feature allows you to use your own domain for your workspace.",
    reminders: [
    "Domain verification process takes up to 24 hours",
    "SSL certificates are automatically generated",
    "DNS settings need to be updated on your domain provider"
    ],
    notes: "This feature is only available for premium tier users. Please contact support if you need assistance with the setup process."
},
{
    id: 2,
    title: "Multiple Workspaces",
    publishInfo: "Multiple Accounts Under One Login",
    status: "Published",
    description: "You can now create and manage multiple workspaces under a single account. Switch between different workspaces without logging out.",
    reminders: [
    "Up to 5 workspaces per account on Pro plan",
    "Each workspace has separate billing",
    "Team members can be invited to specific workspaces"
    ],
    notes: "We recommend using different workspaces for different projects or clients to keep your work organized."
},
{
    id: 3,
    title: "IdeaPlan API",
    publishInfo: "",
    status: "Published",
    description: "Our new API allows developers to integrate IdeaPlan functionality into their own applications and workflows.",
    reminders: [
    "API keys can be generated in the settings panel",
    "Rate limits apply based on your plan",
    "Documentation is available at api.ideaplan.com"
    ],
    notes: "The API is currently in beta. Please report any issues to our support team."
},
{
    id: 4,
    title: "Zapier Integration",
    publishInfo: "",
    status: "Published",
    description: "Connect IdeaPlan with over 3,000 apps using our new Zapier integration. Automate your workflow and save time.",
    reminders: [
    "Zapier account required",
    "Available triggers: new idea, status change, comment added",
    "Available actions: create idea, update status, add comment"
    ],
    notes: "Check out our template Zaps to get started quickly with popular integrations."
},
{
    id: 5,
    title: "Custom Statuses For Ideas",
    publishInfo: "Private Boards",
    status: "Published",
    description: "You can now create custom statuses for your ideas to better reflect your workflow.",
    reminders: [
    "Up to 10 custom statuses per board",
    "Statuses can be color-coded",
    "Default statuses can be modified or disabled"
    ],
    notes: "Custom statuses are only available on Pro and Enterprise plans."
},
{
    id: 6,
    title: "Private Idea Boards",
    publishInfo: "Some lorem ipsum text",
    status: "Published",
    description: "Create private boards that are only visible to selected team members.",
    reminders: [
    "Private boards are not visible in the main dashboard",
    "Only invited members can access private boards",
    "Board owner can manage permissions"
    ],
    notes: "Private boards are perfect for sensitive projects or ideas that are not ready to be shared with the entire team."
},
{
    id: 7,
    title: "Custom Statuses For Ideas",
    publishInfo: "Private Boards",
    status: "Published",
    description: "Additional instance of custom statuses feature with slightly different details.",
    reminders: [
    "Drag and drop interface for status management",
    "Export status reports",
    "Integrate with project management tools"
    ],
    notes: "Contact your account manager for a demo of advanced status features."
},
{
    id: 8,
    title: "Private Idea Boards",
    publishInfo: "Some lorem ipsum text",
    status: "Published",
    description: "Another instance of private boards with additional information.",
    reminders: [
    "Archive unused private boards to keep workspace clean",
    "Transfer ownership option available",
    "Activity logs track all changes"
    ],
    notes: "We recommend reviewing access permissions regularly for security purposes."
}
];

const announcementList = document.getElementById('announcement-list');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalReminders = document.getElementById('modal-reminders');
const modalNotes = document.getElementById('modal-notes');
const modalCloseButtons = [document.getElementById('modal-close'), document.getElementById('modal-close-footer')];

function openModal(announcement) {
modalTitle.textContent = announcement.title;
modalDescription.textContent = announcement.description;

// Clear and add reminders
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

modalCloseButtons.forEach(btn => btn.addEventListener('click', closeModal));

// Clicking outside modal closes it
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

renderAnnouncements();