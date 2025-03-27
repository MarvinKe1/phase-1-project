// DOM Elements
const expenseForm = document.getElementById('expense-form');
const transactionsList = document.getElementById('transactions-list');
const totalAmountElement = document.getElementById('total-amount');
const filterCategory = document.getElementById('filter-category');

// State
let transactions = [];

// Initialize App
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    console.log("App initialized"); // Temporary log
}