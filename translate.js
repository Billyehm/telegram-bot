// Add the event listener to toggle the dropdown menu
document.getElementById("languageButton").addEventListener("click", () => {
    document.getElementById("languageDropdown").classList.toggle("show");
  });
  
  // Add event listeners for language selection
  const languageLinks = document.querySelectorAll("#languageDropdown a");
  
  languageLinks.forEach(link => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const selectedLanguage = event.target.getAttribute("data-lang");
  
      // Update the flag in the button
      document.getElementById("languageButton").innerText = event.target.innerText.split(' ')[0];
  
      // Translate the page
      await translatePage(selectedLanguage);
  
      // Close the dropdown menu after selecting a language
      document.getElementById("languageDropdown").classList.remove("show");
    });
  });
  
  async function translatePage(targetLanguage) {
    const elements = document.querySelectorAll("body *:not(script):not(style)");
  
    for (const element of elements) {
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
        const originalText = element.innerText.trim();
        if (originalText) {
          const translatedText = await translateText(originalText, targetLanguage);
          element.innerText = translatedText;
        }
      }
    }
  }
  
  async function translateText(text, targetLanguage) {
    const apiKey = "YOUR_GOOGLE_TRANSLATE_API_KEY"; // Replace with your API key
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, target: targetLanguage })
    });
  
    const data = await response.json();
    return data.data.translations[0].translatedText;
  }
  