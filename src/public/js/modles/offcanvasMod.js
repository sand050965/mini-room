class OffcanvasMod {
  constructor() {}

  toggleOffcanvas = async (offcanvasDOMElement) => {
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
      await this.offcanvasCloseControl(offcanvasDOMElement);
      await this.offcanvasCloseGrid();
      isOffcanvasOpen = false;
      offcanvasMap.clear();
    } else {
      tagetBsOffcanvas.show();
      await this.offcanvasOpenControl(offcanvasDOMElement);
      await this.offcanvasOpenGrid();
      isOffcanvasOpen = true;
      offcanvasMap.set("isOpen", btnId);
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

  offcanvasOpenGrid = () => {
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
  };
}

export default OffcanvasMod;
