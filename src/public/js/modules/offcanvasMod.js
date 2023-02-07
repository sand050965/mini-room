class OffcanvasMod {
  constructor() {}

  toggleOffCanvas = (offCanvasDOMElement) => {
    let targetBtn;
    const tagetSideBar = offCanvasDOMElement.tagetSideBar;
    const tagetBsOffcanvas = offCanvasDOMElement.tagetBsOffcanvas;
    const btnId = offCanvasDOMElement.btnId;
    const selfVideoItemContainer = document.querySelector(
      "#selfVideoItemContainer"
    );

    if (btnId.includes("Icon")) {
      targetBtn = document.querySelector(`#${btnId}`);
    } else {
      targetBtn = document.querySelector(`#${btnId}Icon`);
    }

    const mainContainer = document.querySelector("#mainContainer");

    for (const bsOffcanvas of bsOffcanvasArray) {
      if (bsOffcanvas === tagetBsOffcanvas) {
        continue;
      }
      bsOffcanvas.hide();
      isOffCanvasOpen = false;
    }

    for (const sideBtnIcon of sideBtnIconsArray) {
      sideBtnIcon.classList.remove("btn-clicked");
    }

    if (isOffCanvasOpen) {
      tagetBsOffcanvas.hide();
      targetBtn.classList.remove("btn-clicked");
      selfVideoItemContainer.classList.remove("offcanvas-open");
      this.offCanvasCloseGrid();
      isOffCanvasOpen = false;
    } else {
      tagetBsOffcanvas.show();
      targetBtn.classList.add("btn-clicked");
      this.offCanvasOpenGrid();
      isOffCanvasOpen = true;
    }
  };

  offCanvasOpenGrid = () => {
    const mainContainer = document.querySelector("#mainContainer");
    if (isScreenSharing) {
      mainContainer.classList.remove("main-middle");
      mainContainer.classList.remove("main-left-middle");
      mainContainer.classList.remove("main-middle-right");
      mainContainer.classList.add("main-left-middle-right");
    } else {
      if (cnt === 2) selfVideoItemContainer.classList.add("offcanvas-open");
      mainContainer.classList.remove("main-middle");
      mainContainer.classList.remove("main-left-middle");
      mainContainer.classList.add("main-middle-right");
      mainContainer.classList.remove("main-left-middle-right");
    }
  };

  offCanvasCloseGrid = () => {
    const mainContainer = document.querySelector("#mainContainer");
    if (isScreenSharing) {
      mainContainer.classList.remove("main-middle");
      mainContainer.classList.add("main-left-middle");
      mainContainer.classList.remove("main-middle-right");
      mainContainer.classList.remove("main-left-middle-right");
    } else {
      mainContainer.classList.add("main-middle");
      mainContainer.classList.remove("main-left-middle");
      mainContainer.classList.remove("main-middle-right");
      mainContainer.classList.remove("main-left-middle-right");
    }
  };
}

export default OffcanvasMod;
