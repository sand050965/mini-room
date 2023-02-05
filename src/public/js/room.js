import Video from "./video.js";
import RoomView from "./RoomView.js";
import { preload } from "./common.js";

const socket = io("/");
const video = new Video();
const roomView = new RoomView();
let myStream;
let cnt = 1;
let renderCnt = 0;
let loadedCnt = 0;
let streams = {};
let peers = {};
const videosContainer = document.querySelector("#videosContainer");
const audioBtn = document.querySelector("#audioBtn");
const audioBtnIcon = document.querySelector("#audioBtnIcon");
const videoBtn = document.querySelector("#videoBtn");
const videoBtnIcon = document.querySelector("#videoBtnIcon");
const shareBtn = document.querySelector("#shareBtn");
const leaveBtn = document.querySelector("#leaveBtn");
const infoBtn = document.querySelector("#infoBtn");
const participantBtn = document.querySelector("#participantBtn");
const chatBtn = document.querySelector("#chatBtn");
const sendMsgBtn = document.querySelector("#sendMsgBtn");
const infoOffcanvas = document.querySelector("#infoOffcanvas");
const infoCloseBtn = document.querySelector("#chatCloseBtn");
const BsInfoOffcanvas = new bootstrap.Offcanvas(infoOffcanvas);
const participantOffcanvas = document.querySelector("#participantOfcanvas");
const BsParticipantOffcanvas = new bootstrap.Offcanvas(participantOffcanvas);
const participantCloseBtn = document.querySelector("#chatCloseBtn");
const chatOffcanvas = document.querySelector("#chatOffcanvas");
const BsChatOffcanvas = new bootstrap.Offcanvas(chatOffcanvas);
const chatCloseBtn = document.querySelector("#chatCloseBtn");
const messageInput = document.querySelector("#messageInput");

const DOMElement = {
  type: "roomSelf",
  cnt: cnt,
  videoBtn: videoBtn,
  videoBtnIcon: videoBtnIcon,
  audioBtn: audioBtn,
  audioBtnIcon: audioBtnIcon,
};

const btnsArray = [
  videoBtn,
  audioBtn,
  shareBtn,
  leaveBtn,
  infoBtn,
  participantBtn,
  chatBtn,
  sendMsgBtn,
  infoCloseBtn,
  participantCloseBtn,
  chatCloseBtn,
];

const sideBtnIconsArray = [infoBtnIcon, participantBtnIcon, chatBtnIcon];

const bsOffcanvasArray = [
  BsInfoOffcanvas,
  BsParticipantOffcanvas,
  BsChatOffcanvas,
];

const bsOffcanvasObj = {
  info: BsInfoOffcanvas,
  participant: BsParticipantOffcanvas,
  chat: BsInfoOffcanvas,
};

/**
 * Init App
 */
const init = async () => {
  try {
    myStream = await video.getUserMediaStream();
    const videoItemContainer = document.createElement("div");
    const videoItem = document.createElement("div");
    const myVideo = document.createElement("video");
    myVideo.muted = true;
    const avatarContainer = document.createElement("div");
    const avatarContent = document.createElement("div");
    const avatar = document.createElement("div");
    const avatarImg = document.createElement("img");
    const nameTag = document.createElement("div");

    // Add Element into DOMElement Object
    DOMElement.stream = myStream;
    DOMElement.videoItemContainer = videoItemContainer;
    DOMElement.videoItem = videoItem;
    DOMElement.video = myVideo;
    DOMElement.avatarContainer = avatarContainer;
    DOMElement.avatarContent = avatarContent;
    DOMElement.avatar = avatar;
    DOMElement.avatarImg = avatarImg;
    DOMElement.nameTag = nameTag;
    DOMElement.userName = "You";
    DOMElement.userId = USER_ID;
    DOMElement.isMuted = JSON.parse(IS_MUTED);
    DOMElement.isStoppedVideo = JSON.parse(IS_STOPPED_VIDEO);

    await addRoomStream(DOMElement);
    await initMediaControl(DOMElement);
    await getAllParticipants();
    // if (cnt === 1) {
    //   preload();
    // }
    preload();
  } catch (e) {
    console.log(e.message);
    preload();
  }
};

/**
 * Get All Participants
 */
const getAllParticipants = async () => {
  const response = await fetch(`/api/room/${ROOM_ID}`);
  const result = await response.json();
  cnt = await result.data.length;
  const participantCnt = document.querySelector("#participantCnt");
  participantCnt.textContent = cnt;
};

/**
 * Get Participant Info
 */
