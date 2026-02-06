/* ======================= nav ======================= */
/* --- 모바일~타블렛 --- */
const mobileNav = {
  init: function () {
    /* 변수 불러오기 */
    const mobileMenu = document.querySelector(".all-menu");
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
    /* PC 헤더 -> mouseenter, mouseleave로 바꿔야 함 */
    const pcMenu = document.querySelector(".all-menu");
    window.addEventListener("click", (e) => {
      /* pc 전용 */
      if (window.innerWidth < 1024) return;

      /* closest이 필요한 변수
      1. 각각 nav안의 li
      2. 전체 all-menu(이건 쿼리 셀렉터까지)
      3. all-menu 안의 x버튼 */
      const nav = e.target.closest("nav li");
      const realPcMenu = e.target.closest(".all-menu");
      const pcExitBtn = e.target.closest(".exit-btn");
      const pcMenuOpen = pcMenu.classList.contains("active");

      if (nav) {
        /* li를 클릭했을 때 이미 메뉴가 열려있다면 닫기 */
        /* + pc는 nav(모바일에서는 trigger)를 눌렀을 때 여기서 한 번 더 if-else가 필요하다. li를 누를 때도 창이 열려있는지 닫혀있는지 경우에 따라 토글해야 하므로 */
        if (pcMenuOpen) {
          closeMenu();
          /* 닫혀있을 때 열기 */
        } else {
          openMenu();
        }
        /* 닫을 때 */
      } else if (pcMenuOpen && (pcExitBtn || !realPcMenu)) {
        closeMenu();
      }
      /* 함수로 분리 */
      function openMenu() {
        pcMenu.classList.add("active");
        pcMenu.animate(
          [
            {
              opacity: "0",
            },
            {
              opacity: "1",
            },
          ],
          {
            duration: 500,
            easing: "ease-out",
            fill: "forwards",
          },
        );
      }
      function closeMenu() {
        /* - 만약 창이 열린 상태라면
        x버튼을 누르거나, 메뉴 바깥을 빠져나간다면 */
        const closeFix = pcMenu.animate(
          [
            {
              opacity: "1",
            },
            {
              opacity: "0",
            },
          ],
          {
            duration: 500,
            easing: "ease-out",
            fill: "forwards",
          },
        );
        /* onfinish가 필요한 이유는, li로 다시 열린 창을 닫을 때 animate로 닫히는 시간(0.5초)가 '지나고 나서야' 창이 닫혀야 하는데, 이게 없으면 바로 remove로 닫아버려서 닫힐 때 애니메이션 적용이 되지 않는다. onfinish는 animate가 다 끝날 때까지 기다렸다가 닫아주는 역할을 함. 
        구문도 () => 가 아니라 = () => 로 '='로 저장했다가 나중에 실행해야 함. */
        /* 따라서 remove active는 위가 아니라 여기 안에 들어간다. */
        closeFix.onfinish = () => {
          pcMenu.classList.remove("active");
          /* 마찬가지로 닫을 때 cancel */
          pcMenu.getAnimations().forEach((anim) => anim.cancel());
        };
      }
    });
  },
};
pcNav.init();

/* ================== sidebar(mobile) ================= */
const mobileSidebar = {
  init: function () {
    const firstMenuContainer = document.querySelector(".first-menu");
    const secondMenu = document.querySelectorAll(".second-menu li");

    /* 이벤트 위임으로 맨 상위로 잡음 */
    firstMenuContainer.addEventListener("click", (e) => {
      if (window.innerWidth > 1023) return;
      /* .first-menu를 위임했기에 li만 써도 됨(X) -> second-menu안에도 li가 있으므로 구분 지어야 함. -> 간단한 로직에서는 li로 foreach 접근해도 됨. */
      const firstMenu = e.target.closest(".first-menu > li");
      /* ★ e.target으로 찾으면 안 되는 이유: (구조상 문제) second-menu로 접근은 하겠지만, 지금 메뉴에서는 일부만 second-menu가 있기 때문에 second-menu가 없는 곳에는 에러가 남 -> 따라서 firstMenu로 시작해야 함. */
      const secondMenu = firstMenu.querySelector(".second-menu");
      /* 메뉴가 열려있는지 확인 필요 */
      const secondMenuOpen = secondMenu.classList.contains("active");
      /* 메뉴가 열려 있다면? */
      if (secondMenu) {
        /* 메뉴가 열려 있다면 -> 닫기 */
        if (secondMenuOpen) {
          secondMenu.classList.remove("active");
          secondMenu.style.maxHeight = "0";
          /* 닫혀있다면 -> 펼치기 */
        } else {
          secondMenu.classList.add("active");
          secondMenu.style.maxHeight = secondMenu.scrollHeight + "px";
        }
      }
    });
  },
};
mobileSidebar.init();

/* ======================= tab menu( + accordion) ======================= */
const tabMenu = {
  init: function () {
    /* li 각 버튼을 불러옴 */
    const tab_button = document.querySelectorAll(".brand-product-tab li");
    /* 전체 tab을 불러옴 */
    const tab_content = document.querySelectorAll(".tab");

    tab_button.forEach((button) => {
      /* [1] 일단 버튼을 누를 때마다 모든 active 제거 */
      button.addEventListener("click", function (e) {
        e.preventDefault(); /* a의 기본 동작 막음. 안전 장치 */

        /* 1. ★ 버튼(제이쿼리로 따지면, 형제 class를 다 지우는 거랑 비슷) */
        /* 전부 퇴장, 여러 개니까 foreach */
        tab_button.forEach((btn) => {
          btn.classList.remove("active");
        });

        /* 2. 내용 */
        /* 전부 퇴장, 여러 개니까 foreach */
        tab_content.forEach((content) => {
          content.classList.remove("active");
        });

        /* [2] ★ 클릭한 버튼(this)에만 active 추가 */
        /* 이 요소만 입장 */
        this.classList.add("active");

        /* [3] data-alt 연결, 탭 활성화 */
        const tabBtn = this.getAttribute("data-alt");
        /* tab1, tab2(id)...에 active 추가 */
        document.getElementById(tabBtn).classList.add("active");

        /* ----------- 처음 버튼을 누르면 전부 다 불러와야 함 ------------ */
        if (tabBtn === "tab1") {
          tab_content.forEach((content) => {
            content.classList.add("active");
          });
        }

        /* === 아코디언 테스트 === */
        /* 현재 이건 ul를 열고 닫는 형태의 슬라이드라 foreach를 안 거침. */
        /* parentElement로 부모 통째를 열고 닫으면, 각자 관리를 안 해도 됨. */
        /* 나머지 클래스를 지우고, 선택한 것만 추가하는 건 이미 되어 있음 */
        if (window.innerWidth < 1024) {
          this.parentElement.classList.toggle("active");
        }
      });
    });
  },
};
tabMenu.init();

/* ======================= top button test ===================== */
const gotoTop = {
  init: function () {
    const topbtn = document.querySelector(".top-btn");
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
