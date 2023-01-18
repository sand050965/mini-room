// import Video from "./video.js";
// const video = new Video();
let audioAuth = false;
let videoAuth = false;
const myVideo = document.createElement("video");
myVideo.muted = true;
const modalContainer = document.querySelector("#modalContainer");
const modal = new bootstrap.Modal(modalContainer);
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

// Init App
const init = () => {
  // AOS
  AOS.init();

  // Hide Modal
  modal.hide();

  // User Stream
  getUserStream();

  if (ACTION === "start") {
    title.textContent = "Start The Meeting";
    subtitle.textContent = "Ready to start this meeting ?";
  } else {
    title.textContent = "Join This Meeting";
    subtitle.textContent = "Ready to join this meeting ?";
  }
};

const getUserStream = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    
    audioAuth = true;
    videoAuth = true;
    addStream(myVideo, stream);
  } catch (e) {
    audioAuth = false;
    videoAuth = false;
    closeAudioStream();
    closeVideoStream();
  }
};

const addStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoContainer.appendChild(video);
  openAudioStream();
  openVideoStream();
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
      if (audioBtn.classList.contains("fa-microphone-slash")) {
        openAudioStream();
      } else {
        closeAudioStream();
      }
      break;
    case "videoBtn":
      if (videoBtn.classList.contains("fa-video-slash")) {
        openVideoStream();
      } else {
        closeVideoStream();
      }
      break;
  }
};

const openAudioStream = () => {
  audioBtn.classList.add("fa-microphone");
  audioBtn.classList.remove("fa-microphone-slash");
  audioBtn.classList.remove("disable");
};

const closeAudioStream = () => {
  audioBtn.classList.remove("fa-microphone");
  audioBtn.classList.add("fa-microphone-slash");
  audioBtn.classList.add("disable");
};

const openVideoStream = () => {
  videoContainer.classList.remove("none");
  avatarContainer.classList.add("none");
  videoBtn.classList.remove("fa-video-slash");
  videoBtn.classList.remove("disable");
  videoBtn.classList.add("fa-video");
};

const closeVideoStream = () => {
  videoContainer.classList.add("none");
  avatarContainer.classList.remove("none");
  videoBtn.classList.remove("fa-video");
  videoBtn.classList.add("fa-video-slash");
  videoBtn.classList.add("disable");
};

const displayName = (e) => {
  if (e.target.value === "") {
    participantName.textContent = User;
    return;
  }
  participantName.textContent = e.target.value;
};

const confirmState = () => {
  const data = {};
  window.location = `/${ROOM_ID}`;
};

window.addEventListener("load", init);

for (const btn of btnsArray) {
  btn.addEventListener("click", btnControl);
}

nameInput.addEventListener("keydown", displayName);

confirmBtn.addEventListener("click", confirmState);
