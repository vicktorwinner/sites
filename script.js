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
      // Раннее скрытие footer при переходе с третьей страницы с анимацией
      if (currentPage !== 3 && $(".footer").hasClass("show-on-mobile")) {
        // Добавляем класс для анимации исчезновения
        $(".footer").addClass("fade-out");
        console.log("Footer: начинается анимация исчезновения");

        // Убираем класс после завершения анимации
        setTimeout(function () {
          $(".footer").removeClass("show-on-mobile fade-out");
          console.log("Footer: скрыт после анимации");
        }, 300); // Быстрая анимация 300ms
      }

      // Убираем все классы active-page
      $wrap.removeClass(function (index, css) {
        return (css.match(/(^|\s)active-page\S+/g) || []).join(" ");
      });

      // Добавляем нужный класс
      $wrap.addClass("active-page" + currentPage);

      // Гарантируем видимость header на мобильных
      if (window.innerWidth <= 770) {
        $(".header").css({
          display: "flex",
          position: "fixed",
          top: "0",
          left: "0",
          "z-index": "1000",
          opacity: "1",
          visibility: "visible",
        });
      }

      // Обновляем навигационные кнопки
      $navBtn.removeClass("active");
      $(".nav-btn.nav-page" + currentPage).addClass("active");

      // Скрываем панель на время анимации
      $navPanel.addClass("invisible");
      scrolling = true;

      // Анимация появления текста и кнопки на текущей странице
      const currentMobileText = $(
        ".bg-photo:nth-child(" + currentPage + ") .mobile-text-overlay"
      );
      const currentMobileButton = $(
        ".bg-photo:nth-child(" + currentPage + ") .photo-button"
      );

      // Убираем анимацию с предыдущих текстов и кнопок
      $(".mobile-text-overlay").removeClass("fade-in-text");
      $(".photo-button").removeClass(
        "fade-in-button button-from-left button-from-right"
      );

      // Небольшая задержка для плавного появления
      setTimeout(function () {
        // Показываем только соответствующий текст в зависимости от размера экрана
        if (window.innerWidth > 770) {
          // На десктопе показываем десктопный текст (он всегда один и в центре)
          $(".desktop-text-overlay").addClass("fade-in-text");
        } else {
          // На мобильных показываем только мобильный текст и кнопку
          currentMobileText.addClass("fade-in-text");

          // Определяем направление кнопки в зависимости от позиции текста
          if (currentMobileText.hasClass("mobile-text-left")) {
            // Если текст слева, кнопка выезжает справа
            currentMobileButton.addClass("button-from-right");
            console.log("Кнопка: выезжает справа (текст слева)");
          } else if (currentMobileText.hasClass("mobile-text-right")) {
            // Если текст справа, кнопка выезжает слева
            currentMobileButton.addClass("button-from-left");
            console.log("Кнопка: выезжает слева (текст справа)");
          }

          currentMobileButton.addClass("fade-in-button");
          console.log("Кнопка: добавлен класс fade-in-button");

          // Показываем footer только на третьей странице с задержкой
          if (currentPage === 3) {
            setTimeout(function () {
              $(".footer").addClass("show-on-mobile");
              console.log("Footer: показан на третьей странице с задержкой");
            }, 800); // Задержка появления footer
          } else {
            // Скрываем footer с анимацией при переходе с третьей страницы
            if ($(".footer").hasClass("show-on-mobile")) {
              $(".footer").addClass("fade-out");
              setTimeout(function () {
                $(".footer").removeClass("show-on-mobile fade-out");
                console.log("Footer: скрыт с анимацией");
              }, 300);
            }
          }
        }
      }, 600); // Задержка для завершения анимации прокрутки

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

    // Обработчики для кнопок на фотографиях
    $(".photo-button").each(function (index) {
      $(this)
        .off("click")
        .on("click", function () {
          console.log(`Кнопка на фотографии ${index + 1} нажата!`);
        });
    });

    // ================================================
    // FOOTER ФУНКЦИОНАЛЬНОСТЬ
    // ================================================

    // Обработчик для ссылки в footer
    $(".footer-link").on("click", function (e) {
      e.preventDefault(); // Предотвращаем стандартное поведение ссылки

      // Анимация нажатия
      $(this).addClass("active");
      setTimeout(() => {
        $(this).removeClass("active");
      }, 150);

      // Здесь можно добавить функциональность (например, открытие модального окна, переход на страницу контактов и т.д.)
      console.log("Footer ссылка нажата!");

      // Пример: показать уведомление
      showNotification("Спасибо за интерес! Скоро свяжемся с вами.");
    });

    // Функция для показа уведомления
    function showNotification(message) {
      // Создаем элемент уведомления
      const notification = $(`
      <div class="notification">
        <p>${message}</p>
      </div>
    `);

      // Добавляем стили для уведомления
      notification.css({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "20px 30px",
        borderRadius: "10px",
        zIndex: "10000",
        fontSize: "16px",
        textAlign: "center",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        opacity: "0",
        transition: "all 0.3s ease",
      });

      // Добавляем уведомление на страницу
      $("body").append(notification);

      // Анимация появления
      setTimeout(() => {
        notification.css("opacity", "1");
      }, 10);

      // Автоматическое скрытие через 3 секунды
      setTimeout(() => {
        notification.css("opacity", "0");
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    }

    // Инициализируем первую страницу
    updateState();

    // Принудительно показываем десктопный текст на первой странице при загрузке
    if (window.innerWidth > 770) {
      setTimeout(function () {
        $(".desktop-text-overlay").addClass("fade-in-text");
      }, 200);
    } else {
      // На мобильных принудительно показываем кнопку на первой странице
      setTimeout(function () {
        const firstButton = $(".bg-photo:nth-child(1) .photo-button");
        const firstText = $(".bg-photo:nth-child(1) .mobile-text-overlay");

        if (firstText.hasClass("mobile-text-left")) {
          firstButton.addClass("button-from-right");
        } else if (firstText.hasClass("mobile-text-right")) {
          firstButton.addClass("button-from-left");
        }
        firstButton.addClass("fade-in-button");

        // Скрываем footer на первой странице
        $(".footer").removeClass("show-on-mobile");
      }, 800);
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
    }, 800);
  }

  // ================================================
  // ГАРАНТИЯ ВИДИМОСТИ HEADER НА МОБИЛЬНЫХ
  // ================================================

  // Функция для принудительного показа header
  function ensureHeaderVisible() {
    if (window.innerWidth <= 770) {
      $(".header").css({
        display: "flex",
        position: "fixed",
        top: "0",
        left: "0",
        "z-index": "1000",
        opacity: "1",
        visibility: "visible",
      });
    }
  }

  // Проверяем видимость header при загрузке
  ensureHeaderVisible();

  // Проверяем видимость header при изменении размера окна
  $(window).on("resize", function () {
    ensureHeaderVisible();
  });

  // Проверяем видимость header при прокрутке (на всякий случай)
  $(window).on("scroll", function () {
    ensureHeaderVisible();
  });

  // Переинициализируем при изменении размера окна
  $(window).on("resize", function () {
    // Восстанавливаем стандартную прокрутку для десктопа
    if (window.innerWidth > 770) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      // Убираем только мобильные анимации при переходе на десктоп
      $(".mobile-text-overlay").removeClass("fade-in-text");
      $(".photo-button").removeClass(
        "fade-in-button button-from-left button-from-right"
      );
      $(".footer").removeClass("show-on-mobile"); // Скрываем мобильный footer
      // Сохраняем десктопный текст и показываем его, если он был скрыт
      if (!$(".desktop-text-overlay").hasClass("fade-in-text")) {
        $(".desktop-text-overlay").addClass("fade-in-text");
      }
    }
    initMobilePageSystem();

    // Дополнительная проверка для сохранения десктопного текста при изменении масштаба
    setTimeout(function () {
      if (window.innerWidth > 770) {
        // Принудительно показываем десктопный текст после изменения размера
        $(".desktop-text-overlay").addClass("fade-in-text");
      }
    }, 100);
  });
});
