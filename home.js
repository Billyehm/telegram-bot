
    const wheel = document.getElementById('btcWheel');
    const countdownDisplay = document.getElementById('countdown');
    const balanceDisplay = document.getElementById('balance-tab');

    let countdown = 5 * 60 * 60; // 5 hours in seconds
    let balance = 0;
    let rotating = false;
    let countdownTimer;
    let balanceTimer;

    function formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function startCountdown() {
      countdownTimer = setInterval(() => {
        if (countdown > 0) {
          countdown--;
          countdownDisplay.textContent = formatTime(countdown);
        } else {
          clearInterval(countdownTimer);
          stopRotation();
        }
      }, 1000);
    }

    function startBalanceIncrement() {
      balanceTimer = setInterval(() => {
        balance += 0.000003;
        balanceDisplay.textContent = `Balance: $${balance.toFixed(6)}`;
      }, 1000);
    }

    function startRotation() {
      rotating = true;
      wheel.style.animation = "rotate 2s linear infinite";
      startCountdown();
      startBalanceIncrement();
    }

    function stopRotation() {
      rotating = false;
      wheel.style.animation = "";
      clearInterval(balanceTimer);
    }

    wheel.addEventListener('click', () => {
      if (!rotating) {
        startRotation();
      }
    });



    


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

// Fetch data from the backend
async function fetchData() {
    try {
        const response = await fetch('https://telegram-bot-blond-omega.vercel.app/api/updateBalance');
        const data = await response.json();
        updateDisplay(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Update display
function updateDisplay(data) {
    countdownDisplay.textContent = formatTime(data.countdown);
    balanceDisplay.textContent = `Balance: $${data.balance.toFixed(6)}`;
}

// Start updating balance on the frontend
function startBalanceSync() {
    balanceTimer = setInterval(fetchData, 1000);
}

// Stop syncing balance
function stopBalanceSync() {
    clearInterval(balanceTimer);
}

// Start rotation
function startRotation() {
    rotating = true;
    wheel.style.animation = "rotate 2s linear infinite";
    startBalanceSync();
}

// Stop rotation
function stopRotation() {
    rotating = false;
    wheel.style.animation = "";
    stopBalanceSync();
}

wheel.addEventListener('click', () => {
    if (!rotating) {
        startRotation();
    } else {
        stopRotation();
    }
});

// Initial fetch on page load
fetchData();
