/* 더 보기(#none) 클릭 시 상단으로 이동하는 것을 방지 */
const preventMoveTop = {
  init: function () {
    this.preventMoveTop();
  },
  /* href="#none"인 모든 링크의 기본 동작(상단 이동) 방지 */
  preventMoveTop: function () {
    // 특정 클래스(.more-btn)뿐만 아니라 #none을 가진 모든 a 태그 대상
    document.addEventListener("click", (e) => {
      const anchor = e.target.closest('a[href="#none"]');
      if (anchor) {
        e.preventDefault();
      }
    });
  },
};
preventMoveTop.init();

/* ======================= nav ======================= */
/* --- 모바일~타블렛 --- */
const mobileNav = {
  /* pc일 때 모바일 잔상이 안 남도록 (모바일 -> pc순이면 필요) */
  resetForPC: function () {
    const mobileMenu = document.querySelector(".all-menu");
    const mobileSubMenu = document.querySelectorAll(".second-menu");

    /* mobileMenu가 없을 시 안전장치 */
    if (!mobileMenu) return;

    /* 열려있을 때 pc로 이동하면 active 제거 -> 창이 닫히게 함 */
    mobileMenu.classList.remove("active");
    /* 모바일의 transform을 지움(더 확실하게) */
    /* = "": 인라인 스타일로 새겨진 걸 삭제 */
    mobileMenu.style.transform = "";
    /* ★★★ 금지된 본문 스크롤을 pc에서 해제 */
    document.body.style.overflow = "";

    /* 아코디언의 상위, 하위 전부 포함해서 싹 cancel로 지움 */
    /* cancel: 애니메이션에 관해 삭제 */
    mobileMenu.getAnimations().forEach((anim) => anim.cancel());
    mobileSubMenu.forEach((sub) => {
      sub.getAnimations().forEach((anim) => anim.cancel());
      sub.style.maxHeight = "";
    });
  },
  init: function () {
    /* 변수 불러오기 */
    const mobileMenu = document.querySelector(".all-menu");

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1023) {
        this.resetForPC(); // 객체 내부 함수 호출
      }
    });

    window.addEventListener("click", (e) => {
      /* 모바일 전용 */
      if (window.innerWidth > 1023) return;

      const trigger = e.target.closest(".trigger");
      const realMenu = e.target.closest(".all-menu");
      const exitBtn = e.target.closest(".exit-btn");
      const menuOpen = mobileMenu.classList.contains("active");

      if (trigger) {
        mobileMenu.classList.add("active");
        openMenu();
      } else if (menuOpen && (exitBtn || !realMenu)) {
        /* 2. 메뉴 닫기 */
        /* (1) x 버튼을 누르거나, 전체 메뉴 바깥을 누르면 닫힘 */
        /* (2) 오직 창이 열렸을 때만 닫힌다는 조건을 넣어줘야 함. 그게 없으면 창이 열려있든 닫혀있든 계속 remove(active)를 하고 있는 상태. 창이 열려 있느냐?(&&) 그렇다면 뒤를 수행, 아니면 안 함. */
        mobileMenu.classList.remove("active");
        closeMenu();
      }
      /* 함수로 분리 */
      function openMenu() {
        // 메뉴가 열릴 때 본문 스크롤 금지 - (1)
        document.body.style.overflow = "hidden";
        const openFix = mobileMenu.animate(
          [
            {
              transform: "translateX(100%)",
            },
            {
              transform: "translateX(0)",
            },
          ],
          {
            duration: 300,
            easing: "ease-out",
            /* 애니메이션이 종료된 시점을 fill로 고정(안하면, -300px로 다시 날아감) */
            fill: "forwards",
          },
        );
        /* + 닫을 때만 넣었는데, 분기점 왔다갔다하면서 자꾸 동작을 안 해서 연 곳에서도 넣음 */
        openFix.onfinish = () => {
          mobileMenu.getAnimations().forEach((anim) => anim.cancel());
        };
      }
      function closeMenu() {
        /* ★★★★★ 메뉴가 닫히면 다시 스크롤 허용 - (2) */
        document.body.style.overflow = "";
        const closeFix = mobileMenu.animate(
          [
            {
              transform: "translateX(0)",
            },
            {
              transform: "translateX(100%)",
            },
          ],
          {
            duration: 300,
            easing: "ease-out",
            fill: "forwards",
          },
        );
        closeFix.onfinish = () => {
          mobileMenu.classList.remove("active");
          /* cancel()을 넣어주는 이유: 닫는 시점에서 cancel로 깨끗하게 fill: "forwards"의 잔재를 지워서 초기화 */
          mobileMenu.getAnimations().forEach((anim) => anim.cancel());
        };
      }
    });
  },
};
mobileNav.init();
/* --- PC --- */
const pcNav = {
  init: function () {
    /* click으로 하면 이벤트 리스너 영역(딱히 윈도우 한정이 아님)에서도 정확한 타겟이 필요하므로 closest을 썼었는데, 이제는 li랑 all-menu 안의 영역으로만 한정이 되니 closest은 필요 없음.(모바일은 필요할듯 함) */
    const pcNav = document.querySelectorAll("nav li");
    const pcAllMenu = document.querySelector(".all-menu");
    /* 애니메이션 리셋 */
    const resetAnimation = () => {
      pcAllMenu.getAnimations().forEach((anim) => anim.cancel());
    };
    /* header 추가 */
    const pcHeader = document.querySelector("header");

    /* nav 메뉴 접근 시 */
    pcNav.forEach((item) => {
      item.addEventListener("mouseenter", function () {
        /* mouseenter/leave로 바뀌면서 인식 영역이 갈리므로 enter, leave 부분에 각자 1024 이하 구문을 넣어주는 게 안전함. */
        /* 1024 미만이거나, 이미 메뉴가 열려있다면 중단(다른 대표메뉴를 커서에 대어도 열리는 게 계속 발생하지 않도록) */

        if (window.innerWidth < 1024) {
          return;
        }
        /* 반드시 if문을 거친 후에 리셋이 이루어져야만 함. */
        resetAnimation();
        function openMenu() {
          /* active 검사를 열렸을 때 하는 것으로 이동 */
          if (pcAllMenu.classList.contains("active")) {
            return;
          }
          pcAllMenu.classList.add("active");
          pcAllMenu.animate(
            [
              {
                opacity: "0",
              },
              {
                opacity: "1",
              },
            ],
            {
              duration: 300,
              easing: "ease-out",
              fill: "forwards",
            },
          );
        }
        openMenu();
      });
    });
    /* 전체 메뉴 떠날 시 */
    /* allmenu -> header로 변경, allmenu로 잡아 버리면 allmenu를 거치지 않고 header에서 커서를 떼었을 때 메뉴가 계속 안 닫힘 */
    pcHeader.addEventListener("mouseleave", function () {
      if (window.innerWidth < 1024) return;
      function closeMenu() {
        /* - 만약 창이 열린 상태라면
        x버튼을 누르거나, 메뉴 바깥을 빠져나간다면 */
        const closeFix = pcAllMenu.animate(
          [
            {
              opacity: "1",
            },
            {
              opacity: "0",
            },
          ],
          {
            duration: 300,
            easing: "ease-out",
            fill: "forwards",
          },
        );
        /* onfinish가 필요한 이유는, li로 다시 열린 창을 닫을 때 animate로 닫히는 시간(0.5초)가 '지나고 나서야' 창이 닫혀야 하는데, 이게 없으면 바로 remove로 닫아버려서 닫힐 때 애니메이션 적용이 되지 않는다. onfinish는 animate가 다 끝날 때까지 기다렸다가 닫아주는 역할을 함. 
        구문도 () => 가 아니라 = () => 로 '='로 저장했다가 나중에 실행해야 함. */
        /* 따라서 remove active는 위가 아니라 여기 안에 들어간다. */
        closeFix.onfinish = () => {
          pcAllMenu.classList.remove("active");
          /* 마찬가지로 닫을 때 cancel */
          resetAnimation();
        };
      }
      closeMenu();
    });
  },
};
pcNav.init();

