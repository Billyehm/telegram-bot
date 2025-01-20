
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
          await fetch('https://telegram-bot-blond-omega.vercel.app/api/state', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rotating }),
          });
      } catch (error) {
          console.error('Error syncing state:', error);
      }
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



    // Poll for updates to keep the frontend synchronized
    function startBalanceSync() {
      balanceTimer = setInterval(fetchState, 1000);
    }

    // Start syncing on page load
    fetchState();
    startBalanceSync();

    