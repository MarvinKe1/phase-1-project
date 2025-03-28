// DOM Elements
const appContent = document.getElementById('app-content');
const getStartedBtn = document.getElementById('get-started');
const expenseForm = document.getElementById('expense-form');
const transactionsList = document.getElementById('transactions-list');
const totalAmountElement = document.getElementById('total-amount');
const filterCategory = document.getElementById('filter-category');

// State
let transactions = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
getStartedBtn.addEventListener('click', showApp);
expenseForm.addEventListener('submit', handleAddExpense);
filterCategory.addEventListener('change', filterTransactions);

// Initialize App
function initApp() {
    appContent.classList.add('hidden');
    fetchTransactions();
}

function showApp() {
    document.querySelector('.landing-header').classList.add('hidden');
    appContent.classList.remove('hidden');
}

// Fetch transactions from API
async function fetchTransactions() {
    try {
        const response = await fetch('http://localhost:3000/transactions');
        if (!response.ok) throw new Error('Failed to fetch');
        transactions = await response.json();
        renderTransactions();
        updateTotal();
    } catch (error) {
        console.error('Error:', error);
        //  sample data
        transactions = [
            { id: 1, description: "Chapati Beans", amount: 120, category: "Food" },
            { id: 2, description: "Matatu Fare", amount: 50, category: "Transport" },
            { id: 3, description: "Safaricom Airtime", amount: 100, category: "Airtime" },
            { id: 4, description: "Rent", amount: 15000, category: "Housing" },
            { id: 5, description: "Movie Ticket", amount: 800, category: "Entertainment" }
        ];
        renderTransactions();
        updateTotal();
    }
}

// Handle form submission
async function handleAddExpense(e) {
    e.preventDefault();
    
    const description = document.getElementById('description').value.trim();
    const amount = parseInt(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    
    if (!description || !amount) {
        alert('Please fill all fields correctly');
        return;
    }
    
    const newTransaction = { description, amount, category };
    
    try {
        const response = await fetch('http://localhost:3000/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTransaction)
        });
        
        const addedTransaction = await response.json();
        transactions.push(addedTransaction);
        renderTransactions();
        updateTotal();
        expenseForm.reset();
    } catch (error) {
        console.error('Error:', error);
        newTransaction.id = Date.now();
        transactions.push(newTransaction);
        renderTransactions();
        updateTotal();
        expenseForm.reset();
    }
}

// Render transactions with KSh formatting
function renderTransactions(transactionsToRender = transactions) {
    transactionsList.innerHTML = '';
    
    transactionsToRender.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction';
        transactionElement.innerHTML = `
            <div class="transaction-info">
                <div class="description">${transaction.description}</div>
                <div class="category">${transaction.category}</div>
            </div>
            <div class="transaction-amount">KSh ${transaction.amount.toLocaleString('en-KE')}</div>
            <button class="delete-btn" data-id="${transaction.id}">×</button>
        `;
        transactionsList.appendChild(transactionElement);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteTransaction);
    });
}

// Filter transactions
function filterTransactions() {
    const category = filterCategory.value;
    const filtered = category === 'all' 
        ? transactions 
        : transactions.filter(t => t.category === category);
    renderTransactions(filtered);
}

// Update total with KSh formatting
function updateTotal() {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    totalAmountElement.textContent = total.toLocaleString('en-KE');
}

// Handle delete transaction
async function handleDeleteTransaction(e) {
    const id = e.target.dataset.id;
    
    try {
        await fetch(`http://localhost:3000/transactions/${id}`, {
            method: 'DELETE'
        });
        transactions = transactions.filter(t => t.id != id);
        renderTransactions();
        updateTotal();
    } catch (error) {
        console.error('Error:', error);
        transactions = transactions.filter(t => t.id != id);
        renderTransactions();
        updateTotal();
    }
}