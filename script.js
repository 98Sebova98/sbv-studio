const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

// 1. Плавный скролл (только для якорных ссылок)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    
    if (!targetId || targetId === '#') return;

    try {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
        
        // Закрываем меню при клике на якорь
        if (menu && menu.classList.contains('active')) {
          menu.classList.remove('active');
        }
      }
    } catch (err) {
      // Игнорируем невалидные селекторы
    }
  });
});

// 2. Управление бургер-меню
if (burger && menu) {
  burger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
}

// 3. Эффект появления карточек
const cards = document.querySelectorAll('.card');
if (cards.length > 0) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  cards.forEach(card => observer.observe(card));
}

// 4. Форма с учетом языка страницы (UA / EN)
const socialPlatform = document.getElementById('social-platform');
const nicknameContainer = document.getElementById('nickname-container');
const nicknameInput = document.getElementById('nickname-input');
const contactForm = document.querySelector('#contact form');
const formStatus = document.getElementById('form-status');

// Проверяем язык текущей страницы
const isEn = document.documentElement.lang === 'en';

const i18n = {
  viberPlaceholder: isEn ? 'Your Viber phone number' : 'Ваш номер телефону у Viber',
  defaultPlaceholder: (platform) => isEn ? `Your handle in ${platform}` : `Ваш нікнейм в ${platform}`,
  sending: isEn ? 'Sending message...' : 'Надсилання повідомлення...',
  success: isEn ? 'Thank you! Your message has been sent.' : 'Дякуємо! Ваша заявка успішно надіслана.',
  error: isEn ? 'Oops! Something went wrong. Please try again.' : 'Ой! Сталася помилка при надсиланні. Спробуйте ще раз.',
  networkError: isEn ? 'Network error. Please check your connection.' : 'Помилка мережі. Перевірте з’єднання з інтернетом.'
};

if (socialPlatform && nicknameContainer && nicknameInput) {
  socialPlatform.addEventListener('change', function() {
    if (this.value) {
      nicknameContainer.style.display = 'block';
      nicknameInput.setAttribute('required', 'required');
      
      if (this.value === 'Viber') {
        nicknameInput.placeholder = i18n.viberPlaceholder;
      } else {
        nicknameInput.placeholder = i18n.defaultPlaceholder(this.value);
      }
    } else {
      nicknameContainer.style.display = 'none';
      nicknameInput.removeAttribute('required');
    }
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    formStatus.style.display = 'block';
    formStatus.style.color = '#ffffff';
    formStatus.textContent = i18n.sending;

    fetch(event.target.action, {
      method: contactForm.method,
      body: formData,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        formStatus.style.color = '#ffffff';
        formStatus.textContent = i18n.success;
        contactForm.reset();
        if (nicknameContainer) nicknameContainer.style.display = 'none';
      } else {
        formStatus.style.color = '#ff4444';
        formStatus.textContent = i18n.error;
      }
    }).catch(() => {
      formStatus.style.color = '#ff4444';
      formStatus.textContent = i18n.networkError;
    });
  });
}

// 5. Слайдер
const track = document.getElementById('services-track');
const prevBtn = document.getElementById('prev-service');
const nextBtn = document.getElementById('next-service');
const dotsContainer = document.getElementById('services-dots');

if (track && prevBtn && nextBtn && dotsContainer) {
  const slides = Array.from(track.children);
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function getVisibleSlidesCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function getMaxIndex() {
    const max = slides.length - getVisibleSlidesCount();
    return max < 0 ? 0 : max;
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    const maxDots = getMaxIndex() + 1;
    for (let i = 0; i < maxDots; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    if (currentIndex < 0) currentIndex = 0;

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 25;
    
    const amountToMove = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${amountToMove}px)`;

    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });

    prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    nextBtn.style.opacity = currentIndex === maxIdx ? '0.3' : '1';
    nextBtn.style.pointerEvents = currentIndex === maxIdx ? 'none' : 'auto';
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && currentIndex < getMaxIndex()) {
        currentIndex++;
        updateSlider();
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    }
  }

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
      updateSlider();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  window.addEventListener('resize', () => {
    createDots();
    updateSlider();
  });

  createDots();
  setTimeout(updateSlider, 100);
}