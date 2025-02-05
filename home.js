// Get references to the wheel, countdown display, and balance display elements in the DOM
const wheel = document.getElementById("btcWheel");
const countdownDisplay = document.getElementById("countdown");
const balanceDisplay = document.getElementById("balance-tab");

const miningDuration = 10 * 60 * 60; // 10 hours in seconds
const btcPerSecond = 0.000000003; // BTC generation rate per second
let rotating = false; // Track whether the wheel is rotating
let countdownTimer; // Timer for countdown
let balanceTimer; // Timer for balance increment

// Function to format time in HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Function to start the mining process
function startMining() {
  const startTime = Date.now();
  const endTime = startTime + miningDuration * 1000;

  localStorage.setItem("miningStart", startTime);
  localStorage.setItem("miningEnd", endTime);
  localStorage.setItem("btcBalance", 0);

  startRotation();
}

// Function to start the countdown
function startCountdown() {
  countdownTimer = setInterval(() => {
    const endTime = parseInt(localStorage.getItem("miningEnd"));
    const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

    if (remainingTime > 0) {
      countdownDisplay.textContent = formatTime(remainingTime);
    } else {
      clearInterval(countdownTimer);
      stopRotation();
    }
  }, 1000);
}

// Function to start increasing the balance
function startBalanceIncrement() {
  balanceTimer = setInterval(() => {
    const startTime = parseInt(localStorage.getItem("miningStart"));
    const endTime = parseInt(localStorage.getItem("miningEnd"));
    let balance = parseFloat(localStorage.getItem("btcBalance")) || 0;

    if (Date.now() >= endTime) {
      clearInterval(balanceTimer);
      stopRotation();
      return;
    }

    const elapsedSeconds = (Date.now() - startTime) / 1000;
    let newBtc = elapsedSeconds * btcPerSecond;

    balance = newBtc;
    localStorage.setItem("btcBalance", balance);
    balanceDisplay.textContent = `Bal: ${balance.toFixed(8)}₿tc`;
  }, 1000);
}

// Function to start the wheel rotation
function startRotation() {
  rotating = true;
  wheel.style.animation = "rotate 2s linear infinite";
  startCountdown();
  startBalanceIncrement();
}

// Function to stop the wheel rotation
function stopRotation() {
  rotating = false;
  wheel.style.animation = "";
  clearInterval(balanceTimer);
}

// Event listener for wheel click to start mining
wheel.addEventListener("click", () => {
  if (!rotating) {
    startMining();
  }
});

// Restore state on page load
function restoreState() {
  const endTime = parseInt(localStorage.getItem("miningEnd")) || 0;
  const currentTime = Date.now();

  if (currentTime < endTime) {
    rotating = true;
    startCountdown();
    startBalanceIncrement();
  } else {
    localStorage.removeItem("miningStart");
    localStorage.removeItem("miningEnd");
    localStorage.removeItem("btcBalance");
  }
}

// Restore state when the page loads
restoreState();
