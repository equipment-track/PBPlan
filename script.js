function calculateBudget() {
    let income = parseFloat(document.getElementById('income').value);
    let expenses = parseFloat(document.getElementById('expenses').value);
    let remaining = income - expenses;

    document.getElementById('result').innerText = `Remaining Budget: ${remaining}`;
}