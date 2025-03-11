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
    let finalCategoryFilter = categoryFilter === "Other" ? otherCategoryInput : categoryFilter;

    // Filter the transactions based on date and category
    let filteredTransactions = transactions.filter(tx => {
        let isDateMatch = dateFilter ? tx.date === dateFilter : true;
        let isCategoryMatch = finalCategoryFilter ? tx.category === finalCategoryFilter : true;
        return isDateMatch && isCategoryMatch;
    });

    filteredTransactions.forEach((tx) => {
        let displayAmount = tx.amount;

        if (currencySwitch === "INR") {
            displayAmount = (tx.amount * conversionRate).toFixed(2);
        } else {
            displayAmount = tx.amount.toFixed(2);
        }

        // Create a list item for each filtered transaction
        let listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${tx.date}</strong> - ${tx.category} (${tx.type}): 
            <span>${displayAmount} ${currencySwitch}</span>
            ${tx.notes ? `<br><em>Notes: ${tx.notes}</em>` : ""}
        `;

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

// Function to clear transactions for the selected date
function clearTransactionsByDate() {
    let selectedDate = document.getElementById("dateFilter").value;
    
    if (!selectedDate) {
        alert("Please select a date to clear transactions.");
        return;
    }

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Filter out transactions that match the selected date
    let remainingTransactions = transactions.filter(tx => tx.date !== selectedDate);

    // Update local storage with remaining transactions
    localStorage.setItem("transactions", JSON.stringify(remainingTransactions));

    alert(`Transactions for ${selectedDate} have been deleted.`);
    
    // Reload transactions
    loadTransactions();
}

// Function to reset all filters
function clearFilters() {
    document.getElementById("currencySwitch").value = "QAR"; // Reset currency to QAR
    document.getElementById("dateFilter").value = ""; // Clear date filter
    document.getElementById("categoryFilter").value = ""; // Clear category filter
    document.getElementById("otherCategoryInput").value = ""; // Clear custom category input
    document.getElementById("otherCategoryGroup").style.display = "none"; // Hide custom category input
    loadTransactions(); // Reload transactions without any filters
}

// Function to export transactions to CSV
function exportToCSV() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    if (transactions.length === 0) {
        alert("No transactions to export!");
        return;
    }

    let csvContent = "Date,Category,Type,Amount,Notes\n";
    transactions.forEach(tx => {
        let notes = tx.notes ? `"${tx.notes}"` : ""; // Handle optional notes
        csvContent += `${tx.date},${tx.category},${tx.type},${tx.amount},${notes}\n`;
    });

    let blob = new Blob([csvContent], { type: "text/csv" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Event listener to load transactions and handle UI updates
document.addEventListener("DOMContentLoaded", function () {
    loadTransactions();

    document.getElementById("currencySwitch").addEventListener("change", loadTransactions);
    document.getElementById("dateFilter").addEventListener("change", loadTransactions);
    document.getElementById("categoryFilter").addEventListener("change", handleCategoryChange);
    document.getElementById("otherCategoryInput").addEventListener("input", loadTransactions);
    document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);
    document.getElementById("clearDateBtn").addEventListener("click", clearTransactionsByDate);
    document.getElementById("exportCSVBtn").addEventListener("click", exportToCSV);
});