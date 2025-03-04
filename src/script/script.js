// class Bank {
//     constructor(expense, cost) [
            // this.expense = expense;
            // this.cost = cost;
//     ]
// }

let income = 1000;;
// let income = parseInt(document.getElementById("total-income").innerHTML);
let expenses = parseInt(document.getElementById("total-expenses").innerHTML);
let balance = income - expenses;

function render() {
    document.getElementById("total-income").innerHTML = income;
    document.getElementById("total-expenses").innerHTML = expenses;
    document.getElementById("current-balance").innerHTML = balance;
}

function addIncome() {
    
}