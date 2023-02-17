import CommonMod from "../modles/commonMod.js";
import UserMod from "../modles/userMod.js";
const roomCodeInput = document.querySelector("#roomCodeInput");
const startBtn = document.querySelector("#startBtn");
const joinBtn = document.querySelector("#joinBtn");

const commonMod = new CommonMod();
const userMod = new UserMod();

/**
 * Init App
 */
const init = async () => {
  await commonMod.initAOS(AOS);
  await userMod.initAuth();
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
  let roomId = roomCodeInput.value.trim();
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
  if (e.which === 13 && roomCodeInput.value.trim() !== "") {
    joinMeeting();
  }
};

window.addEventListener("load", init);
roomCodeInput.addEventListener("keydown", hotKeysControl);
roomCodeInput.addEventListener("focus", showDisableBtn);
roomCodeInput.addEventListener("blur", hideBtn);
roomCodeInput.addEventListener("keyup", showBtn);

startBtn.addEventListener("click", startMeeting);
joinBtn.addEventListener("click", joinMeeting);

document.querySelector("#userAuth").addEventListener("click", userMod.doAuth);
document.querySelector("#signUp").addEventListener("click", userMod.initSignUp);
document.querySelector("#login").addEventListener("click", userMod.initLogIn);
document.querySelector("#loginBtn").addEventListener("click", userMod.doLogIn);
document
  .querySelector("#signUpBtn")
  .addEventListener("click", userMod.doSignUp);
document
  .querySelector("#authStatus")
  .addEventListener("click", userMod.doLogOut);
document
  .querySelector("#username")
  .addEventListener("keyup", userMod.validateUsername);
document
  .querySelector("#email")
  .addEventListener("keyup", userMod.validateEmail);
document
  .querySelector("#password")
  .addEventListener("keyup", userMod.validatePassword);
