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

    // Функция для плавного перехода к фотографии с поддержкой scroll-snap
    function scrollToPhoto(photoIndex) {
      if (isScrolling) return;

      isScrolling = true;
      const targetScroll = photoIndex * photoHeight;

      console.log(
        "Переход к фотографии:",
        photoIndex,
        "Позиция:",
        targetScroll
      );

      mainWindow.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });

      // Обновляем текущую фотографию сразу
      currentPhoto = photoIndex;
      if (updateIndicators) {
        updateIndicators();
      }

      // Увеличиваем время ожидания для завершения scroll-snap анимации
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }

    // Обработчик прокрутки - работает независимо от скорости и дальности
    let scrollTimeout;
    mainWindow.addEventListener("scroll", function () {
      // Не обрабатываем прокрутку во время программной анимации
      if (isScrolling) return;

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollTop = mainWindow.scrollTop;

        // Определяем текущую фотографию на основе позиции прокрутки
        // Используем более точную логику для определения ближайшей фотографии
        let newPhoto = 0;

        // Проверяем, к какой фотографии ближе всего текущая позиция прокрутки
        for (let i = 0; i < photos.length; i++) {
          const photoStart = i * photoHeight;
          const photoEnd = (i + 1) * photoHeight;

          // Если прокрутка находится в пределах фотографии (с меньшим запасом для точности)
          if (
            scrollTop >= photoStart - photoHeight * 0.4 &&
            scrollTop < photoEnd - photoHeight * 0.4
          ) {
            newPhoto = i;
            break;
          }
        }

        console.log(
          "Прокрутка:",
          scrollTop,
          "Новая фотография:",
          newPhoto,
          "Текущая:",
          currentPhoto
        );

        // Обновляем текущую фотографию, если она изменилась
        if (
          newPhoto !== currentPhoto &&
          newPhoto >= 0 &&
          newPhoto < photos.length
        ) {
          currentPhoto = newPhoto;
          if (updateIndicators) {
            updateIndicators();
          }
        }
      }, 150); // Увеличили задержку для предотвращения конфликтов с scroll-snap
    });

    // Обработчики касаний для свайпов - улучшенная версия
    let startY = 0;
    let startTime = 0;
    let isSwipeScrolling = false;

    mainWindow.addEventListener("touchstart", function (e) {
      // Не обрабатываем касания во время программной прокрутки
      if (isScrolling) return;

      startY = e.touches[0].clientY;
      startTime = Date.now();
      isSwipeScrolling = false;
    });

    mainWindow.addEventListener("touchend", function (e) {
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      const deltaY = startY - endY;
      const deltaTime = endTime - startTime;

      // Более чувствительные настройки для свайпов
      const minSwipeDistance = 30; // Уменьшили минимальное расстояние
      const maxSwipeTime = 500; // Увеличили максимальное время

      if (
        Math.abs(deltaY) > minSwipeDistance &&
        deltaTime < maxSwipeTime &&
        !isSwipeScrolling
      ) {
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

        // Сбрасываем флаг через небольшую задержку
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

    // Обработчик колеса мыши для более плавной навигации
    let wheelTimeout;
    mainWindow.addEventListener("wheel", function (e) {
      if (window.innerWidth <= 770) {
        // Не обрабатываем колесо мыши во время программной прокрутки
        if (isScrolling) return;

        e.preventDefault();

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          if (e.deltaY > 0 && currentPhoto < photos.length - 1) {
            // Прокрутка вниз - следующая фотография
            currentPhoto++;
            scrollToPhoto(currentPhoto);
          } else if (e.deltaY < 0 && currentPhoto > 0) {
            // Прокрутка вверх - предыдущая фотография
            currentPhoto--;
            scrollToPhoto(currentPhoto);
          }
        }, 50); // Небольшая задержка для предотвращения множественных срабатываний
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
