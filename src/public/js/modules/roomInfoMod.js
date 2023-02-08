class RoomInfoMod {
  constructor() {}

  initInfo = () => {
    const roomPath = document.querySelector("#roomPath");
    roomPath.textContent = window.location.href;
  };

  copyInfo = () => {
    const roomPath = document.querySelector("#roomPath");
    roomPath.select();
    roomPath.selectionRange(0, 99999999);
    navigator.clipboard.setText(roomPath.textContent);
  };
}

export default RoomInfoMod;
