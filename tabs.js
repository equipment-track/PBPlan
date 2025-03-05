document.addEventListener("DOMContentLoaded", function () {
    showTab("Dashboard");
});

function showTab(tabId) {
    let tabs = document.getElementsByClassName("tabcontent");
    for (let tab of tabs) {
        tab.style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
}