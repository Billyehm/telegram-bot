// Get references to the wheel, countdown display, and balance display elements in the DOM
const wheel = document.getElementById("btcWheel");
const countdownDisplay = document.getElementById("countdown");
const balanceDisplay = document.getElementById("balance-tab");

const miningDuration = 24 * 60 * 60; // 24 hours in seconds
const btcPerSecond = 0.00000001157; // BTC generation rate per second
let rotating = false; // Track whether the wheel is rotating
let countdownTimer; // Timer for countdown

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
  updateBalance(); // Update balance based on elapsed time
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

// Function to update the BTC balance based on elapsed time
function updateBalance() {
  const startTime = parseInt(localStorage.getItem("miningStart")) || 0;
  const endTime = parseInt(localStorage.getItem("miningEnd")) || 0;
  let balance = parseFloat(localStorage.getItem("btcBalance")) || 0;

  if (Date.now() < startTime) return; // Mining hasn't started yet

  // Calculate elapsed time since mining started (or since last update)
  const elapsedSeconds = Math.min((Date.now() - startTime) / 1000, miningDuration);

  // Calculate new BTC earned
  let newBtc = elapsedSeconds * btcPerSecond;

  // Update balance
  balance = newBtc; // Since balance is stored and updated every session, it should be overwritten
  localStorage.setItem("btcBalance", balance);
  balanceDisplay.textContent = `Bal: ${balance.toFixed(9)}₿tc`;

  // If mining is still ongoing, update periodically
  if (Date.now() < endTime) {
    setTimeout(updateBalance, 1000);
  }
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
    startRotation();
    startCountdown();
    updateBalance(); // Update BTC balance based on elapsed time
  } else {
    localStorage.removeItem("miningStart");
    localStorage.removeItem("miningEnd");
  }
}

// Restore state when the page loads
restoreState();
