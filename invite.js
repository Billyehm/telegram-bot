   const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const carouselContainer = document.querySelector('.carousel-container');

    let currentIndex = 0;

    // Function to update slide position
    function updateSlides() {
      slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
      });

      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    }

    // Handle dot click
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.getAttribute('data-index'));
        updateSlides();
      });
    });

    // Swipe functionality
    let startX = 0;
    let isSwiping = false;

    carouselContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
    });

    carouselContainer.addEventListener('touchend', (e) => {
      if (!isSwiping) return;

      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) {
        currentIndex = (currentIndex + 1) % slides.length;
      } else if (endX - startX > 50) {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      }

      updateSlides();
      isSwiping = false;
    });

    // Initialize slides
    updateSlides();