const getParticipantInfo = async (userId) => {
  const response = await fetch(`/api/room/${ROOM_ID}/${userId}`);
  const result = await response.json();
  return result;
};

/**
 * Button Control
 */
const btnControl = async (e) => {
  if (e.target.id.includes("audioBtn")) {
    const isMuted = await video.muteUnmute(DOMElement);
    selfAudioControl(isMuted);
  } else if (e.target.id.includes("videoBtn")) {
    const isStoppedVideo = await video.playStopVideo(DOMElement);
    selfVideoControl(isStoppedVideo);
  } else if (e.target.id.includes("shareBtn")) {
  } else if (e.target.id.includes("leaveBtn")) {
    leaveRoom();
  } else if (e.target.id.includes("infoBtn")) {
    const offCanvasDOMElement = {
      tagetSideBar: infoOffcanvas,
      tagetBsOffcanvas: BsInfoOffcanvas,
      btnId: e.target.id,
    };
    toggleOffCanvas(offCanvasDOMElement);
  } else if (e.target.id.includes("participantBtn")) {
    const offCanvasDOMElement = {
      tagetSideBar: participantOffcanvas,
      tagetBsOffcanvas: BsParticipantOffcanvas,
      btnId: e.target.id,
    };
    toggleOffCanvas(offCanvasDOMElement);
  } else if (e.target.id.includes("chatBtn")) {
    const offCanvasDOMElement = {
      tagetSideBar: chatOffcanvas,
      tagetBsOffcanvas: BsChatOffcanvas,
      btnId: e.target.id,
    };
    toggleOffCanvas(offCanvasDOMElement);
  } else if (e.target.id.includes("closeBtn")) {
    const mainContainer = document.querySelector("#mainContainer");
    mainContainer.classList.remove("main-container-grid");
  } else if (e.target.id.includes("sendMsgBtn")) {
    sendMessage();
  }
};

/**
 * Hotkeys Control
 */
const hotKeysControl = (e) => {
  if (e.which === 13) {
    e.preventDefault();
    sendMessage();
  }
};

/**
 * audio Control
 */
const initMediaControl = (DOMElement) => {
  if (DOMElement.isMuted) video.muteUnmute(DOMElement);
  if (DOMElement.isStoppedVideo) video.playStopVideo(DOMElement);
};

/**
 * audio Control
 */
const selfAudioControl = (isMuted) => {
  if (isMuted) {
    socket.emit("mute");
  } else {
    socket.emit("unmute");
  }
};

/**
 * video Control
 */
const selfVideoControl = (isStoppedVideo) => {
  if (isStoppedVideo) {
    socket.emit("stop-video");
  } else {
    socket.emit("play-video");
  }
};

/**
 * Send Message Control
 */
const sendMsgBtnControl = () => {
  const messageInput = document.querySelector("#messageInput");
  if (messageInput.value.trim().length === 0) {
    sendMsgBtn.classList.remove("send-msg-btn-able");
  } else {
    sendMsgBtn.classList.add("send-msg-btn-able");
  }
};

/**
 * Toggle Offcanvas
 */
const toggleOffCanvas = (offCanvasDOMElement) => {
  let targetBtn;
  const tagetSideBar = offCanvasDOMElement.tagetSideBar;
  const tagetBsOffcanvas = offCanvasDOMElement.tagetBsOffcanvas;
  const btnId = offCanvasDOMElement.btnId;
  const selfVideoItemContainer = document.querySelector(
    "#selfVideoItemContainer"
  );

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
    selfVideoItemContainer.classList.remove("offcanvas-open");
  } else {
    tagetBsOffcanvas.show();
    mainContainer.classList.add("main-container-grid");
    targetBtn.classList.add("side-btn-clicked");
    if (cnt === 2) selfVideoItemContainer.classList.add("offcanvas-open");
  }
};

/**
 * Video Grid Style
 */
