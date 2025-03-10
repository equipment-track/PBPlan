// Function to handle tab switching
function openTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tabcontent').forEach(tab => {
        tab.style.display = 'none';
    });

    // Show the selected tab
    document.getElementById(tabName).style.display = 'block';
}

// Ensure Dashboard is shown by default
document.addEventListener('DOMContentLoaded', function () {
    openTab('Dashboard'); 
});