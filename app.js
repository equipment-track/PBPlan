let transactions = [];
let targetAmount = 0;
let exchangeRate = 22.5; // 1 QAR = 22.5 INR (Update manually)

document.getElementById("reason").addEventListener("change", function () {
    document.getElementById("otherReason").classList.toggle("hidden", this.value !== "Other");
});

function addTransaction() {
    let type = document.getElementById("transactionType").value;
    let reason = document.getElementById("reason").value;
    if (reason === "Other") {
        reason = document.getElementById("otherReason").value;
    }
    let amount = parseFloat(document.getElementById("amount").value);
    let notes = document.getElementById("notes").value;
    
    transactions.push({ type, reason, amount, notes });
    updateDashboard();
    displayRecords();
}

function updateDashboard() {
    let totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    let totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    let balance = totalIncome - totalExpenses;

    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("totalExpenses").innerText = totalExpenses;
    document.getElementById("balance").innerText = balance;
}

function displayRecords() {
    let list = document.getElementById("transactionList");
    list.innerHTML = transactions.map(t => `<li>${t.type}: ${t.reason} - ${t.amount} QAR (${t.notes})</li>`).join("");
}

function updateTarget() {
    targetAmount = parseFloat(document.getElementById("monthlyTarget").value);
    document.getElementById("targetAmount").innerText = targetAmount;
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));
    document.getElementById(pageId).classList.remove("hidden");
}