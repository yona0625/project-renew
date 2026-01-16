/* 탭 메뉴 테스트 */
  /* li 각 버튼을 불러옴 */
  const tab_button = document.querySelectorAll(".brand-product-tab li");
  /* 전체 tab을 불러옴 */
  const tab_content = document.querySelectorAll(".tab");

  tab_button.forEach((button) => {
    /* [1] 일단 버튼을 누를 때마다 모든 active 제거 */
    button.addEventListener("click", function(e) {
      e.preventDefault(); /* a의 기본 동작 막음. 안전 장치 */

      /* 1. 버튼(제이쿼리로 따지면, 형제 class를 다 지우는 거랑 비슷) */
      tab_button.forEach((btn)=> btn.classList.remove("active"));
      /* 2. 내용 */
      tab_content.forEach((content) => content.classList.remove("active"));

      /* [2] 클릭한 버튼(this)에만 active 추가 */
      this.classList.add("active");

      /* [3] data-alt 연결, 탭 활성화 */
      const tabBtn = this.getAttribute("data-alt");
      /* tab1, tab2(id)...에 active 추가 */
      document.getElementById(tabBtn).classList.add("active");
    });
  });