const setRoomVideoGridStyle = (DOMElement) => {
  const videoItemContainer = DOMElement.videoItemContainer;
  const videoItem = DOMElement.videoItem;
  const video = DOMElement.video;
  const avatarContainer = DOMElement.avatarContainer;
  const nameTag = DOMElement.nameTag;
  const userName = DOMElement.userName;
  const userId = DOMElement.userId;

  // append and add common class
  videoItem.appendChild(video);
  videoItem.classList.add("center");
  nameTag.textContent = userName;
  nameTag.classList.add("name-tag");
  videoItem.appendChild(avatarContainer);
  videoItem.appendChild(nameTag);
  videoItemContainer.appendChild(videoItem);
  videoItemContainer.classList.add("center");
  videosContainer.append(videoItemContainer);

  // set id
  if (userId === USER_ID) {
    videoItemContainer.setAttribute("id", "selfVideoItemContainer");
    videoItem.setAttribute("id", "selfVideoItem");
    video.setAttribute("id", "selfVideo");
  } else {
    videoItemContainer.setAttribute("id", `${userId}VideoItemContainer`);
    videoItemContainer.setAttribute("name", "otherVideoItemContainer");
    videoItem.setAttribute("id", `${userId}VideoItem`);
    videoItem.setAttribute("name", "otherVideoItem");
    video.setAttribute("id", `${userId}Video`);
    video.setAttribute("name", "otherVideo");
  }

  if (cnt === 1) {
    videoItemContainer.classList.add("video-container");
    videoItem.classList.add("one-self-item");
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
    selfVideoItem.classList.remove("one-self-item");
    selfVideoItem.classList.add("two-self-item");
    selfVideo.classList.remove("one-self-video");
    selfVideo.classList.add("video");

    // other's video
    videoItemContainer.setAttribute("name", "otherVideoItemContainer");
    videoItemContainer.classList.add("video-container");

    videoItem.classList.add("two-other-item");
    video.classList.add("video");
  } else {
    // videosContainer
    videosContainer.classList.add("more-videos-grid");

    let columns;
    if (parseInt(Math.sqrt(cnt)) === parseFloat(Math.sqrt(cnt))) {
      columns = Math.sqrt(cnt);
    } else {
      columns = parseInt(cnt / 2) + (cnt % 2);
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
    selfVideoItem.classList.remove("one-self-item");
    selfVideoItem.classList.remove("two-self-item");
    selfVideoItem.classList.add("more-item");
    selfVideo.classList.remove("one-self-video");
    selfVideo.classList.add("video");

    // other's video
    videoItemContainer.classList.add("video-container");
    const otherVideoItems = document.querySelectorAll(
      "div[name='otherVideoItem']"
    );

    for (const item of otherVideoItems) {
      item.classList.remove("two-other-item");
      item.classList.add("more-item");
    }
    video.classList.add("video");
  }
};

/**
 * Avatar Style
 */
const setRoomAvatarStyle = (DOMElement) => {
  const avatarContainer = DOMElement.avatarContainer;
  const avatarContent = DOMElement.avatarContent;
  const avatar = DOMElement.avatar;
  const avatarImg = DOMElement.avatarImg;
  const userId = DOMElement.userId;

  if (userId === USER_ID) {
    avatarContainer.setAttribute("id", "selfAvatarContainer");
    avatarContent.setAttribute("id", "selfAvatarContent");
    avatar.setAttribute("id", "selfAvatar");
    avatarImg.setAttribute("id", "selfAvatarImg");
  } else {
    avatarContainer.setAttribute("id", `${userId}AvatarContainer`);
    avatarContent.setAttribute("id", `${userId}AvatarContent`);
    avatar.setAttribute("id", `${userId}Avatar`);
    avatarImg.setAttribute("id", `${userId}AvatarImg`);
  }

  avatarImg.setAttribute(
    "src",
    "https://s3.amazonaws.com/www.miniroom.online/images/avatar.png"
  );

  if (cnt === 1) {
    avatarContainer.classList.add("avatar-container");
    avatarContent.classList.add("avatar-content");
    avatar.classList.add("avatar");
  } else if (cnt === 2) {
    // self avatar
    const selfAvatar = document.querySelector("#selfAvatar");
    selfAvatar.classList.remove("avatar");
    selfAvatar.classList.add("two-self-avatar");

    // other avatar
    avatarContainer.classList.add("avatar-container");
    avatar.classList.add("avatar");
  } else {
    // self avatar
    const selfAvatarContainer = document.querySelector("#selfAvatarContainer");
    const selfAvatar = document.querySelector("#selfAvatar");
    selfAvatarContainer.classList.add("avatar-container");
    selfAvatar.classList.remove("more-video-avatar");
    selfAvatar.classList.add("avatar");

    // other avatar
    avatarContainer.classList.add("avatar-container");
    avatar.classList.add("avatar");
  }

  // append
  avatar.classList.add("center");
  avatarContainer.classList.add("center");
  avatarContainer.classList.add("none");
  avatar.appendChild(avatarImg);
  avatarContent.appendChild(avatar);
  avatarContent.classList.add("center");
  avatarContainer.appendChild(avatarContent);
};

/**
 * Add Stream
 */
const addRoomStream = async (DOMElement) => {
  const stream = DOMElement.stream;
  const userId = DOMElement.userId;
  const videoElement = DOMElement.video;
  videoElement.srcObject = stream;
  streams[userId] = stream;

  // avatar style
  await setRoomAvatarStyle(DOMElement);

  // video grid style
  await setRoomVideoGridStyle(DOMElement);

  // mute or unmute
  const audioEnabled = stream.getAudioTracks()[0].enabled;
  if (!audioEnabled) {
    video.muteUnmute(DOMElement);
  }

  // play or stop video
  const videoEnabled = stream.getVideoTracks()[0].enabled;
  if (!videoEnabled) {
    video.playStopVideo(DOMElement);
  }

  videoElement.addEventListener("loadedmetadata", async () => {
    await videoElement.play();
    loadedCnt++;
    if (renderCnt === loadedCnt) {
      preload();
      socket.emit("finished-render");
    }
  });
};

/**
 * Close Avatar
 */
const closeAvatar = () => {
  if (cnt === 2) {
    const selfAvatar = document.querySelector("#selfAvatar");
    selfAvatar.classList.remove("avatar");
    selfAvatar.classList.add("two-self-avatar");
  } else {
    const selfAvatar = document.querySelector("#selfAvatar");
    selfAvatar.classList.add("avatar");
    selfAvatar.classList.remove("two-self-avatar");
  }
};

/**
 * Close Video Grid
 */
const closeVideoGrid = () => {
  const selfVideoItemContainer = document.querySelector(
    "#selfVideoItemContainer"
  );
  const selfVideoItem = document.querySelector("#selfVideoItem");
  const selfVideo = document.querySelector("#selfVideo");
  if (cnt === 1) {
    selfVideoItemContainer.classList.remove("two-self-video-container");
    selfVideoItemContainer.classList.add("video-container");
    selfVideoItem.classList.remove("more-item");
    selfVideoItem.classList.remove("two-self-item");
    selfVideoItem.classList.remove("one-self-item");
    selfVideo.classList.remove("video");
    selfVideo.classList.add("one-self-video");
    selfVideoItem.classList.add("one-self-item");
    videosContainer.classList.remove("more-videos-grid");
    videosContainer.style.removeProperty("grid-template-columns");
  } else if (cnt === 2) {
    // self video
    selfVideoItemContainer.classList.remove("video-container");
    selfVideoItemContainer.classList.add("two-self-video-container");
    selfVideoItem.classList.remove("more-item");
    selfVideoItem.classList.remove("one-self-item");
    selfVideoItem.classList.add("two-self-item");
    selfVideo.classList.remove("one-self-video");
    selfVideo.classList.add("video");

    // other's video
    const otherVideoItemContainer = document.querySelector(
      '[name="otherVideoItemContainer"]'
    );
    const otherVideoItem = document.querySelector('[name="otherVideoItem"]');
    const otherVideo = document.querySelector('[name="otherVideo"]');
    otherVideoItemContainer.classList.add("video-container");
    otherVideoItem.classList.remove("more-item");
    otherVideoItem.classList.add("two-other-item");
    otherVideo.classList.add("video");
    videosContainer.classList.remove("more-videos-grid");
    videosContainer.style.removeProperty("grid-template-columns");
  } else {
    // videosContainer
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
    // selfVideoItemContainer.classList.remove("two-self-video-container");
    selfVideoItemContainer.classList.add("video-container");
    // selfVideoItem.classList.remove("one-self-item");
    // selfVideoItem.classList.remove("two-self-item");
    selfVideoItem.classList.add("more-item");
    // selfVideo.classList.remove("one-self-video");
    selfVideo.classList.add("video");

    // other's video
    const otherVideoItems = document.querySelectorAll(
      "div[name='otherVideoItem']"
    );
    for (const item of otherVideoItems) {
      item.classList.remove("two-other-item");
      item.classList.add("more-item");
    }
  }
};

/**
 * Close Window
 */
const closeWindow = async (e) => {
  e.preventDefault();
  await removeParticipant(ROOM_ID, USER_ID);
};

/**
 * Leave Meeting Room
 */
const leaveRoom = async () => {
  await removeParticipant(ROOM_ID, USER_ID);
  window.location = "/leave/thankyou";
};

/**
 * Remove Participant
 */
const removeParticipant = async (roomId, userId) => {
  const deleteData = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId: roomId,
      userId: userId,
    }),
  };
  const response = await fetch("/api/room/participant", deleteData);
  getAllParticipants();
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
  mainMessage.classList.add("message");
  messageContent.appendChild(messageSender);
  messageContent.appendChild(br);
  messageContent.appendChild(mainMessage);
  messageContent.classList.add("message-content");
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

