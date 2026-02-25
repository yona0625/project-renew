/* === 공통 swiper === */
function commonSwiper(name) {
  const slideContainer = document.querySelector(`.${name}-slide-container`);
  if (!slideContainer) return;

  slideContainer.classList.add("c-slide__container");

  const slideWrapper = slideContainer.querySelector(".swiper-wrapper");
  const eachSlide = slideWrapper.querySelectorAll(".swiper-slide");
  const originalIndex = eachSlide.length;

  /* 모듈화 */
  eachSlide.forEach((slide) => {
    slide.classList.add("c-slide");
    const slideItem = ["text", "image"];

    slideItem.forEach((item) => {
      const findItem = slide.querySelector(`.${name}-${item}__swiperMain`);
      if (findItem) {
        findItem.classList.add(`c-slide-${item}__swiperMain`);
      }
    });
    /* 복제 */
    const slideClone = slide.cloneNode(true);
    slideWrapper.appendChild(slideClone);
  });

  const swiperInstance = new Swiper(slideContainer, {
    slidesPerView: 1.2,
    spaceBetween: 15,
    loop: true,
    watchSlidesProgress: true, // tab 이동 무한 갇힘 방지 
    observer: true,
    observeParents: true,

    navigation: {
      nextEl: `.${name}-btn-next`,
      prevEl: `.${name}-btn-prev`,
    },

    pagination: {
      enabled: true,
      el: `.${name}-pagination`,
      clickable: true,
      renderBullet: function (index, className) {
        if (index < originalIndex) {
          return `<span class="${className} ${name}-slideDot common-dot"></span>`;
        }
        return "";
      },
    },

    on: {
      slideChange: function () {
        const activeBulletIndex = this.realIndex % originalIndex;
        const bullets = slideContainer.querySelectorAll(
          ".swiper-pagination-bullet",
        );
        bullets.forEach((bullet, i) => {
          if (i === activeBulletIndex) {
            bullet.classList.add("swiper-pagination-bullet-active");
          } else {
            bullet.classList.remove("swiper-pagination-bullet-active");
          }
        });
      },

      resize: function () {
        this.update();
      },
    },

    breakpoints: {
      360: {
        centeredSlides: true,
        initialSlide: 0,
        slidesPerView: 1.2,
        slidesPerGroup: 1,
      },
      768: {
        centeredSlides: true,
        slidesPerView: 1.2,
        slidesPerGroup: 1,
      },
      1024: {
        centeredSlides: false,
        spaceBetween: 20,
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        initialSlide: 0,
      },
    },
  });

  /* === swiper 전체 영역 클릭 이벤트 === */
  const cardClick = () => {
    slideContainer.addEventListener("click", (e) => {
      if (window.innerWidth > 1023) return;

      const findSlide = e.target.closest(".c-slide");
      if (!findSlide) return;

      const findMoreBtn = findSlide.querySelector(".more-btn");
      if (!findMoreBtn) return;

      if (!e.target.closest(".more-btn")) {
        e.preventDefault();
        findMoreBtn.click();
      }
    });
  };
  cardClick();
}
