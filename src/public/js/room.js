import Video from "./video.js";
import { preload } from "./common.js";

const socket = io("/");
const video = new Video();
let myStream;
let cnt = 1;
let peers = {};
let streams = {};
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
const BsInfoOffcanvas = new bootstrap.Offcanvas(infoOffcanvas);
const participantOffcanvas = document.querySelector("#participantOfcanvas");
const BsParticipantOffcanvas = new bootstrap.Offcanvas(participantOffcanvas);
const chatOffcanvas = document.querySelector("#chatOffcanvas");
const BsChatOffcanvas = new bootstrap.Offcanvas(chatOffcanvas);
const messageInput = document.querySelector("#messageInput");

const DOMElement = {
  type: "roomSelf",
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
    myStream = await video.getUserMediaStream();
    const videoItemContainer = document.createElement("div");
    const videoItem = document.createElement("div");
    const myVideo = document.createElement("video");
    myVideo.muted = true;
    const avatarContainer = document.createElement("div");
    const avatar = document.createElement("div");
    const avatarImg = document.createElement("img");
    const nameTag = document.createElement("div");
    const participantInfo = await getParticipantInfo();

    // Add Element into DOMElement Object
    DOMElement.stream = myStream;
    DOMElement.videoItemContainer = videoItemContainer;
    DOMElement.item = videoItem;
    DOMElement.video = myVideo;
    DOMElement.avatarContainer = avatarContainer;
    DOMElement.avatar = avatar;
    DOMElement.avatarImg = avatarImg;
    DOMElement.nameTag = nameTag;
    DOMElement.userName = "You";
    DOMElement.userId = USER_ID;
    DOMElement.isMuted = participantInfo.isMuted;
    DOMElement.isStopped = participantInfo.isStoppedVideo;

    await addRoomStream(DOMElement);
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
  cnt = result.data.length;
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
    myStream = DOMElement.stream;
    selfAudioControl(isMuted);
  } else if (e.target.id.includes("videoBtn")) {
    const isStoppedVideo = await video.playStopVideo(DOMElement);
    myStream = DOMElement.stream;
    selfVideoControl(isStoppedVideo);
  } else if (e.target.id.includes("shareBtn")) {
  } else if (e.target.id.includes("leaveBtn")) {
    leaveRoom();
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
 * Hotkeys Control
 */
const hotKeysControl = (e) => {
  if (e.which === 13) {
    e.preventDefault();
    sendMessage();
  }
};

/**
 * video Control
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
const setRoomVideoGridStyle = (DOMElement) => {
  const videoItemContainer = DOMElement.videoItemContainer;
  const itemContainer = DOMElement.videoItemContainer;
  const item = DOMElement.item;
  const video = DOMElement.video;
  const avatarContainer = DOMElement.avatarContainer;
  const nameTag = DOMElement.nameTag;
  const userName = DOMElement.userName;
  const userId = DOMElement.userId;

  if (cnt === 1) {
    itemContainer.setAttribute("id", "selfVideoItemContainer");
    item.setAttribute("id", "selfVideoItem");
    video.setAttribute("id", "selfVideo");
    itemContainer.classList.add("video-container");
    item.classList.add("self-item");
    video.classList.add("one-self-video");
    video.classList.add("video-rotate");
  } else if (cnt === 2) {
    // self video
    const selfVideoItemContainer = document.querySelector(
      "#selfVideoItemContainer"
    );
    // const selfVideoItem = document.querySelector("#selfVideoItem");
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

  // append
  item.appendChild(video);
  item.appendChild(avatarContainer);
  item.classList.add("center");
  nameTag.textContent = userName;
  nameTag.classList.add("name-tag");
  item.appendChild(nameTag);
  videoItemContainer.appendChild(item);
  videoItemContainer.classList.add("center");
  videosContainer.append(videoItemContainer);
};

/**
 * Avatar Style
 */
const setRoomAvatarStyle = (DOMElement) => {
  const avatarContainer = DOMElement.avatarContainer;
  const avatar = DOMElement.avatar;
  const avatarImg = DOMElement.avatarImg;
  const userId = DOMElement.userId;

  if (userId === USER_ID) {
    avatarImg.setAttribute("id", "selfAvatarImg");
    avatar.setAttribute("id", "selfAvatar");
    avatarContainer.setAttribute("id", "selfAvatarContainer");
  } else {
    avatarImg.setAttribute("id", `${userId}AvatarImg`);
    avatar.setAttribute("id", `${userId}Avatar`);
    avatarContainer.setAttribute("id", `${userId}AvatarContainer`);
  }

  avatarImg.setAttribute(
    "src",
    "https://s3.amazonaws.com/www.miniroom.online/images/avatar.png"
  );

  if (cnt === 1) {
    avatarContainer.classList.add("one-self-avatar-container");
    avatar.classList.add("default-avatar");
  } else if (cnt === 2) {
    const selfAvatarContainer = document.querySelector("#selfAvatarContainer");
    selfAvatarContainer.classList.remove("one-self-avatar-container");
    selfAvatarContainer.classList.add("avatar-container");
    const selfAvatar = document.querySelector("#selfAvatar");
    selfAvatar.classList.remove("default-avatar");
    selfAvatar.classList.add("more-video-avatar");
    avatar.classList.add("more-video-avatar");
  } else {
    const selfAvatar = document.querySelector("#selfAvatar");
    selfAvatar.classList.remove("more-video-avatar");
    selfAvatar.classList.add("default-avatar");
    avatar.classList.add("default-avatar");
  }

  // append
  avatar.classList.add("center");
  avatarContainer.classList.add("center");
  avatarContainer.classList.add("none");
  avatar.appendChild(avatarImg);
  avatarContainer.appendChild(avatar);
};

/**
 * Add Stream
 */
const addRoomStream = async (DOMElement) => {
  const stream = DOMElement.stream;
  const videoElement = DOMElement.video;
  const userId = DOMElement.userId;
  streams.userId = stream;
  videoElement.srcObject = stream;
  videoElement.addEventListener("loadedmetadata", async () => {
    await videoElement.play();
    preload();
  });

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
};

/**
 * Leave Meeting Room
 */
const leaveRoom = async (e) => {
  await removeParticipant();
  window.location = "/leave/thankyou";
};

/**
 * Remove Participant
 */
const removeParticipant = async () => {
  const deleteData = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId: ROOM_ID,
      userId: USER_ID,
    }),
  };
  const response = await fetch("/api/room/participant", deleteData);
  const result = await response.json();
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

