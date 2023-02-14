import CommonMod from "../modules/commonMod.js";
const input = document.querySelector("input");
const startBtn = document.querySelector("#startBtn");
const joinBtn = document.querySelector("#joinBtn");

const commonMod = new CommonMod();

/**
 * Init App
 */
const init = () => {
  commonMod.initAOS(AOS);
};

// input button control
const showDisableBtn = () => {
  joinBtn.classList.remove("none");
};

const hideBtn = (e) => {
  if (e.target.value !== "") {
    return;
  }
  joinBtn.classList.add("none");
};

const showBtn = (e) => {
  switch (e.target.value.trim()) {
    case "":
      document.querySelector("#alert").classList.add("none");
      joinBtn.disabled = true;
      joinBtn.classList.add("disable");
      joinBtn.classList.remove("none");
      joinBtn.classList.remove("able");
      break;
    default:
      joinBtn.disabled = false;
      joinBtn.classList.remove("disable");
      joinBtn.classList.remove("none");
      joinBtn.classList.add("able");
      break;
  }
};

// start meeting
const startMeeting = async () => {
  // const data = { roomId: roomId };

  // const postData = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // };
  const respone = await fetch(`/api/room/start`);
  const result = await respone.json();
  const roomId = result.roomId;
  window.location = `/${roomId}`;
};

// join meeting
const joinMeeting = async () => {
  let roomId = input.value.trim();
  if (roomId.startsWith("https://")) {
    if (roomId.startsWith("miniroom.online")) {
      roomId = roomId.replace("https://miniroom.online/", "");
    } else {
      return;
    }
  } else if (roomId.startsWith("miniroom.online/")) {
    roomId = roomId.replace("miniroom.online/", "");
  }

  const response = await fetch(`/api/room/join?roomId=${roomId}`);
  const result = await response.json();
  if (result.ok) {
    window.location = `/${roomId}`;
  } else {
    document.querySelector("#alert").classList.remove("none");
  }
};

const hotKeysControl = (e) => {
  if (e.which === 13 && input.value.trim() !== "") {
    joinMeeting();
  }
};

window.addEventListener("load", init);
window.addEventListener("keydown", hotKeysControl);
input.addEventListener("focus", showDisableBtn);
input.addEventListener("blur", hideBtn);
input.addEventListener("keyup", showBtn);

startBtn.addEventListener("click", startMeeting);
joinBtn.addEventListener("click", joinMeeting);