// Receive other user's stream when first time join room (Listen to one we get call)
peer.on("call", async (call) => {
  // Answer call
  await call.answer(myStream);
  peers[call.peer] = call;

  const videoItemContainer = document.createElement("div");
  const videoItem = document.createElement("div");
  const video = document.createElement("video");
  const avatarContainer = document.createElement("div");
  const avatarContent = document.createElement("div");
  const avatar = document.createElement("div");
  const avatarImg = document.createElement("img");
  const nameTag = document.createElement("div");

  const newDOMElement = {
    type: "roomOther",
    videoItemContainer: videoItemContainer,
    videoItem: videoItem,
    video: video,
    avatarContainer: avatarContainer,
    avatarContent: avatarContent,
    avatar: avatar,
    avatarImg: avatarImg,
    nameTag: nameTag,
    userId: call.peer,
  };

  // Respond to stream that comes in
  await call.on("stream", async (userVideoStream) => {
    streams[call.peer] = userVideoStream;
    const userInfo = await getParticipantInfo(call.peer);
    const userName = userInfo.data.userName;
    newDOMElement.stream = userVideoStream;
    newDOMElement.userName = userName;
    await addRoomStream(newDOMElement);
    renderCnt++;
  });
});

// user finish render
socket.on("user-finished-render", (userId) => {
  if (!myStream.getAudioTracks()[0].enabled) {
    socket.emit("mute");
  }

  if (!myStream.getVideoTracks()[0].enabled) {
    socket.emit("stop-video");
  }
});

