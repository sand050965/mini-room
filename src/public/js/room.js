const socket = io("/");
let myStream;
let cnt = 1;
let peers = {};
let msgScrollTop;
const myVideo = document.createElement("video");
myVideo.muted = true;
const videoContainer = document.querySelector("#videoContainer");
const audioBtn = document.querySelector("#audioBtn");
const audioBtnIcon = document.querySelector("#audioBtnIcon");
const videoBtn = document.querySelector("#videoBtn");
const videoBtnIcon = document.querySelector("#videoBtnIcon");
const shareBtn = document.querySelector("#shareBtn");
const infoBtn = document.querySelector("#infoBtn");
const participantBtn = document.querySelector("#participantBtn");
const chatBtn = document.querySelector("#chatBtn");
const sendMsgBtn = document.querySelector("#sendMsgBtn");
const infoOffcanvas = document.querySelector("#infoOffcanvas");
const BsInfoOffcanvas = new bootstrap.Offcanvas(infoOffcanvas);
const participantOffcanvas = document.querySelector("#participantOfcanvas");
const BsParticipantOffcanvas = new bootstrap.Offcanvas(participantOffcanvas);
const chatOffcanvas = document.querySelector("#chatOffcanvas");
const BsChatOffcanvas = new bootstrap.Offcanvas(chatOffcanvas);
const messageInput = document.querySelector("#messageInput");
const btnsArray = [
  videoBtn,
  audioBtn,
  shareBtn,
  infoBtn,
  participantBtn,
  chatBtn,
  sendMsgBtn,
];

const sideBtnIconsArray = [infoBtnIcon, participantBtnIcon, chatBtnIcon];

const bsOffcanvasArray = [
  BsInfoOffcanvas,
  BsParticipantOffcanvas,
  BsChatOffcanvas,
];

const init = async () => {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const videoItem = document.createElement("div");
    addStream(myVideo, myStream, videoItem, "You");
  } catch (e) {}
};

const getRoomInfo = async () => {
  const response = await fetch(`/room/${ROOM_ID}`);
  const result = await response.json();
  cnt = result.data.length;
};

const videoGridStyle = (item, video) => {
  if (cnt === 1) {
    item.classList.add("item");
    item.classList.add("one-video-container");
    item.setAttribute("id", "firstVideoItem");
    video.classList.add("one-video");
    video.classList.add("video-rotate");
    video.setAttribute("id", "firstVideo");
  } else if (cnt === 2) {
    const firstVideoItem = document.querySelector("#firstVideoItem");
    const firstVideo = document.querySelector("#firstVideo");
    item.classList.add("item");
    firstVideoItem.classList.remove("one-video-container");
    firstVideoItem.classList.add("two-video-container");
    item.classList.add("one-video-container");
    item.setAttribute("id", "secondVideo");
    video.classList.add("one-video");
    video.classList.remove("one-video");
    video.classList.add("more-video");
  } else {
    const firstVideoItem = document.querySelector("#firstVideoItem");
    const secondVideoItem = document.querySelector("#secondVideoItem");
    firstVideoItem.classList.remove("two-video-container");
    secondVideoItem.classList.remove("one-video-container");
    item.classList.add("item");
    item.classList.add("more-video-grid");
    video.classList.add("more-video");
  }
};

const btnControl = (e) => {
  // Modal Display
  // if (!audioAuth) {
  //   modal.show();
  //   return;
  // } else if (!videoAuth) {
  //   modal.show();
  //   return;
  // }
  if (e.target.id.includes("audioBtn")) {
    muteUnmute();
  } else if (e.target.id.includes("videoBtn")) {
    playStopVideo();
  } else if (e.target.id.includes("shareBtn")) {
  } else if (e.target.id.includes("leaveBtn")) {
  } else if (e.target.id.includes("infoBtn")) {
    toggleSideBar(infoOffcanvas, BsInfoOffcanvas, e.target.id);
  } else if (e.target.id.includes("participantBtn")) {
    toggleSideBar(participantOffcanvas, BsParticipantOffcanvas, e.target.id);
  } else if (e.target.id.includes("chatBtn")) {
    toggleSideBar(chatOffcanvas, BsChatOffcanvas, e.target.id);
  } else if (e.target.id.includes("sendMsgBtn")) {
    sendMessage();
  }
};

const keydowControl = (e) => {
  if (e.which === 13) {
    e.preventDefault();
    sendMessage();
  }
};

const sendMsgControl = (e) => {
  if (e.target.value.trim().length === 0) {
    sendMsgBtn.classList.remove("send-msg-btn-able");
  } else {
    sendMsgBtn.classList.add("send-msg-btn-able");
  }
};

// Mute and Unmute
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

const unmute = () => {
  audioBtnIcon.classList.add("fa-microphone");
  audioBtnIcon.classList.remove("fa-microphone-slash");
  audioBtn.classList.remove("btn-disable");
  audioBtn.classList.add("btn-able");
};

