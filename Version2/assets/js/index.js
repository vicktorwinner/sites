/* ================================================ */
/* ФУНКЦИОНАЛЬНОСТЬ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ (INDEX.HTML) */
/* ================================================ */
/* 
  Специфичная функциональность для главной страницы
  Включает: автоскролл, мобильную навигацию, анимации текста
*/

// ================================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ================================================

let currentPage = 1; // Текущая страница (1, 2, 3)
let isScrolling = false; // Флаг для предотвращения множественных скроллов
let autoScrollInterval = null; // Интервал автоскролла
let scrollTimeout = null; // Таймаут для сброса флага скролла
let pages = 3; // Количество страниц

// Элементы DOM
const backgroundPhotos = document.querySelector(".background-photos");
const mobileNav = document.querySelector(".mobile-nav");
const scrollBtns = document.querySelectorAll(".scroll-btn");
const navBtns = document.querySelectorAll(".nav-btn");
const photoButtons = document.querySelectorAll(".photo-button");
const mobileTextOverlays = document.querySelectorAll(".mobile-text-overlay");
const desktopTextOverlay = document.querySelector(".desktop-text-overlay");

// Touch события для свайпов
let startY = 0;
let startTime = 0;
let touchScrolling = false;

// ================================================
// АВТОСКРОЛЛ
// ================================================

/**
 * Запуск автоскролла
 * Автоматически переключает страницы каждые 5 секунд
 */
function startAutoScroll() {
  // Очищаем предыдущий интервал если есть
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }

  // Запускаем новый интервал
  autoScrollInterval = setInterval(() => {
    if (!isScrolling) {
      nextPage();
    }
  }, 5000); // 5 секунд
}

/**
 * Остановка автоскролла
 */
function stopAutoScroll() {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
}

/**
 * Перезапуск автоскролла с задержкой
 * Используется после ручного переключения страниц
 */
function restartAutoScroll() {
  stopAutoScroll();
  setTimeout(() => {
    startAutoScroll();
  }, 2000); // 2 секунды задержки
}

// ================================================
// НАВИГАЦИЯ ПО СТРАНИЦАМ
// ================================================

/**
 * Переход к следующей странице
 */
function nextPage() {
  if (isScrolling || currentPage >= pages) return;

  currentPage++;
  updateState();
}

/**
 * Переход к предыдущей странице
 */
function prevPage() {
  if (isScrolling || currentPage <= 1) return;

  currentPage--;
  updateState();
}

/**
 * Переход к конкретной странице
 * @param {number} pageNum - номер страницы (1, 2, 3)
 */
function goToPage(pageNum) {
  if (isScrolling || pageNum < 1 || pageNum > pages) return;

  currentPage = pageNum;
  updateState();
}

/**
 * Обновление состояния страницы (основная функция из оригинального кода)
 */
function updateState() {
  if (isScrolling) return;

  isScrolling = true;

  // Убираем все активные классы
  if (backgroundPhotos) {
    backgroundPhotos.classList.remove(
      "active-page1",
      "active-page2",
      "active-page3"
    );
    backgroundPhotos.classList.add(`active-page${currentPage}`);
  }

  // Обновляем навигационные кнопки
  updateNavButtons();

  // Скрываем панель навигации на время анимации
  if (mobileNav) {
    mobileNav.classList.add("invisible");
  }

  // Убираем анимации с предыдущих элементов
  mobileTextOverlays.forEach((overlay) => {
    overlay.classList.remove("fade-in-text");
  });

  photoButtons.forEach((button) => {
    button.classList.remove(
      "fade-in-button",
      "button-from-left",
      "button-from-right"
    );
  });

  // Анимация появления текста и кнопки на текущей странице
  setTimeout(() => {
    const currentMobileText = document.querySelector(
      `.bg-photo:nth-child(${currentPage}) .mobile-text-overlay`
    );
    const currentMobileButton = document.querySelector(
      `.bg-photo:nth-child(${currentPage}) .photo-button`
    );

    if (window.innerWidth > 770) {
      // На десктопе показываем десктопный текст
      if (desktopTextOverlay) {
        desktopTextOverlay.classList.add("fade-in-text");
      }
    } else {
      // На мобильных показываем мобильный текст и кнопку
      if (currentMobileText) {
        currentMobileText.classList.add("fade-in-text");
      }

      if (currentMobileButton) {
        // Определяем направление кнопки в зависимости от позиции текста
        if (
          currentMobileText &&
          currentMobileText.classList.contains("mobile-text-left")
        ) {
          currentMobileButton.classList.add("button-from-right");
        } else if (
          currentMobileText &&
          currentMobileText.classList.contains("mobile-text-right")
        ) {
          currentMobileButton.classList.add("button-from-left");
        }
        currentMobileButton.classList.add("fade-in-button");
      }
    }
  }, 600); // Задержка для завершения анимации прокрутки

  // Показываем навигацию и сбрасываем флаг скролла
  setTimeout(() => {
    if (mobileNav) {
      mobileNav.classList.remove("invisible");
    }
    isScrolling = false;
  }, 1000);

  // Перезапускаем автоскролл
  restartAutoScroll();
}

