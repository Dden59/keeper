let balance = 0;
let stake = 0;
let defaultStake = 0;
let losses = 0;
let wins = 0;
let greed = 50;

function calculateInitialStake() {
  const input = parseFloat(document.getElementById("balance-input").value);
  if (isNaN(input) || input < 1000) {
    alert("Введите корректный баланс (рекомендуется от 2500₽)");
    return;
  }

  balance = input;

  // расчет ставки так, чтобы выдержать 6 проигрышей (с учетом удвоений)
  let maxSteps = 6;
  let sum = 0;
  let temp = 1.5;
  for (let i = 0; i < maxSteps; i++) {
    sum += Math.pow(temp, i);
  }
  stake = Math.floor(balance / sum);
  defaultStake = stake;

  document.getElementById("suggestion-box").innerText = `Рекомендуемая ставка: ${stake}₽`;
  const inputField = document.getElementById("custom-stake-input");
  inputField.value = stake;
  inputField.disabled = false;
}

function startGame() {
  const customStake = parseFloat(document.getElementById("custom-stake-input").value);
  if (isNaN(customStake) || customStake < 1) {
    alert("Введите корректную ставку");
    return;
  }

  stake = customStake;
  defaultStake = stake;
  document.getElementById("current-stake").innerText = stake;
  document.getElementById("current-balance").innerText = balance;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  updateGreedBar();
}

function handleResult(win) {
  if (win) {
    balance += stake * 0.5;
    stake = defaultStake;
    losses = 0;
    wins++;
    showNotification(wins);
    greed = Math.max(greed - 10, 0);
  } else {
    balance -= stake;
    losses++;
    wins = 0;
    greed = Math.min(greed + 10, 100);

    stake = getRecoveryStake();
    if (balance < stake) {
      showFixedMessage("У вас недостаточно средств для ставки 😭");
    }
  }

  updateUI();
}

function getRecoveryStake() {
  let required = 0;
  for (let i = 0; i < losses; i++) {
    required += defaultStake * Math.pow(1.5, i);
  }
  const goal = balance + required;
  let nextStake = (goal - balance) / 0.5;
  return Math.ceil(nextStake);
}

function updateGreedBar() {
  document.getElementById("greed-bar").style.width = `${greed}%`;
}

function updateUI() {
  document.getElementById("current-balance").innerText = Math.floor(balance);
  document.getElementById("current-stake").innerText = Math.floor(stake);
  updateGreedBar();

  if (balance < defaultStake * 2) {
    showFixedMessage("Высокий риск слить баланс!");
  }
}

function showNotification(count) {
  const notify = document.getElementById("notifications");
  let message = "";

  switch (count) {
    case 2: message = "У тебя хорошо получается, продолжай в том же духе!"; break;
    case 3: message = "Горжусь тобой 😇"; break;
    case 4: message = "Пристегни ремни, мы взлетаем 🚀"; break;
    case 5: message = "Куда потратим деньги? 😂"; break;
  }

  if (losses === 2) message = "Ничего страшного, я верю в тебя 🥺";
  if (losses === 3) message = "Сделай паузу на кофе ☕️";
  if (losses === 4) message = "Высокий риск слить баланс!";

  if (message) notify.innerText = message;
  else notify.innerText = "";
}

function showFixedMessage(msg) {
  document.getElementById("notifications").innerText = msg;
}

function resetGame() {
  location.reload();
}
