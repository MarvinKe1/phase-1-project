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
async function initApp() {
    await fetchTransactions();
    renderTransactions();
}

async function fetchTransactions() {
    try {
        const response = await fetch('http://localhost:3000/transactions');
        transactions = await response.json();
    } catch (error) {
        console.error("API Error:", error);
        transactions = []; // Fallback empty array
    }
}

function renderTransactions() {
    transactionsList.innerHTML = '';
    transactions.forEach(transaction => {
        const transactionEl = document.createElement('div');
        transactionEl.className = 'transaction';
        transactionEl.innerHTML = `
            <div>${transaction.description}</div>
            <div>KSh ${transaction.amount}</div>
        `;
        transactionsList.appendChild(transactionEl);
    });
}
expenseForm.addEventListener('submit', handleAddExpense);

async function handleAddExpense(e) {
    e.preventDefault();
    
    const newTransaction = {
        description: document.getElementById('description').value.trim(),
        amount: parseInt(document.getElementById('amount').value),
        category: document.getElementById('category').value
    };

    if (!newTransaction.description || !newTransaction.amount) return;

    try {
        const response = await fetch('http://localhost:3000/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTransaction)
        });
        transactions.push(await response.json());
        renderTransactions();
        expenseForm.reset();
    } catch (error) {
        console.error("Submission Error:", error);
    }
}