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

// Save INR & Target
function saveBudgetSettings() {
    let inrRate = parseFloat(document.getElementById("inrRate").value);
    let monthlyTarget = parseFloat(document.getElementById("targetValue").value);

    if (isNaN(inrRate) || isNaN(monthlyTarget)) {
        alert("Please enter valid numbers.");
        return;
    }

    localStorage.setItem("inrRate", inrRate);
    localStorage.setItem("monthlyTarget", monthlyTarget);
    alert("Budget settings saved!");
}

// Save Daily & Threshold Notifications
function saveNotificationSettings() {
    let dailyReminderEnabled = document.getElementById("dailyReminder").checked;
    let dailyReminderTime = dailyReminderEnabled ? document.getElementById("reminderTime").value : null;
    let thresholdEnabled = document.getElementById("thresholdNotifications").checked;

    localStorage.setItem("dailyReminderEnabled", dailyReminderEnabled);
    localStorage.setItem("dailyReminderTime", dailyReminderTime);
    localStorage.setItem("thresholdNotifications", thresholdEnabled);

    alert("Notification settings saved!");
    scheduleDailyReminder();
}

// Show Notifications
function showNotification(title, message) {
    if (Notification.permission === "granted") {
        new Notification(title, { body: message });
    }
}

// Schedule Daily Reminder
function scheduleDailyReminder() {
    let dailyReminderEnabled = localStorage.getItem("dailyReminderEnabled") === "true";
    let reminderTime = localStorage.getItem("dailyReminderTime");

    if (dailyReminderEnabled && reminderTime) {
        let [hours, minutes] = reminderTime.split(":");
        let now = new Date();
        let reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);

        if (reminderDate < now) {
            reminderDate.setDate(reminderDate.getDate() + 1);
        }

        let delay = reminderDate - now;
        setTimeout(() => {
            showNotification("Daily Reminder", "Don't forget to update your expenses today!");
            scheduleDailyReminder(); // Reschedule for the next day
        }, delay);
    }
}

// Check Threshold Notifications (50%, 75%, 90%, 100%)
function checkThresholdNotifications() {
    let thresholdEnabled = localStorage.getItem("thresholdNotifications") === "true";
    if (!thresholdEnabled) return;

    let monthlyTarget = parseFloat(localStorage.getItem("monthlyTarget")) || 0;
    let totalSpent = parseFloat(localStorage.getItem("totalSpent")) || 0;
    let percentage = (totalSpent / monthlyTarget) * 100;

    if (percentage >= 50 && percentage < 75) {
        showNotification("Budget Alert", "You have reached 50% of your budget.");
    } else if (percentage >= 75 && percentage < 90) {
        showNotification("Budget Alert", "You have reached 75% of your budget.");
    } else if (percentage >= 90 && percentage < 100) {
        showNotification("Budget Alert", "You have reached 90% of your budget.");
    } else if (percentage >= 100) {
        showNotification("Budget Alert", "You have reached 100% of your budget! Consider reviewing expenses.");
    }
}

// Add Custom Reminders
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

// Display Custom Reminders
function displayReminders() {
    let reminders = JSON.parse(localStorage.getItem("customReminders")) || [];
    let reminderList = document.getElementById("reminderList");
    reminderList.innerHTML = "";

    reminders.forEach((reminder, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = `${reminder.date} ${reminder.time} - ${reminder.message}`;
        reminderList.appendChild(listItem);
    });
}

// Schedule Custom Reminder Notifications
function scheduleCustomReminder(reminder) {
    let now = new Date();
    let reminderDate = new Date(reminder.date + " " + reminder.time);

    if (reminderDate > now) {
        let delay = reminderDate - now;
        setTimeout(() => {
            showNotification("Custom Reminder", reminder.message);
        }, delay);
    }
}

// Load Settings
document.addEventListener("DOMContentLoaded", function () {
    requestNotificationPermission();
    displayReminders();
    scheduleDailyReminder();
});