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

      // Используем requestAnimationFrame для более плавной анимации
      requestAnimationFrame(() => {
        mainWindow.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      });

      // Обновляем текущую фотографию сразу
      currentPhoto = photoIndex;

      // Увеличиваем время ожидания для завершения scroll-snap анимации
      setTimeout(() => {
        isScrolling = false;
      }, 400); // Оптимизированное время для плавности
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
            scrollTop >= photoStart - photoHeight * 0.5 &&
            scrollTop < photoEnd - photoHeight * 0.5
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
        }
      }, 80); // Оптимизированная задержка для плавности
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

      // Оптимизированные настройки для свайпов
      const minSwipeDistance = 25; // Еще более чувствительные свайпы
      const maxSwipeTime = 400; // Оптимизированное время

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

        // Сбрасываем флаг через оптимизированную задержку
        setTimeout(() => {
          isSwipeScrolling = false;
        }, 250);
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
        }, 30); // Оптимизированная задержка для плавности
      }
    });
  }

  // Инициализируем карусель
  initMobileCarousel();
});
