/* 공통 슬라이드 - 호출 */
commonSwiper("pick");
commonSwiper("recommend");
commonSwiper("resource");
commonSwiper("water");
commonSwiper("community");

/* [2] 메인 슬라이드 */
const mainSwiper = new Swiper(".visual-slide-container", {
  /* 변경 시점 있을 때 슬라이드가 계속 떨리는 걸 방지 */
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: ".visual-pagination",
    clickable: true,
    renderBullet: function (index, className) {
      /* 똑같이 common-dot으로 제어하기 위해 추가 */
      return `<span class="${className} visualSlide-dot common-dot"></span>`;
    },
  },
  navigation: {
    nextEl: ".visual-btn-next",
    prevEl: ".visual-btn-prev",
  },
  breakpoints: {
    360: {
      navigation: {
        enabled: false,
      },
    },
  },
  on: {
    resize: function () {
      this.loopFix();
      this.slideToLoop(0, 0);
      this.update();
    },
  },
});

/* [3] 서브 슬라이드(1): brandList */
const brandList_slide = new Swiper(".brandList-slide-container", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: false,

  navigation: {
    nextEl: ".brandList-btn-next",
    prevEl: ".brandList-btn-prev",
  },

  breakpoints: {
    360: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
    },
  },
});

/* [4] 서브 슬라이드(2): story */
const story_slide = new Swiper(".story-slide-container", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  /* navigation */
  navigation: {
    nextEl: ".story-btn-next",
    prevEl: ".story-btn-prev",
    enabled: false,
  },
  /* pagination */
  pagination: {
    el: ".story-pagination",
    enabled: true,
    clickable: true,
    type: "bullets",
    renderBullet: function (index, className) {
      /* 똑같이 common-dot으로 제어하기 위해 추가 */
      return `<span class="${className} storySlide-dot common-dot"></span>`;
    },
  },
  breakpoints: {
    1024: {
      navigation: {
        enabled: true,
      },
    },
  },
  on: {
    breakpoints: function () {
      /* 슬라이드 흔들림 방지 */
      this.loopFix();
      this.slideToLoop(0, 0);
      /* 이미지가 렌더링 속도를 못 따라오고 튀는 현상 방지 */
      this.update();
    },
  },
});
