function loadDashboard() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let totalIncome = 0, totalExpense = 0, target = localStorage.getItem("estimatedTarget") || 0;

    transactions.forEach((tx) => {
        if (tx.type === "income") totalIncome += tx.amount;
        else totalExpense += tx.amount;
    });

    let totalBalance = totalIncome - totalExpense;
    document.getElementById("totalBalance").textContent = totalBalance.toFixed(2);

    // Update the pie chart with the new data
    updatePieChart(totalIncome, totalExpense, target);
}

// **Pie Chart**
function updatePieChart(income, expense, target) {
    let ctx = document.getElementById("pieChart").getContext("2d");
    if (window.pieChartInstance) window.pieChartInstance.destroy();

    window.pieChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Income", "Expense", "Target"],
            datasets: [{
                data: [income, expense, target],
                backgroundColor: ["#4CAF50", "#FF5733", "#FFEB3B"], // Colors: Green (Income), Red (Expense), Yellow (Target)
                hoverBackgroundColor: ["#388E3C", "#D32F2F", "#FBC02D"], // Slightly darker colors on hover
                hoverBorderColor: "#fff", // White border on hover
                borderWidth: 2, // Border width for each segment
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            let percentage = Math.round(tooltipItem.raw / tooltipItem.dataset._meta[Object.keys(tooltipItem.dataset._meta)[0]].total * 100);
                            return tooltipItem.label + ": " + tooltipItem.raw + " QAR (" + percentage + "%)";
                        }
                    }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", loadDashboard);