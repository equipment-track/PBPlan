// Function to handle visibility of the "Other" category input
function checkOtherCategory() {
    let category = document.getElementById("category").value;
    document.getElementById("otherCategory").style.display = category === "Other" ? "block" : "none";
}

// Function to add a new transaction and save it to localStorage
function addTransaction() {
    // Get input values
    let type = document.getElementById("type").value;
    let currency = document.getElementById("currency").value;
    let date = document.getElementById("date").value;
    let category = document.getElementById("category").value;
    let amount = parseFloat(document.getElementById("amount").value);

    // Handle "Other" category
    if (category === "Other") {
        category = document.getElementById("otherCategory").value || "Other";
    }

    // Validate required fields
    if (!amount || !date) {
        alert("Please fill in all required fields!");
        return;
    }

    // Convert INR to QAR if needed
    let conversionRate = parseFloat(localStorage.getItem("inrRate")) || 22.2;
    let storedAmount = currency === "INR" ? amount / conversionRate : amount;

    // Create a transaction object
    let transaction = {
        type,
        category,
        amount: storedAmount,
        date,
    };

    // Get existing transactions from localStorage (if any)
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Add the new transaction to the transactions array
    transactions.push(transaction);

    // Save the updated transactions array back to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Notify the user and refresh the transaction list
    alert("Transaction saved!");
    loadTransactions(); // Update transaction display
}

// Function to load and display transactions from localStorage
function loadTransactions() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let transactionList = document.getElementById("transactionList");

    // Clear the existing list
    transactionList.innerHTML = "";

    // Loop through each transaction and create a list item for it
    transactions.forEach(function (transaction) {
        let listItem = document.createElement("li");
        listItem.textContent = `Type: ${transaction.type}, Category: ${transaction.category}, Amount: ${transaction.amount.toFixed(2)}, Date: ${transaction.date}`;
        transactionList.appendChild(listItem);
    });
}

// Initialize the page by loading transactions after the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Load the transactions when the page is ready
    loadTransactions();

    // Add event listener to handle category changes
    document.getElementById("category").addEventListener("change", checkOtherCategory);
});