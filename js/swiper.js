/* 호출 */
const commonList = ["pick", "recommend", "resource", "water", "community"];
commonList.forEach(
  name => commonSwiper(name)
);

/* main - visual */
const mainSwiper = new Swiper(".visual-slide-container", {
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: ".visual-pagination",
    clickable: true,
    renderBullet: function (index, className) {
      return `<span class="${className} visualSlide-dot common-dot"></span>`;
    },
  },
  navigation: {
    nextEl: ".visual-btn-next",
    prevEl: ".visual-btn-prev",
  },
  breakpoints: {},
  on: {
    resize: function () {
      this.update();
    },
  },
});

/* brandList */
const brandList_slide = new Swiper(".brandList-slide-container", {
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 20,
  loop: false,
  watchSlidesProgress: true,

  navigation: {
    nextEl: ".brandList-btn-next",
    prevEl: ".brandList-btn-prev",
  },

  breakpoints: {
    768: {
      slidesPerView: 2,
      slidesPerGroup: 1,
    },
    1024: {
      slidesPerView: 3,
      slidesPerGroup: 1,
    },
  },
});

/* story */
const story_slide = new Swiper(".story-slide-container", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,

  navigation: {
    nextEl: ".story-btn-next",
    prevEl: ".story-btn-prev",
    enabled: false,
  },

  pagination: {
    el: ".story-pagination",
    enabled: true,
    clickable: true,
    type: "bullets",
    renderBullet: function (index, className) {
      return `<span class="${className} storySlide-dot common-dot"></span>`;
    },
  },
  breakpoints: {
    1024: {
      /* css 제어로 바꿔볼 것 */
      navigation: {
        enabled: true,
      },
    },
  },
  on: {
    resize: function () {
      this.update();
    },
  },
});
