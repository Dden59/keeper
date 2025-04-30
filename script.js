let userBalance = 0;
let currentBet = 0;
let greedLevel = 0;
let winStreak = 0;
let loseStreak = 0;
let notifications = document.getElementById('notificationBox');

function calculateRecommendedBet() {
    userBalance = parseFloat(document.getElementById('userBalance').value);
    let safeBet = Math.floor(userBalance / ((1.5 ** 6) - 1)); // расчет на 6 проигрышей
    currentBet = safeBet;
    document.getElementById('recommendedBetDisplay').innerText = `${safeBet}₽`;
    document.getElementById('currentBetInput').value = safeBet;
    document.getElementById('startSection').classList.add('hidden');
    document.getElementById('betSection').classList.remove('hidden');
}

function startGame() {
    currentBet = parseFloat(document.getElementById('currentBetInput').value);
    document.getElementById('displayBalance').innerText = `${userBalance}₽`;
    document.getElementById('displayBet').innerText = `${currentBet}₽`;
    document.getElementById('betSection').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
}

function handleResult(isWin) {
    if (isWin) {
        userBalance += currentBet * 0.5;
        winStreak++;
        loseStreak = 0;
        greedLevel = Math.max(0, greedLevel - 10);
    } else {
        userBalance -= currentBet;
        loseStreak++;
        winStreak = 0;
        greedLevel += 15;

        // рассчёт новой ставки
        currentBet = calculateRecoveryBet();
        if (currentBet > userBalance) {
            showNotification("У вас недостаточно средств для ставки 😭");
            currentBet = 0;
        }
    }

    updateUI();
}

function calculateRecoveryBet() {
    let lostAmount = 0;
    for (let i = 0; i < loseStreak; i++) {
        lostAmount += currentBet * (1.5 ** i);
    }
    return Math.ceil((lostAmount + currentBet * 0.5) / 1.5);
}

function updateUI() {
    document.getElementById('displayBalance').innerText = `${Math.floor(userBalance)}₽`;
    document.getElementById('displayBet').innerText = `${Math.floor(currentBet)}₽`;
    updateGreedBar();
    showStreakMessages();

    if (userBalance <= (userBalance * 0.3)) {
        showNotification("Высокий риск слить баланс!");
    }
}

function updateGreedBar() {
    const fill = document.getElementById('greedFill');
    let percentage = Math.min(100, greedLevel);
    fill.style.width = percentage + "%";

    const message = document.getElementById('greedMessage');
    if (percentage < 25) message.innerText = "Холоден как лёд";
    else if (percentage < 50) message.innerText = "Начинает закипать...";
    else if (percentage < 75) message.innerText = "Жарко!";
    else message.innerText = "Ты на грани, остынь!";
}

function showStreakMessages() {
    let msg = "";
    if (winStreak === 2) msg = "У тебя хорошо получается, продолжай в том же духе👍";
    if (winStreak === 3) msg = "Горжусь тобой 😇";
    if (winStreak === 4) msg = "Пристегни ремни, мы взлетаем🚀";
    if (winStreak === 5) msg = "Куда потратим деньги? 😂";

    if (loseStreak === 2) msg = "Ничего страшного, я верю в тебя 🥺";
    if (loseStreak === 3) msg = "Сделай паузу на кофе ☕️";
    if (loseStreak === 4) msg = "Высокий риск слить баланс!";

    if (msg) showNotification(msg);
}

function showNotification(message) {
    notifications.innerText = message;
    notifications.style.display = 'block';
}

function resetGame() {
    window.location.reload();
}
