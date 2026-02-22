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
      /* 공통 요소가 또 있으므로 __swiperMain로 불러옴 */
      const findItem = slide.querySelector(`.${name}-${item}__swiperMain`);
      /* 만약 찾았다면, c_slide__text/image라는 이름을 붙여 줌 */
      if (findItem) {
        /* 불러온 걸 [슬라이드]__text로 붙임 */
        findItem.classList.add(`c-slide-${item}__swiperMain`);
      }
    });
    /* - 복제 - */
    const slideClone = slide.cloneNode(true);
    slideWrapper.appendChild(slideClone);
  });

  /* === 2. 새로운 스와이퍼 생성 === */
  /* ${name}으로 받아오는 slideContainer에 적용해야 함 */
  const newSwiper = new Swiper(slideContainer, {
    slidesPerView: 1.2,
    spaceBetween: 15,
    loop: true,
    /* tab 이동 시 무한 갇힘 해제 */
    watchSlidesProgress: true,
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

      resize: function () {
        this.update();
      },
    },

    // breakpoints
    /* 각자 구간에서 다 써줘야 안정적으로 돌아감. */
    breakpoints: {
      360: {
        centeredSlides: true,
        initialSlide: 0,
        slidesPerView: 1.2,
        slidesPerGroup: 1,
      },
      /* 타블렛 <-> pc 양 방향 스위칭을 위해 768에서도 명시적 기입하는 게 좋음. */
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

  /* === 3. swiper slide 전체 영역 클릭 이벤트 === */
  const cardClick = () => {
    slideContainer.addEventListener("click", (e) => {
      if (window.innerWidth > 1023) return;

      /* 클릭 요소에서 가장 가까운 슬라이드 찾기 */
      const findSlide = e.target.closest(".c-slide");
      if (!findSlide) return;

      /* 슬라이드 내부의 더보기 링크 버튼 찾기 */
      const findMoreBtn = findSlide.querySelector(".more-btn");
      if (!findMoreBtn) return;

      // [테스트용] 클릭이 됐는지 확인하는 용도
      /* 만약 더보기를 누르지 않았다면, 기존 e의 배경 기본 동작을 막고(init) js로 click을 심어줌. 그럼 더보기를 누른다면? if문에서 벗어나기 때문에 그냥 원래대로의 버튼 클릭이 이루어짐. */
      console.log(`${name} 슬라이드의 카드 클릭`);
      if (!e.target.closest(".more-btn")) {
        e.preventDefault();

        // 실제 버튼 클릭 트리거
        findMoreBtn.click();
      }
    });
  };
  cardClick();
}