/* ================== sidebar(mobile) ================= */
const mobileSidebar = {
  init: function () {
    const firstMenuContainer = document.querySelector(".first-menu");

    /* 이벤트 위임으로 맨 상위로 잡음 */
    firstMenuContainer.addEventListener("click", (e) => {
      if (window.innerWidth > 1023) return;
      /* 서브 메뉴를 눌렀을 때 자꾸 접히는 문제 방지 */
      /* .first-menu를 위임했기에 li만 써도 됨(X) -> second-menu안에도 li가 있으므로 구분 지어야 함. -> 간단한 로직에서는 li로 foreach 접근해도 됨. */
      const firstMenu = e.target.closest(".first-menu > li");
      /* 해당 영역 밖을 눌렀을 때: null로 나오는 에러 방지 */
      /* ★ e.target으로 찾으면 안 되는 이유: (구조상 문제) second-menu로 접근은 하겠지만, 지금 메뉴에서는 일부만 second-menu가 있기 때문에 second-menu가 없는 곳에는 에러가 남 -> 따라서 firstMenu로 시작해야 함. */

      /* 원래 firstMenu, secondMenu, e.target.closest에 각각 if(!(변수명)) return을 했는데, 이러니까 if문을 너무 남발해서 합쳤음. */
      /* 1. 일단 if(!(변수명) return을 사용하는 이유는, 해당 영역의 바깥을 눌렀을 때 typeError(null)가 뜨는데 이 경우가 생기지 않게 return으로 넘겨버리겠다는 의미이다.
      2. 여기서 secondMenu는 firstMenu에서 전달받고 있는데, typeError(null)이 나올 가능성은 firstMenu에 있으므로 옵셔널 체이닝은 firstMenu에만 붙이면 secondMenu에도 자동으로 되므로 더 안 붙여도 됨. */
      /* 3. 1,2번에서 안전 장치를 다 걸었으므로 if문에 다 합쳐서 return */
      /* ★ typeError(null)과 데이터 값 null은 다르다. firstMenu?.은 데이터 null값을 담아놓기만 하고 작동은 되지만(이후 return으로 넘겨버리면 됨.), typeError(null)의 경우 화면이 빨갛게 되면서 아예 작동을 안 함. */

      const secondMenu = firstMenu?.querySelector(".second-menu");
      if (e.target.closest(".second-menu") || !firstMenu || !secondMenu) return;
      /* 메뉴가 열려있는지 확인 필요 */
      const secondMenuOpen = secondMenu.classList.contains("active");
      /* 메뉴가 열려 있다면? -> 닫기 */
      /* + (!secondMenu) return 추가로 기존 if(secondMenu)는 삭제 */
      if (secondMenuOpen) {
        secondMenu.classList.remove("active");
        secondMenu.style.maxHeight = "0";
        /* 닫혀있다면 -> 펼치기 */
      } else {
        secondMenu.classList.add("active");
        secondMenu.style.maxHeight = secondMenu.scrollHeight + "px";
      }
    });
  },
};
mobileSidebar.init();

