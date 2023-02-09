class RoomInfoMod {
  constructor() {}

  initInfo = () => {
    copyInfoBtnTooltip.hide();
    const roomPath = document.querySelector("#roomPath");
    roomPath.value = window.location.href;
  };

  showTooltips = () => {
    copyInfoBtnTooltip.show();
  };

  hideTooltips = () => {
    copyInfoBtnTooltip.hide();
  };
}

export default RoomInfoMod;
