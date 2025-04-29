let initialBet = 100;
let multiplier = 2;
let balance = 1000;
let currentBet = initialBet;
let greed = 0;
let winStreak = 0;
let lossStreak = 0;

function startGame() {
  initialBet = parseFloat(document.getElementById("startBet").value);
  multiplier = parseFloat(document.getElementById("multiplier").value);
  balance = parseFloat(document.getElementById("balance").value);
  currentBet = initialBet;
  updateDisplay();
}

function logResult(win) {
  if (win) {
    balance += currentBet * 1.5 - currentBet;
    currentBet = initialBet;
    winStreak++;
    lossStreak = 0;
    greed += 10;
  } else {
    balance -= currentBet;
    lossStreak++;
    winStreak = 0;
    greed += 5;
    currentBet = calculateRecoveryBet();
  }

  updateDisplay();
  updateGreedBar();
  showMessage();
}

function updateDisplay() {
  document.getElementById("currentBet").innerText = currentBet.toFixed(2);
  document.getElementById("currentBalance").innerText = balance.toFixed(2);
}

function updateGreedBar() {
  let width = Math.min(greed, 100);
  document.getElementById("greedLevel").style.width = width + "%";
}

function showMessage() {
  const msg = document.getElementById("message");
  if (winStreak === 2) msg.innerText = "У тебя хорошо получается, продолжай в том же духе 👍";
  else if (winStreak === 3) msg.innerText = "Горжусь тобой 😇";
  else if (winStreak === 4) msg.innerText = "Пристегни ремни, мы взлетаем 🚀";
  else if (winStreak >= 5) msg.innerText = "Куда потратим деньги? 😂";
  else if (lossStreak === 2) msg.innerText = "Ничего страшного, я верю в тебя 🥺";
  else if (lossStreak === 3) msg.innerText = "Сделай паузу на кофе ☕️";
  else if (lossStreak >= 4) msg.innerText = "Высокий риск слить баланс!";
  else msg.innerText = "";
}

function calculateRecoveryBet() {
  let totalLost = 0;
  let tempBet = currentBet;
  for (let i = 0; i < lossStreak; i++) {
    totalLost += tempBet;
    tempBet *= multiplier;
  }

  let neededWin = totalLost / 0.5; // 0.5 = (1.5x profit)
  return Math.ceil(neededWin);
}