/* ======================= tab menu( + accordion) ======================= */
const tabMenu = {
  init: function () {
    /* li 각 버튼을 불러옴 */
    const tab_button = document.querySelectorAll(".brand-tab-menu li");
    /* 전체 tab을 불러옴 */
    const tab_content = document.querySelectorAll(".brand-tab");

    /* 클릭 이벤트 */
    tab_button.forEach((button) => {
      /* 일단 버튼을 누를 때마다 모든 active 제거 */
      button.addEventListener("click", function (e) {
        e.preventDefault(); /* a의 기본 동작 막음. 안전 장치 */

        /* [1] 전체 리셋 */
        tab_button.forEach((btn) => {
          btn.classList.remove("active");
        });
        tab_content.forEach((content) => {
          content.classList.remove("active");
        });

        /* [2] ★ 클릭한 버튼(this)에만 active 추가 */
        this.classList.add("active");

        /* [3] data-alt 연결, 탭 활성화 */
        const tabBtn = this.getAttribute("data-alt");
        /* tab1, tab2(id)...에 active 추가 */
        document.getElementById(tabBtn).classList.add("active");

        /* ----------- 처음 버튼을 누르면 전부 다 불러와야 함 ------------ */
        /* 이건 로드할 때랑 다르게 '클릭'이벤트라 로드 이벤트랑 이 이벤트랑 동시에 2개가 존재해야 하는 게 맞음. */
        /* 여긴 이미 active가 추가된 이후 시점이므로 옵셔널 체이닝으로 거를 필요가 없음. */
        if (tabBtn === "brand-tab1") {
          tab_content.forEach((content) => {
            content.classList.add("active");
          });
        }

        /* === 아코디언 테스트 (모바일) === */
        /* 현재 이건 ul를 열고 닫는 형태의 슬라이드라 foreach를 안 거침. */
        /* parentElement로 부모 통째를 열고 닫으면, 각자 관리를 안 해도 됨. */
        /* 나머지 클래스를 지우고, 선택한 것만 추가하는 건 이미 되어 있음 */
        if (window.innerWidth < 1024) {
          this.parentElement.classList.toggle("active");
        }
      });
    });

    /* load 이벤트(순서 중요) */
    const activeTab = document.querySelector(".brand-tab-menu li.active");
    const allTab = activeTab?.getAttribute("data-alt");
    /* 옵셔널 체이닝(?.): 조건에 있는게 없어도 오류 내지 말고 넘어갈 것(active가 보장된 click이벤트와 달리 load로 바로 접근하니 해당 active 값이 없을 수도 있음) */
    /* 현재 처음 화면에서 활성화된 탭이 탭1이라면, 나머지도 전부 활성화 -> 모든 탭을 열어라 */
    if (allTab === "brand-tab1") {
      tab_content.forEach((content) => {
        content.classList.add("active");
      });
    }
  },
};
/* 이미지가 다 로드되고 나서 실행(onload) */
window.addEventListener("load", () => {
  tabMenu.init();
});

/* ======================= top button test ===================== */
const gotoTop = {
  init: function () {
    const topbtn = document.querySelector(".top-btn");
    if (!topbtn) return; /* top 버튼 다 넣고나서 지울 것 */
    topbtn.addEventListener("click", () => {
      window.scrollTo(0, 0);
    });
    window.addEventListener("scroll", () => {
      if (window.scrollY > 450) {
        topbtn.style.opacity = "1";
        topbtn.style.visibility = "visible";
      } else {
        topbtn.style.opacity = "0";
        topbtn.style.visibility = "hidden";
      }
    });
  },
};
gotoTop.init();
