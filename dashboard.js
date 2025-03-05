// Function to load the dashboard data from localStorage
function loadDashboard() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let totalIncome = 0, totalExpense = 0, target = parseFloat(localStorage.getItem("estimatedTarget")) || 0;

    // Calculate total income and total expense from transactions
    transactions.forEach((tx) => {
        if (tx.type === "income") totalIncome += tx.amount;
        else totalExpense += tx.amount;
    });

    // Calculate total balance: income - expense
    let totalBalance = totalIncome - totalExpense;

    // Update the dashboard with calculated values
    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
    document.getElementById("totalBalance").textContent = totalBalance.toFixed(2);
    document.getElementById("estimatedTarget").textContent = target.toFixed(2);

    // Update the pie chart with the new data
    updatePieChart(totalIncome, totalExpense, target);
}

// Function to update the pie chart dynamically using CSS
function updatePieChart(income, expense, target) {
    let pieChartContainer = document.getElementById("pieChart");
    pieChartContainer.innerHTML = ''; // Clear previous chart slices

    let total = income + expense + target;

    // Create slices and append them to the pie chart container
    createSlice(pieChartContainer, 0, (income / total) * 100, '#4CAF50', "Income: " + income.toFixed(2) + " QAR");
    createSlice(pieChartContainer, (income / total) * 100, (expense / total) * 100 + (income / total) * 100, '#FF5733', "Expense: " + expense.toFixed(2) + " QAR");
    createSlice(pieChartContainer, (expense / total) * 100 + (income / total) * 100, 100, '#FFEB3B', "Target: " + target.toFixed(2) + " QAR");
}

// Function to create individual pie chart slices dynamically
function createSlice(container, start, end, color, label) {
    // Create the slice div
    let slice = document.createElement('div');
    slice.classList.add('pie-slice');
    slice.style.transform = `rotate(${start}deg)`;
    slice.style.backgroundColor = color;
    slice.style.clipPath = 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)';
    slice.style.transformOrigin = "100% 100%";
    container.appendChild(slice);

    // Add the label inside the slice
    let sliceLabel = document.createElement('span');
    sliceLabel.textContent = label;
    sliceLabel.style.position = 'absolute';
    sliceLabel.style.left = '50%';
    sliceLabel.style.top = '50%';
    sliceLabel.style.transform = 'translate(-50%, -50%)';
    sliceLabel.style.color = '#fff';
    sliceLabel.style.fontWeight = 'bold';
    container.appendChild(sliceLabel);
}

// Load the dashboard when the page is ready
document.addEventListener("DOMContentLoaded", loadDashboard);