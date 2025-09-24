/*
  JavaScript для сайта Варвары Нещеретовой
  Функциональность мобильной карусели и навигации
*/

// Ждем полной загрузки DOM перед выполнением скриптов
document.addEventListener("DOMContentLoaded", function () {
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

  // Функциональность вертикальной карусели для мобильных устройств
  function initMobileCarousel() {
    const mainWindow = document.querySelector(".main-window");
    const photos = document.querySelectorAll(".bg-photo");
    let isScrolling = false;
    let currentPhoto = 0;
    const photoHeight = window.innerHeight;

    // Проверяем, что элементы найдены
    if (!mainWindow || photos.length === 0) {
      console.warn("Элементы карусели не найдены");
      return;
    }

    console.log("Инициализация карусели:", photos.length, "фотографий");

    // Улучшенная функция для плавного перехода к фотографии
    function scrollToPhoto(photoIndex) {
      if (isScrolling) return;

      // Проверяем валидность индекса
      if (photoIndex < 0 || photoIndex >= photos.length) {
        console.warn("Недопустимый индекс фотографии:", photoIndex);
        return;
      }

      isScrolling = true;
      const targetScroll = photoIndex * photoHeight;
      const currentScroll = mainWindow.scrollTop;
      const scrollDistance = Math.abs(targetScroll - currentScroll);

      console.log(
        "Переход к фотографии:",
        photoIndex,
        "Позиция:",
        targetScroll,
        "Текущая позиция:",
        currentScroll,
        "Расстояние:",
        scrollDistance
      );

      // Обновляем текущую фотографию сразу
      currentPhoto = photoIndex;

      // Используем requestAnimationFrame для более плавной анимации
      requestAnimationFrame(() => {
        mainWindow.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      });

      // Динамическое время ожидания в зависимости от расстояния прокрутки
      const baseDelay = 300;
      const distanceMultiplier = Math.min(scrollDistance / photoHeight, 2);
      const dynamicDelay = baseDelay + distanceMultiplier * 100;

      setTimeout(() => {
        isScrolling = false;
        console.log("Переход завершен, фотография:", currentPhoto);
      }, dynamicDelay);
    }

    // Простая и эффективная логика скролла (адаптированная из example.js)
    let scrollTimeout;
    let lastScrollTime = 0;
    const scrollSensitivity = 30; // Чувствительность к прокрутке
    const scrollLockDuration = 600; // Время блокировки повторных событий

    mainWindow.addEventListener("scroll", function () {
      // Не обрабатываем прокрутку во время программной анимации
      if (isScrolling) return;

      const currentTime = Date.now();

      // Throttling - ограничиваем частоту обработки событий
      if (currentTime - lastScrollTime < 50) return;
      lastScrollTime = currentTime;

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollTop = mainWindow.scrollTop;

        // Простая логика определения текущей фотографии
        const newPhoto = Math.round(scrollTop / photoHeight);

        // Ограничиваем индекс в допустимых пределах
        const clampedPhoto = Math.max(0, Math.min(newPhoto, photos.length - 1));

        console.log(
          "Прокрутка:",
          scrollTop,
          "Новая фотография:",
          clampedPhoto,
          "Текущая:",
          currentPhoto
        );

        // Обновляем текущую фотографию, если она изменилась
        if (clampedPhoto !== currentPhoto) {
          currentPhoto = clampedPhoto;
        }
      }, 100);
    });

    // Упрощенные обработчики свайпов (адаптированные из example.js)
    let startY = 0;
    let isSwipeScrolling = false;
    const swipeSensitivity = 50; // Чувствительность к свайпам
    const swipeLockDuration = 600; // Время блокировки повторных свайпов

    mainWindow.addEventListener("touchstart", function (e) {
      // Не обрабатываем касания во время программной прокрутки
      if (isScrolling || isSwipeScrolling) return;

      startY = e.touches[0].clientY;
    });

    mainWindow.addEventListener("touchend", function (e) {
      if (isScrolling || isSwipeScrolling) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;

      // Простая проверка свайпа (аналогично example.js)
      if (Math.abs(deltaY) > swipeSensitivity) {
        isSwipeScrolling = true;

        if (deltaY > 0 && currentPhoto < photos.length - 1) {
          // Свайп вверх - следующая фотография
          currentPhoto++;
          scrollToPhoto(currentPhoto);
        } else if (deltaY < 0 && currentPhoto > 0) {
          // Свайп вниз - предыдущая фотография
          currentPhoto--;
          scrollToPhoto(currentPhoto);
        }

        // Блокируем повторные свайпы
        setTimeout(() => {
          isSwipeScrolling = false;
        }, swipeLockDuration);
      }
    });

    // Обработчик клавиш для навигации (адаптированный из example.js)
    let keyTicking = false;
    const keyLockDuration = 600; // Время блокировки повторных нажатий

    document.addEventListener("keydown", function (e) {
      if (window.innerWidth <= 770) {
        // Не обрабатываем клавиши во время программной прокрутки или блокировки
        if (isScrolling || keyTicking) return;

        if (e.key === "ArrowDown" && currentPhoto < photos.length - 1) {
          e.preventDefault();
          keyTicking = true;
          currentPhoto++;
          scrollToPhoto(currentPhoto);

          // Блокируем повторные нажатия
          setTimeout(() => {
            keyTicking = false;
          }, keyLockDuration);
        } else if (e.key === "ArrowUp" && currentPhoto > 0) {
          e.preventDefault();
          keyTicking = true;
          currentPhoto--;
          scrollToPhoto(currentPhoto);

          // Блокируем повторные нажатия
          setTimeout(() => {
            keyTicking = false;
          }, keyLockDuration);
        }
      }
    });

    // Обработчик колеса мыши (адаптированный из example.js)
    let wheelTicking = false;
    const wheelSensitivity = 30; // Чувствительность к прокрутке колеса
    const wheelLockDuration = 600; // Время блокировки повторных событий

    // Функция для определения направления прокрутки (как в example.js)
    function handleWheelScroll(evt) {
      if (window.innerWidth <= 770) {
        // Не обрабатываем колесо мыши во время программной прокрутки
        if (isScrolling || wheelTicking) return;

        evt.preventDefault();

        // Определяем delta для разных браузеров (как в example.js)
        let delta;
        if (evt.deltaY !== undefined) {
          delta = -evt.deltaY;
        } else if (evt.wheelDelta !== undefined) {
          delta = evt.wheelDelta;
        } else {
          delta = evt.detail * -120;
        }

        // Проверяем направление и чувствительность
        if (delta <= -wheelSensitivity) {
          // Прокрутка вниз - следующая фотография
          wheelTicking = true;
          if (currentPhoto < photos.length - 1) {
            currentPhoto++;
            scrollToPhoto(currentPhoto);
          }
          // Блокируем повторные события
          setTimeout(() => {
            wheelTicking = false;
          }, wheelLockDuration);
        } else if (delta >= wheelSensitivity) {
          // Прокрутка вверх - предыдущая фотография
          wheelTicking = true;
          if (currentPhoto > 0) {
            currentPhoto--;
            scrollToPhoto(currentPhoto);
          }
          // Блокируем повторные события
          setTimeout(() => {
            wheelTicking = false;
          }, wheelLockDuration);
        }
      }
    }

    // Добавляем обработчик с throttling (как в example.js)
    mainWindow.addEventListener("wheel", handleWheelScroll, { passive: false });
  }

  // Инициализируем карусель
  initMobileCarousel();
});
