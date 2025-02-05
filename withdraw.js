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
