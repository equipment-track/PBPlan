// Function to load transactions and display them on the Records tab
function loadTransactions() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let currencySwitch = document.getElementById("currencySwitch").value;
    let dateFilter = document.getElementById("dateFilter").value;
    let categoryFilter = document.getElementById("categoryFilter").value;
    let otherCategoryInput = document.getElementById("otherCategoryInput").value.trim();
    let transactionList = document.getElementById("transactionList");

    transactionList.innerHTML = ""; // Clear the existing list

    // Load the conversion rate for INR to QAR from localStorage
    let conversionRate = parseFloat(localStorage.getItem("inrRate")) || 22.2;

    // Determine the category filter value
    let finalCategoryFilter = (categoryFilter === "Other") ? otherCategoryInput : categoryFilter;

    // Filter the transactions based on date and category
    let filteredTransactions = transactions.filter(tx => {
        let isDateMatch = dateFilter ? tx.date === dateFilter : true;
        let isCategoryMatch = finalCategoryFilter ? tx.category === finalCategoryFilter : true;
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

// Function to show/hide custom category input
function handleCategoryChange() {
    let categoryFilter = document.getElementById("categoryFilter").value;
    let otherCategoryGroup = document.getElementById("otherCategoryGroup");

    if (categoryFilter === "Other") {
        otherCategoryGroup.style.display = "block";
    } else {
        otherCategoryGroup.style.display = "none";
        document.getElementById("otherCategoryInput").value = ""; // Reset input if not needed
    }

    loadTransactions(); // Reload transactions when category changes
}

// Function to reset all filters to their default state
function clearFilters() {
    document.getElementById("currencySwitch").value = "QAR";  // Reset currency to QAR
    document.getElementById("dateFilter").value = "";       // Clear date filter
    document.getElementById("categoryFilter").value = "";   // Clear category filter
    document.getElementById("otherCategoryInput").value = ""; // Clear custom category input
    document.getElementById("otherCategoryGroup").style.display = "none"; // Hide custom category input
    loadTransactions(); // Reload transactions without any filters
}

// Event listener to load transactions and handle UI updates
document.addEventListener("DOMContentLoaded", function () {
    loadTransactions();

    document.getElementById("currencySwitch").addEventListener("change", loadTransactions);
    document.getElementById("dateFilter").addEventListener("change", loadTransactions);
    document.getElementById("categoryFilter").addEventListener("change", handleCategoryChange);
    document.getElementById("otherCategoryInput").addEventListener("input", loadTransactions);
    document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);
});