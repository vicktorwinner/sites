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

  // Функциональность бесконечной карусели для мобильных устройств
  function initMobileCarousel() {
    const mainWindow = document.querySelector(".main-window");
    const photos = document.querySelectorAll(".bg-photo");
    const backgroundPhotos = document.querySelector(".background-photos");
    let currentPhoto = 0;
    let isTransitioning = false;
    let updateIndicators;

    // Проверяем, что элементы найдены
    if (!mainWindow || photos.length === 0 || !backgroundPhotos) {
      console.warn("Элементы карусели не найдены");
      return;
    }

    console.log(
      "Инициализация бесконечной карусели:",
      photos.length,
      "фотографий"
    );

    // Функция для перехода к фотографии (бесконечная карусель)
    function goToPhoto(photoIndex) {
      if (isTransitioning) return;

      // Ограничиваем индекс фотографии
      const clampedIndex = Math.max(0, Math.min(photoIndex, photos.length - 1));

      isTransitioning = true;
      currentPhoto = clampedIndex;

      // Вычисляем смещение для карусели
      const translateX = -clampedIndex * 100; // -100% для каждой фотографии

      console.log(
        "Переход к фотографии:",
        clampedIndex,
        "Смещение:",
        translateX + "%"
      );

      // Применяем трансформацию
      backgroundPhotos.style.transform = `translateX(${translateX}%)`;

      // Обновляем индикаторы
      if (updateIndicators) {
        updateIndicators();
      }

      // Сбрасываем флаг после завершения анимации
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }

    // Функция для следующей фотографии (бесконечная)
    function nextPhoto() {
      const nextIndex = (currentPhoto + 1) % photos.length;
      goToPhoto(nextIndex);
    }

    // Функция для предыдущей фотографии (бесконечная)
    function prevPhoto() {
      const prevIndex =
        currentPhoto === 0 ? photos.length - 1 : currentPhoto - 1;
      goToPhoto(prevIndex);
    }

    // Обработчики свайпов для карусели
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    mainWindow.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    });

    mainWindow.addEventListener("touchend", function (e) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();

      const deltaX = startX - endX;
      const deltaY = startY - endY;
      const deltaTime = endTime - startTime;

      // Определяем направление свайпа
      const isSwipeLeft = deltaX > 0;
      const isSwipeRight = deltaX < 0;
      const isSwipeUp = deltaY > 0;
      const isSwipeDown = deltaY < 0;

      // Минимальная дистанция для свайпа
      const minSwipeDistance = 50;
      const maxSwipeTime = 500;

      // Проверяем, что свайп достаточно сильный и быстрый
      if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
        if (isSwipeLeft) {
          // Свайп влево - следующая фотография
          nextPhoto();
        } else if (isSwipeRight) {
          // Свайп вправо - предыдущая фотография
          prevPhoto();
        }
      } else if (
        Math.abs(deltaY) > minSwipeDistance &&
        deltaTime < maxSwipeTime
      ) {
        // Вертикальные свайпы тоже работают
        if (isSwipeUp) {
          nextPhoto();
        } else if (isSwipeDown) {
          prevPhoto();
        }
      }
    });

    // Обработчик клавиш для навигации
    document.addEventListener("keydown", function (e) {
      if (window.innerWidth <= 770) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          nextPhoto();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          prevPhoto();
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
          goToPhoto(index);
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
