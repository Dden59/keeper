let initialBalance = 0;
let currentBalance = 0;
let baseBet = 0;
let currentStep = 0;
let winStreak = 0;
let lossStreak = 0;

function calculateInitialBet() {
  const balance = Number(document.getElementById("balance").value);
  if (!balance || balance < 100) {
    alert("Введите корректный баланс.");
    return;
  }
  initialBalance = balance;
  currentBalance = balance;

  const bet = calculateSafeBet(balance);
  baseBet = bet;

  document.getElementById("bet").value = bet.toFixed(2);
  document.getElementById("bet-setup").style.display = "block";
}

function calculateSafeBet(balance) {
  const multiplier = 1.5;
  let bet = 1;
  while (true) {
    let total = 0;
    for (let i = 0; i < 6; i++) {
      total += bet * (2 ** i);
    }
    const recover = bet * (2 ** 6);
    const needed = total - recover / multiplier;
    if (needed <= balance) break;
    bet -= 0.1;
  }
  return Math.floor(bet * 100) / 100;
}

function startGame() {
  baseBet = Number(document.getElementById("bet").value);
  if (!baseBet || baseBet <= 0) {
    alert("Укажите корректную ставку");
    return;
  }

  currentBalance = initialBalance;
  currentStep = 0;
  winStreak = 0;
  lossStreak = 0;

  document.getElementById("game-ui").style.display = "block";
  document.getElementById("status").textContent = `Текущий баланс: ${currentBalance.toFixed(2)} ₽`;
}

function recordResult(isWin) {
  const bet = baseBet * (2 ** currentStep);

  if (bet > currentBalance) {
    document.getElementById("status").textContent = "У вас недостаточно средств для ставки 😭";
    return;
  }

  if (isWin) {
    const winAmount = bet * 1.5;
    currentBalance += (winAmount - bet);
    currentStep = 0;
    winStreak++;
    lossStreak = 0;
  } else {
    currentBalance -= bet;
    currentStep++;
    winStreak = 0;
    lossStreak++;
  }

  updateGreed(isWin);
  showFeedback();
  document.getElementById("status").textContent = `Текущий баланс: ${currentBalance.toFixed(2)} ₽`;
}

function updateGreed(isWin) {
  const greed = document.getElementById("greed");
  let value = parseInt(greed.value);
  if (isWin) {
    value = Math.max(0, value - 10);
  } else {
    value = Math.min(100, value + 20);
  }
  greed.value = value;
  document.getElementById("greed-emoji").textContent = value < 30 ? "😇" : value < 70 ? "😐" : "😈";
}

function showFeedback() {
  const status = document.getElementById("status");

  if (winStreak === 2) status.textContent = "У тебя хорошо получается, продолжай в том же духе 👍";
  if (winStreak === 3) status.textContent = "Горжусь тобой 😇";
  if (winStreak === 4) status.textContent = "Пристегни ремни, мы взлетаем 🚀";
  if (winStreak === 5) status.textContent = "Куда потратим деньги? 😂";

  if (lossStreak === 2) status.textContent = "Ничего страшного, я верю в тебя 🥺";
  if (lossStreak === 3) status.textContent = "Сделай паузу на кофе ☕️";
  if (lossStreak >= 4) status.textContent = "Высокий риск слить баланс! ⚠️";
}

function resetGame() {
  document.getElementById("balance").value = "";
  document.getElementById("bet").value = "";
  document.getElementById("bet-setup").style.display = "none";
  document.getElementById("game-ui").style.display = "none";
  document.getElementById("status").textContent = "";
  document.getElementById("greed").value = 0;
  document.getElementById("greed-emoji").textContent = "😇";
}
