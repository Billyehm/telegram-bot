
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
        balance += 0.0000003;
        balanceDisplay.textContent = `Bal: ${balance.toFixed(6)}₿tc`;
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