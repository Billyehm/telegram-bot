document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startMining");
    const btcDisplay = document.getElementById("btcAmount");
    const countdownDisplay = document.getElementById("countdown");

    const miningDuration = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    const btcPerSecond = 0.00001; // Adjust BTC generation rate

    function startMining() {
        const startTime = Date.now();
        const endTime = startTime + miningDuration;

        localStorage.setItem("miningStart", startTime);
        localStorage.setItem("miningEnd", endTime);

        updateMining();
    }

    function updateMining() {
        const startTime = parseInt(localStorage.getItem("miningStart"));
        const endTime = parseInt(localStorage.getItem("miningEnd"));
        let storedBtc = parseFloat(localStorage.getItem("btcAmount")) || 0;

        if (!startTime || Date.now() > endTime) {
            countdownDisplay.innerText = "Mining Complete!";
            return;
        }

        function update() {
            const now = Date.now();
            if (now >= endTime) {
                countdownDisplay.innerText = "Mining Complete!";
                return;
            }

            let remainingTime = endTime - now;
            let hours = Math.floor(remainingTime / (1000 * 60 * 60));
            let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            countdownDisplay.innerText = `${hours}h ${minutes}m ${seconds}s`;

            let elapsedSeconds = (now - startTime) / 1000;
            let newBtc = elapsedSeconds * btcPerSecond;
            btcDisplay.innerText = (storedBtc + newBtc).toFixed(8);

            localStorage.setItem("btcAmount", btcDisplay.innerText);
            requestAnimationFrame(update);
        }

        update();
    }

    startButton.addEventListener("click", startMining);
    updateMining();
});
