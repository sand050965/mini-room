import { initAOS, preload, displayModal } from "../modules/commonMod.js";
import StreamMod from "../modules/streamMod.js";
const socket = io("/");
const peer = new Peer(undefined, {
  host: "triptaipei.online",
  port: 443,
  secure: true,
});
const streamMod = new StreamMod();

let userId;
let isPermissionDenied = true;
let isMuted = false;
let isStoppedVideo = false;
let myStream = null;
const videoContainer = document.querySelector("#videoContainer");
const avatarContainer = document.querySelector("#avatarContainer");
const title = document.querySelector("#title");
const subtitle = document.querySelector("#subtitle");
const audioBtn = document.querySelector("#audioBtn");
const audioBtnIcon = document.querySelector("#audioBtnIcon");
const videoBtn = document.querySelector("#videoBtn");
const videoBtnIcon = document.querySelector("#videoBtnIcon");
const btnsArray = [videoBtn, audioBtn];
const userName = document.querySelector("#userName");
const nameInput = document.querySelector("#nameInput");
const confirmBtn = document.querySelector("#confirmBtn");
const DOMElement = {
  type: "premeeting",
  audioBtn: audioBtn,
  audioBtnIcon: audioBtnIcon,
  videoContainer: videoContainer,
  avatarContainer: avatarContainer,
  videoBtn: videoBtn,
  videoBtnIcon: videoBtnIcon,
};

/**
 * Peer JS
 */
peer.on("open", (id) => {
  userId = id;
  userName.innerHTML = `${userId}`;
});

// =================================================================

/**
 * Init App
 */
const init = async () => {
  const myVideo = document.createElement("video");
  myVideo.muted = true;
  DOMElement.video = myVideo;

  // Get User Stream
  await getStream();

  // Join Or Start Meeting
  if (ACTION === "start") {
    title.textContent = "Start The Meeting";
    subtitle.textContent = "Ready to start this meeting ?";
  } else {
    title.textContent = "Join This Meeting";
    subtitle.textContent = "Ready to join this meeting ?";
  }
};

/**
 * Get Video and Audio Stream
 */
const getStream = async () => {
  try {
    myStream = await streamMod.getUserMediaStream();
    DOMElement.stream = myStream;
    displayAlert(true);
    isPermissionDenied = false;
    addStream(DOMElement);
  } catch (e) {
    console.log(e);
    preload();
    displayAlert(false);
    isPermissionDenied = true;
    isMuted = streamMod.mute(DOMElement);
    isStoppedVideo = video.stopVideo(DOMElement);
  }
};

/**
 * Add Video and Audio Stream
 */
const addStream = (DOMElement) => {
  const videoContainer = DOMElement.videoContainer;
  const video = DOMElement.video;
  const stream = DOMElement.stream;
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", async () => {
    await video.play();
    preload();
  });

  videoContainer.appendChild(video);
  isMuted = streamMod.unmute(DOMElement);
  isStoppedVideo = streamMod.playVideo(DOMElement);
};

/**
 * Hotkeys Control
 */
const hotKeysControl = (e) => {
  if (e.which === 13) {
    e.preventDefault();
    confirmState();
  }
};

/**
 * Buttons Control
 */
const btnControl = (e) => {
  displayModal(isPermissionDenied);

  if (e.target.id.includes("audioBtn")) {
    isMuted = streamMod.muteUnmute(DOMElement);
  } else if (e.target.id.includes("videoBtn")) {
    isStoppedVideo = streamMod.playStopVideo(DOMElement);
  }
};

/**
 * Display Alert
 */
const displayAlert = (isSuccess) => {
  const failedAlert = document.querySelector("#FailedAlert");
  const successAlert = document.querySelector("#SuccessAlert");
  if (isSuccess) {
    successAlert.classList.remove("none");
    successAlert.setAttribute("data-aos", "fade-up");
    failedAlert.classList.add("none");
    initAOS(AOS);
  } else {
    failedAlert.classList.remove("none");
    failedAlert.setAttribute("data-aos", "fade-up");
    successAlert.classList.add("none");
    initAOS(AOS);
  }
};

/**
 * Display Name
 */
const displayName = (e) => {
  if (e.target.value === "") {
    userName.textContent = `${userId}`;
    return;
  }
  userName.textContent = e.target.value;
};

/**
 * Confirm State
 */
const confirmState = async () => {
  displayModal(isPermissionDenied);

  const data = {
    userId: userId,
    userName: userName.textContent.trim(),
    roomId: ROOM_ID.toString(),
    isMuted: isMuted,
    isStoppedVideo: isStoppedVideo,
    isReadyState: true,
  };

  const postData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch("/api/premeeting/ready", postData);
  const result = await response.json();
  if (result.ok) {
    window.location = `/${ROOM_ID}`;
  }
};

// ========================== Event Listeners ==========================

window.addEventListener("load", init);

window.addEventListener("keydown", hotKeysControl);

for (const btn of btnsArray) {
  btn.addEventListener("click", btnControl);
}

nameInput.addEventListener("keyup", displayName);

confirmBtn.addEventListener("click", confirmState);
