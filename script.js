/* ================================================ */
/* JAVASCRIPT ДЛЯ САЙТА ВАРВАРЫ НЕЩЕРЕТОВОЙ */
/* ================================================ */
/*
  JavaScript для сайта Варвары Нещеретовой
  Функциональность мобильной карусели и навигации
*/

// ================================================
// ИНИЦИАЛИЗАЦИЯ И ОСНОВНЫЕ ОБРАБОТЧИКИ
// ================================================

// Ждем полной загрузки DOM перед выполнением скриптов
document.addEventListener("DOMContentLoaded", function () {
  // ================================================
  // МОБИЛЬНОЕ МЕНЮ И НАВИГАЦИЯ
  // ================================================

  // Получаем ссылки на элементы DOM
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const body = document.body;

  // Обработчик клика на кнопку бургер-меню
  burger.addEventListener("click", function () {
    burger.classList.toggle("active");
    mobileMenu.classList.toggle("active");

    // Блокируем/разблокируем прокрутку страницы при открытом меню
    if (mobileMenu.classList.contains("active")) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
  });

  // Обработчики для мобильного меню
  const mobileLinks = document.querySelectorAll(".mobile-link");

  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      burger.classList.remove("active");
      mobileMenu.classList.remove("active");
      body.style.overflow = "";
    });
  });

  // Закрытие мобильного меню при клике вне его области
  document.addEventListener("click", function (event) {
    if (!mobileMenu.contains(event.target) && !burger.contains(event.target)) {
      if (mobileMenu.classList.contains("active")) {
        burger.classList.remove("active");
        mobileMenu.classList.remove("active");
        body.style.overflow = "";
      }
    }
  });

  // Закрытие мобильного меню при нажатии клавиши Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileMenu.classList.contains("active")) {
      burger.classList.remove("active");
      mobileMenu.classList.remove("active");
      body.style.overflow = "";
    }
  });

  // ================================================
  // ПЛАВНАЯ ПРОКРУТКА
  // ================================================

  // Плавная прокрутка для навигационных ссылок
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ================================================
  // СИСТЕМА СТРАНИЦ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
  // ================================================

  // Инициализация системы страниц для мобильных устройств
  function initMobilePageSystem() {
    // Проверяем, что мы на мобильном устройстве
    if (window.innerWidth > 770) {
      return;
    }

    // Удаляем все старые обработчики событий для предотвращения дублирования
    $(document).off("mousewheel DOMMouseScroll wheel");
    $(document).off("click", ".scroll-btn");
    $(document).off("click", ".nav-btn");
    $(document).off("touchstart");
    $(document).off("touchend");
    $(document).off("touchmove");

    // Блокируем стандартную прокрутку на мобильных
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const $wrap = $(".background-photos");
    const pages = $(".page").length;
    let scrolling = false;
    let currentPage = 1;
    const $navPanel = $(".nav-panel");
    const $navBtn = $(".nav-btn");

    // ================================================
    // ФУНКЦИИ УПРАВЛЕНИЯ СОСТОЯНИЕМ
    // ================================================

    // Функция обновления состояния (обновляет кэш при каждой прокрутке)
    function updateState() {
      // Убираем все классы active-page
      $wrap.removeClass(function (index, css) {
        return (css.match(/(^|\s)active-page\S+/g) || []).join(" ");
      });

      // Добавляем нужный класс
      $wrap.addClass("active-page" + currentPage);

      // Обновляем навигационные кнопки
      $navBtn.removeClass("active");
      $(".nav-btn.nav-page" + currentPage).addClass("active");

      // Скрываем панель на время анимации
      $navPanel.addClass("invisible");
      scrolling = true;

      // Анимация появления текста на текущей странице
      const currentMobileText = $(
        ".bg-photo:nth-child(" + currentPage + ") .mobile-text-overlay"
      );

      // Убираем анимацию с предыдущих текстов
      $(".mobile-text-overlay").removeClass("fade-in-text");

      // Небольшая задержка для плавного появления
      setTimeout(function () {
        // Показываем только соответствующий текст в зависимости от размера экрана
        if (window.innerWidth > 770) {
          // На десктопе показываем десктопный текст (он всегда один и в центре)
          $(".desktop-text-overlay").addClass("fade-in-text");
        } else {
          // На мобильных показываем только мобильный текст
          currentMobileText.addClass("fade-in-text");
        }
      }, 100); // Ускорили анимацию

      setTimeout(function () {
        $navPanel.removeClass("invisible");
        scrolling = false;
      }, 1000);
    }

    function navigateUp() {
      if (currentPage > 1 && !scrolling) {
        currentPage--;
        updateState();
      }
    }

    function navigateDown() {
      if (currentPage < pages && !scrolling) {
        currentPage++;
        updateState();
      }
    }

    // ================================================
    // ОБРАБОТЧИКИ СОБЫТИЙ ПРОКРУТКИ
    // ================================================

    // Обработчик колеса мыши - исправляем двойное прокручивание
    $(document).on("wheel", function (e) {
      // Предотвращаем стандартное поведение только на мобильных устройствах
      if (window.innerWidth <= 770) {
        e.preventDefault();
        e.stopPropagation();
        if (!scrolling) {
          if (e.originalEvent.deltaY < 0) {
            navigateUp();
          } else {
            navigateDown();
          }
        }
      }
    });

    // Обработчики кнопок навигации
    $(document).on("click", ".scroll-btn", function () {
      if ($(this).hasClass("up")) {
        navigateUp();
      } else {
        navigateDown();
      }
    });

    // Обработчики точек навигации
    $(document).on("click", ".nav-btn:not(.active)", function () {
      if (!scrolling) {
        var target = parseInt($(this).attr("data-target"));
        currentPage = target;
        updateState();
      }
    });

    // ================================================
    // ОБРАБОТЧИКИ TOUCH СОБЫТИЙ (СВАЙПЫ)
    // ================================================

    // Обработчики свайпов для мобильных устройств
    let startY = 0;
    let startTime = 0;
    let isScrolling = false;

    $(document).on("touchstart", function (e) {
      if (!scrolling && !isScrolling) {
        startY = e.originalEvent.touches[0].clientY;
        startTime = Date.now();
        isScrolling = true;
      }
    });

    $(document).on("touchmove", function (e) {
      // Предотвращаем стандартную прокрутку на мобильных
      if (window.innerWidth <= 770) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    $(document).on("touchend", function (e) {
      if (!scrolling && isScrolling) {
        const endY = e.originalEvent.changedTouches[0].clientY;
        const endTime = Date.now();
        const deltaY = startY - endY;
        const deltaTime = endTime - startTime;

        if (Math.abs(deltaY) > 30 && deltaTime < 300) {
          if (deltaY > 0) {
            navigateDown();
          } else {
            navigateUp();
          }
        }
        isScrolling = false;
      }
    });

    // ================================================
    // ОБРАБОТЧИКИ ИНТЕРАКТИВНЫХ ЭЛЕМЕНТОВ
    // ================================================

    // Обработчики для кнопок на фотографиях - убираем alert
    $(".photo-button").each(function (index) {
      $(this)
        .off("click")
        .on("click", function () {
          // Кнопка нажата, но без alert
          console.log(`Кнопка на фотографии ${index + 1} нажата!`);
        });
    });

    // Инициализируем первую страницу
    updateState();

    // Принудительно показываем десктопный текст на первой странице при загрузке
    if (window.innerWidth > 770) {
      setTimeout(function () {
        $(".desktop-text-overlay").addClass("fade-in-text");
      }, 200); // Ускорили появление
    }
  }

  // ================================================
  // ИНИЦИАЛИЗАЦИЯ И ОБРАБОТКА ИЗМЕНЕНИЙ РАЗМЕРА
  // ================================================

  // Инициализируем систему страниц для мобильных
  initMobilePageSystem();

  // Принудительно показываем десктопный текст при загрузке страницы
  if (window.innerWidth > 770) {
    setTimeout(function () {
      $(".desktop-text-overlay").addClass("fade-in-text");
    }, 300); // Ускорили появление
  }

  // Переинициализируем при изменении размера окна
  $(window).on("resize", function () {
    // Восстанавливаем стандартную прокрутку для десктопа
    if (window.innerWidth > 770) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      // Убираем все анимации текстов при переходе на десктоп
      $(".desktop-text-overlay, .mobile-text-overlay").removeClass(
        "fade-in-text"
      );
    }
    initMobilePageSystem();
  });
});
