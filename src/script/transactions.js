class MoneyManager {
    constructor() {
        this.activeProfileEmail = localStorage.getItem('activeProfileEmail');
        this.loadProfileData();
        this.init();
    }

    // Load profile transactions and calculate totals
    loadProfileData() {
        if (!this.activeProfileEmail) {
            console.error("No active profile found.");
            return;
        }

        let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        let profile = profiles.find(p => p.email === this.activeProfileEmail);

        if (profile) {
            this.transactions = profile.transactions || [];
            this.calculateTotals();
        } else {
            this.transactions = [];
            this.totalIncome = 0;
            this.totalExpenses = 0;
        }

        this.render(); // Update UI
    }

    // Sum up all income and expenses dynamically
    calculateTotals() {
        this.totalIncome = this.transactions
            .filter(tx => tx.type === "Income")
            .reduce((sum, tx) => sum + tx.amount, 0);

        this.totalExpenses = this.transactions
            .filter(tx => tx.type === "Expense")
            .reduce((sum, tx) => sum + tx.amount, 0);
    }

    // Save profile data
    saveProfileData() {
        let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        let profileIndex = profiles.findIndex(p => p.email === this.activeProfileEmail);

        if (profileIndex !== -1) {
            profiles[profileIndex].transactions = this.transactions;
            localStorage.setItem('profiles', JSON.stringify(profiles));
        }
    }

    // Add a new income transaction
    addIncome(amount) {
        if (!isNaN(amount) && amount > 0) {
            this.transactions.push({
                type: "Income",
                amount,
                date: new Date().toISOString().split("T")[0]
            });

            this.calculateTotals();
            this.saveProfileData();
            this.render();
        } else {
            alert("Please enter a valid income amount!");
        }
    }

    // Render total income and balance
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

        this.render();
    }
}

// Initialize MoneyManager when the page loads
document.addEventListener("DOMContentLoaded", () => {
    new MoneyManager();
});


document.addEventListener("DOMContentLoaded", () => {
    const profNameSpan = document.getElementById("prof-name");
    const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
    const activeProfileEmail = localStorage.getItem("activeProfileEmail");

    if (activeProfileEmail) {
        // Find the active profile by email
        const activeProfile = profiles.find(profile => profile.email === activeProfileEmail);
        
        if (activeProfile) {
            profNameSpan.textContent = activeProfile.name; // Display profile name
        } else {
            profNameSpan.textContent = "Unknown User"; // Fallback if profile is not found
        }
    } else {
        profNameSpan.textContent = "Guest";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.querySelector("form");
    const activeProfileEmail = localStorage.getItem("activeProfileEmail");
    let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
    let activeProfile = profiles.find(p => p.email === activeProfileEmail);

    if (!activeProfile) {
        alert("No active profile found!");
        return;
    }

    let transactions = activeProfile.transactions || [];

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

        // Create a new transaction
        const newTransaction = { id: Date.now(), type, category, amount, date, notes };
        transactions.push(newTransaction);
        activeProfile.transactions = transactions;

        // Save back to localStorage
        localStorage.setItem("profiles", JSON.stringify(profiles));

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
        transactions = transactions.filter(tx => tx.id !== id);
        activeProfile.transactions = transactions;
        localStorage.setItem("profiles", JSON.stringify(profiles));
        updateTransactionList();
    }

    updateTransactionList();
});