/* ================================================ */
/* БАЗОВАЯ ФУНКЦИОНАЛЬНОСТЬ ДЛЯ ВСЕХ СТРАНИЦ */
/* ================================================ */
/* 
  Общие JavaScript функции для всех страниц сайта
  Включает: мобильное меню, базовые утилиты
*/

// ================================================
// МОБИЛЬНОЕ МЕНЮ
// ================================================

/**
 * Инициализация мобильного меню
 * Управляет открытием/закрытием бургер-меню
 */
function initMobileMenu() {
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!burger || !mobileMenu) return;

  // Обработчик клика по бургер-меню
  burger.addEventListener("click", function () {
    // Переключаем активные классы
    burger.classList.toggle("active");
    mobileMenu.classList.toggle("active");

    // Блокируем прокрутку при открытом меню
    if (mobileMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Закрытие меню при клике на ссылки
  const mobileLinks = mobileMenu.querySelectorAll(".mobile-link");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      burger.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Закрытие меню при клике вне его области
  mobileMenu.addEventListener("click", function (e) {
    if (e.target === mobileMenu) {
      burger.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Закрытие меню при нажатии Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      burger.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// ================================================
// УТИЛИТЫ
// ================================================

/**
 * Проверка, является ли устройство мобильным
 * @returns {boolean} true если мобильное устройство
 */
function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Получение текущего размера экрана
 * @returns {string} 'mobile', 'tablet', 'desktop'
 */
function getScreenSize() {
  const width = window.innerWidth;
  if (width <= 480) return "mobile";
  if (width <= 768) return "tablet";
  return "desktop";
}

/**
 * Дебаунс функция для оптимизации производительности
 * @param {Function} func - функция для выполнения
 * @param {number} wait - время ожидания в мс
 * @returns {Function} оптимизированная функция
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Троттлинг функция для ограничения частоты вызовов
 * @param {Function} func - функция для выполнения
 * @param {number} limit - лимит времени в мс
 * @returns {Function} оптимизированная функция
 */
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ================================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ================================================

/**
 * Обработчик изменения размера окна
 * Оптимизирован с помощью дебаунса
 */
const handleResize = debounce(function () {
  // Закрываем мобильное меню при изменении размера
  const mobileMenu = document.getElementById("mobileMenu");
  const burger = document.getElementById("burger");

  if (mobileMenu && burger && mobileMenu.classList.contains("active")) {
    // Если перешли на десктоп, закрываем меню
    if (!isMobile()) {
      burger.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
}, 250);

// ================================================
// ИНИЦИАЛИЗАЦИЯ
// ================================================

/**
 * Инициализация всех базовых функций
 * Вызывается при загрузке страницы
 */
function initBase() {
  // Инициализируем мобильное меню
  initMobileMenu();

  // Добавляем обработчик изменения размера окна
  window.addEventListener("resize", handleResize);

  // Логируем успешную инициализацию
  console.log("Base functionality initialized");
}

// Запускаем инициализацию при загрузке DOM
document.addEventListener("DOMContentLoaded", initBase);

// Экспортируем функции для использования в других модулях
window.BaseUtils = {
  isMobile,
  getScreenSize,
  debounce,
  throttle,
  initMobileMenu,
};
