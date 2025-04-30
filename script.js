let balance = 0;
let baseBet = 0;
let currentBet = 0;
let losses = 0;
let wins = 0;
let greedLevel = 0;

const balanceInput = document.getElementById('balance');
const betInput = document.getElementById('bet');
const resultBox = document.getElementById('result');
const greedFill = document.getElementById('greed-fill');
const statusMsg = document.getElementById('status-message');

function calculateRecommendedBet(balance) {
  // Расчет ставки, чтобы перекрыть 6 проигрышей подряд при коэффициенте 1.5x
  let bet = 1;
  let total = 0;
  for (let i = 0; i < 6; i++) {
    total += bet;
    bet *= 2;
  }
  return Math.floor(balance / total);
}

function startGame() {
  balance = parseInt(balanceInput.value);
  if (isNaN(balance) || balance < 100) {
    alert("Введите корректный баланс (от 100₽)");
    return;
  }
  baseBet = calculateRecommendedBet(balance);
  betInput.value = baseBet;
  currentBet = baseBet;
  losses = 0;
  wins = 0;
  greedLevel = 0;
  updateGreedBar();
  resultBox.innerText = `Рекомендуемая ставка: ${baseBet}₽ (хватает на 6 проигрышей подряд при 1.5x)`;
  statusMsg.innerText = "Готово к старту 🚀";
}

function updateGreedBar() {
  let level = Math.min((losses / 6) * 100, 100);
  greedFill.style.width = `${level}%`;
}

function handleWin() {
  balance += currentBet * 0.5; // потому что выигрыш на 1.5x
  wins++;
  losses = 0;
  currentBet = baseBet;
  updateGreedBar();
  updateStatus("win");
  showResult(`Выигрыш! Новый баланс: ${Math.round(balance)}₽`);
}

function handleLoss() {
  balance -= currentBet;
  losses++;
  currentBet = calculateRecoveryBet();
  updateGreedBar();
  updateStatus("loss");

  if (balance <= 0) {
    showResult("Баланс исчерпан 😢");
    statusMsg.innerText = "У вас недостаточно средств для ставки 😭";
    return;
  }

  if (currentBet > balance) {
    showResult(`Недостаточно средств на следующую ставку: ${currentBet}₽`);
    statusMsg.innerText = "У вас недостаточно средств для ставки 😭";
    return;
  }

  showResult(`Проигрыш. Следующая ставка: ${currentBet}₽`);
}

function calculateRecoveryBet() {
  let neededProfit = wins * baseBet * 0.5 + losses * baseBet;
  for (let bet = baseBet; bet < balance; bet++) {
    let totalLoss = 0;
    let b = bet;
    for (let i = 0; i < losses; i++) {
      totalLoss += b;
      b *= 2;
    }
    if ((b * 1.5) - totalLoss >= neededProfit) return Math.ceil(b);
  }
  return baseBet;
}

function showResult(message) {
  resultBox.innerText = message;
}

function resetGame() {
  balance = 0;
  baseBet = 0;
  currentBet = 0;
  losses = 0;
  wins = 0;
  betInput.value = "";
  balanceInput.value = "";
  greedFill.style.width = "0%";
  resultBox.innerText = "";
  statusMsg.innerText = "Сброс выполнен.";
}

function updateStatus(result) {
  if (result === "win") {
    const messages = [
      "У тебя хорошо получается, продолжай в том же духе 👍",
      "Горжусь тобой 😇",
      "Пристегни ремни, мы взлетаем 🚀",
      "Куда потратим деньги? 😂"
    ];
    if (wins <= messages.length)
      statusMsg.innerText = messages[wins - 1];
  } else {
    const messages = [
      "Ничего страшного, я верю в тебя 🥺",
      "Сделай паузу на кофе ☕️",
      "Высокий риск слить баланс!"
    ];
    if (losses <= messages.length)
      statusMsg.innerText = messages[losses - 1];
  }

  if (balance <= baseBet * 2) {
    statusMsg.innerText = "У вас недостаточно средств для ставки 😭";
  }
}
