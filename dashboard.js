function loadDashboard() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let totalIncome = 0, totalExpense = 0;

    transactions.forEach((tx) => {
        if (tx.type === "income") totalIncome += tx.amount;
        else totalExpense += tx.amount;
    });

    let totalBalance = totalIncome - totalExpense;
    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
    document.getElementById("totalBalance").textContent = totalBalance.toFixed(2);

    updatePieChart(totalIncome, totalExpense);
}

// **Pie Chart**
function updatePieChart(income, expense) {
    let ctx = document.getElementById("pieChart").getContext("2d");
    if (window.pieChartInstance) window.pieChartInstance.destroy();

    window.pieChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                data: [income, expense],
                backgroundColor: ["#4CAF50", "#FF5733"]
            }]
        }
    });
}

document.addEventListener("DOMContentLoaded", loadDashboard);