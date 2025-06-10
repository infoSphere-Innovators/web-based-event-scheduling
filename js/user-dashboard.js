document.addEventListener("DOMContentLoaded", () => {
    const eventsBtn = document.getElementById("events-btn");
    const calendarBtn = document.getElementById("calendar-btn");
    const announcementBtn = document.getElementById("announcement-btn");

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
        window.location.href = "/html/announcements.html";
    });

    // Update current time
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
        setInterval(setTime, 60000); // Update every minute
    }

    // Initialize
    updateTime();
});