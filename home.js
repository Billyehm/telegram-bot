// Get references to the wheel, countdown display, and balance display elements in the DOM
const wheel = document.getElementById("btcWheel");
const countdownDisplay = document.getElementById("countdown");
const balanceDisplay = document.getElementById("balance-tab");

const miningDuration = 24 * 60 * 60; // 24 hours in seconds
const btcPerSecond = 0.00000001157; // BTC generation rate per second
let rotating = false; // Track whether the wheel is rotating
let countdownTimer; // Timer for countdown
let balanceTimer; // Timer for real-time BTC updates

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

  startRotation(); // Start rotation when mining starts
  startCountdown(); // Start countdown
  startBalanceIncrement(); // Start real-time BTC updates
}

// Function to start the countdown
function startCountdown() {
  clearInterval(countdownTimer); // Clear any existing countdown timer

  countdownTimer = setInterval(() => {
    const endTime = parseInt(localStorage.getItem("miningEnd"));
    const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

    if (remainingTime > 0) {
      countdownDisplay.textContent = formatTime(remainingTime);
    } else {
      clearInterval(countdownTimer); // Clear countdown when finished
      stopRotation();
    }
  }, 1000);
}

// 🚀 Function to update BTC **every second in real-time**
function startBalanceIncrement() {
  clearInterval(balanceTimer); // Clear previous balance updates if any

  balanceTimer = setInterval(() => {
    let balance = parseFloat(localStorage.getItem("btcBalance")) || 0;
    const endTime = parseInt(localStorage.getItem("miningEnd"));

    if (Date.now() >= endTime) {
      clearInterval(balanceTimer); // Stop balance update when mining ends
      return;
    }

    balance += btcPerSecond; // ✅ **Increase BTC per second in real-time**
    localStorage.setItem("btcBalance", balance);
    balanceDisplay.textContent = `Bal: ${balance.toFixed(9)}₿tc`; // ✅ **Update UI instantly**
  }, 1000); // ✅ **Runs every second**
}

// Function to start the wheel rotation
function startRotation() {
  rotating = true;
  wheel.style.animation = "rotate 2s linear infinite"; // Keep rotating the wheel during countdown
}

// Function to stop the wheel rotation
function stopRotation() {
  rotating = false;
  wheel.style.animation = ""; // Stop the animation when mining ends
  clearInterval(balanceTimer); // Stop BTC updates
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
  let balance = parseFloat(localStorage.getItem("btcBalance")) || 0;

  balanceDisplay.textContent = `Bal: ${balance.toFixed(9)}₿tc`; // Show saved balance

  if (currentTime < endTime) {
    rotating = true;
    startRotation();
    startCountdown();
    startBalanceIncrement(); // ✅ **Ensure BTC keeps updating live**
  }
}

// Restore state when the page loads
restoreState();
