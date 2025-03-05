// Function to handle tab switching
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Hide all tab content
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove active class from all tablinks
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show the clicked tab and add active class
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// By default, open the Dashboard tab
document.getElementsByClassName("tablinks")[0].click();

// Function to add transaction
function addTransaction() {
    var type = document.getElementById('type').value;
    var date = document.getElementById('date').value;
    var category = document.getElementById('category').value;
    var otherCategory = document.getElementById('otherCategory').value;
    var amount = document.getElementById('amount').value;
    var currency = document.getElementById('currency').value;
    
    if (type && date && amount && (category !== "Other" || (category === "Other" && otherCategory))) {
        var transaction = {
            type: type,
            date: date,
            category: category === "Other" ? otherCategory : category,
            amount: amount,
            currency: currency
        };
        
        var transactionList = document.getElementById('transactionList');
        var li = document.createElement('li');
        li.textContent = `${transaction.date} | ${transaction.type.toUpperCase()} | ${transaction.category} | ${transaction.amount} ${transaction.currency}`;
        transactionList.appendChild(li);

        alert("Transaction Saved!");
    } else {
        alert("Please fill all the mandatory fields!");
    }
}

// Function to show other category input if "Other" is selected
function checkOtherCategory() {
    var category = document.getElementById('category').value;
    var otherCategoryInput = document.getElementById('otherCategory');
    
    if (category === "Other") {
        otherCategoryInput.style.display = "inline";
    } else {
        otherCategoryInput.style.display = "none";
    }
}

// Function to save settings
function saveSettings() {
    var monthlyTarget = document.getElementById('monthlyTarget').value;
    var targetValue = document.getElementById('targetValue').value;
    var inrRate = document.getElementById('inrRate').value;
    var notificationTime = document.getElementById('notificationTime').value;
    var thresholdNotifications = document.getElementById('thresholdNotifications').checked;

    if (monthlyTarget && targetValue && inrRate && notificationTime) {
        alert(`Settings Saved!\nTarget: ${targetValue} for ${monthlyTarget} \nINR Rate: ${inrRate} \nNotification Time: ${notificationTime} \nThreshold Notifications: ${thresholdNotifications}`);
    } else {
        alert("Please fill in all the required settings fields.");
    }
}