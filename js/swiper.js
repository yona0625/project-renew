/* 공통 슬라이드 - 호출 */
commonSwiper("pick");
commonSwiper("reco");
commonSwiper("source");
commonSwiper("water");
commonSwiper("comm");

/* [2] 메인 슬라이드 */
const mainSwiper = new Swiper(".main-slide-container", {
  /* 변경 시점 있을 때 슬라이드가 계속 떨리는 걸 방지 */
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: ".main-pagination",
    clickable: true,
    renderBullet: function (index, className) {
      /* 똑같이 common-dot으로 제어하기 위해 추가 */
      return `<span class="${className} mainSlide-dot common-dot"></span>`;
    },
  },
  navigation: {
    nextEl: ".main-btn-next",
    prevEl: ".main-btn-prev",
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

/* [3] 서브 슬라이드(1): brand */
const brand_slide = new Swiper(".brand-slide-container", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: false,

  navigation: {
    nextEl: ".brand-btn-next",
    prevEl: ".brand-btn-prev",
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

/* [4] 서브 슬라이드(2): brand2 */
/* 'brand'가 겹쳐서 2로 주었지만 전반적으로 변수명들 나중에 바꿀 것 */
const brand2_slide = new Swiper(".brand2-slide-container", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  /* navigation */
  navigation: {
    nextEl: ".brand2-btn-next",
    prevEl: ".brand2-btn-prev",
    enabled: false,
  },
  /* pagination */
  pagination: {
    el: ".brand2-pagination",
    enabled: true,
    clickable: true,
    type: "bullets",
    renderBullet: function (index, className) {
      /* 똑같이 common-dot으로 제어하기 위해 추가 */
      return `<span class="${className} brandSlide2-dot common-dot"></span>`;
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
