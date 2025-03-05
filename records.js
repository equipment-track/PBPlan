// Function to load transactions and display them on the Records tab
function loadTransactions() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let currencySwitch = document.getElementById("currencySwitch").value;
    let dateFilter = document.getElementById("dateFilter").value;
    let categoryFilter = document.getElementById("categoryFilter").value;
    let transactionList = document.getElementById("transactionList");

    transactionList.innerHTML = ""; // Clear the existing list

    // Load the conversion rate for INR to QAR from localStorage
    let conversionRate = parseFloat(localStorage.getItem("inrRate")) || 22.2;

    // Filter the transactions based on date and category
    let filteredTransactions = transactions.filter(tx => {
        // Filter by date if provided
        let isDateMatch = dateFilter ? tx.date === dateFilter : true;
        // Filter by category if provided
        let isCategoryMatch = categoryFilter ? tx.category === categoryFilter : true;
        return isDateMatch && isCategoryMatch;
    });

    filteredTransactions.forEach((tx) => {
        let displayAmount = tx.amount;

        if (currencySwitch === "INR") {
            // Convert QAR to INR if the selected currency is INR
            displayAmount = tx.amount * conversionRate;
            displayAmount = displayAmount.toFixed(2);
        } else {
            // Display as QAR if the selected currency is QAR
            displayAmount = tx.amount.toFixed(2);
        }

        // Create a list item for each filtered transaction
        let listItem = document.createElement("li");
        listItem.textContent = `${tx.date} - ${tx.category} (${tx.type}): ${displayAmount} ${currencySwitch}`;
        transactionList.appendChild(listItem);
    });
}

// Event listener to load transactions and handle currency switch
document.addEventListener("DOMContentLoaded", function () {
    loadTransactions();

    // When the currency selection changes, reload the transactions
    document.getElementById("currencySwitch").addEventListener("change", loadTransactions);

    // When the date filter changes, reload the transactions
    document.getElementById("dateFilter").addEventListener("change", loadTransactions);

    // When the category filter changes, reload the transactions
    document.getElementById("categoryFilter").addEventListener("change", loadTransactions);
});