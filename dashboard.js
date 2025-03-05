function loadDashboard() {
    // Retrieve transactions and target from localStorage
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let estimatedTarget = parseFloat(localStorage.getItem("estimatedTarget")) || 0;
    
    let totalIncome = 0, totalExpense = 0;

    // Calculate total income and expense
    transactions.forEach((tx) => {
        if (tx.type === "income") totalIncome += tx.amount;
        else totalExpense += tx.amount;
    });

    let totalBalance = estimatedTarget + totalIncome - totalExpense;

    // Update the dashboard elements
    document.getElementById("estimatedTarget").textContent = estimatedTarget.toFixed(2);
    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
    document.getElementById("totalBalance").textContent = totalBalance.toFixed(2);

    // Update the pie chart
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
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            let value = tooltipItem.raw;
                            let percentage = ((value / (income + expense)) * 100).toFixed(2);
                            return value + " QAR (" + percentage + "%)";
                        }
                    }
                }
            }
        }
    });
}

// Load the dashboard when the page is loaded
document.addEventListener("DOMContentLoaded", loadDashboard);