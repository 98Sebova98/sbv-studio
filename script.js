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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { 
  threshold: 0.1, // Анімація спрацьовує, як тільки видно 10% картки
  rootMargin: "0px 0px -50px 0px" // Легке зміщення зони видимості для плавності
});

cards.forEach(card => observer.observe(card));

// Динамічне поле для соцмереж у формі
const socialPlatform = document.getElementById('social-platform');
const nicknameContainer = document.getElementById('nickname-container');
const nicknameInput = document.getElementById('nickname-input');

if (socialPlatform && nicknameContainer && nicknameInput) {
  socialPlatform.addEventListener('change', function() {
    if (this.value) {
      // Показуємо поле і робимо його обов'язковим
      nicknameContainer.style.display = 'block';
      nicknameInput.setAttribute('required', 'required');
      
      // Змінюємо підказку залежно від вибору
      if (this.value === 'Viber') {
        nicknameInput.placeholder = 'Ваш номер телефону у Viber';
      } else {
        nicknameInput.placeholder = `Ваш нікнейм (юзернейм) в ${this.value}`;
      }
    } else {
      // Ховаємо, якщо нічого не обрано
      nicknameContainer.style.display = 'none';
      nicknameInput.removeAttribute('required');
    }
  });
}

// ==========================================
// УПРАВЛЕНИЕ ФОРМОЙ (СОЦСЕТИ И AJAX-ОТПРАВКА)
// ==========================================

const socialPlatform = document.getElementById('social-platform');
const nicknameContainer = document.getElementById('nickname-container');
const nicknameInput = document.getElementById('nickname-input');
const contactForm = document.querySelector('#contact form');
const formStatus = document.getElementById('form-status');

// 1. Показ/скрытие поля никнейма
if (socialPlatform && nicknameContainer && nicknameInput) {
  // Добавляем эффект фокуса на тег select, как у ваших обычных инпутов
  socialPlatform.addEventListener('focus', () => {
    socialPlatform.style.borderColor = '#6366f1';
    socialPlatform.style.background = '#ffffff';
    socialPlatform.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
  });
  socialPlatform.addEventListener('blur', () => {
    socialPlatform.style.borderColor = '#cbd5e1';
    socialPlatform.style.background = '#f1f5f9';
    socialPlatform.style.boxShadow = 'none';
  });

  // Логика изменения выпадающего списка
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

// 2. Отправка формы без перезагрузки страницы (AJAX)
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Полностью отключаем перезагрузку страницы и перенаправление
    
    const formData = new FormData(event.target);
    
    // Показываем анимацию загрузки
    formStatus.style.display = 'block';
    formStatus.style.color = '#6366f1'; // Ваш красивый фиолетовый бренд-цвет
    formStatus.textContent = 'Надсилання повідомлення...';

    // Отправляем данные методом fetch в фоновом режиме на Formspree
    fetch(event.target.action, {
      method: contactForm.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        formStatus.style.color = '#22c55e'; // Зеленый цвет успеха
        formStatus.textContent = 'Дякуємо! Ваша заявка успішно надіслана.';
        contactForm.reset(); // Очищаем форму
        
        // Скрываем контейнер никнейма после сброса формы
        if (nicknameContainer) nicknameContainer.style.display = 'none';
      } else {
        formStatus.style.color = '#ef4444'; // Красный цвет ошибки
        formStatus.textContent = 'Ой! Сталася помилка при надсиланні. Спробуйте ще раз.';
      }
    }).catch(error => {
      formStatus.style.color = '#ef4444';
      formStatus.textContent = 'Помилка мережі. Перевірте з’єднання з інтернетом.';
    });
  });
}
