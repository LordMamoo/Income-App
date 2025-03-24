class MoneyManager {
    constructor() {
        this.activeProfileEmail = localStorage.getItem('activeProfileEmail');
        this.loadProfileData();
        this.init();
    }

    // Load income & expenses for the active profile
    loadProfileData() {
        if (!this.activeProfileEmail) {
            console.error("No active profile found.");
            return;
        }
        const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        const profile = profiles.find(p => p.email === this.activeProfileEmail);

        if (profile) {
            this.totalIncome = profile.income || 0;
            this.totalExpenses = profile.expenses || 0;
        } else {
            this.totalIncome = 0;
            this.totalExpenses = 0;
        }
    }

    // Save updated income & expenses for the active profile
    saveProfileData() {
        if (!this.activeProfileEmail) return;

        let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        let profileIndex = profiles.findIndex(p => p.email === this.activeProfileEmail);

        if (profileIndex !== -1) {
            profiles[profileIndex].income = this.totalIncome;
            profiles[profileIndex].expenses = this.totalExpenses;
            localStorage.setItem('profiles', JSON.stringify(profiles));
        }
    }

    // Add Income
    addIncome(amount) {
        if (!isNaN(amount) && amount > 0) {
            this.totalIncome += amount;
            this.saveProfileData();
            this.render();
        } else {
            alert("Please enter a valid income amount!");
        }
    }

    // Add Expense
    addExpense(amount) {
        if (!isNaN(amount) && amount > 0) {
            this.totalExpenses += amount;
            this.saveProfileData();
            this.render();
        } else {
            alert("Please enter a valid expense amount!");
        }
    }

    // Calculate & update UI
    render() {
        document.getElementById("total-income").textContent = `$${this.totalIncome.toFixed(2)}`;
        document.getElementById("total-expenses").textContent = `$${this.totalExpenses.toFixed(2)}`;
        document.getElementById("current-balance").textContent = `$${(this.totalIncome - this.totalExpenses).toFixed(2)}`;
    }

    // Initialize event listeners
    init() {
        document.getElementById("incomeBtn").addEventListener("click", () => {
            const amount = parseFloat(document.getElementById("addIncome").value);
            document.getElementById("addIncome").value = "";
            this.addIncome(amount);
        });

        document.getElementById("expenseBtn").addEventListener("click", () => {
            const amount = parseFloat(document.getElementById("addExpense").value);
            document.getElementById("addExpense").value = "";
            this.addExpense(amount);
        });

        this.render();
    }
}

// Initialize MoneyManager when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new MoneyManager();
});

document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.querySelector("form");
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    transactionForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const type = document.getElementById("t-type").value;
        const category = document.getElementById("t-category").value;
        const amount = parseFloat(document.getElementById("t-amount").value);
        const date = document.getElementById("t-date").value;
        const notes = document.getElementById("t-notes").value.trim();

        if (!amount || amount <= 0) {
            alert("Enter a valid amount!");
            return;
        }

        const newTransaction = { id: Date.now(), type, category, amount, date, notes};
        transactions.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));

        updateTransactionList();
        transactionForm.reset();
    });

    function updateTransactionList() {
        const incomeList = document.getElementById("income-list");
        const expenseList = document.getElementById("expense-list");

        incomeList.innerHTML = "";
        expenseList.innerHTML = "";

        transactions.forEach(tx => {
            const li = document.createElement("li");
            li.textContent = `${tx.category}: $${tx.amount.toFixed(2)} (${tx.date}) - ${tx.notes}`;
            li.classList = 'bg-yellow-500 flex justify-between p-4';

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("ml-2", "text-red-500", "hover:text-red-700");
            deleteBtn.setAttribute("data-id", tx.id); // Store transaction ID

            deleteBtn.addEventListener("click", (event) => {
                const txId = parseInt(event.target.getAttribute("data-id"));
                deleteTransaction(txId);
            });

            li.appendChild(deleteBtn);

            if (tx.type === "Income") {
                incomeList.appendChild(li);
            } else {
                expenseList.appendChild(li);
            }
        });
    }

    function deleteTransaction(id) {
        console.log(id);
        transactions = transactions.filter(tx => tx.id !== id);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateTransactionList();
    }

    updateTransactionList();
});