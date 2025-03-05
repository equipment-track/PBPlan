function loadDashboard() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let totalIncome = 0, totalExpense = 0, target = parseFloat(localStorage.getItem("monthlyTarget")) || 0;

    transactions.forEach(tx => {
        if (tx.type === "income") totalIncome += tx.amount;
        else totalExpense += tx.amount;
    });

    let totalBalance = totalIncome - totalExpense;

    // Update UI
    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2) + " QAR";
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2) + " QAR";
    document.getElementById("estimatedTarget").textContent = target.toFixed(2) + " QAR";
    document.getElementById("totalBalance").textContent = totalBalance.toFixed(2) + " QAR";

    // Update Pie Chart
    updatePieChart(totalIncome, totalExpense, target);
}

// **Pie Chart**
function updatePieChart(income, expense, target) {
    let ctx = document.getElementById("pieChart").getContext("2d");

    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
    }

    window.pieChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expense", "Target"],
            datasets: [{
                data: [income, expense, target],
                backgroundColor: ["#4CAF50", "#FF5733", "#FFEB3B"],
                hoverBackgroundColor: ["#388E3C", "#D32F2F", "#FBC02D"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

// Load Dashboard on Page Load
document.addEventListener("DOMContentLoaded", loadDashboard);