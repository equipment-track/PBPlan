// Function to save the settings to localStorage
function saveSettings() {
    // Get values from the settings inputs
    let inrRate = parseFloat(document.getElementById("inrRate").value);
    let monthlyTarget = document.getElementById("targetValue").value;
    let reminderTime = document.getElementById("reminderTime").value;
    let thresholdNotifications = document.getElementById("thresholdNotifications").checked;
    
    // Check if daily reminder is enabled
    let dailyReminderEnabled = document.getElementById("dailyReminder").checked;
    let dailyReminderTime = dailyReminderEnabled ? document.getElementById("reminderTime").value : null;

    // Get the custom reminder details
    let customReminderDate = document.getElementById("customReminderDate").value;
    let customReminderTime = document.getElementById("customReminderTime").value;
    let customReminderText = document.getElementById("customReminderText").value;

    // Validate the INR rate and monthly target (they should be numbers)
    if (isNaN(inrRate) || isNaN(monthlyTarget)) {
        alert("Please enter valid numbers for INR rate and Monthly Target.");
        return;
    }

    // Store the settings in localStorage
    localStorage.setItem("inrRate", inrRate);
    localStorage.setItem("monthlyTarget", monthlyTarget);
    localStorage.setItem("thresholdNotifications", thresholdNotifications);
    localStorage.setItem("dailyReminderEnabled", dailyReminderEnabled);
    localStorage.setItem("dailyReminderTime", dailyReminderTime);
    localStorage.setItem("customReminderDate", customReminderDate);
    localStorage.setItem("customReminderTime", customReminderTime);
    localStorage.setItem("customReminderText", customReminderText);

    alert("Settings saved!");
}

// Function to load settings from localStorage
function loadSettings() {
    // Retrieve settings from localStorage or set default values
    let inrRate = localStorage.getItem("inrRate") || "";
    let monthlyTarget = localStorage.getItem("monthlyTarget") || "";
    let thresholdNotifications = localStorage.getItem("thresholdNotifications") === "true"; // Convert string to boolean
    let dailyReminderEnabled = localStorage.getItem("dailyReminderEnabled") === "true"; // Convert string to boolean
    let dailyReminderTime = localStorage.getItem("dailyReminderTime") || "";
    let customReminderDate = localStorage.getItem("customReminderDate") || "";
    let customReminderTime = localStorage.getItem("customReminderTime") || "";
    let customReminderText = localStorage.getItem("customReminderText") || "";

    // Apply the values to the settings form
    document.getElementById("inrRate").value = inrRate;
    document.getElementById("targetValue").value = monthlyTarget;
    document.getElementById("thresholdNotifications").checked = thresholdNotifications;
    document.getElementById("dailyReminder").checked = dailyReminderEnabled;
    document.getElementById("reminderTime").value = dailyReminderTime;
    document.getElementById("customReminderDate").value = customReminderDate;
    document.getElementById("customReminderTime").value = customReminderTime;
    document.getElementById("customReminderText").value = customReminderText;

    // Show or hide the reminder time section based on the daily reminder status
    toggleReminderTimeInput();
}

// Function to show or hide the reminder time input based on the daily reminder checkbox
function toggleReminderTimeInput() {
    let reminderTimeSection = document.getElementById("reminderTimeSection");
    if (document.getElementById("dailyReminder").checked) {
        reminderTimeSection.style.display = "block";
    } else {
        reminderTimeSection.style.display = "none";
    }
}

// Event listener to load the settings when the page is ready
document.addEventListener("DOMContentLoaded", function () {
    loadSettings();
    document.getElementById("dailyReminder").addEventListener("change", toggleReminderTimeInput);
});