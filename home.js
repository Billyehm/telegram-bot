// Get references to the wheel, countdown display, and balance display elements in the DOM
const wheel = document.getElementById('btcWheel');
const countdownDisplay = document.getElementById('countdown');
const balanceDisplay = document.getElementById('balance-tab');

// Initialize variables
let countdown = 5 * 60 * 60; // Countdown duration in seconds (5 hours)
let balance = 0; // User's current balance
let rotating = false; // Boolean to track whether the wheel is rotating
let countdownTimer; // Timer for the countdown
let balanceTimer; // Timer for balance increment

// Function to format time in HH:MM:SS format
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600); // Calculate hours
  const minutes = Math.floor((seconds % 3600) / 60); // Calculate minutes
  const secs = seconds % 60; // Calculate seconds
  // Return formatted time as a string
  return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Function to start the countdown timer
function startCountdown() {
  countdownTimer = setInterval(() => {
    if (countdown > 0) {
      countdown--; // Decrease countdown by 1 second
      countdownDisplay.textContent = formatTime(countdown); // Update countdown display
    } else {
      clearInterval(countdownTimer); // Clear the countdown timer when it reaches 0
      stopRotation(); // Stop the wheel rotation
    }
  }, 1000); // Run every 1 second
}


// Function to start incrementing the balance
function startBalanceIncrement() {
  balanceTimer = setInterval(() => {
    balance += 0.00000003; // Increment the balance by a fixed amount
    balanceDisplay.textContent = `Bal: ${balance.toFixed(8)}₿tc`; // Update the balance display
  }, 1000); // Run every 1 second
}

// Function to start the wheel rotation
function startRotation() {
  rotating = true; // Set rotating to true
  wheel.style.animation = "rotate 2s linear infinite"; // Add rotation animation to the wheel
  startCountdown();
  startBalanceIncrement();
  syncState(true); // Notify backend that rotation started
}

// Function to stop the wheel rotation
function stopRotation() {
  rotating = false; // Set rotating to false
  wheel.style.animation = ""; // Remove the rotation animation
  clearInterval(balanceTimer); // Stop the balance increment timer
  syncState(false); // Notify backend that rotation stopped
}


// Add a click event listener to the wheel
wheel.addEventListener('click', () => {
  if (!rotating) { // If the wheel is not already rotating
    startRotation(); // Start the rotation
  }
});







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



// Fetch and sync state on page load
fetchState();
