class RoomInfoMod {
  constructor() {}

  initInfo = () => {
    copyInfoBtnTooltip.hide();
    document.querySelector("#roomPath").value = window.location.href;
    document.querySelector("#meetingRoomId").textContent = ROOM_ID;
    this.displayRoomClock();
  };

  showTooltips = () => {
    copyInfoBtnTooltip.show();
  };

  hideTooltips = () => {
    copyInfoBtnTooltip.hide();
  };

  getDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return {
      y: year,
      m: month,
      d: day,
    };
  };

  getTime = () => {
    const date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let session = "AM";

    if (h === 0) {
      h = 12;
    }

    if (h > 12) {
      h = h - 12;
      session = "PM";
    }

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    return {
      h: h,
      m: m,
      s: s,
      session: session,
    };
  };

  displayRoomClock = async () => {
    const timeElement = await this.getTime();
    const time = `${timeElement.h}:${timeElement.m}:${timeElement.s} ${timeElement.session}`;
    document.querySelector("#clock").textContent = time;

    setTimeout(this.displayRoomClock, 1000);
  };
}

export default RoomInfoMod;