const mute = () => {
  audioBtnIcon.classList.remove("fa-microphone");
  audioBtnIcon.classList.add("fa-microphone-slash");
  audioBtn.classList.remove("btn-able");
  audioBtn.classList.add("btn-disable");
};

// Play and Stop Video
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

const playVideo = () => {
  videoContainer.classList.remove("none");
  // avatarContainer.classList.add("none");
  videoBtnIcon.classList.remove("fa-video-slash");
  videoBtnIcon.classList.add("fa-video");
  videoBtn.classList.remove("btn-disable");
  videoBtn.classList.add("btn-able");
};

const stopVideo = () => {
  videoContainer.classList.add("none");
  // avatarContainer.classList.remove("none");
  videoBtnIcon.classList.remove("fa-video");
  videoBtnIcon.classList.add("fa-video-slash");
  videoBtn.classList.remove("btn-able");
  videoBtn.classList.add("btn-disable");
};

const toggleSideBar = (tagetSideBar, tagetBsOffcanvas, btnId) => {
  let targetBtn;
  if (btnId.includes("Icon")) {
    targetBtn = document.querySelector(`#${btnId}`);
  } else {
    targetBtn = document.querySelector(`#${btnId}Icon`);
  }

  const mainContainer = document.querySelector("#mainContainer");

  for (const bsOffcanvas of bsOffcanvasArray) {
    if (bsOffcanvas === tagetBsOffcanvas) {
      continue;
    }
    bsOffcanvas.hide();
  }

  for (const sideBtnIcon of sideBtnIconsArray) {
    sideBtnIcon.classList.remove("side-btn-clicked");
  }

  if (tagetSideBar.classList.contains("show")) {
    tagetBsOffcanvas.hide();
    mainContainer.classList.remove("main-container-grid");
    targetBtn.classList.remove("side-btn-clicked");
  } else {
    tagetBsOffcanvas.show();
    mainContainer.classList.add("main-container-grid");
    targetBtn.classList.add("side-btn-clicked");
  }
};

const addStream = (video, stream, item, userName) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  item.appendChild(video);
  item.classList.add("item");
  videoGridStyle(item, video);
  const nameTag = document.createElement("div");
  nameTag.textContent = userName;
  nameTag.classList.add("name-tag");
  item.appendChild(nameTag);
  videoContainer.append(item);
};

const displayMessage = (message, userId, userName) => {
  if (userId === USER_ID) {
    userName = "You";
  }
  const messageContainer = document.querySelector("#messageContainer");
  const messageContent = document.createElement("div");
  const messageSender = document.createElement("b");
  const br = document.createElement("br");
  const mainMessage = document.createElement("div");
  messageSender.textContent = userName;
  mainMessage.textContent = message;
  messageContent.appendChild(messageSender);
  messageContent.appendChild(br);
  messageContent.appendChild(mainMessage);
  messageContent.classList.add("message");
  messageContainer.appendChild(messageContent);
};

const scrollToBottom = () => {
  const messageContainer = document.querySelector("#messageContainer");
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Socket IO & Peer JS
const peer = new Peer(USER_ID, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, USER_NAME);
});

// Receive Other User's Stream (Listen to one we get call)
peer.on("call", (call) => {
  // Answer call
  call.answer(myStream);
  peers[call.peer] = call;

  // Respond to stream that comes in
  const videoItem = document.createElement("div");
  const video = document.createElement("video");
  call.on("stream", async (userVideoStream) => {
    await getRoomInfo();
    addStream(video, userVideoStream, videoItem, "Aloha");
  });
});

// new user connected
socket.on("user-connected", async (userId, userName) => {
  await getRoomInfo();
  connectToNewUser(userId, userName, myStream);
});

// create message
socket.on("create-message", (message, userId, userName) => {
  displayMessage(message, userId, userName);
  scrollToBottom();
});

// user disconnected
socket.on("user-disconnected", async (userId) => {
  if (peers[userId]) {
    peers[userId].close();
  }
});

const sendMessage = () => {
  const messageInput = document.querySelector("#messageInput");
  const message = messageInput.value.trim();
  if (message.length !== 0) {
    socket.emit("message", message);
    messageInput.value = "";
  }
};

// // Make Call
const connectToNewUser = (userId, userName, stream) => {
  const call = peer.call(userId, stream);
  const videoItem = document.createElement("div");
  const video = document.createElement("video");

  // Receive Other User's Stream (Listen to someone try to call us)
  call.on("stream", async (userVideoStream) => {
    await getRoomInfo();
    addStream(video, userVideoStream, videoItem, userName);
  });

  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
};

window.addEventListener("load", init);

window.addEventListener("keydown", keydowControl);

messageInput.addEventListener("keyup", sendMsgControl);

for (const btn of btnsArray) {
  btn.addEventListener("click", btnControl);
}
