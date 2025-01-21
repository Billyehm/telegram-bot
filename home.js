const wheel = document.getElementById('btcWheel');
const countdownDisplay = document.getElementById('countdown');
const balanceDisplay = document.getElementById('balance-tab');

let rotating = false;

// Format time helper
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Fetch the latest state from the backend
async function fetchState() {
  try {
    const response = await fetch('https://telegram-bot-blond-omega.vercel.app/api/state'); // Replace with your Vercel URL
    const data = await response.json();
    updateDisplay(data);
    rotating = data.rotating;
    if (rotating) {
      startCountdown(data.countdown);
      startBalanceIncrement(data.balance);
    }
  } catch (error) {
    console.error('Error fetching state:', error);
  }
}

// Update the display
function updateDisplay(state) {
  countdownDisplay.textContent = formatTime(state.countdown);
  balanceDisplay.textContent = `Bal: ${state.balance.toFixed(8)}₿tc`;
}

// Sync rotation state with the backend
async function syncState(rotating) {
  try {
    await fetch('https://telegram-bot-blond-omega.vercel.app/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rotating }),
    });
  } catch (error) {
    console.error('Error syncing state:', error);
  }
}

// Start the countdown timer
function startCountdown(initialCountdown) {
  let countdown = initialCountdown;
  setInterval(() => {
    if (countdown > 0) {
      countdown--;
      countdownDisplay.textContent = formatTime(countdown);
    }
  }, 1000);
}

// Start the balance increment timer
function startBalanceIncrement(initialBalance) {
  let balance = initialBalance;
  setInterval(() => {
    balance += 0.00000003;
    balanceDisplay.textContent = `Bal: ${balance.toFixed(8)}₿tc`;
  }, 1000);
}

// Start rotation
function startRotation() {
  rotating = true;
  wheel.style.animation = "rotate 2s linear infinite";
  syncState(true); // Notify backend that rotation started
}

// Stop rotation
function stopRotation() {
  rotating = false;
  wheel.style.animation = "";
  syncState(false); // Notify backend that rotation stopped
}

// Wheel click handler
wheel.addEventListener('click', () => {
  if (!rotating) {
    startRotation();
  }
});

// Fetch and sync state on page load
fetchState();
