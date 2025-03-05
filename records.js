function loadTransactions() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let transactionList = document.getElementById("transactionList");

    transactionList.innerHTML = "";
    transactions.forEach((tx) => {
        let listItem = document.createElement("li");
        listItem.textContent = `${tx.date} - ${tx.category} (${tx.type}): ${tx.amount.toFixed(2)} QAR`;
        transactionList.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", loadTransactions);