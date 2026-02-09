/* [1] 공통 슬라이드 */

function commonSwiper(name) {
  /* === 1. 슬라이드 복제 === */
  const slideContainer = document.querySelector(`.${name}-slide-container`);
  if (!slideContainer) return;
  /* 모듈화를 위해 공통 클래스 부여 */
  slideContainer.classList.add("c-slide__container");

  const slideWrapper = slideContainer.querySelector(".swiper-wrapper");
  const eachSlide = slideWrapper.querySelectorAll(".swiper-slide");
  /* 슬라이드의 진짜 인덱스 */
  const originalIndex = eachSlide.length;

  eachSlide.forEach((slide) => {
    /* - 모듈화 - */
    /* 각 슬라이드(swiper-slide)에 c-slide 부여 */
    slide.classList.add("c-slide");
    /* c-slide안에 있는 text, image를 가져옴 */
    const slideItem = ["text", "image"];
    slideItem.forEach((item) => {
      /* ${name}-text/image를 찾아서 findItem에 넣음 */
      const findItem = slide.querySelector(`.${name}-${item}`);
      /* 만약 찾았다면, c_slide__text/image라는 이름을 붙여 줌 */
      if (findItem) {
        findItem.classList.add(`c-slide__${item}`);
      }
    });
    /* - 복제 - */
    const slideClone = slide.cloneNode(true);
    slideWrapper.appendChild(slideClone);
  });

  /* === 2. 새로운 스와이퍼 생성 === */
  /* ${name}으로 받아오는 slideContainer에 적용해야 함 */
  const newSwiper = new Swiper(slideContainer, {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    observer: true,
    observeParents: true,

    // Navigation
    navigation: {
      nextEl: `.${name}-btn-next`,
      prevEl: `.${name}-btn-prev`,
    },
    // pagination
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

    // on
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


      /* 인덱스 테스트 용 콘솔 */
      slideChangeTransitionEnd: function () {
        savedIdx = this.realIndex;
        console.log("안전하게 저장된 인덱스:", savedIdx);
      },

      resize: function () {
        this.loopFix();
        this.slideToLoop(0, 0);
        this.update();
      },
    },

    // breakpoints
    breakpoints: {
      360: {
        centeredSlides: true,
        initialSlide: 0,
        slidesPerView: 3,
        slidesPerGroup: 1,
      },
      1024: {
        centeredSlides: true,
      },
    },
  });

  /* resize 안정화 -> window로 위임 */
  window.addEventListener("resize", () => {
    if (newSwiper) {
      newSwiper.update();
    }
  });
}
