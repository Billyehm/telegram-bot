const wheel = document.getElementById('btcWheel');
const countdownDisplay = document.getElementById('countdown');
const balanceDisplay = document.getElementById('balance-tab');

let rotating = false;
let balanceTimer;

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
        const response = await fetch('https://telegram-bot-blond-omega.vercel.app/api/state'); // Replace with your API URL
        const data = await response.json();
        updateDisplay(data);
        rotating = data.rotating;
        if (rotating) startRotation();
    } catch (error) {
        console.error('Error fetching state:', error);
    }
}

// Update the display
function updateDisplay(state) {
    countdownDisplay.textContent = formatTime(state.countdown);
    balanceDisplay.textContent = `Balance: $${state.balance.toFixed(6)}`;
}

// Sync rotation state with the backend
async function syncState(rotating) {
    try {
        await fetch('/api/state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rotating }),
        });
    } catch (error) {
        console.error('Error syncing state:', error);
    }
}

// Start rotation
function startRotation() {
    rotating = true;
    wheel.style.animation = "rotate 2s linear infinite";
    syncState(true); // Notify the backend that the wheel is rotating
}

// Stop rotation
function stopRotation() {
    rotating = false;
    wheel.style.animation = "";
    syncState(false); // Notify the backend that the wheel stopped
}

// Wheel click handler
wheel.addEventListener('click', () => {
    if (!rotating) {
        startRotation();
    }
});

// Poll for updates to keep the frontend synchronized
function startBalanceSync() {
    balanceTimer = setInterval(fetchState, 1000);
}

// Stop syncing balance
function stopBalanceSync() {
    clearInterval(balanceTimer);
}

// Start syncing on page load
fetchState();
startBalanceSync();
