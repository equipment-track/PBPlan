// Request Notification Permission
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            } else {
                alert("Enable notifications for reminders.");
            }
        });
    }
}

// Save Settings
function saveSettings() {
    let inrRate = parseFloat(document.getElementById("inrRate").value);
    let monthlyTarget = parseFloat(document.getElementById("targetValue").value);
    let dailyReminderEnabled = document.getElementById("dailyReminder").checked;
    let dailyReminderTime = dailyReminderEnabled ? document.getElementById("reminderTime").value : null;
    let thresholdNotifications = document.getElementById("thresholdNotifications").checked;

    if (isNaN(inrRate) || isNaN(monthlyTarget)) {
        alert("Please enter valid numbers for INR rate and Monthly Target.");
        return;
    }

    localStorage.setItem("inrRate", inrRate);
    localStorage.setItem("monthlyTarget", monthlyTarget);
    localStorage.setItem("thresholdNotifications", thresholdNotifications);
    localStorage.setItem("dailyReminderEnabled", dailyReminderEnabled);
    localStorage.setItem("dailyReminderTime", dailyReminderTime);

    alert("Settings saved!");
}

// Load Settings on Page Load
function loadSettings() {
    document.getElementById("inrRate").value = localStorage.getItem("inrRate") || "";
    document.getElementById("targetValue").value = localStorage.getItem("monthlyTarget") || "";
    document.getElementById("thresholdNotifications").checked = localStorage.getItem("thresholdNotifications") === "true";
    document.getElementById("dailyReminder").checked = localStorage.getItem("dailyReminderEnabled") === "true";
    document.getElementById("reminderTime").value = localStorage.getItem("dailyReminderTime") || "";

    displayReminders();
    scheduleDailyReminder();
    scheduleThresholdNotifications();
}

// Show or Hide Reminder Time Input
function toggleReminderTimeInput() {
    let section = document.getElementById("reminderTimeSection");
    section.style.display = document.getElementById("dailyReminder").checked ? "block" : "none";
}

// Daily Reminder Notification
function scheduleDailyReminder() {
    let dailyReminderEnabled = localStorage.getItem("dailyReminderEnabled") === "true";
    let dailyReminderTime = localStorage.getItem("dailyReminderTime");

    if (dailyReminderEnabled && dailyReminderTime) {
        let now = new Date();
        let reminderTime = new Date();
        let [hours, minutes] = dailyReminderTime.split(":");
        reminderTime.setHours(hours, minutes, 0, 0);

        if (reminderTime > now) {
            let delay = reminderTime - now;
            setTimeout(() => {
                showNotification("Daily Reminder", "Don't forget to update your expenses!");
            }, delay);
        }
    }
}

// Threshold Notifications (50%, 75%, 90%, 100%)
function scheduleThresholdNotifications() {
    let monthlyTarget = parseFloat(localStorage.getItem("monthlyTarget") || 0);
    let thresholdEnabled = localStorage.getItem("thresholdNotifications") === "true";

    if (monthlyTarget > 0 && thresholdEnabled) {
        let spent = parseFloat(localStorage.getItem("totalExpenses") || 0);
        let percentages = [50, 75, 90, 100];
        percentages.forEach(percentage => {
            let threshold = (monthlyTarget * percentage) / 100;
            if (spent >= threshold) {
                showNotification("Budget Alert", `You have spent ${percentage}% of your target!`);
            }
        });
    }
}

// Add Custom Reminder
function addCustomReminder() {
    let date = document.getElementById("customReminderDate").value;
    let time = document.getElementById("customReminderTime").value;
    let message = document.getElementById("customReminderText").value;

    if (!date || !time || !message) {
        alert("Please fill all fields.");
        return;
    }

    let reminders = JSON.parse(localStorage.getItem("customReminders")) || [];
    let reminder = { date, time, message };
    reminders.push(reminder);
    localStorage.setItem("customReminders", JSON.stringify(reminders));

    displayReminders();
    scheduleCustomReminder(reminder);
}

// Display Custom Reminders with Delete Button
function displayReminders() {
    let reminders = JSON.parse(localStorage.getItem("customReminders")) || [];
    let reminderList = document.getElementById("reminderList");
    reminderList.innerHTML = "";

    reminders.forEach((reminder, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = `${reminder.date} ${reminder.time} - ${reminder.message}`;

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => removeReminder(index);
        deleteButton.style.marginLeft = "10px";

        listItem.appendChild(deleteButton);
        reminderList.appendChild(listItem);
    });
}

// Remove Custom Reminder
function removeReminder(index) {
    let reminders = JSON.parse(localStorage.getItem("customReminders")) || [];
    reminders.splice(index, 1);
    localStorage.setItem("customReminders", JSON.stringify(reminders));
    displayReminders();
}

// Schedule Custom Reminder Notifications
function scheduleCustomReminder(reminder) {
    let now = new Date();
    let reminderDate = new Date(`${reminder.date}T${reminder.time}`);

    if (reminderDate > now) {
        let delay = reminderDate - now;
        setTimeout(() => {
            showNotification("Custom Reminder", reminder.message);
        }, delay);
    }
}

// Show Notifications
function showNotification(title, message) {
    if (Notification.permission === "granted") {
        new Notification(title, { body: message });
    }
}

// Load Settings on Page Load
document.addEventListener("DOMContentLoaded", function () {
    requestNotificationPermission();
    loadSettings();
});

// Request notification permission on page load
document.addEventListener("DOMContentLoaded", () => {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
        });
    }
});

// Send a test notification when button is clicked
document.getElementById("notifyBtn").addEventListener("click", () => {
    if (Notification.permission === "granted") {
        new Notification("Test Notification", {
            body: "This is a test push notification!",
            icon: "icon-192x192.png"
        });
    } else {
        alert("Please allow notifications in your browser settings.");
    }
});