/**
 * Обновление CSS классов для анимации страниц
 */
function updatePageClasses() {
  if (!backgroundPhotos) return;

  // Убираем все активные классы
  backgroundPhotos.classList.remove(
    "active-page1",
    "active-page2",
    "active-page3"
  );

  // Добавляем нужный класс
  backgroundPhotos.classList.add(`active-page${currentPage}`);
}

/**
 * Обновление состояния навигационных кнопок
 */
function updateNavButtons() {
  navBtns.forEach((btn, index) => {
    btn.classList.toggle("active", index + 1 === currentPage);
  });
}

// ================================================
// АНИМАЦИИ ТЕКСТА
// ================================================

/**
 * Анимация появления текстовых элементов
 */
function animateTextElements() {
  // Анимация мобильных текстов
  mobileTextOverlays.forEach((overlay) => {
    overlay.classList.remove("fade-in-text");

    // Небольшая задержка для плавности
    setTimeout(() => {
      overlay.classList.add("fade-in-text");
    }, 100);
  });

  // Анимация десктопного текста
  if (desktopTextOverlay) {
    desktopTextOverlay.classList.remove("fade-in-text");

    setTimeout(() => {
      desktopTextOverlay.classList.add("fade-in-text");
    }, 200);
  }

  // Анимация кнопок
  animatePhotoButtons();
}

/**
 * Анимация кнопок на фотографиях
 */
function animatePhotoButtons() {
  photoButtons.forEach((button, index) => {
    // Убираем предыдущие классы анимации
    button.classList.remove(
      "fade-in-button",
      "button-from-left",
      "button-from-right"
    );

    // Определяем направление анимации в зависимости от страницы
    const isLeftPage = currentPage === 1 || currentPage === 3;
    const animationClass = isLeftPage
      ? "button-from-left"
      : "button-from-right";

    // Добавляем класс анимации
    button.classList.add(animationClass);

    // Запускаем анимацию с задержкой
    setTimeout(() => {
      button.classList.add("fade-in-button");
    }, 300 + index * 100); // Задержка для каждой кнопки
  });
}

// ================================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ================================================

/**
 * Инициализация обработчиков событий
 */
