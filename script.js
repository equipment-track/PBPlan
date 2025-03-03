let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function handleCategoryChange() {
    const category = document.getElementById('category').value;
    const otherCategory = document.getElementById('other-category');
    if (category === 'others') {
        otherCategory.style.display = 'block';
    } else {
        otherCategory.style.display = 'none';
    }
}

function addTransaction() {
    const type = document.getElementById('type').value;
    const currency = document.getElementById('currency').value;
    const category = document.getElementById('category').value;
    const other = document.getElementById('other').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const notes = document.getElementById('notes').value;
    const timestamp = new Date();

    const transaction = {
        type,
        currency,
        category: category === 'others' ? other : category,
        amount,
        notes,
        timestamp
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    document.getElementById('transaction-form').reset();
    handleCategoryChange(); // Reset "other" category input visibility
    updateRecords();
}

function filterRecords() {
    const period = document.getElementById('time-period').value;
    const now = new Date();
    let filteredTransactions = transactions;

    if (period !== 'all') {
        filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.timestamp);
            switch (period) {
                case 'today':
                    return transactionDate.toDateString() === now.toDateString();
                case 'weekly':
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                    return transactionDate >= startOfWeek;
                case 'monthly':
                    return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
                case 'yearly':
                    return transactionDate.getFullYear() === now.getFullYear();
                default:
                    return false;
            }
        });
    }

    return filteredTransactions;
}

function updateRecords() {
    const filteredTransactions = filterRecords();
    const recordList = document.getElementById('record-list');
    recordList.innerHTML = '';

    filteredTransactions.forEach(transaction => {
        const recordItem = document.createElement('div');
        recordItem.className = 'record-item';
        recordItem.innerHTML = `
            <p><strong>Type:</strong> ${transaction.type}</p>
            <p><strong>Currency:</strong> ${transaction.currency}</p>
            <p><strong>Category:</strong> ${transaction.category}</p>
            <p><strong>Amount:</strong> ${transaction.amount}</p>
            <p><strong>Notes:</strong> ${transaction.notes}</p>
            <p><strong>Date:</strong> ${new Date(transaction.timestamp).toLocaleString()}</p>
        `;
        recordList.appendChild(recordItem);
    });
}

function updateChart() {
    const filteredTransactions = filterRecords();

    const income = filteredTransactions.filter(transaction => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = filteredTransactions.filter(transaction => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0);

    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expenses],
                backgroundColor: ['#4CAF50', '#FF0000']
            }]
        }
    });
}

// Initial setup
updateRecords();
updateChart();