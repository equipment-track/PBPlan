function showTab(tabId) {
    let tabs = document.getElementsByClassName("tab-content");

    for (let tab of tabs) {
        tab.style.display = "none";
    }

    document.getElementById(tabId).style.display = "block";
}