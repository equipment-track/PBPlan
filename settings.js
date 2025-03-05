// Function to save the settings to localStorage
function saveSettings() {
    // Get values from the settings inputs
    let inrRate = parseFloat(document.getElementById("inrRate").value);
    let monthlyTarget = document.getElementById("targetValue").value;
    let reminderTime = document.getElementById("notificationTime").value;
    let thresholdNotifications = document.getElementById("thresholdNotifications").checked;

    // Validate the INR rate and monthly target (they should be numbers)
    if (isNaN(inrRate) || isNaN(monthlyTarget)) {
        alert("Please enter valid numbers for INR rate and Monthly Target.");
        return;
    }

    // Store the settings in localStorage
    localStorage.setItem("inrRate", inrRate);
    localStorage.setItem("monthlyTarget", monthlyTarget);
    localStorage.setItem("reminderTime", reminderTime);
    localStorage.setItem("thresholdNotifications", thresholdNotifications);

    alert("Settings saved!");
}

// Function to load settings from localStorage
function loadSettings() {
    // Retrieve settings from localStorage or set default values
    let inrRate = localStorage.getItem("inrRate") || "";
    let monthlyTarget = localStorage.getItem("monthlyTarget") || "";
    let reminderTime = localStorage.getItem("reminderTime") || "";
    let thresholdNotifications = localStorage.getItem("thresholdNotifications") === "true"; // Convert string to boolean

    // Apply the values to the settings form
    document.getElementById("inrRate").value = inrRate;
    document.getElementById("targetValue").value = monthlyTarget;
    document.getElementById("notificationTime").value = reminderTime;
    document.getElementById("thresholdNotifications").checked = thresholdNotifications;
}

// Event listener to load the settings when the page is ready
document.addEventListener("DOMContentLoaded", loadSettings);