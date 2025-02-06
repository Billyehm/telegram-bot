document.getElementById('nextBtn').addEventListener('click', () => {
  const content = document.getElementById('content');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const doneTick = document.getElementById('doneTick');

  // Show loading overlay and blur content
  content.style.filter = 'blur(5px)';
  loadingOverlay.classList.remove('hidden');

  // Simulate a 15-second process
  setTimeout(() => {
    document.querySelector('.spinner').classList.add('hidden');
    doneTick.classList.remove('hidden');
  }, 15000);
});

document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");
  const maxButton = document.querySelector(".max-btn");
  const usdEquivalent = document.querySelector(".usd-equivalent");

  // Fetch the BTC balance from localStorage
  function getBtcBalance() {
    return parseFloat(localStorage.getItem("btcBalance")) || 0;
  }

  // Function to update USD equivalent (Assume 1 BTC = $100,000 for example)
  function updateUsdEquivalent(btcAmount) {
    const btcToUsdRate = 100000; // Replace with real-time rate if needed
    const usdValue = btcAmount * btcToUsdRate;
    usdEquivalent.textContent = `≈ $${usdValue.toFixed(2)}`;
  }

  // Max Button Click Event
  maxButton.addEventListener("click", () => {
    const btcBalance = getBtcBalance();
    amountInput.value = btcBalance.toFixed(8); // Set input value to full BTC balance
    updateUsdEquivalent(btcBalance); // Update USD equivalent
  });

  // Update USD equivalent when user types manually
  amountInput.addEventListener("input", () => {
    const btcValue = parseFloat(amountInput.value) || 0;
    updateUsdEquivalent(btcValue);
  });
});