// Receive other user's stream when first time join room (Listen to one we get call)
peer.on("call", async (call) => {
  // Answer call
  await call.answer(myStream);
  peers[call.peer] = call;

  const videoItemContainer = document.createElement("div");
  const item = document.createElement("div");
  const video = document.createElement("video");
  const avatarContainer = document.createElement("div");
  const avatar = document.createElement("div");
  const avatarImg = document.createElement("img");
  const nameTag = document.createElement("div");

  const newDOMElement = {
    type: "roomOther",
    target: call.peer,
    videoItemContainer: videoItemContainer,
    item: item,
    video: video,
    avatarContainer: avatarContainer,
    avatar: avatar,
    avatarImg: avatarImg,
    nameTag: nameTag,
    userId: call.peer,
  };

  // Respond to stream that comes in
  await call.on("stream", async (userVideoStream) => {
    await getAllParticipants();
    const userInfo = await getParticipantInfo(call.peer);
    const userName = userInfo.data.userName;
    newDOMElement.stream = userVideoStream;
    newDOMElement.userName = userName;
    await addRoomStream(newDOMElement);
    socket.emit("finished-render");
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
    stream: streams.userId,
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.mute(newDOMElement);
});

// display other user unmute
socket.on("user-unmute", async (userId) => {
  const newDOMElement = {
    type: "roomOther",
    stream: streams.userId,
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.unmute(newDOMElement);
});

// stop other user video
socket.on("user-stop-video", async (userId) => {
  const newDOMElement = {
    type: "roomOther",
    stream: streams.userId,
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.stopVideo(newDOMElement);
});

// play other user video
socket.on("user-play-video", async (userId) => {
  const newDOMElement = {
    type: "roomOther",
    stream: streams.userId,
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
});

// send message
const sendMessage = () => {
  const messageInput = document.querySelector("#messageInput");
  const message = messageInput.value.trim();
  if (message.length !== 0) {
    socket.emit("message", message);
    messageInput.value = "";
  }
};

// Make Call
const connectToNewUser = async (userId, userName, stream) => {
  const call = peer.call(userId, stream);

  const videoItemContainer = document.createElement("div");
  const item = document.createElement("div");
  const video = document.createElement("video");
  const avatarContainer = document.createElement("div");
  const avatar = document.createElement("div");
  const avatarImg = document.createElement("img");
  const nameTag = document.createElement("div");

  const newDOMElement = {
    type: "roomOther",
    target: call.peer,
    videoItemContainer: videoItemContainer,
    item: item,
    video: video,
    avatarContainer: avatarContainer,
    avatar: avatar,
    avatarImg: avatarImg,
    nameTag: nameTag,
    userName: userName,
    userId: userId,
  };

  // Receive other oser's stream when they join room (Listen to someone try to call us)
  await call.on("stream", async (userVideoStream) => {
    newDOMElement.stream = userVideoStream;
    await getAllParticipants();
    await addRoomStream(newDOMElement);
  });

  peers[userId] = call;

  await call.on("close", async () => {
    await removeParticipant();
    video.remove();
  });
};

/**
 * Event Listeners
 */
window.addEventListener("load", init);

window.addEventListener("keydown", hotKeysControl);

window.addEventListener("beforeunload", leaveRoom);

messageInput.addEventListener("keyup", sendMsgControl);

for (const btn of btnsArray) {
  btn.addEventListener("click", btnControl);
}
