class Expense {
    constructor(expense, cost) {
        this.expense = expense;
        this.cost = cost;
    }

    addExpense(expense) {
        if (!expense) return;
            const newExpense = parseFloat(document.getElementById("addExpense").value);
            expenseTotal = expenseTotal + newExpense;
            document.getElementById("addExpense").value = null;
            this.saveExpenses();
            render();
    }

    saveExpenses() {
        localStorage.setItem("expense", JSON.stringify(this.expense));
        localStorage.setItem("cost", JSON.stringify(this.cost));
    }
}



let incomeTotal = 0;
let expenseTotal = 0;
const balance = incomeTotal - expenseTotal;

function render() {
    document.getElementById("total-income").innerHTML = incomeTotal.toFixed(2);
    document.getElementById("total-expenses").innerHTML = expenseTotal.toFixed(2);
    document.getElementById("current-balance").innerHTML = balance.toFixed(2);
}



function addIncome() {
    const newIncome = parseFloat(document.getElementById("addIncome").value);
    incomeTotal = incomeTotal + newIncome;
    document.getElementById("addIncome").value = null;


    render();
}