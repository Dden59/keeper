let round = 0;
let winStreak = 0;
let loseStreak = 0;
let balance = 0;
let currentBet = 0;
let greedLevel = 0;
let initialBet = 0;

function startGame() {
    initialBet = parseFloat(document.getElementById('initialBet').value);
    balance = parseFloat(document.getElementById('balance').value);
    round = 0;
    winStreak = 0;
    loseStreak = 0;
    greedLevel = 0;
    currentBet = initialBet;
    updateUI();
    document.getElementById('recommendation').textContent = '';
}

function registerResult(win) {
    round++;

    if (win) {
        balance += currentBet * 0.5;
        winStreak++;
        loseStreak = 0;
        currentBet = initialBet;
        greedLevel = Math.max(0, greedLevel - 10);
    } else {
        balance -= currentBet;
        loseStreak++;
        winStreak = 0;
        let totalLoss = 0;
        for (let i = 1; i <= loseStreak; i++) {
            totalLoss += Math.pow(2, i - 1) * initialBet;
        }
        currentBet = Math.ceil((totalLoss * 1.5) - (currentBet * 0.5));
        greedLevel = Math.min(100, greedLevel + 10);
    }

    document.getElementById('balance').value = Math.round(balance);
    showNotification();
    updateUI();
}

function updateUI() {
    document.getElementById('roundInfo').textContent = `Раунд: ${round}`;
    document.getElementById('currentBet').textContent = `Текущая ставка: ${Math.ceil(currentBet)}₽`;
    document.getElementById('greedBar').style.width = `${greedLevel}%`;

    const emoji = greedLevel < 30 ? '🙂' : greedLevel < 70 ? '😬' : '😈';
    document.getElementById('greedEmoji').textContent = emoji;
    document.getElementById('greedLevel').textContent = `Жадность: ${greedLevel}%`;

    const riskSteps = Math.floor(Math.log2(balance / currentBet));
    if (riskSteps < 3) {
        document.getElementById('recommendation').textContent = 'Внимание! Риск потерять баланс слишком высок. Уменьши ставку или увеличь банк.';
    }
}

function resetGame() {
    document.getElementById('initialBet').value = 100;
    document.getElementById('balance').value = 1000;
    document.getElementById('notifications').textContent = '';
    startGame();
}

function showNotification() {
    let text = '';
    if (winStreak === 2) text = 'У тебя хорошо получается, продолжай в том же духе 👍';
    else if (winStreak === 3) text = 'Горжусь тобой 😇';
    else if (winStreak === 4) text = 'Пристегни ремни, мы взлетаем 🚀';
    else if (winStreak >= 5) text = 'Куда потратим деньги? 😂';

    if (loseStreak === 2) text = 'Ничего страшного, я верю в тебя 🥺';
    else if (loseStreak === 3) text = 'Сделай паузу на кофе ☕️';
    else if (loseStreak >= 4) text = 'Высокий риск слить баланс!';

    document.getElementById('notifications').textContent = text;
}
