/* ================================================ */
/* JAVASCRIPT ДЛЯ СТРАНИЦЫ КОНТАКТОВ */
/* ================================================ */
/* 
  Интерактивность для страницы контактов
  Включает: обработку формы, анимации, мобильное меню
*/

// ================================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ================================================

$(document).ready(function () {
  console.log("Страница контактов загружена");

  // Инициализируем все компоненты
  // initMobileMenu(); // Убираем дублирование - мобильное меню уже инициализировано в base.js
  initContactItems();
  initSlider();
  initMobileButtons(); // Инициализация мобильных кнопок
  initScrollAnimations();
  initParallaxEffect();
});

// ================================================
// МОБИЛЬНОЕ МЕНЮ (удалено - используется base.js)
// ================================================

// ================================================
// СЛАЙДЕР
// ================================================

/**
 * Инициализация слайдера
 * Обрабатывает клики по панелям слайдера и переключение активной панели
 */
function initSlider() {
  const panels = $(".slider-panel");

  console.log("Инициализация слайдера");

  // Обработчик клика по панелям слайдера
  panels.on("click", function () {
    console.log("Клик по панели слайдера");

    // Убираем активный класс со всех панелей
    removeActiveClasses();

    // Добавляем активный класс к кликнутой панели
    $(this).addClass("active");
  });

  // Обработчик наведения на панели
  panels.on("mouseenter", function () {
    $(this).addClass("hovered");
  });

  panels.on("mouseleave", function () {
    $(this).removeClass("hovered");
  });
}

/**
 * Инициализация мобильных кнопок
 * Обрабатывает клики по мобильным кнопкам контактов
 */
function initMobileButtons() {
  const mobileButtons = $(".mobile-button");

  console.log("Инициализация мобильных кнопок");

  // Обработчик клика по мобильным кнопкам
  mobileButtons.on("click", function () {
    console.log("Клик по мобильной кнопке");

    // Получаем тип социальной сети
    const socialType = $(this).data("social");

    // Здесь можно добавить логику для обработки кликов
    // Например, открытие ссылок или выполнение действий
    console.log("Выбрана социальная сеть:", socialType);
  });

  // Обработчик наведения на мобильные кнопки
  mobileButtons.on("mouseenter", function () {
    $(this).addClass("hovered");
  });

  mobileButtons.on("mouseleave", function () {
    $(this).removeClass("hovered");
  });
}

/**
 * Удаление активных классов со всех панелей слайдера
 */
function removeActiveClasses() {
  $(".slider-panel").removeClass("active");
}

// ================================================
// КОНТАКТНЫЕ ЭЛЕМЕНТЫ
// ================================================

/**
 * Инициализация контактных элементов
 * Добавляет интерактивность к контактной информации
 */
function initContactItems() {
  // Обработчик клика по контактным элементам
  $(".contact-item").on("click", function () {
    const contactType = $(this).find(".contact-label").text();
    const contactValue = $(this).find(".contact-value").text();

    console.log(`Клик по контакту: ${contactType} - ${contactValue}`);

    // Анимация клика
    $(this).addClass("clicked");
    setTimeout(() => {
      $(this).removeClass("clicked");
    }, 200);

    // Копирование в буфер обмена для email и телефона
    if (contactType === "Email" || contactType === "Телефон") {
      copyToClipboard(contactValue);
      // Уведомления удалены по запросу пользователя
    }
  });

  // Обработчик наведения на контактные элементы
  $(".contact-item").on("mouseenter", function () {
    $(this).addClass("hovered");
  });

  $(".contact-item").on("mouseleave", function () {
    $(this).removeClass("hovered");
  });
}

/**
 * Копирование текста в буфер обмена
 * @param {string} text - Текст для копирования
 */
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    // Современный API
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Ошибка копирования:", err);
      fallbackCopyToClipboard(text);
    });
  } else {
    // Fallback для старых браузеров
    fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback метод копирования в буфер обмена
 * @param {string} text - Текст для копирования
 */
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Ошибка копирования:", err);
  }

  document.body.removeChild(textArea);
}

// ================================================
// АНИМАЦИИ ПРИ ПРОКРУТКЕ
// ================================================

/**
 * Инициализация анимаций при прокрутке
 * Добавляет анимации появления элементов при скролле
 */
function initScrollAnimations() {
  // Создаем Intersection Observer для анимаций
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Наблюдаем за элементами для анимации
  $(".contact-item").each(function () {
    observer.observe(this);
  });
}

// ================================================
// ПАРАЛЛАКС ЭФФЕКТ
// ================================================

/**
 * Инициализация параллакс эффекта
 * Создает эффект параллакса для фонового изображения
 */
function initParallaxEffect() {
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallax = $(".contacts-background");
    const speed = scrolled * 0.5;

    parallax.css("transform", `translateY(${speed}px)`);
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Обработчик прокрутки
  $(window).on("scroll", requestTick);
}

// ================================================
// УВЕДОМЛЕНИЯ (УДАЛЕНЫ ПО ЗАПРОСУ ПОЛЬЗОВАТЕЛЯ)
// ================================================

// ================================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ================================================

// Обработчик изменения размера окна
$(window).on("resize", function () {
  // Пересчитываем позиции элементов при изменении размера
  initParallaxEffect();
});

// Обработчик загрузки изображений
$(window).on("load", function () {
  console.log("Все ресурсы загружены");

  // Добавляем класс для анимации появления
  $("body").addClass("loaded");
});

// Обработчик ошибок JavaScript
window.addEventListener("error", function (e) {
  console.error("Ошибка JavaScript:", e.error);
});

// ================================================ */
// УТИЛИТЫ
// ================================================

/**
 * Дебаунс функция для оптимизации производительности
 * @param {Function} func - Функция для дебаунса
 * @param {number} wait - Время ожидания в миллисекундах
 * @returns {Function} - Дебаунсированная функция
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
 * Троттлинг функция для оптимизации производительности
 * @param {Function} func - Функция для троттлинга
 * @param {number} limit - Лимит времени в миллисекундах
 * @returns {Function} - Троттлированная функция
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
