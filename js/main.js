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
      })
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
