// import Video from "./video.js";
// const video = new Video();
const socket = io("/");
const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

let userId;
let audioAuth = false;
let videoAuth = false;
let isMuted = false;
let isStoppedVideo = false;
let myStream = null;
let myVideoStream = null;
let myAudioStream = null;
const myVideo = document.createElement("video");
const modal = new bootstrap.Modal(document.querySelector("#modalContainer"));
const videoContainer = document.querySelector("#videoContainer");
const avatarContainer = document.querySelector("#avatarContainer");
const title = document.querySelector("#title");
const subtitle = document.querySelector("#subtitle");
const audioBtn = document.querySelector("#audioBtn");
const videoBtn = document.querySelector("#videoBtn");
const btnsArray = [videoBtn, audioBtn];
const participantName = document.querySelector("#participantName");
const nameInput = document.querySelector("#nameInput");
const confirmBtn = document.querySelector("#confirmBtn");

// Peer JS
peer.on("open", (id) => {
  userId = id;
  participantName.innerHTML = "User ID:<br/>" + `${userId}`;
});

// ============================

// Init App
const init = () => {
  myVideo.muted = true;

  // AOS
  AOS.init();

  // Hide Modal
  modal.hide();

  // Process User Stream
  processUserStream();

  if (ACTION === "start") {
    title.textContent = "Start The Meeting";
    subtitle.textContent = "Ready to start this meeting ?";
  } else {
    title.textContent = "Join This Meeting";
    subtitle.textContent = "Ready to join this meeting ?";
  }
};

// Process Video and Audio Stream
const processUserStream = async () => {
  await getStream();
  // await getAudioStream();
  // await getVideoStream();
};

// Get Stream
const getStream = async () => {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    audioAuth = true;
    videoAuth = true;
    addStream(myVideo, myStream);
  } catch (e) {
    audioAuth = false;
    videoAuth = false;
    mute();
    stopVideo();
  }
};

// Get Audio Stream
// const getAudioStream = async () => {
//   try {
//     myAudioStream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//     });
//     audioAuth = true;
//     videoAuth = true;
//   } catch (e) {
//     if (myAudioStream === undefined) {
//       audioAuth = false;
//       mute();
//     }
//   }
// };

// Get Video Stream
// const getVideoStream = async () => {
//   try {
//     myVideoStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//     });
//     videoAuth = true;
//   } catch (e) {
//     if (myVideoStream === undefined) {
//       videoAuth = false;
//       stopVideo();
//     }
//   }
// };

// Add Stream on HTML
const addStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoContainer.appendChild(video);
  unmute();
  playVideo();
};

const btnControl = (e) => {
  // Modal Display
  if (!audioAuth) {
    modal.show();
    return;
  } else if (!videoAuth) {
    modal.show();
    return;
  }

  switch (e.target.id) {
    case "audioBtn":
      muteUnmute();
      break;
    case "videoBtn":
      playStopVideo();
      break;
  }
};

const muteUnmute = () => {
  const enabled = myStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myStream.getAudioTracks()[0].enabled = false;
    mute();
  } else {
    myStream.getAudioTracks()[0].enabled = true;
    unmute();
  }
};

const playStopVideo = () => {
  const enabled = myStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myStream.getVideoTracks()[0].enabled = false;
    stopVideo();
  } else {
    myStream.getVideoTracks()[0].enabled = true;
    playVideo();
  }
};

const unmute = () => {
  isMuted = false;
  audioBtn.classList.add("fa-microphone");
  audioBtn.classList.remove("fa-microphone-slash");
  audioBtn.classList.remove("disable");
};

const mute = () => {
  isMuted = true;
  audioBtn.classList.remove("fa-microphone");
  audioBtn.classList.add("fa-microphone-slash");
  audioBtn.classList.add("disable");
};

const playVideo = () => {
  isStoppedVideo = false;
  videoContainer.classList.remove("none");
  avatarContainer.classList.add("none");
  videoBtn.classList.remove("fa-video-slash");
  videoBtn.classList.remove("disable");
  videoBtn.classList.add("fa-video");
};

const stopVideo = () => {
  isStoppedVideo = true;
  videoContainer.classList.add("none");
  avatarContainer.classList.remove("none");
  videoBtn.classList.remove("fa-video");
  videoBtn.classList.add("fa-video-slash");
  videoBtn.classList.add("disable");
};

const displayName = (e) => {
  if (e.target.value === "") {
    participantName.textContent = `User ID:\n${userId}`;
    return;
  }
  participantName.textContent = e.target.value;
};

const confirmState = async () => {
  if (!audioAuth && !videoAuth) {
    modal.show();
    return;
  }

  const data = {
    userId: userId,
    participantName: participantName.textContent.replace("User ID:", "").trim(),
    videoAuth: videoAuth,
    audioAuth: audioAuth,
    isMuted: isMuted,
    isStoppedVideo: isStoppedVideo,
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

window.addEventListener("load", init);

for (const btn of btnsArray) {
  btn.addEventListener("click", btnControl);
}

nameInput.addEventListener("keyup", displayName);

confirmBtn.addEventListener("click", confirmState);
