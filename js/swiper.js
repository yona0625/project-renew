/* ========================= 스와이퍼 합치기 test ========================== */
/* [1] 공통 슬라이드 */
function commonSwiper(name) {
  /* 복제할 슬라이드 요소들 가져오기 */
  const slideContainer = document.querySelector(`.${name}-slide-container`);
  /* 이 !slideContainer 구문은 굉장히 중요한 게,
  slideContainer가 인식하는 로직은 이렇다: commonSwiper 바깥에 호출문 '2개'를 걸어놓은 상태인데,
  해당 구문은 (예시) slide1-slide-container[1번째]를 불러오고, 그 다음에 호출문의 개수에 따라 slide2-slide-container[2번째]를 연속으로 불러오게 되어있다. 즉 slide1에서 slide1도 찾고 slide2도 찾고 있는 것이다. 그러나 slide1에는 slide1의 내용만, slide2에는 slide2의 내용만 있는 상태이다. 따라서, slide1을 찾고 나서 다른 요소를 찾지 말고 return으로 그냥 종료해서 끊으라는 뜻이다. */
  if (!slideContainer) return;
  const slideWrapper = slideContainer.querySelector(".swiper-wrapper");
  const eachSlide = slideWrapper.querySelectorAll(".swiper-slide");

  /* 슬라이드의 진짜 인덱스 가져오기 */
  const originalIndex = eachSlide.length;

  /* 1. 슬라이드 복제, for문을 forEach로 간결화(중간 변경 지점 없으니 foreach로 진행) */
  eachSlide.forEach((slide) => {
    /* 내용물까지 전부 클론 */
    const slideClone = slide.cloneNode(true);
    /* 이 내용을 wrapper 뒤에 붙이기 */
    slideWrapper.appendChild(slideClone);
  });

  /* ---------- 기본 설정 끝 ---------- */

  /* 2. 새로운 스와이퍼 생성 */
  /* ${name}으로 받아오는 slideContainer에 적용해야 함 */
  const newSwiper = new Swiper(slideContainer, {
    // Optional parameters
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,

    // Navigation arrows
    navigation: {
      nextEl: `.${name}-btn-next`,
      prevEl: `.${name}-btn-prev`,
    },
    pagination: {
      enabled: true,
      el: `.${name}-pagination`,
      /* 이제부터 bullet를 그리겠다. */
      renderBullet: function (index, className) {
        if (index < originalIndex) {
          /* 원본 슬라이드 개수까지만 불렛 그리기. 하단 문구 자체가 swiper에서 지정한 불렛 그리기 문구
          <span class="'+ className + '"></span> */
          /* className = swiper-pagination-bullet */
          /* 스와이퍼의 불렛을 불러오되 그것을 ${name}-slideDot이라 지칭(템플릿 리터럴) - return으로 반환해야 html상의 태그로 기록 됨 */
          return `<span class="${className} ${name}-slideDot"></span>`;
        }
        /* 그게 아니라면 나머지는 ''(공백)처리해서 안 보이게 해. */
        return "";
      },
    },

    // on
    on: {
      /* slideClone을 commonSwiper로 옮겨왔으므로 beforeInit 삭제 */

      /* -----------페이지네이션 테스트----------- */
      /* 너 슬라이드 바뀔 때 마다 아래 함수 실행해. */
      slideChange: function () {
        /* 지금 움직이고 있는 슬라이드의 진짜 index 가져와.(loop의 복제본 무시) (this.realIndex) */
        const activeBulletIndex = this.realIndex % originalIndex;
        /* 지금 여기서 bullet은 renderBullet으로 '원본 슬라이드 개수'만큼만 제작된 상태. 이걸 bullets으로 불러옴. => originalIndex로 나누는 이유는, 혹시라도 readlIndex가 원본 슬라이드 개수 밖을 빠져 나가지 않도록 위한 방지 대책과, 또한 나눔으로써 '원본 슬라이드' 개수의 불렛만을 쓰겠다는 명시적 표기의 의미가 있음. */
        /* document -> slideContainer로 불러와서 전체 swiper가 아니라 각각 슬라이드의 영역 '안'에서 불러오게 함 */
        const bullets = slideContainer.querySelectorAll(
          ".swiper-pagination-bullet",
        );
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

    // breakpoints
    breakpoints: {
      360: {
        centeredSlides: true,
        initialSlide: 0,
        slidesPerView: 3,
        slidesPerGroup: 1,
      },
    },
  });

  /* resize 할 때마다 슬라이드 전체가 흔들리는 것을 방지 */
  /* resize: update() 구문으로 들어가게 되면, 이미 swiper 내부에서 자동 리사이징이 이루어지고 있는데 브라우저에서 update()를 또 계산하다보니 서로 엉켜서 흔들림이 심해짐.
  그래서 window로 더 제어권이 높은 명령을 내려 update를 하면 꼬이지 않음 */
  window.addEventListener("resize", () => {
    if (newSwiper) {
      newSwiper.update();
    }
  });
}
/* 함수 밖에서 호출 */
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
  },
  navigation: {
    nextEl: ".main-btn-next",
    prevEl: ".main-btn-prev",
  },
  
})

/* [3] 서브 슬라이드(1): brand */
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
  },
  /* pagination */
  pagination: {
    enabled: true,
  },
  breakpoints: {
    360: {
      navigation: {
        enabled: false,
      },
      pagination: {
        enabled: true,
        el: ".brand2-pagination",
      },
    },
  },
});
