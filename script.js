// Show the relevant content when clicking a tab
function showTab(tabId) {
    let tabs = document.getElementsByClassName("tab-content");

    for (let tab of tabs) {
        tab.style.display = "none";
    }

    document.getElementById(tabId).style.display = "block";
}

// Display dynamic input for 'Other' category
function checkOtherCategory() {
    let category = document.getElementById("category").value;
    document.getElementById("otherCategory").style.display = category === "Other" ? "block" : "none";
}

// Save the transaction
function saveTransaction() {
    let type = document.getElementById("type").value;
    let currency = document.getElementById("currency").value;
    let category = document.getElementById("category").value;
    let otherCategory = document.getElementById("otherCategory").value;
    let amount = document.getElementById("amount").value;
    let date = document.getElementById("date").value;
    let notes = document.getElementById("notes").value;

    // Validate mandatory fields
    if (!amount || !date || !category) {
        alert("Please fill in all mandatory fields.");
        return;
    }

    if (category === "Other" && !otherCategory) {
        alert("Please specify the 'Other' category.");
        return;
    }

    // Transaction object
    let transaction = {
        type,
        currency,
        category: category === "Other" ? otherCategory : category,
        amount,
        date,
        notes: notes || "No notes",
    };

    // Save transaction to localStorage or IndexedDB
    localStorage.setItem("lastTransaction", JSON.stringify(transaction));

    // Show success message
    document.getElementById("successMessage").style.display = "block";
    setTimeout(function() {
        document.getElementById("successMessage").style.display = "none";
    }, 3000);

    // Clear the form after saving
    document.getElementById("transactionForm").reset();
}