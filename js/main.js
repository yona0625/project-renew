/* header(모바일~타블렛) 테스트 */
/* 1. 만약에 trigger를 누르면, all-menu가 나와야 함. 
2. all-menu는 exit-btn을 누르기 전까지 유지가 되어야 함.
3. all-menu 바깥 영역을 터치해도 메뉴가 접혀야 함. */

/* 변수 불러오기 */
const mobileMenu = document.querySelector(".all-menu");
/* ---- 모바일~타블렛 헤더 ---- */
window.addEventListener("click", (e) => {
  /* 모바일 전용 */
  if (window.innerWidth > 1023) return;
  /* 그냥 클릭만 하는 경우에는 click만 써도 되는데, if로 경우를 볼 때는 두 번째 인자(e)가 필요함. */
  /* 1. 메뉴 열기: trigger가 눌렸을 때 */
  /* closest을 사용한 변수 불러오기 */
  /* (열릴 때) - trigger: trigger 하위 span들을 눌러도 열려야 함
  (닫힐 때) - all-menu: all-menu안의 자식들도 전부 포함(껍데기 뿐만 아니라 내용도)
  - exit-btn: exit-btn를 쿼리 셀렉터로 불러오면 닫을 때 그냥 exit-btn이 존재하기만 해도 성립되기 때문에 closest으로 정말 클릭했는지 분간해야 함. */
  const trigger = e.target.closest(".trigger");
  const realMenu = e.target.closest(".all-menu");
  const exitBtn = e.target.closest(".exit-btn");
  const menuOpen = mobileMenu.classList.contains("active");
  if (trigger) {
    /* 원래 transition으로 했는데, 리사이징 할 때마다 transition이 발생해서 방법을 변경 -> css에서 transition을 삭제하고 js에서 animate로 조정 */
    mobileMenu.classList.add("active");
    mobileMenu.animate([
      {
        right: '-100%'
      },
      {
        right: 0
      }
    ], {
      duration: 500,
      easing: 'ease-out',
      /* 애니메이션이 종료된 시점을 fill로 고정(안하면, -300px로 다시 날아감) */
      fill: 'forwards'
    })
  } else if (menuOpen && (exitBtn || !realMenu)) {
  /* 2. 메뉴 닫기 */
  /* (1) x 버튼을 누르거나, 전체 메뉴 바깥을 누르면 닫힘 */
  /* (2) 오직 창이 열렸을 때만 닫힌다는 조건을 넣어줘야 함. 그게 없으면 창이 열려있든 닫혀있든 계속 remove(active)를 하고 있는 상태. 창이 열려 있느냐?(&&) 그렇다면 뒤를 수행, 아니면 안 함. */
    mobileMenu.classList.remove("active");
    mobileMenu.animate([
      {
        right: 0
      },
      {
        right: '-100%'
      }
    ], {
      duration: 500,
      easing: 'ease-out',
      fill: 'forwards'
    })
  }
});

/* 탭 메뉴 테스트 */
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
    if (window.innerWidth < 767) {
      this.parentElement.classList.toggle("active");
    }
  });
});
