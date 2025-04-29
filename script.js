let baseBet = 100;
let currentBet = 100;
let balance = 1000;
let winStreak = 0;
let loseStreak = 0;
let greedLevel = 0;
let gameStarted = false;
let totalProfitTarget = 0;

const greedBar = document.getElementById("greedBar");
const currentBetDisplay = document.getElementById("currentBet");
const currentBalanceDisplay = document.getElementById("currentBalance");
const notifications = document.getElementById("notifications");

function updateGreedBar() {
    greedBar.style.setProperty("--greed", `${greedLevel}%`);
    greedBar.style.setProperty("width", `${greedLevel}%`);
}

function showNotification(msg) {
    notifications.innerText = msg;
    notifications.style.display = "block";
    setTimeout(() => {
        notifications.style.display = "none";
    }, 3500);
}

function calculateNextBet(losses, targetProfit) {
    return Math.ceil((targetProfit + (baseBet * losses)) / 0.5);
}

function resetGame() {
    gameStarted = false;
    winStreak = 0;
    loseStreak = 0;
    greedLevel = 0;
    notifications.innerText = "";
    document.getElementById("gameSection").style.display = "none";
}

document.getElementById("startBtn").addEventListener("click", () => {
    baseBet = parseFloat(document.getElementById("baseBet").value);
    balance = parseFloat(document.getElementById("balance").value);
    currentBet = baseBet;
    totalProfitTarget = balance;

    document.getElementById("gameSection").style.display = "block";
    updateDisplay();
    gameStarted = true;
});

document.getElementById("winBtn").addEventListener("click", () => {
    if (!gameStarted) return;

    const profit = currentBet * 1.5;
    balance += profit;
    winStreak++;
    loseStreak = 0;

    if (greedLevel > 0) greedLevel -= 10;
    updateGreedBar();

    totalProfitTarget = balance;

    if (winStreak === 2) showNotification("У тебя хорошо получается, продолжай в том же духе👍");
    if (winStreak === 3) showNotification("Горжусь тобой 😇");
    if (winStreak === 4) showNotification("Пристегни ремни, мы взлетаем🚀");
    if (winStreak === 5) showNotification("Куда потратим деньги? 😂");

    currentBet = baseBet;
    updateDisplay();
});

document.getElementById("loseBtn").addEventListener("click", () => {
    if (!gameStarted) return;

    balance -= currentBet;
    loseStreak++;
    winStreak = 0;

    if (greedLevel < 100) greedLevel += 10;
    updateGreedBar();

    if (loseStreak === 2) showNotification("Ничего страшного, я верю в тебя 🥺");
    if (loseStreak === 3) showNotification("Сделай паузу на кофе ☕️");
    if (loseStreak === 4) showNotification("Высокий риск слить баланс!");

    if (balance <= 0) {
        showNotification("У вас недостаточно средств для ставки 😭");
        return;
    }

    let nextBet = calculateNextBet(loseStreak, totalProfitTarget - balance);
    if (nextBet > balance) {
        showNotification("У вас недостаточно средств для ставки 😭");
        return;
    }

    currentBet = nextBet;
    updateDisplay();
});

function updateDisplay() {
    currentBetDisplay.textContent = currentBet.toFixed(2);
    currentBalanceDisplay.textContent = balance.toFixed(2);

    if (balance < baseBet * 3) {
        showNotification("Осталось мало попыток.");
    }
}

document.getElementById("resetBtn").addEventListener("click", () => {
    window.location.reload();
});
