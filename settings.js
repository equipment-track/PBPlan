function saveSettings() {
    let inrRate = parseFloat(document.getElementById("inrRate").value);
    let monthlyTarget = document.getElementById("targetValue").value;
    let reminderTime = document.getElementById("notificationTime").value;
    let thresholdNotifications = document.getElementById("thresholdNotifications").checked;

    localStorage.setItem("inrRate", inrRate);
    localStorage.setItem("monthlyTarget", monthlyTarget);
    localStorage.setItem("reminderTime", reminderTime);
    localStorage.setItem("thresholdNotifications", thresholdNotifications);

    alert("Settings saved!");
}

function loadSettings() {
    document.getElementById("inrRate").value = localStorage.getItem("inrRate") || "";
    document.getElementById("targetValue").value = localStorage.getItem("monthlyTarget") || "";
    document.getElementById("notificationTime").value = localStorage.getItem("reminderTime") || "";
    document.getElementById("thresholdNotifications").checked = localStorage.getItem("thresholdNotifications") === "true";
}

document.addEventListener("DOMContentLoaded", loadSettings);