class ProfileManager { //manages profiles
    constructor() {
        this.profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        this.activeProfile = JSON.parse(localStorage.getItem('activeProfile')) || null;
    }

    setActiveProfile(email) { // Switch active profile
        const profile = this.profiles.find(p => p.email === email);
        if (profile) {
            this.activeProfile = profile;
            localStorage.setItem('activeProfile', JSON.stringify(profile));
            localStorage.setItem('activeProfileEmail', profile.email); // Track active profile for MoneyManager
        } else {
            console.error('Profile not found');
        }
    }

    addProfile(profile) { // Create new profile
        if (this.profiles.some(p => p.email === profile.email)) {
            console.error('Profile with this email already exists');
            return;
        }
        this.profiles.push(profile);
        localStorage.setItem('profiles', JSON.stringify(this.profiles));
        this.setActiveProfile(profile.email);
    }

    getActiveProfile() {
        return this.activeProfile;
    }

    getProfiles() {
        return this.profiles
    }

    signOut() { // Log out of the active profile
        this.activeProfile = null;
        localStorage.removeItem('activeProfile');
        localStorage.removeItem('activeProfileEmail');
    }
}

class Profile { //creates a new profile
    constructor (name, email, age) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.income = 0;
        this.expenses = 0;
    }
    
    getProfileInfo() {
        return `${this.name}, ${this.age} years old, Email: ${this.email}`
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const profileSelect = document.getElementById("profileSelect");
    const loginBtn = document.getElementById("loginBtn");
    const createProfileBtn = document.getElementById("createProfileBtn");

    let profiles = JSON.parse(localStorage.getItem("profiles")) || [];

    // Populate profile dropdown
    function loadProfiles() {
        profileSelect.innerHTML = '<option value="">-- Choose Profile --</option>';
        profiles.forEach(profile => {
            const option = document.createElement("option");
            option.value = profile.email;
            option.textContent = profile.name;
            profileSelect.appendChild(option);
        });
    }

    loadProfiles();

    // Log in an existing profile
    loginBtn.addEventListener("click", () => {
        const selectedEmail = profileSelect.value;

        if (selectedEmail) {
            localStorage.setItem("activeProfileEmail", selectedEmail);
            window.location.href = "index.html"; // Redirect to main app
        } else {
            alert("Please select a profile to log in.");
        }
    });

    // Create a new profile
    createProfileBtn.addEventListener("click", () => {
        const name = document.getElementById("newName").value.trim();
        const email = document.getElementById("newEmail").value.trim();
        const age = document.getElementById("newAge").value.trim();

        if (!name || !email || !age) {
            alert("All fields are required.");
            return;
        }

        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Enter a valid positive number.");
            return;
        }

        if (profiles.some(profile => profile.email === email)) {
            alert("A profile with this email already exists.");
            return;
        }

        // Create new profile
        const newProfile = { name, email, age, income: 0, expenses: 0 };
        profiles.push(newProfile);
        localStorage.setItem("profiles", JSON.stringify(profiles));

        loadProfiles(); // Update dropdown

        alert("Profile created successfully! Please log in.");
    });
});

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
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

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

        const newTransaction = { type, category, amount, date, notes };
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
            li.classList = 'bg-yellow-500';

            if (tx.type === "Income") {
                incomeList.appendChild(li);
            } else {
                expenseList.appendChild(li);
            }
        });
    }

    updateTransactionList();
});