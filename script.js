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
}

function drawPieChart(data) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    const labels = Object.keys(data);
    const values = Object.values(data);

    const total = values.reduce((sum, value) => sum + value, 0);

    const percentages = values.map(value => (value / total) * 100);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expense Categories',
                data: percentages,
                backgroundColor: ['#ff5733', '#33ff57', '#3357ff', '#ff33a1', '#a1ff33'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const label = tooltipItem.label;
                            const value = tooltipItem.raw;
                            return `${label}: ${value.toFixed(2)}%`;
                        }
                    }
                }
            }
        }
    });
}

// Event listeners for the Add Transaction form on transactions.html
document.getElementById("addTransactionBtn").addEventListener("click", addTransaction);

// Handle currency change in settings.html
document.getElementById("currency").addEventListener("change", updateCurrency);

// Handle setting change and currency conversion when switching currencies
function updateCurrency() {
    let currency = document.getElementById("currency").value;
    let conversionFactor = (currency === "INR") ? conversionRate : 1;

    // Convert all amounts in the system based on the selected currency
    document.querySelectorAll(".amount").forEach(element => {
        let amount = parseFloat(element.dataset.amount);
        element.textContent = (amount * conversionFactor).toFixed(2);
    });

    // Update currency labels
    document.querySelectorAll(".currencyLabel").forEach(label => {
        label.textContent = currency;
    });

    // Recalculate balance, income, and expenses
    updateBalance();
}

// Recalculate the total balance, income, and expense
function updateBalance() {
    let totalIncome = 0;
    let totalExpense = 0;

    document.querySelectorAll(".transaction").forEach(transaction => {
        let amount = parseFloat(transaction.dataset.amount);
        if (transaction.dataset.type === 'income') {
            totalIncome += amount;
        } else {
            totalExpense += amount;
        }
    });

    document.getElementById("totalBalance").textContent = (totalIncome - totalExpense).toFixed(2);
    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
}

// Show or hide the "Other Category" input when the user selects "Other"
document.getElementById("category").addEventListener("change", function() {
    if (this.value === "Other") {
        document.getElementById("otherCategoryInput").style.display = "block";
    } else {
        document.getElementById("otherCategoryInput").style.display = "none";
    }
});

// Initialize the app by loading transactions and updating balance
window.onload = function() {
    loadTransactions();
    updateBalance();
};