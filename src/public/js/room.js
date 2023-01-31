import Video from "./video.js";
import { preload } from "./common.js";

const socket = io("/");
const video = new Video();
let myStream;
let cnt = 1;
let peers = {};
const myVideo = document.createElement("video");
myVideo.muted = true;
const videosContainer = document.querySelector("#videosContainer");
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

/**
 * Init App
 */
const init = async () => {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const videoItemContainer = document.createElement("div");
    const videoItem = document.createElement("div");
    const nameTag = document.createElement("div");
    await addStream(
      myVideo,
      myStream,
      videoItemContainer,
      videoItem,
      nameTag,
      "You",
      USER_ID
    );
  } catch (e) {
    console.log(e.message);
    preload();
  }
};

/**
 * Get Room Info
 */
const getRoomInfo = async () => {
  const response = await fetch(`/api/room/${ROOM_ID}`);
  const result = await response.json();
  cnt = result.data.length;
};

/**
 * Get User Info
 */
const getUserInfo = async (userId) => {
  const response = await fetch(`/api/room/${ROOM_ID}/${userId}`);
  const result = await response.json();
  return result;
};

/**
 * Button Control
 */
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
    video.muteUnmute(myStream, audioBtn, audioBtnIcon);
  } else if (e.target.id.includes("videoBtn")) {
    video.playStopVideo(myStream, videosContainer, videoBtn, videoBtnIcon);
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

/**
 * Keydow Control
 */
const keydowControl = (e) => {
  if (e.which === 13) {
    e.preventDefault();
    sendMessage();
  }
};

/**
 * Send Message Control
 */
const sendMsgControl = (e) => {
  if (e.target.value.trim().length === 0) {
    sendMsgBtn.classList.remove("send-msg-btn-able");
  } else {
    sendMsgBtn.classList.add("send-msg-btn-able");
  }
};

/**
 * Toggle Side Bar
 */
const toggleSideBar = (tagetSideBar, tagetBsOffcanvas, btnId) => {
  let targetBtn;
  const selfVideoItem = document.querySelector("#selfVideoItem");

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
    selfVideoItem.classList.remove("offcanvas-open");
  } else {
    tagetBsOffcanvas.show();
    mainContainer.classList.add("main-container-grid");
    targetBtn.classList.add("side-btn-clicked");
    if (cnt === 2) selfVideoItem.classList.add("offcanvas-open");
  }
};

/**
 * Video Grid Style
 */
const videoGridStyle = (itemContainer, item, video, userId) => {
  if (cnt === 1) {
    itemContainer.setAttribute("id", "selfVideoItemContainer");
    itemContainer.classList.add("video-container");
    item.setAttribute("id", "selfVideoItem");
    item.classList.add("self-item");
    video.setAttribute("id", "selfVideo");
    video.classList.add("one-self-video");
    video.classList.add("video-rotate");
  } else if (cnt === 2) {
    // self video
    const selfVideoItemContainer = document.querySelector(
      "#selfVideoItemContainer"
    );
    const selfVideoItem = document.querySelector("#selfVideoItem");
    const selfVideo = document.querySelector("#selfVideo");
    selfVideoItemContainer.classList.remove("video-container");
    selfVideoItemContainer.classList.add("two-self-video-container");
    selfVideo.classList.remove("one-self-video");
    selfVideo.classList.add("video");

    // other's video
    itemContainer.setAttribute("id", `${userId}VideoItemContainer`);
    itemContainer.setAttribute("name", "otherVideoItemContainer");
    itemContainer.classList.add("video-container");
    item.setAttribute("id", `${userId}VideoItem`);
    item.setAttribute("name", "otherVideoItem");
    item.classList.add("two-other-item");
    video.setAttribute("id", `${userId}Video`);
    video.setAttribute("name", "otherVideo");
    video.classList.add("video");
  } else {
    // videosContainer
    videosContainer.classList.add("flex-auto-wrap");
    videosContainer.classList.add("more-videos-grid");

    let columns;
    if (cnt < 9) {
      columns = parseInt(cnt / 2) + (cnt % 2);
    } else {
      columns = 3;
    }

    videosContainer.style.setProperty(
      "grid-template-columns",
      `repeat(${columns}, 1fr)`
    );

    // self video
    const selfVideoItemContainer = document.querySelector(
      "#selfVideoItemContainer"
    );
    const selfVideoItem = document.querySelector("#selfVideoItem");
    const selfVideo = document.querySelector("#selfVideo");
    selfVideoItemContainer.classList.remove("two-self-video-container");
    selfVideoItemContainer.classList.add("video-container");
    selfVideoItem.classList.remove("self-item");
    selfVideoItem.classList.add("more-item");
    selfVideo.classList.remove("one-self-video");
    selfVideo.classList.add("video");

    // other's video
    const otherVideoItems = document.querySelectorAll(
      "div[name='otherVideoItem']"
    );
    for (const item of otherVideoItems) {
      item.classList.remove("two-other-item");
      item.classList.add("more-item");
    }

    itemContainer.setAttribute("id", `${userId}VideoItemContainer`);
    itemContainer.setAttribute("name", "otherVideoItemContainer");
    itemContainer.classList.add("video-container");
    item.setAttribute("id", `${userId}VideoItem`);
    item.setAttribute("name", "otherVideoItem");
    item.classList.add("more-item");
    video.setAttribute("id", `${userId}Video`);
    video.setAttribute("name", "otherVideo");
    video.classList.add("video");
  }
};

