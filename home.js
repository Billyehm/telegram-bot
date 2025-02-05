// Get references to the wheel, countdown display, and balance display elements in the DOM
const wheel = document.getElementById("btcWheel");
const countdownDisplay = document.getElementById("countdown");
const balanceDisplay = document.getElementById("balance-tab");

const miningDuration = 5 * 60 * 60; // 5 hours in seconds
const btcPerSecond = 0.00000003; // BTC generation rate per second
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
  syncState(true);
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
  syncState(false);
}

// Event listener for wheel click to start mining
wheel.addEventListener("click", () => {
  if (!rotating) {
    startMining();
  }
});

// Fetch the latest mining state from the backend
async function fetchState() {
  try {
    const response = await fetch("https://telegram-bot-blond-omega.vercel.app/api/state");
    const data = await response.json();

    rotating = data.rotating;
    const remainingTime = data.countdown || miningDuration;
    const balance = data.balance || 0;

    localStorage.setItem("miningEnd", Date.now() + remainingTime * 1000);
    localStorage.setItem("btcBalance", balance);

    updateDisplay({ countdown: remainingTime, balance });

    if (rotating) {
      startCountdown();
      startBalanceIncrement();
    }
  } catch (error) {
    console.error("Error fetching state:", error);
  }
}

// Update UI based on fetched state
function updateDisplay(state) {
  countdownDisplay.textContent = formatTime(state.countdown);
  balanceDisplay.textContent = `Bal: ${state.balance.toFixed(8)}₿tc`;
}

// Sync mining state with the backend
async function syncState(rotating) {
  try {
    await fetch("https://telegram-bot-blond-omega.vercel.app/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rotating }),
    });
  } catch (error) {
    console.error("Error syncing state:", error);
  }
}

// Fetch state on page load
fetchState();
