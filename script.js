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
    let updateIndicators;

    // Проверяем, что элементы найдены
    if (!mainWindow || photos.length === 0) {
      console.warn("Элементы карусели не найдены");
      return;
    }

    console.log("Инициализация карусели:", photos.length, "фотографий");

    // Функция для плавного перехода к фотографии
    function scrollToPhoto(photoIndex) {
      if (isScrolling) return;

      // Ограничиваем индекс фотографии
      const clampedIndex = Math.max(0, Math.min(photoIndex, photos.length - 1));

      isScrolling = true;
      currentPhoto = clampedIndex;
      const targetScroll = clampedIndex * photoHeight;

      console.log(
        "Переход к фотографии:",
        clampedIndex,
        "Позиция:",
        targetScroll
      );

      mainWindow.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });

      // Обновляем индикаторы
      if (updateIndicators) {
        updateIndicators();
      }

      setTimeout(() => {
        isScrolling = false;
      }, 500);
    }

    // Обработчик прокрутки с автоматическим выравниванием
    let scrollTimeout;
    let isAutoScrolling = false;

    mainWindow.addEventListener("scroll", function () {
      // Если это автоматическая прокрутка, не обрабатываем
      if (isAutoScrolling) return;

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollTop = mainWindow.scrollTop;
        const newPhoto = Math.round(scrollTop / photoHeight);

        // Ограничиваем индекс фотографии
        const clampedPhoto = Math.max(0, Math.min(newPhoto, photos.length - 1));

        console.log(
          "Прокрутка:",
          scrollTop,
          "Новая фотография:",
          clampedPhoto,
          "Текущая:",
          currentPhoto
        );

        // Если пользователь прокрутил достаточно далеко от текущей фотографии
        const distanceFromCurrent = Math.abs(
          scrollTop - currentPhoto * photoHeight
        );
        const threshold = photoHeight * 0.3; // 30% от высоты экрана

        if (distanceFromCurrent > threshold) {
          // Автоматически выравниваем по ближайшей фотографии
          isAutoScrolling = true;
          currentPhoto = clampedPhoto;

          mainWindow.scrollTo({
            top: currentPhoto * photoHeight,
            behavior: "smooth",
          });

          // Сбрасываем флаг после завершения анимации
          setTimeout(() => {
            isAutoScrolling = false;
          }, 500);

          if (updateIndicators) {
            updateIndicators();
          }
        }
      }, 100); // Уменьшили задержку для более быстрого отклика
    });

    // Обработчики касаний для свайпов
    let startY = 0;
    let startTime = 0;
    let startScrollTop = 0;

    mainWindow.addEventListener("touchstart", function (e) {
      startY = e.touches[0].clientY;
      startTime = Date.now();
      startScrollTop = mainWindow.scrollTop;
    });

    mainWindow.addEventListener("touchend", function (e) {
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      const deltaY = startY - endY;
      const deltaTime = endTime - startTime;
      const deltaScroll = mainWindow.scrollTop - startScrollTop;

      // Определяем направление свайпа
      const isSwipeUp = deltaY > 0;
      const isSwipeDown = deltaY < 0;

      // Минимальная дистанция для свайпа
      const minSwipeDistance = 30;
      const maxSwipeTime = 500;

      if (Math.abs(deltaY) > minSwipeDistance && deltaTime < maxSwipeTime) {
        if (isSwipeUp && currentPhoto < photos.length - 1) {
          // Свайп вверх - следующая фотография
          currentPhoto++;
          scrollToPhoto(currentPhoto);
        } else if (isSwipeDown && currentPhoto > 0) {
          // Свайп вниз - предыдущая фотография
          currentPhoto--;
          scrollToPhoto(currentPhoto);
        }
      } else if (Math.abs(deltaScroll) < 10) {
        // Если пользователь просто коснулся экрана без свайпа,
        // автоматически выравниваем по текущей фотографии
        scrollToPhoto(currentPhoto);
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

    // Функция обновления индикаторов
    updateIndicators = function () {
      const indicators = document.querySelectorAll(".indicator");
      indicators.forEach((indicator, index) => {
        if (index === currentPhoto) {
          indicator.style.background = "rgba(255, 255, 255, 0.9)";
          indicator.style.transform = "scale(1.2)";
        } else {
          indicator.style.background = "rgba(255, 255, 255, 0.3)";
          indicator.style.transform = "scale(1)";
        }
      });
    };

    // Создание индикаторов
    function createPhotoIndicators() {
      const indicatorsContainer = document.createElement("div");
      indicatorsContainer.className = "photo-indicators";
      indicatorsContainer.style.cssText = `
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;

      photos.forEach((_, index) => {
        const indicator = document.createElement("div");
        indicator.className = "indicator";
        indicator.style.cssText = `
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        `;

        indicator.addEventListener("click", () => {
          currentPhoto = index;
          scrollToPhoto(currentPhoto);
        });

        indicatorsContainer.appendChild(indicator);
      });

      document.body.appendChild(indicatorsContainer);
    }

    // Создаем индикаторы только на мобильных
    if (window.innerWidth <= 770) {
      createPhotoIndicators();
    }

    // Обработчик изменения размера окна
    window.addEventListener("resize", function () {
      if (window.innerWidth > 770) {
        const indicators = document.querySelector(".photo-indicators");
        if (indicators) {
          indicators.remove();
        }
      } else {
        if (!document.querySelector(".photo-indicators")) {
          createPhotoIndicators();
        }
      }
    });
  }

  // Инициализируем карусель
  initMobileCarousel();
});
