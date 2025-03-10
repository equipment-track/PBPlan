function checkOtherCategory() {
    let category = document.getElementById("category").value;
    document.getElementById("otherCategory").style.display = category === "Other" ? "block" : "none";
}

function addTransaction() {
    let type = document.getElementById("type").value;
    let currency = document.getElementById("currency").value;
    let date = document.getElementById("date").value;
    let category = document.getElementById("category").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let notes = document.getElementById("notes").value; // Capture notes

    // Handle "Other" category input
    if (category === "Other") {
        category = document.getElementById("otherCategory").value || "Other";
    }

    // Ensure amount and date are filled
    if (!amount || !date) {
        alert("Please fill in all required fields!");
        return;
    }

    // Convert INR to QAR if INR is selected
    let storedAmount = amount;
    if (currency === "INR") {
        let conversionRate = parseFloat(localStorage.getItem("inrRate")) || 22.2; // Retrieve INR conversion rate from localStorage
        storedAmount = amount / conversionRate; // Convert to QAR
    }

    // Save the transaction data including notes
    let transaction = { type, category, amount: storedAmount, date, notes }; // Add notes
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);

    // Store updated transactions in localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    alert("Transaction saved!");
    // Update dashboard totals and UI
    calculateTotals(); // Recalculate totals
    updateDashboardValues("QAR"); // Update UI with QAR values (or "INR" if currency switch is checked)
    loadTransactions();
}

// Load transactions from localStorage (if any)
function loadTransactions() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let transactionList = document.getElementById("transactionList");
    transactionList.innerHTML = ""; // Clear existing list

    transactions.forEach(transaction => {
        let listItem = document.createElement("li");
        listItem.textContent = `${transaction.date} - ${transaction.type} - ${transaction.category} - ${transaction.amount} QAR`;
        transactionList.appendChild(listItem);
    });
}

// Event listener to handle category change
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("category").addEventListener("change", checkOtherCategory);
});