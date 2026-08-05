import { initSwipers } from './swiper.js';
const isPC = () => window.innerWidth >= 1024;

/* === animation === */
const NAV_ANIMATION = {
  OPTIONS: {
    duration: 300,
    easing: "ease-out",
    fill: "forwards",
  },
  cancel: (target) => {
    if (target) target.getAnimations().forEach((anim) => anim.cancel());
  },
};

/* === #none 이동 방지 === */
function preventMoveTop() {
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest('a[href="#none"]');
    if (anchor) e.preventDefault();
  });
}


/* === nav === */
/* ~tablet */
const mobileNav = {
  resetForPC: function () {
    const mobileMenu = document.querySelector(".all-menu");
    const mobileSubMenu = document.querySelectorAll(".second-menu");

    if (!mobileMenu) return;

    /* reset */
    mobileMenu.classList.remove("active");
    mobileMenu.style.transform = "";
    document.body.style.overflow = "";
    NAV_ANIMATION.cancel(mobileMenu);

    mobileSubMenu.forEach((sub) => {
      NAV_ANIMATION.cancel(sub);
      sub.style.maxHeight = "";
    });
  },

  init: function () {
    const mobileMenu = document.querySelector(".all-menu");

    /* resize */
    window.addEventListener("resize", () => {
      /* 모바일 ~ 타블렛 로직 리셋 */
      if (isPC()) {
        this.resetForPC();
      }
    });

    window.addEventListener("click", (e) => {
      if (isPC()) return;
      /* 모바일 ~ 타블렛 */
      const trigger = e.target.closest(".trigger");
      const menuArea = e.target.closest(".all-menu");
      const exitBtn = e.target.closest(".exit-btn");
      const menuOpen = mobileMenu.classList.contains("active");

      if (trigger) {
        mobileMenu.classList.add("active");
        openMenu();
      } else if (menuOpen && (exitBtn || !menuArea)) {
        mobileMenu.classList.remove("active");
        closeMenu();
      }
      function openMenu() {
        /* no scroll */
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
          NAV_ANIMATION.OPTIONS,
        );
        openFix.onfinish = () => {
          NAV_ANIMATION.cancel(mobileMenu);
        };
      }
      function closeMenu() {
        /* no scroll */
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
          NAV_ANIMATION.OPTIONS,
        );
        closeFix.onfinish = () => {
          mobileMenu.classList.remove("active");
          NAV_ANIMATION.cancel(mobileMenu);
        };
      }
    });
  },
};
/* PC */
const pcNav = {
  init: function () {
    const pcNav = document.querySelectorAll("nav li");
    const pcAllMenu = document.querySelector(".all-menu");

    /* reset */
    const resetAnimation = () => {
      NAV_ANIMATION.cancel(pcAllMenu);
    };

    const pcHeader = document.querySelector("header");

    pcNav.forEach((item) => {
      item.addEventListener("mouseenter", function () {

        if (!isPC()) {
          return;
        }
        /* 순서 중요 */
        resetAnimation();
        function openMenu() {
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
            NAV_ANIMATION.OPTIONS,
          );
        }
        openMenu();
      });
    });
    pcHeader.addEventListener("mouseleave", function () {
      if (!isPC()) return;
      function closeMenu() {
        const closeFix = pcAllMenu.animate(
          [
            {
              opacity: "1",
            },
            {
              opacity: "0",
            },
          ],
          NAV_ANIMATION.OPTIONS,
        );
        closeFix.onfinish = () => {
          pcAllMenu.classList.remove("active");
          resetAnimation();
        };
      }
      closeMenu();
    });
  },
};

/* === sidebar(mobile) === */
const mobileSidebar = {
  init: function () {
    const firstMenuContainer = document.querySelector(".first-menu");

    firstMenuContainer.addEventListener("click", (e) => {
      if (isPC()) return;

      const firstMenu = e.target.closest(".first-menu > li");
      const secondMenu = firstMenu?.querySelector(".second-menu");

      if (e.target.closest(".second-menu") || !firstMenu || !secondMenu) return;
      const secondMenuOpen = secondMenu.classList.contains("active");

      if (secondMenuOpen) {
        secondMenu.classList.remove("active");
        secondMenu.style.maxHeight = "0";
      } else {
        secondMenu.classList.add("active");
        secondMenu.style.maxHeight = secondMenu.scrollHeight + "px";
      }
    });
  },
};

/* === tab menu( + accordion) === */
const tabMenu = {
  showAllTab: function (targetID, content) {
    if (targetID == "brand-tab1") {
      content.forEach((item) => {
        item.classList.add("active");
      });
    }
  },
  init: function () {
    const tab_button = document.querySelectorAll(".brand-tab-menu li");
    const tab_content = document.querySelectorAll(".brand-tab");

    tab_button.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        /* reset */
        document
          .querySelectorAll(".brand-tab-menu li.active, .brand-tab.active")
          .forEach((target) => target.classList.remove("active"));
        this.classList.add("active");

        /* tab active */
        const tabBtn = this.getAttribute("data-alt");
        document.getElementById(tabBtn).classList.add("active");

        /* all tab(click) */
        tabMenu.showAllTab(tabBtn, tab_content);

        /* accordion */

        if (!isPC()) {
          this.parentElement.classList.toggle("active");
        }
      });
    });

    /* all tab(load - 순서 중요)*/
    const activeTab = document.querySelector(".brand-tab-menu li.active");
    const allTab = activeTab?.getAttribute("data-alt");
    tabMenu.showAllTab(allTab, tab_content);
  },
};

/* === top button === */
const gotoTop = {
  init: function () {
    const topbtn = document.querySelector(".top-btn");
    if (!topbtn) return;

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

document.addEventListener("DOMContentLoaded", () => {
  initSwipers();
  preventMoveTop();
  mobileNav.init();
  pcNav.init();
  mobileSidebar.init();
  tabMenu.init();
  gotoTop.init();
});
