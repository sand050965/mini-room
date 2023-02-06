import { initAOS, preload } from "../utils/commonUtil.js";
const input = document.querySelector("input");
const startBtn = document.querySelector("#startBtn");
const joinBtn = document.querySelector("#joinBtn");

/**
 * Init App
 */
const init = () => {
  initAOS(AOS);
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
  const respone = await fetch(`/api/premeeting/start`);
  const result = await respone.json();
  const roomId = result.roomId;
  window.location = `/${roomId}`;
};

// join meeting
const joinMeeting = async () => {
  let roomId = input.value.trim();
  if (roomId.startsWith("miniroom.online")) {
    roomId = roomId.replace("miniroom.online/", "");
  }

  console.log(roomId);

  const data = { roomId: roomId };

  const postData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch("/api/premeeting/join", postData);
  const result = await response.json();
  if (result.ok) {
    window.location = `/${roomId}`;
  } else {
  }
};

window.addEventListener("load", init);

input.addEventListener("focus", showDisableBtn);
input.addEventListener("blur", hideBtn);
input.addEventListener("keyup", showBtn);

startBtn.addEventListener("click", startMeeting);
joinBtn.addEventListener("click", joinMeeting);
