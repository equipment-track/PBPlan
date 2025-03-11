// Function to calculate total income and expenses
function calculateTotals() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let totalIncome = 0, totalExpense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "Income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    let totalBalance = totalIncome - totalExpense;

    // Store calculated values in localStorage for easy retrieval
    localStorage.setItem("totalIncome", totalIncome);
    localStorage.setItem("totalExpense", totalExpense);
    localStorage.setItem("totalBalance", totalBalance);

    // Display values in QAR by default
    updateDashboardValues("QAR");
}

// Function to update dashboard values based on selected currency
function updateDashboardValues(currency) {
    let totalIncome = parseFloat(localStorage.getItem("totalIncome")) || 0;
    let totalExpense = parseFloat(localStorage.getItem("totalExpense")) || 0;
    let estimatedTarget = parseFloat(localStorage.getItem("monthlyTarget")) || 0;

    let totalBalance = estimatedTarget + totalIncome - totalExpense;
    
    // Ensure 2 decimal places for all displayed values
    totalIncome = totalIncome.toFixed(2);
    totalExpense = totalExpense.toFixed(2);
    totalBalance = totalBalance.toFixed(2);
    estimatedTarget = estimatedTarget.toFixed(2);

    let inrRate = parseFloat(localStorage.getItem("inrRate")) || 22.2; // Default conversion rate

    // Convert values to INR if selected
    if (currency === "INR") {
        totalIncome = (totalIncome * inrRate).toFixed(2);
        totalExpense = (totalExpense * inrRate).toFixed(2);
        totalBalance = (totalBalance * inrRate).toFixed(2);
        estimatedTarget = (estimatedTarget * inrRate).toFixed(2);
    }

    // Update UI with converted values
    document.getElementById("totalIncome").innerText = `${totalIncome} ${currency}`;
    document.getElementById("totalExpense").innerText = `${totalExpense} ${currency}`;
    document.getElementById("totalBalance").innerText = `${totalBalance} ${currency}`;
    document.getElementById("estimatedTarget").innerText = `${estimatedTarget} ${currency}`;
}

// Event listener for currency switch
document.getElementById("currencySwitch").addEventListener("change", function () {
    updateDashboardValues(this.checked ? "INR" : "QAR");
});

// Load dashboard values on page load
document.addEventListener("DOMContentLoaded", function () {
    calculateTotals();
});