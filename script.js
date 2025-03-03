let db;
const request = indexedDB.open("BudgetDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    let store = db.createObjectStore("transactions", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadTransactions();
};

const conversionRate = 22.2; // Static conversion rate: 1 QAR = 22.2 INR

function addTransaction() {
    let type = document.getElementById("type").value;
    let date = document.getElementById("date").value;
    let category = document.getElementById("category").value;
    let amount = parseFloat(document.getElementById("amount").value);

    if (category === "Other") {
        category = document.getElementById("otherCategory").value || "Other";
    }

    if (!date || isNaN(amount)) {
        alert("Please enter valid data");
        return;
    }

    let transaction = { type, date, category, amount };
    
    let tx = db.transaction("transactions", "readwrite");
    let store = tx.objectStore("transactions");
    store.add(transaction);

    tx.oncomplete = function() {
        document.getElementById("amount").value = "";
        loadTransactions();
    };
}

function loadTransactions() {
    let tx = db.transaction("transactions", "readonly");
    let store = tx.objectStore("transactions");
    let request = store.getAll();

    request.onsuccess = function() {
        let transactions = request.result;
        updateUI(transactions);
    };
}

function updateUI(transactions) {
    let totalIncome = 0, totalExpense = 0;
    let listHTML = "";
    let categoryData = {};

    transactions.forEach(t => {
        if (t.type === "income") totalIncome += t.amount;
        else totalExpense += t.amount;

        categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;

        listHTML += `<li>${t.date} - ${t.category}: ${t.amount} QAR</li>`;
    });

    document.getElementById("totalIncome").textContent = totalIncome;
    document.getElementById("totalExpense").textContent = totalExpense;
    document.getElementById("totalBalance").textContent = totalIncome - totalExpense;
    document.getElementById("transactionList").innerHTML = listHTML;

    drawPieChart(categoryData);
}

function updateCurrency() {
    let currency = document.getElementById("currency").value;
    let conversionFactor = (currency === "INR") ? conversionRate : 1;

    document.getElementById("totalBalance").textContent = (parseFloat(document.getElementById("totalBalance").textContent) * conversionFactor).toFixed(2);
    document.getElementById("totalIncome").textContent = (parseFloat(document.getElementById("totalIncome").textContent) * conversionFactor).toFixed(2);
    document.getElementById("totalExpense").textContent = (parseFloat(document.getElementById("totalExpense").textContent) * conversionFactor).toFixed(2);

    document.getElementById("currencyLabel").textContent = currency;
    document.getElementById("currencyLabelIncome").textContent = currency;
    document.getElementById("currencyLabelExpense").textContent = currency