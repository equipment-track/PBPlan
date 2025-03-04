document.addEventListener('DOMContentLoaded', () => {
    loadDashboardSettings();
    loadCurrencySettings();
    loadSettings();
    showTab('dashboard');
});

function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

function updateDashboard() {
    const period = document.getElementById('time-period').value;
    localStorage.setItem('time-period', period);
    calculateSummary(period);
    updatePieChart(period);
}

function calculateSummary(period) {
    const transactions = getTransactionsForPeriod(period);
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
            totalExpenses += transaction.amount;
        }
    });

    const balance = totalIncome - totalExpenses;
    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
}

function updatePieChart(period) {
    const transactions = getTransactionsForPeriod(period);
    const categories = {};

    transactions.forEach(transaction => {
        const category = transaction.category;
        if (!categories[category]) {
            categories[category] = 0;
        }
        categories[category] += transaction.amount;
    });

    const data = Object.keys(categories).map(category => ({
        label: category,
        value: categories[category]
    }));

    createPieChart(data);
}

function toggleCurrency() {
    const currency = document.getElementById('currency-toggle').checked ? 'INR' : 'QAR';
    localStorage.setItem('currency', currency);
    convertCurrency(currency);
}

function convertCurrency(currency) {
    const conversionRate = parseFloat(localStorage.getItem('settings')?.conversionRate) || 1;
    document.querySelectorAll('.currency-amount').forEach(element => {
        const amount = parseFloat(element.getAttribute('data-amount'));
        element.textContent = (currency === 'INR' ? amount * conversionRate : amount).toFixed(2);
    });
}

function saveTransaction(event) {
    event.preventDefault();

    const type = document.getElementById('transaction-type').value;
    const currency = document.getElementById('currency').value;
    const category = document.getElementById('category').value === 'Others'
        ? document.getElementById('custom-category').value
        : document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const notes = document.getElementById('notes').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

    if (!type || !currency || !category || isNaN(amount)) {
        alert('Please fill in all required fields.');
        return;
    }

    const transaction = {
        type,
        currency,
        category,
        amount,
        notes,
        tags,
        timestamp: Date.now()
    };

    saveToLocalStorage(transaction);
    alert('Transaction saved successfully!');
    document.getElementById('transaction-form').reset();
}

function getTransactionsForPeriod(period) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const now = new Date();
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.timestamp);
        switch (period) {
            case 'daily':
                return transactionDate.toDateString() === now.toDateString();
            case 'weekly':
                const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                return transactionDate >= startOfWeek;
            case 'monthly':
                return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
            case 'yearly':
                return transactionDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    });
}

function saveToLocalStorage(transaction) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function filterRecords() {
    const period = document.getElementById('filter-period').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const keyword = document.getElementById('filter-keyword').value.toLowerCase();

    let filteredTransactions = getTransactionsForPeriod(period);

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredTransactions = filteredTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.timestamp);
            return transactionDate >= start && transactionDate <= end;
        });
    }

    if (keyword) {
        filteredTransactions = filteredTransactions.filter(transaction =>
            transaction.category.toLowerCase().includes(keyword) ||
            transaction.notes.toLowerCase().includes(keyword) ||
            transaction.tags.some(tag => tag.toLowerCase().includes(keyword))
        );
    }

    displayRecords(filteredTransactions);
}

function displayRecords(transactions) {
    const recordsContainer = document.getElementById('records-container');
    recordsContainer.innerHTML = '';
    transactions.forEach(transaction => {
        const record = document.createElement('div');
        record.classList.add('record');
        record.innerHTML = `
            <p>Type: ${transaction.type}</p>
            <p>Currency: ${transaction.currency}</p>
            <p>Category: ${transaction.category}</p>
            <p>Amount: ${transaction.amount}</p>
            <p>Notes: ${transaction.notes}</p>
            <p>Tags: ${transaction.tags.join(', ')}</p>
            <p>Date: ${new Date(transaction.timestamp).toLocaleString()}</p>
        `;
        recordsContainer.appendChild(record);
    });
}

function exportToCSV() {
    const transactions = getFilteredTransactions();
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Currency,Category,Amount,Notes,Tags,Date\n";

    transactions.forEach(transaction => {
        const row = [
            transaction.type,
            transaction.currency,
            transaction.category,
            transaction.amount,
            transaction.notes,
            transaction.tags.join(', '),
            new Date(transaction.timestamp).toLocaleString()
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function saveSettings(event) {
    event.preventDefault();

    const monthlyTarget = parseFloat(document.getElementById('monthly-target').value);
    const conversionRate = parseFloat(document.getElementById('conversion-rate').value);
    const dailyReminder = document.getElementById('daily-reminder').checked;
    const thresholdNotification = document.getElementById('threshold-notification').checked;

    const settings = {
        monthlyTarget,
        conversionRate,
        dailyReminder,
        thresholdNotification
    };

    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings'));
    if (settings) {
        document.getElementById('monthly-target').value = settings.monthlyTarget || '';
        document.getElementById('conversion-rate').value = settings.conversionRate || '';
        document.getElementById('daily-reminder').checked = settings.dailyReminder || false;
        document.getElementById('threshold-notification').checked = settings.thresholdNotification || false;
    }
}

function setSavingsGoal() {
    const goal = parseFloat(document.getElementById('savings-goal').value);
    if (!isNaN(goal)) {
        localStorage.setItem('savings-goal', goal);
        alert('Savings goal set successfully!');
    } else {
        alert('Please enter a valid savings goal.');
    }
}

function setCustomNotification() {
    const time = document.getElementById('custom-notification-time').value;
    const message = document.getElementById('custom-notification-message').value;
    if (time && message) {
        const notification = { time, message };
        localStorage.setItem('custom-notification', JSON.stringify(notification));
        alert('Custom notification set successfully!');
    } else {
        alert('Please enter both time and message for the notification.');
    }
}

function toggleTheme() {
    const isDarkMode = document.getElementById('theme-toggle').checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('dark-mode', isDarkMode);
}

function loadDashboardSettings() {
    const period = localStorage.getItem('time-period') || 'monthly';
    document.getElementById('time-period').value = period;
    calculateSummary(period);
    updatePieChart(period);
}

function loadCurrencySettings() {
    const currency = localStorage.getItem('currency') || 'QAR';
    document.getElementById('currency-toggle').checked = (currency === 'INR');
    convertCurrency(currency);
}

function loadDarkMode() {
    const isDarkMode = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.getElementById('theme-toggle').checked = isDarkMode;
}

function createPieChart(data) {
    const ctx = document.getElementById('pie-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(item => item.label),
            datasets: [{
                data: data.map(item => item.value),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#FF7043']
            }]
        },
        options: {
            responsive: true
        }
    });
}

function getFilteredTransactions() {
    const period = document.getElementById('filter-period').value;
    return getTransactionsForPeriod(period);
}