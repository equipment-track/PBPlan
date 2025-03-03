// IndexedDB Setup
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

function addTransaction() {
    let date = document.getElementById("date").value;
    let category = document.getElementById("category").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let notes = document.getElementById("notes").value;

    if (!date || isNaN(amount)) {
        alert("Please enter valid data");
        return;
    }

    let transaction = { date, category, amount, notes };
    
    let tx = db.transaction("transactions", "readwrite");
    let store = tx.objectStore("transactions");
    store.add(transaction);

    tx.oncomplete = function() {
        document.getElementById("amount").value = "";
        loadTransactions();
    };
}

// Load Transactions and Update UI
function loadTransactions() {
    let tx = db.transaction("transactions", "readonly");
    let store = tx.objectStore("transactions");
    let request = store.getAll();

    request.onsuccess = function() {
        let transactions = request.result;
        updateUI(transactions);
    };
}

// Update UI
function updateUI(transactions) {
    let totalIncome = 0, totalExpense = 0;
    let listHTML = "";
    let categoryData = {};

    transactions.forEach(t => {
        if (t.amount > 0) totalIncome += t.amount;
        else totalExpense += Math.abs(t.amount);

        categoryData[t.category] = (categoryData[t.category] || 0) + Math.abs(t.amount);

        listHTML += `<li>${t.date} - ${t.category}: ₹${t.amount}</li>`;
    });

    document.getElementById("totalIncome").textContent = totalIncome;
    document.getElementById("totalExpense").textContent = totalExpense;
    document.getElementById("totalBalance").textContent = totalIncome - totalExpense;
    document.getElementById("transactionList").innerHTML = listHTML;

    drawPieChart(categoryData);
}

// Draw Pie Chart (Canvas API)
function drawPieChart(data) {
    let canvas = document.getElementById("pieChart");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let colors = ["#FF5733", "#33FF57", "#3357FF", "#F4C724"];
    let total = Object.values(data).reduce((a, b) => a + b, 0);
    let startAngle = 0;
    let i = 0;

    Object.entries(data).forEach(([category, value]) => {
        let endAngle = startAngle + (value / total) * (2 * Math.PI);
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 100, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        startAngle = endAngle;
        i++;
    });
}