/**
 * Add Stream
 */
const addStream = (
  video,
  stream,
  videoItemContainer,
  item,
  nameTag,
  userName,
  userId
) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", async () => {
    await video.play();
    preload();
  });

  item.appendChild(video);
  item.classList.add("center");
  videoGridStyle(videoItemContainer, item, video, userId);
  nameTag.textContent = userName;
  nameTag.classList.add("name-tag");
  item.appendChild(nameTag);
  videoItemContainer.appendChild(item);
  videoItemContainer.classList.add("center");
  videosContainer.append(videoItemContainer);
};

/**
 * Display Message
 */
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

/**
 * Scroll To Bottom
 */
const scrollToBottom = () => {
  const messageContainer = document.querySelector("#messageContainer");
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Socket IO & Peer JS
const peer = new Peer(USER_ID, {
  host: "triptaipei.online",
  port: 443,
  secure: true,
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, USER_NAME);
});

// Receive Other User's Stream (Listen to one we get call)
peer.on("call", async (call) => {
  // Answer call
  await call.answer(myStream);
  peers[call.peer] = call;

  // Respond to stream that comes in
  const videoItemCOntainer = document.createElement("div");
  const videoItem = document.createElement("div");
  const video = document.createElement("video");
  const nameTag = document.createElement("div");

  await call.on("stream", async (userVideoStream) => {
    await getRoomInfo();
    const userInfo = await getUserInfo(call.peer);
    const userName = userInfo.data.userName;
    // const otherUserIsMuted = userInfo.data.isMuted;
    // const otherUserIsVideo = userInfo.data.isVideo;
    await addStream(
      video,
      userVideoStream,
      videoItemCOntainer,
      videoItem,
      nameTag,
      userName,
      call.peer
    );
  });
});

// new user connected
socket.on("user-connected", async (userId, userName) => {
  await getRoomInfo();
  await connectToNewUser(userId, userName, myStream);
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
const connectToNewUser = async (userId, userName, stream) => {
  const call = peer.call(userId, stream);
  const videoItemContainer = document.createElement("div");
  const videoItem = document.createElement("div");
  const video = document.createElement("video");
  const nameTag = document.createElement("div");

  // Receive Other User's Stream (Listen to someone try to call us)
  await call.on("stream", async (userVideoStream) => {
    await getRoomInfo();
    await addStream(
      video,
      userVideoStream,
      videoItemContainer,
      videoItem,
      nameTag,
      userName,
      call.peer
    );
  });

  await call.on("close", () => {
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
