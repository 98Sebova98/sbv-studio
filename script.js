const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

// Керування бургер-меню (відкриття / закриття)
if (burger && menu) {
  burger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
}

// Обробка кліків по пунктах меню (тільки закриття шторки на мобільних)
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    if (menu && menu.classList.contains('active')) {
      menu.classList.remove('active');
    }
  });
});

// Ефект плавної появи карток при прокручуванні сторінки
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

// ==========================================
// УПРАВЛІННЯ ФОРМОЮ (СОЦМЕРЕЖІ ТА AJAX)
// ==========================================

const socialPlatform = document.getElementById('social-platform');
const nicknameContainer = document.getElementById('nickname-container');
const nicknameInput = document.getElementById('nickname-input');
const contactForm = document.querySelector('#contact form');
const formStatus = document.getElementById('form-status');

// 1. Показ/приховування поля нікнейму
if (socialPlatform && nicknameContainer && nicknameInput) {
  socialPlatform.addEventListener('change', function() {
    if (this.value) {
      nicknameContainer.style.display = 'block';
      nicknameInput.setAttribute('required', 'required');
      
      if (this.value === 'Viber') {
        nicknameInput.placeholder = 'Ваш номер телефону у Viber';
      } else {
        nicknameInput.placeholder = `Ваш нікнейм в ${this.value}`;
      }
    } else {
      nicknameContainer.style.display = 'none';
      nicknameInput.removeAttribute('required');
    }
  });
}

// 2. Відправка форми без перезавантаження сторінки
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    formStatus.style.display = 'block';
    formStatus.style.color = '#6366f1';
    formStatus.textContent = 'Надсилання повідомлення...';

    fetch(event.target.action, {
      method: contactForm.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        formStatus.style.color = '#22c55e';
        formStatus.textContent = 'Дякуємо! Ваша заявка успішно надіслана.';
        contactForm.reset();
        if (nicknameContainer) nicknameContainer.style.display = 'none';
      } else {
        formStatus.style.color = '#ef4444';
        formStatus.textContent = 'Ой! Сталася помилка при надсиланні. Спробуйте ще раз.';
      }
    }).catch(error => {
      formStatus.style.color = '#ef4444';
      formStatus.textContent = 'Помилка мережі. Перевірте з’єднання з інтернетом.';
    });
  });
}

// ==========================================
// ЛЕГКАЯ КАРУСЕЛЬ ДЛЯ СЕКЦИИ SERVICES
// ==========================================

const track = document.getElementById('services-track');
const prevBtn = document.getElementById('prev-service');
const nextBtn = document.getElementById('next-service');
const dotsContainer = document.getElementById('services-dots');

if (track && prevBtn && nextBtn && dotsContainer) {
  const slides = Array.from(track.children);
  let currentIndex = 0;

  // Функция для определения количества видимых слайдов в зависимости от ширины экрана
  function getVisibleSlidesCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  // Функция расчета максимального индекса для смещения
  function getMaxIndex() {
    return slides.length - getVisibleSlidesCount();
  }

  // Создание точек навигации
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

  // Обновление положения слайдера и активности элементов
  function updateSlider() {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 25; // Тот же gap, что прописан в CSS
    
    // Считаем шаг смещения
    const amountToMove = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${amountToMove}px)`;

    // Обновляем точки
    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });

    // Блокировка/активация стрелок управления
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    nextBtn.style.opacity = currentIndex === maxIdx ? '0.5' : '1';
    nextBtn.style.pointerEvents = currentIndex === maxIdx ? 'none' : 'auto';
  }

  // Слушатели событий на кнопках
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

  // Пересчет при изменении размеров экрана
  window.addEventListener('resize', () => {
    createDots();
    updateSlider();
  });

  // Инициализация при старте
  createDots();
  // Небольшая задержка, чтобы браузер успел отрендерить элементы перед расчетом ширины
  setTimeout(updateSlider, 100);
}