// new user connected
socket.on("user-connected", async (userId, userName) => {
  await getAllParticipants();
  await connectToNewUser(userId, userName, myStream);
});

// display other user mute
socket.on("user-mute", async (userId) => {
  const newDOMElement = {
    type: "roomOther",
    stream: streams[userId],
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.mute(newDOMElement);
});

// display other user unmute
socket.on("user-unmute", async (userId) => {
  const newDOMElement = {
    type: "roomOther",
    stream: streams[userId],
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.unmute(newDOMElement);
});

// stop other user video
socket.on("user-stop-video", async (userId) => {
  const newDOMElement = {
    type: "roomOther",
    stream: streams[userId],
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.stopVideo(newDOMElement);
});

// play other user video
socket.on("user-play-video", async (userId) => {
  const newDOMElement = {
    type: "roomOther",
    stream: streams[userId],
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.playVideo(newDOMElement);
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
  await getAllParticipants();
  const videoItemContainer = document.getElementById(
    `${userId}VideoItemContainer`
  );
  await videoItemContainer.remove();
  closeVideoGrid();
  closeAvatar();
});

// send message
const sendMessage = () => {
  const messageInput = document.querySelector("#messageInput");
  const message = messageInput.value.trim();
  if (message.length !== 0) {
    socket.emit("message", message);
    messageInput.value = "";
    sendMsgBtnControl();
  }
};

// Make Call
const connectToNewUser = async (userId, userName, stream) => {
  const call = peer.call(userId, stream);

  const videoItemContainer = document.createElement("div");
  const videoItem = document.createElement("div");
  const video = document.createElement("video");
  const avatarContainer = document.createElement("div");
  const avatarContent = document.createElement("div");
  const avatar = document.createElement("div");
  const avatarImg = document.createElement("img");
  const nameTag = document.createElement("div");

  const newDOMElement = {
    type: "roomOther",
    videoItemContainer: videoItemContainer,
    videoItem: videoItem,
    video: video,
    avatarContainer: avatarContainer,
    avatarContent: avatarContent,
    avatar: avatar,
    avatarImg: avatarImg,
    nameTag: nameTag,
    userName: userName,
    userId: userId,
  };

  // Receive other user's stream when they join room (Listen to someone try to call us)
  await call.on("stream", async (userVideoStream) => {
    peers[call.peer] = call;
    streams[call.peer] = userVideoStream;
    newDOMElement.stream = userVideoStream;
    await getAllParticipants();
    await addRoomStream(newDOMElement);
  });

  await call.on("close", async () => {
    video.remove();
  });
};

/**
 * Event Listeners
 */
window.addEventListener("load", init);

window.addEventListener("keydown", hotKeysControl);

window.addEventListener("beforeunload", closeWindow);

messageInput.addEventListener("keyup", sendMsgBtnControl);

for (const btn of btnsArray) {
  btn.addEventListener("click", btnControl);
}
