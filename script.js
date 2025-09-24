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
});
