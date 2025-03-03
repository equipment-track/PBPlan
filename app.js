if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(() => {
        console.log('Service Worker Registered');
    }).catch(err => {
        console.log('Service Worker Registration Failed:', err);
    });
}

async function encryptData(data, password) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const key = await window.crypto.subtle.importKey(
        'raw', passwordBuffer, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = encoder.encode(JSON.stringify(data));

    const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encodedData
    );

    return { encryptedData: new Uint8Array(encryptedData), iv };
}

async function decryptData(encryptedData, iv, password) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const key = await window.crypto.subtle.importKey(
        'raw', passwordBuffer, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']
    );

    const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encryptedData
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedData));
}

async function saveData(data, password) {
    const { encryptedData, iv } = await encryptData(data, password);
    localStorage.setItem('encryptedTransactions', JSON.stringify({ encryptedData: Array.from(encryptedData), iv: Array.from(iv) }));
}

async function getData(password) {
    const storedData = JSON.parse(localStorage.getItem('encryptedTransactions'));
    if (storedData) {
        const encryptedData = new Uint8Array(storedData.encryptedData);
        const iv = new Uint8Array(storedData.iv);
        return await decryptData(encryptedData, iv, password);
    }
    return [];
}

function drawPieChart(data) {
    const canvas = document.getElementById('pieChart');
    const ctx = canvas.getContext('2d');
    const total = data.income + data.expense;

    const incomePercentage = (data.income / total) * 100;
    const expensePercentage = (data.expense / total) * 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 100, 0, Math.PI * 2 * (incomePercentage / 100));
    ctx.fillStyle = '#4caf50';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 100, Math.PI * 2 * (incomePercentage / 100), Math.PI * 2);
    ctx.fillStyle = '#f44336';
    ctx.fill();
}

function prepareChartData(transactions, startDate, endDate) {
    let income = 0, expense = 0;

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        if (transactionDate >= startDate && transactionDate <= endDate) {
            if (transaction.type === 'income') {
                income += transaction.amount;
            } else {
                expense += transaction.amount;
            }
        }
    });

    return { income, expense };
}

function getDateRange(period) {
    const today = new Date();
    let startDate;

    switch (period) {
        case 'weekly':
            startDate = new Date(today.setDate(today.getDate() - today.getDay()));
            break;
        case 'monthly':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            break;
        case 'yearly':
            startDate = new Date(today.getFullYear(), 0, 1);
            break;
    }

    return { startDate, endDate: new Date() };
}

document.getElementById('transactionForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const reason = document.getElementById('reason').value;
    const notes = document.getElementById('notes').value;
    const type = document.getElementById('transactionType').value;
    const currency = document.getElementById('currency').value;
    const password = 'mySecretPassword'; // You can change this to a dynamic input

    const transaction = {
        amount: amount,
        reason: reason,
        notes: notes,
        type: type,
        currency: currency,
        date: new Date().toISOString()
    };

    const transactions = await getData(password);
    transactions.push(transaction);
    await saveData(transactions, password);

    alert('Transaction saved!');
});

document.getElementById('periodSelector').addEventListener('change', async function () {
    const { startDate, endDate } = getDateRange(this.value);
    const transactions = await getData('mySecretPassword'); // Use the same password used while saving
    const categorizedData = prepareChartData(transactions, startDate, endDate);
    drawPieChart(categorizedData);
});