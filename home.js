// Get references to the wheel, countdown display, and balance display elements
const wheel = document.getElementById("btcWheel");
const countdownDisplay = document.getElementById("countdown");
const balanceDisplay = document.getElementById("balance-tab");

const miningDuration = 24 * 60 * 60; // 24 hours in seconds
const btcPerSecond = 0.00000001157; // BTC generation rate per second
let countdownTimer;
let balanceTimer;
let rotating = false;

// Function to format time in HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Function to start mining
function startMining() {
  if (localStorage.getItem("miningEnd")) return; // Prevent restarting if already mining

  const startTime = Date.now();
  const endTime = startTime + miningDuration * 1000;

  localStorage.setItem("miningStart", startTime);
  localStorage.setItem("miningEnd", endTime);

  startRotation();
  startCountdown();
  startBalanceIncrement();
}

// Function to start countdown
function startCountdown() {
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    const endTime = parseInt(localStorage.getItem("miningEnd")) || 0;
    const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

    if (remainingTime > 0) {
      countdownDisplay.textContent = formatTime(remainingTime);
    } else {
      clearInterval(countdownTimer);
      stopMining();
    }
  }, 1000);
}

// Function to start increasing BTC balance
function startBalanceIncrement() {
  clearInterval(balanceTimer);
  balanceTimer = setInterval(() => {
    const startTime = parseInt(localStorage.getItem("miningStart")) || 0;
    const endTime = parseInt(localStorage.getItem("miningEnd")) || 0;
    let balance = parseFloat(localStorage.getItem("btcBalance")) || 0;

    if (Date.now() >= endTime) {
      clearInterval(balanceTimer);
      stopMining();
      return;
    }

    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minedBtc = elapsedSeconds * btcPerSecond;

    localStorage.setItem("btcBalance", minedBtc);
    balanceDisplay.textContent = `Bal: ${minedBtc.toFixed(9)}₿tc`;
  }, 1000);
}

// Function to start the wheel rotation
function startRotation() {
  rotating = true;
  wheel.style.animation = "rotate 2s linear infinite";
}

// Function to stop the wheel rotation
function stopMining() {
  rotating = false;
  wheel.style.animation = "";
  clearInterval(balanceTimer);
  clearInterval(countdownTimer);
  localStorage.removeItem("miningStart");
  localStorage.removeItem("miningEnd");
}

// Restore state when the page loads
function restoreState() {
  const endTime = parseInt(localStorage.getItem("miningEnd")) || 0;
  const currentTime = Date.now();
  let balance = parseFloat(localStorage.getItem("btcBalance")) || 0;

  balanceDisplay.textContent = `Bal: ${balance.toFixed(9)}₿tc`;

  if (currentTime < endTime) {
    startCountdown();
    startBalanceIncrement();
    startRotation();
  }
}

// Event listener for wheel click to start mining
wheel.addEventListener("click", startMining);

// Restore state on page load
restoreState();
