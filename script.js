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

    // Улучшенный обработчик прокрутки с более точной логикой
    let scrollTimeout;
    let lastScrollTime = 0;

    mainWindow.addEventListener("scroll", function () {
      // Не обрабатываем прокрутку во время программной анимации
      if (isScrolling) return;

      const currentTime = Date.now();
      lastScrollTime = currentTime;

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        // Проверяем, что прошло достаточно времени с последнего скролла
        if (Date.now() - lastScrollTime < 50) return;

        const scrollTop = mainWindow.scrollTop;

        // Улучшенная логика определения текущей фотографии
        // Используем более точные пороги для лучшего определения
        let newPhoto = 0;
        let minDistance = Infinity;

        // Находим фотографию с минимальным расстоянием до текущей позиции
        for (let i = 0; i < photos.length; i++) {
          const photoCenter = i * photoHeight + photoHeight / 2;
          const distance = Math.abs(scrollTop - photoCenter);

          if (distance < minDistance) {
            minDistance = distance;
            newPhoto = i;
          }
        }

        // Дополнительная проверка: если мы близко к границе фотографии
        const currentPhotoCenter = currentPhoto * photoHeight + photoHeight / 2;
        const distanceToCurrent = Math.abs(scrollTop - currentPhotoCenter);

        // Если мы достаточно далеко от центра текущей фотографии, переключаемся
        if (distanceToCurrent > photoHeight * 0.3) {
          // Определяем направление прокрутки
          if (
            scrollTop > currentPhotoCenter &&
            currentPhoto < photos.length - 1
          ) {
            newPhoto = currentPhoto + 1;
          } else if (scrollTop < currentPhotoCenter && currentPhoto > 0) {
            newPhoto = currentPhoto - 1;
          }
        }

        console.log(
          "Прокрутка:",
          scrollTop,
          "Новая фотография:",
          newPhoto,
          "Текущая:",
          currentPhoto,
          "Расстояние:",
          minDistance
        );

        // Обновляем текущую фотографию, если она изменилась
        if (
          newPhoto !== currentPhoto &&
          newPhoto >= 0 &&
          newPhoto < photos.length
        ) {
          currentPhoto = newPhoto;
        }
      }, 100); // Увеличена задержка для более стабильной работы
    });

    // Улучшенные обработчики касаний для свайпов с более точной логикой
    let startY = 0;
    let startTime = 0;
    let isSwipeScrolling = false;
    let touchStartScrollTop = 0;

    mainWindow.addEventListener("touchstart", function (e) {
      // Не обрабатываем касания во время программной прокрутки
      if (isScrolling) return;

      startY = e.touches[0].clientY;
      startTime = Date.now();
      touchStartScrollTop = mainWindow.scrollTop;
      isSwipeScrolling = false;
    });

    mainWindow.addEventListener("touchend", function (e) {
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      const deltaY = startY - endY;
      const deltaTime = endTime - startTime;
      const scrollDelta = mainWindow.scrollTop - touchStartScrollTop;

      // Улучшенные настройки для свайпов с учетом скорости и направления
      const minSwipeDistance = 30; // Минимальное расстояние для свайпа
      const maxSwipeTime = 500; // Максимальное время для свайпа
      const minSwipeVelocity = 0.3; // Минимальная скорость свайпа (пикселей/мс)

      // Рассчитываем скорость свайпа
      const swipeVelocity = Math.abs(deltaY) / deltaTime;

      // Проверяем условия для свайпа
      const isValidSwipe =
        Math.abs(deltaY) > minSwipeDistance &&
        deltaTime < maxSwipeTime &&
        swipeVelocity > minSwipeVelocity &&
        !isSwipeScrolling;

      if (isValidSwipe) {
        isSwipeScrolling = true;

        // Определяем направление свайпа с учетом текущей позиции
        const isSwipeUp = deltaY > 0;
        const isSwipeDown = deltaY < 0;

        console.log(
          "Свайп:",
          "Направление:",
          isSwipeUp ? "вверх" : "вниз",
          "Расстояние:",
          deltaY,
          "Скорость:",
          swipeVelocity,
          "Текущая фотография:",
          currentPhoto
        );

        if (isSwipeUp && currentPhoto < photos.length - 1) {
          // Свайп вверх - следующая фотография
          currentPhoto++;
          scrollToPhoto(currentPhoto);
        } else if (isSwipeDown && currentPhoto > 0) {
          // Свайп вниз - предыдущая фотография
          currentPhoto--;
          scrollToPhoto(currentPhoto);
        }

        // Сбрасываем флаг через оптимизированную задержку
        setTimeout(() => {
          isSwipeScrolling = false;
        }, 300);
      }
    });

    // Обработчик клавиш для навигации
    document.addEventListener("keydown", function (e) {
      if (window.innerWidth <= 770) {
        if (e.key === "ArrowDown" && currentPhoto < photos.length - 1) {
          e.preventDefault();
          currentPhoto++;
          scrollToPhoto(currentPhoto);
        } else if (e.key === "ArrowUp" && currentPhoto > 0) {
          e.preventDefault();
          currentPhoto--;
          scrollToPhoto(currentPhoto);
        }
      }
    });

    // Улучшенный обработчик колеса мыши с накоплением прокрутки
    let wheelTimeout;
    let wheelAccumulator = 0;
    const wheelThreshold = 50; // Порог для срабатывания прокрутки

    mainWindow.addEventListener("wheel", function (e) {
      if (window.innerWidth <= 770) {
        // Не обрабатываем колесо мыши во время программной прокрутки
        if (isScrolling) return;

        e.preventDefault();

        // Накопляем значение прокрутки для более точного определения
        wheelAccumulator += e.deltaY;

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          // Проверяем, превышен ли порог для смены фотографии
          if (Math.abs(wheelAccumulator) > wheelThreshold) {
            if (wheelAccumulator > 0 && currentPhoto < photos.length - 1) {
              // Прокрутка вниз - следующая фотография
              currentPhoto++;
              scrollToPhoto(currentPhoto);
            } else if (wheelAccumulator < 0 && currentPhoto > 0) {
              // Прокрутка вверх - предыдущая фотография
              currentPhoto--;
              scrollToPhoto(currentPhoto);
            }

            // Сбрасываем накопитель после смены фотографии
            wheelAccumulator = 0;
          }
        }, 50); // Увеличена задержка для более стабильной работы
      }
    });
  }

  // Инициализируем карусель
  initMobileCarousel();
});
