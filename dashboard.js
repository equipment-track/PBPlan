function loadDashboard() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let totalIncome = 0, totalExpense = 0;
    let target = parseFloat(localStorage.getItem("estimatedTarget")) || 0;

    transactions.forEach((tx) => {
        let amount = parseFloat(tx.amount);
        if (tx.type === "income") totalIncome += amount;
        else totalExpense += amount;
    });

    let totalBalance = totalIncome - totalExpense;

    // Update UI elements dynamically
    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2) + " QAR";
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2) + " QAR";
    document.getElementById("totalBalance").textContent = totalBalance.toFixed(2) + " QAR";
    document.getElementById("estimatedTarget").textContent = target.toFixed(2) + " QAR";

    // Update the pie chart with new data
    updatePieChart(totalIncome, totalExpense, target);
}

// **Pie Chart with Google-Style Colors**
function updatePieChart(income, expense, target) {
    let ctx = document.getElementById("pieChart").getContext("2d");
    if (window.pieChartInstance) window.pieChartInstance.destroy();

    window.pieChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expense", "Target"],
            datasets: [{
                data: [income, expense, target],
                backgroundColor: ["#34A853", "#EA4335", "#F4B400"], // Google Colors: Green, Red, Yellow
                hoverBackgroundColor: ["#2E7D32", "#C62828", "#F57C00"], // Darker shades on hover
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        color: "#333",
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            let dataset = tooltipItem.dataset.data;
                            let total = dataset.reduce((acc, val) => acc + val, 0);
                            let percentage = ((tooltipItem.raw / total) * 100).toFixed(1);
                            return `${tooltipItem.label}: ${tooltipItem.raw} QAR (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Ensure dashboard updates when a new transaction is added
document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
    window.addEventListener("storage", loadDashboard); // Listen for storage updates
});