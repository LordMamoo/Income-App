class ProfileManager { //manages profiles
    constructor() {
        this.profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        this.activeProfile = JSON.parse(localStorage.getItem('activeProfile')) || null;
    }

    setActiveProfile(email) { //sets the active profile
        const profile = this.profiles.find(p => p.email === email);
        if (profile) {
          this.activeProfile = profile;
          localStorage.setItem('activeProfile', JSON.stringify(profile));
        } else {
          console.error('Profile not found');
        }
    }

    addProfile(profile) { //creates a profile
        this.profiles.push(profile);
        localStorage.setItem('profiles', JSON.stringify(this.profiles));
        this.activeProfile = profile;
    }

    getActiveProfile() {
        return this.activeProfile;
    }

    getProfiles() {
        return this.profiles
    }

    signOut() { //signs out of the active profile
        const profile = null

        if (profile === null) {
            this.activeProfile = profile;
            localStorage.setItem('activeProfile', JSON.stringify(profile));
        }
    }
}

class Profile { //creates a new profile
    constructor (name, email, age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    getProfileInfo() {
        return `${this.name}, ${this.age} years old, Email: ${this.email}`
    }
}

class Transactions {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || {};
    }

    addTransaction() {
        const activeProfile = profileManager.getActiveProfile();

        if (!activeProfile) {
            console.error('No active profile set');
            return;
        }

        const type = document.getElementById('t-type').value;
        const category = document.getElementById('t-category').value;
        const amount = parseFloat(document.getElementById('t-amount').value);
        const date = document.getElementById('t-date').value;
        const notes = document.getElementById('t-notes').value;

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const email = activeProfile.email;

        if (!this.transactions[email]) {
            this.transactions[email] = [];
        }

        const transaction = { type, category, amount, date, notes };
        this.transactions[email].push(transaction);
        localStorage.setItem('transactions', JSON.stringify(this.transactions));

        alert('Transaction added successfully');
    }

    getTransactions() {
        const activeProfile = profileManager.getActiveProfile();
        if (!activeProfile) return [];

        return this.transactions[activeProfile.email] || [];
    }

    calculateBalance() {
        const transactions = this.getTransactions();

        let incomeTotal = 0;
        let expenseTotal = 0;

        transactions.forEach(({ type, amount }) => {
            if (type === 'Income') {
                incomeTotal += parseFloat(amount);
            } else if (type === 'Expense') {
                expenseTotal += parseFloat(amount);
            }
        });

        return incomeTotal - expenseTotal;
    }
}

const profileManager = new ProfileManager();
// const transactions = new Transactions();

let incomeTotal = 0;
let expenseTotal = 0;
const balance = incomeTotal - expenseTotal;

function renderProfile() {
    const activeProfile = profileManager.getActiveProfile();
    
    if (activeProfile) {
        document.getElementById('prof-name').innerHTML = activeProfile.name;
    } else {
        document.getElementById('prof-name').innerHTML = 'No active profile';
    }
}

// function renderLists() {
//     const lists = transactions.lists;

//     let transactionsHtml = `<ul id="transactions">`;

//     Object.values(lists).forEach(list => {
//         transactionsHtml += `<li>${list}</li>`;
//     });

//     transactionsHtml += `</ul>`;

//     document.getElementById('income-list').innerHTML = transactionsHtml;
// }

function render() {
    renderProfile();
    // renderLists();
}

// Handle Profile Form Submission
function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const ageInput = document.getElementById('age').value;

    const birthYear = new Date(ageInput).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    const newProfile = new Profile(name, email, age);
    profileManager.addProfile(newProfile);
    profileManager.setActiveProfile(email);

    window.location.href = 'home.html'; // Redirect to home page
}