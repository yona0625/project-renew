/* 슬라이드의 원본 개수(복제 제외). 밖에다 선언하는 이유는, 복제가 되기 전의 개수를 세야하기 때문에.
즉 1. 밖에서 먼저 개수를 세고 2. swiper 시작하고 3. 슬라이드 복제 */
let originalIndex = document.querySelectorAll(
  ".pick-slide-container .swiper-slide"
).length;

/* =============== 1. pick-slide =============== */
const pick_slide = new Swiper(".pick-slide-container", {
  // Optional parameters
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".pick-btn-next",
    prevEl: ".pick-btn-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    /* 이제부터 bullet를 그리겠다. */
    renderBullet: function (index, className) {
      if (index < originalIndex) {
        /* 원본 슬라이드 개수까지만 불렛 그리기. 하단 문구 자체가 swiper에서 지정한 불렛 그리기 문구 */
        return '<span class="' + className + '"></span>';
      }
      /* 그게 아니라면 나머지는 ''(공백)처리해서 안 보이게 해. */
      return "";
    },
  },
  on: {
    /* swiper가 루프 돌리기 전에 준비(복제)를 해야함. SlideClone()이라고 쓰면 즉시 함수가 실행되므로 참조(파라미터)만 넘겨서 나중에 실행하도록 해야 함. */
    beforeInit: SlideClone,

    /* -----------페이지네이션 테스트----------- */
    /* 너 슬라이드 바뀔 때 마다 아래 함수 실행해. */
    slideChange: function () {
      /* 지금 움직이고 있는 슬라이드의 진짜 index 가져와.(loop의 복제본 무시) (this.realIndex) */
      const activeBulletIndex = this.realIndex % originalIndex;
      /* 지금 여기서 bullet은 renderBullet으로 '원본 슬라이드 개수'만큼만 제작된 상태. 이걸 bullets으로 불러옴. */
      const bullets = document.querySelectorAll(".swiper-pagination-bullet");
      /* bullets 검사. bullet은 그 <span>태그, i는 순서 */
      bullets.forEach((bullet, i) => {
        if (i === activeBulletIndex) {
          /* 만약 조건에 맞아? 불렛에 불 켜. classList는 일부만 add하고 remove 가능함. 옷 바꾸듯이 */
          bullet.classList.add("swiper-pagination-bullet-active");
        } else {
          /* 조건 미달? 불 꺼. */
          bullet.classList.remove("swiper-pagination-bullet-active");
        }
      });
    },
  },
  breakpoints: {
    360: {
      centeredSlides: true,
      initialSlide: 0,
      slidesPerView: 3,
      slidesPerGroup: 1,
      pagination: {
        enabled: false,
      },
    },
  },
});

/* ★ swiper 리사이징 시 흔들림 방지 코드 */
window.addEventListener("resize", () => {
  pick_slide.update();
});

/* -------------- 메인 슬라이드 테스트(pick-slide) ---------------- */

/* beforeInit의 파라미터를 clone으로 받아서 서로 연결함 */
function SlideClone(slideclone) {
  /* 나 swiper의 집(clone.el)에서 wrapper 찾을거야. */
  const slideWrapper = slideclone.el.querySelector(".swiper-wrapper");
  /* wrapper는 찾았는데 그 안에서 뭐 찾게? 각 슬라이드 모두 다 찾을거야. */
  const AllSlide = slideWrapper.querySelectorAll(".swiper-slide");

  /* 현재 슬라이드 수만큼 반복(복제)할거임. */
  for (var i = 0; i < AllSlide.length; i++) {
    /* 슬라이드 검사 들어갑니다. 배열수만큼 true(안의 내용까지 전부) 복사함 */
    const clone = AllSlide[i].cloneNode(true);
    /* 복사된 덩어리 뒤에 통째로 붙임. */
    slideWrapper.appendChild(clone);
  }
}

/* ======================== 2. brand-slide ================== */
const brand_slide = new Swiper(".brand-slide-container", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,

  navigation: {
    nextEl: ".brand-btn-next",
    prevEl: ".brand-btn-prev",
  },

  breakpoints: {
    360: {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: false,
    },
    768: {
      slidesPerView: 3,
    },
  },
});
