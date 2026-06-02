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
