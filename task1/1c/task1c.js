// Function object
function menuItem(name, price) {
    this.name = name;
    this.price = price;
}

function cartItem(item, quantity) {
    this.menuItem = item;
    this.quantity = quantity;
    this.total = getTotal;
}

function getTotal() {
    return (this.quantity * this.menuItem.price).toFixed(2);
}

let hotdog = new menuItem("Hotdog", 4.00);
let fries = new menuItem("Fries", 3.50);
let soda = new menuItem("Soda", 1.50);
let sauerkraut = new menuItem("Sauerkraut", 1.00);

menuItems = [hotdog, fries, soda, sauerkraut];
var cartItems = [];
var total = 0;

document.addEventListener("DOMContentLoaded", () => {
    createMenuAndOrderOptions();
    addToOrderEvent();
})

function createMenuAndOrderOptions() {
    var menu = document.querySelector(".menu-items");
    var orderItemOption = document.querySelector("#order-item");
    menuItems.forEach((item) => {
        menu.innerHTML += `<div class="menu-item"><p>${item.name}</p> <p>$${item.price.toFixed(2)}</p></div>`;
        orderItemOption.innerHTML += `<option value="${item.name}">${item.name}</option>`;
    })
}


function addToOrderEvent() {
    const btn = document.querySelector("#order-button");
    const itemToOrder = document.querySelector("#order-item");
    const qty = document.querySelector("#order-quantity");
    btn.addEventListener("click", () => {
        const itemName = itemToOrder[itemToOrder.selectedIndex].value;
        let { orderItem, menuItem } = getCartAndMenuItem(itemName);
        orderItem ? orderItem.quantity += qty.valueAsNumber : cartItems.push(new cartItem(menuItem, qty.valueAsNumber));
        total += qty.valueAsNumber * menuItem.price;
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
    cartItems.forEach((item) => {
        summary.innerHTML += `<div class="order-summary-item"><p>${item.name}</p><p>${item.quantity}</p><p>$${item.total()}</p></div>`;
    })
    if (!summary.classList.contains("border-bottom")) { summary.classList.add("border-bottom") }
}

function showOrderTotal() {
    let summaryTotal = document.querySelector(".summary-total");
    if (summaryTotal.classList.contains("hide")) { summaryTotal.classList.remove("hide") }
    document.querySelector("#total").innerText = total.toFixed(2);
}

function getCartAndMenuItem(itemName) {
    let orderItem = cartItems.filter(cartItem => cartItem.menuItem.name === itemName)[0];
    let menuItem = menuItems.filter(menuItem => menuItem.name === itemName)[0];
    return { orderItem, menuItem }
}