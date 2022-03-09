// Associative array
var menuItems = [];
menuItems["Hotdogs"] = 4.00;
menuItems["Fries"] = 3.50;
menuItems["Soda"] = 1.50;
menuItems["Sauerkraut"] = 1.00;

var cart = [];
var total = 0;

document.addEventListener("DOMContentLoaded", () => {
    createMenuAndOrderOptions();
    addToOrderEvent();
})

function createMenuAndOrderOptions() {
    var menu = document.querySelector(".menu-items");
    var orderItemOption = document.querySelector("#order-item");
    for (item in menuItems) {
        menu.innerHTML += `<div class="menu-item"><p>${item}</p> <p>$${menuItems[item].toFixed(2)}</p></div>`;
        orderItemOption.innerHTML += `<option value="${item}">${item}</option>`;
    }
}

function addToOrderEvent() {
    const btn = document.querySelector("#order-button");
    const orderItem = document.querySelector("#order-item");
    const qty = document.querySelector("#order-quantity");
    btn.addEventListener("click", () => {
        const item = orderItem[orderItem.selectedIndex].value;
        cart[item] ? cart[item] += qty.valueAsNumber : cart[item] = qty.valueAsNumber
        total += qty.valueAsNumber * menuItems[item];
        qty.value = "1";
        displayOrderSummary();
    })
}

function displayOrderSummary() {
    showOrderItems();
    showOrderTotal();
}

function showOrderItems() {
    let summary = document.querySelector(".order-summary");
    // removes everything except summary header
    while (summary.childElementCount > 1) {
        summary.removeChild(summary.lastChild);
    }
    for (item in cart) {
        summary.innerHTML += `<div class="order-summary-item"><p>${item}</p><p>${cart[item]}</p><p>$${getItemTotal(item).toFixed(2)}</p></div>`;
    }
    if (!summary.classList.contains("border-bottom")) { summary.classList.add("border-bottom") }
}

function showOrderTotal() {
    let summaryTotal = document.querySelector(".summary-total");
    if (summaryTotal.classList.contains("hide")) { summaryTotal.classList.remove("hide") }
    document.querySelector("#total").innerText = total.toFixed(2);
}

function getItemTotal(item) {
    return cart[item] * menuItems[item];
}