function initEventListeners() {
  // Обработчики для кнопок прокрутки
  scrollBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (this.classList.contains("up")) {
        prevPage();
      } else if (this.classList.contains("down")) {
        nextPage();
      }
    });
  });

  // Обработчики для навигационных кнопок
  navBtns.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      goToPage(index + 1);
    });
  });

  // Обработчики для кнопок на фотографиях
  photoButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Здесь можно добавить логику для кнопок
      console.log("Photo button clicked");
    });
  });

  // Обработчик для мобильного меню футера
  const mobileMenuFooter = document.querySelector(".mobile-menu-footer");
  if (mobileMenuFooter) {
    mobileMenuFooter.addEventListener("click", function (e) {
      e.preventDefault();
      // Здесь можно добавить логику для футера
      console.log("Mobile menu footer clicked");
    });
  }

  // Обработчик колеса мыши для прокрутки страниц
  document.addEventListener("wheel", function (e) {
    // Предотвращаем стандартное поведение только на мобильных устройствах
    if (window.innerWidth <= 770) {
      e.preventDefault();
      e.stopPropagation();
      if (!isScrolling) {
        if (e.deltaY < 0) {
          prevPage();
        } else {
          nextPage();
        }
      }
    }
  });

  // Обработчики клавиатуры
  document.addEventListener("keydown", function (e) {
    if (isScrolling) return;

    switch (e.key) {
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        prevPage();
        break;
      case "ArrowDown":
      case "ArrowRight":
      case " ":
        e.preventDefault();
        nextPage();
        break;
      case "1":
        e.preventDefault();
        goToPage(1);
        break;
      case "2":
        e.preventDefault();
        goToPage(2);
        break;
      case "3":
        e.preventDefault();
        goToPage(3);
        break;
    }
  });

  // Обработчики для сенсорных устройств (свайпы)
  document.addEventListener("touchstart", function (e) {
    if (!isScrolling && !touchScrolling) {
      startY = e.touches[0].clientY;
      startTime = Date.now();
      touchScrolling = true;
    }
  });

  document.addEventListener("touchmove", function (e) {
    // Предотвращаем стандартную прокрутку на мобильных
    if (window.innerWidth <= 770) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  document.addEventListener("touchend", function (e) {
    if (!isScrolling && touchScrolling) {
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      const deltaY = startY - endY;
      const deltaTime = endTime - startTime;

      if (Math.abs(deltaY) > 30 && deltaTime < 300) {
        if (deltaY > 0) {
          nextPage();
        } else {
          prevPage();
        }
      }
      touchScrolling = false;
    }
  });
}

// ================================================
// УПРАВЛЕНИЕ ВИДИМОСТЬЮ НАВИГАЦИИ
// ================================================

/**
 * Показать навигацию
 */
function showNavigation() {
  if (mobileNav) {
    mobileNav.classList.remove("invisible");
  }
}

/**
 * Скрыть навигацию
 */
function hideNavigation() {
  if (mobileNav) {
    mobileNav.classList.add("invisible");
  }
}

/**
 * Переключение видимости навигации
 */
function toggleNavigation() {
  if (mobileNav) {
    mobileNav.classList.toggle("invisible");
  }
}

// ================================================
// ИНИЦИАЛИЗАЦИЯ
// ================================================

/**
 * Инициализация функциональности главной страницы
 */
function initIndexPage() {
  // Проверяем, что мы на главной странице
  if (!backgroundPhotos) {
    console.log("Index page elements not found, skipping initialization");
    return;
  }

  // Блокируем стандартную прокрутку на мобильных устройствах
  if (window.innerWidth <= 770) {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  // Инициализируем обработчики событий
  initEventListeners();

  // Устанавливаем начальную страницу
  currentPage = 1;
  updateState();

  // Запускаем автоскролл
  startAutoScroll();

  // Показываем навигацию с задержкой
  setTimeout(showNavigation, 1000);

  // Принудительно показываем десктопный текст на первой странице при загрузке
  if (window.innerWidth > 770) {
    setTimeout(() => {
      if (desktopTextOverlay) {
        desktopTextOverlay.classList.add("fade-in-text");
      }
    }, 200);
  } else {
    // На мобильных принудительно показываем кнопку на первой странице
    setTimeout(() => {
      const firstButton = document.querySelector(
        ".bg-photo:nth-child(1) .photo-button"
      );
      const firstText = document.querySelector(
        ".bg-photo:nth-child(1) .mobile-text-overlay"
      );

      if (firstText && firstButton) {
        if (firstText.classList.contains("mobile-text-left")) {
          firstButton.classList.add("button-from-right");
        } else if (firstText.classList.contains("mobile-text-right")) {
          firstButton.classList.add("button-from-left");
        }
        firstButton.classList.add("fade-in-button");
      }
    }, 800);
  }

  console.log("Index page functionality initialized");
}

// ================================================
// ОЧИСТКА ПРИ ПЕРЕХОДЕ
// ================================================

/**
 * Очистка ресурсов при уходе со страницы
 */
function cleanup() {
  stopAutoScroll();

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // Убираем обработчики событий
  document.removeEventListener("keydown", arguments.callee);
  document.removeEventListener("touchstart", arguments.callee);
  document.removeEventListener("touchend", arguments.callee);
}

// Очистка при уходе со страницы
window.addEventListener("beforeunload", cleanup);

// ================================================
// ЭКСПОРТ ФУНКЦИЙ
// ================================================

// Экспортируем функции для использования в других модулях
window.IndexPage = {
  goToPage,
  nextPage,
  prevPage,
  startAutoScroll,
  stopAutoScroll,
  showNavigation,
  hideNavigation,
  toggleNavigation,
  initIndexPage,
};

// Обработчик изменения размера окна
window.addEventListener("resize", function () {
  // Восстанавливаем стандартную прокрутку для десктопа
  if (window.innerWidth > 770) {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    // Убираем только мобильные анимации при переходе на десктоп
    mobileTextOverlays.forEach((overlay) => {
      overlay.classList.remove("fade-in-text");
    });
    photoButtons.forEach((button) => {
      button.classList.remove(
        "fade-in-button",
        "button-from-left",
        "button-from-right"
      );
    });
    // Сохраняем десктопный текст и показываем его, если он был скрыт
    if (
      desktopTextOverlay &&
      !desktopTextOverlay.classList.contains("fade-in-text")
    ) {
      desktopTextOverlay.classList.add("fade-in-text");
    }
  } else {
    // Блокируем прокрутку для мобильных
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  // Дополнительная проверка для сохранения десктопного текста при изменении масштаба
  setTimeout(() => {
    if (window.innerWidth > 770 && desktopTextOverlay) {
      // Принудительно показываем десктопный текст после изменения размера
      desktopTextOverlay.classList.add("fade-in-text");
    }
  }, 100);
});

// Автоматическая инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", function () {
  // Небольшая задержка для полной загрузки
  setTimeout(initIndexPage, 100);
});
