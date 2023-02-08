class OffcanvasMod {
  constructor() {}

  toggleOffcanvas = (offcanvasDOMElement) => {
    const btnId = offcanvasDOMElement.btnId;
    const tagetBsOffcanvas = offcanvasDOMElement.tagetBsOffcanvas;

    for (const bsOffcanvas of bsOffcanvasArray) {
      if (bsOffcanvas === tagetBsOffcanvas) {
        continue;
      }
      bsOffcanvas.hide();
    }
    if (offcanvasMap.get("isOpen") !== btnId) {
      isOffcanvasOpen = false;
    }

    for (const sideBtnIcon of sideBtnIconsArray) {
      sideBtnIcon.classList.remove("side-btn-clicked");
    }

    if (isOffcanvasOpen) {
      tagetBsOffcanvas.hide();
      this.offcanvasCloseControl(offcanvasDOMElement);
      this.offcanvasCloseGrid();
    } else {
      tagetBsOffcanvas.show();
      this.offcanvasOpenControl(offcanvasDOMElement);
      this.offcanvasOpenGrid(offcanvasDOMElement);
    }
  };

  offcanvasCloseControl = (offcanvasDOMElement) => {
    const targetBtn = document.querySelector(
      `#${offcanvasDOMElement.btnId}Icon`
    );
    const selfVideoItemContainer = document.querySelector(
      "#selfVideoItemContainer"
    );

    targetBtn.classList.remove("side-btn-clicked");
    selfVideoItemContainer.classList.remove("offcanvas-open");
  };

  offcanvasOpenControl = (offcanvasDOMElement) => {
    const targetBtn = document.querySelector(
      `#${offcanvasDOMElement.btnId}Icon`
    );
    targetBtn.classList.add("side-btn-clicked");
  };

  offcanvasOpenGrid = (offcanvasDOMElement) => {
    const btnId = offcanvasDOMElement.btnId;
    const mainContainer = document.querySelector("#mainContainer");

    if (isScreenSharing) {
      mainContainer.classList.remove("main-middle");
      mainContainer.classList.remove("main-left-middle");
      mainContainer.classList.remove("main-middle-right");
      mainContainer.classList.add("main-left-middle-right");
    } else {
      if (cnt === 2) {
        selfVideoItemContainer.classList.add("offcanvas-open");
      }
      mainContainer.classList.remove("main-middle");
      mainContainer.classList.remove("main-left-middle");
      mainContainer.classList.add("main-middle-right");
      mainContainer.classList.remove("main-left-middle-right");
    }
    isOffcanvasOpen = true;
    offcanvasMap.set("isOpen", btnId);
  };

  offcanvasCloseGrid = () => {
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
    isOffcanvasOpen = false;
    offcanvasMap.clear();
  };
}

export default OffcanvasMod;
