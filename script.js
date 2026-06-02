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