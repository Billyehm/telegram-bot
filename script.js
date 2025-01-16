
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
        if (event.key === 'Enter') {
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
    alert('Form submitted successfully!');
    // Reset form
const inputs = document.querySelectorAll('#recovery-phrase input');
inputs.forEach(input => input.value = '');

}

