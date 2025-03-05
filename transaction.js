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

    if (category === "Other") {
        category = document.getElementById("otherCategory").value || "Other";
    }

    if (!amount || !date) {
        alert("Please fill in all required fields!");
        return;
    }

    // Convert INR to QAR if needed
    let conversionRate = parseFloat(localStorage.getItem("inrRate")) || 22.2;
    let storedAmount = currency === "INR" ? amount / conversionRate : amount;

    let transaction = { type, category, amount: storedAmount, date };
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    alert("Transaction saved!");
    loadTransactions();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("category").addEventListener("change", checkOtherCategory);
});