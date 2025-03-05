// Tab Switching Logic
function showTab(tabId) {
    let tabs = document.getElementsByClassName("tab-content");
    for (let tab of tabs) {
        tab.style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
}

// Show/Hide "Other" Category Input
function checkOtherCategory() {
    let category = document.getElementById("category").value;
    document.getElementById("otherCategory").style.display = category === "other" ? "block" : "none";
}

// Save Transaction
function saveTransaction() {
    let type = document.getElementById("type").value;
    let currency = document.getElementById("currency").value;
    let category = document.getElementById("category").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let date = document.getElementById("date").value;

    if (category === "other") {
        category = document.getElementById("otherCategory").value || "Other";
    }

    if (!amount || !date) {
        alert("Please fill all required fields!");
        return;
    }

    let conversionRate = parseFloat(localStorage.getItem("conversionRate")) || 22.2;
    let storedAmount = currency === "INR" ? amount / conversionRate : amount;

    let transaction = { type, category, amount: storedAmount, date };
    localStorage.setItem("transactions", JSON.stringify(transaction));

    alert("Transaction saved!");
}

// Save Settings
function saveSettings() {
    let target = document.getElementById("monthlyTarget").value;
    let conversionRate = document.getElementById("conversionRate").value;
    let reminderTime = document.getElementById("reminderTime").value;
    let dailyReminder = document.getElementById("dailyReminder").checked;
    let thresholdNotification = document.getElementById("thresholdNotification").checked;

    localStorage.setItem("conversionRate", conversionRate);
    alert("Settings saved!");
}