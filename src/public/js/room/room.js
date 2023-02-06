import BtnsControl from "../modules/btnsControl.js";
import Display from "../modules/display.js";
import ChatRoom from "../modules/chatRoom.js";
import Participant from "../utils/participantUtil.js";
import Video from "../utils/participantUtil.js";

/**
 * ============================== Common Variables ==============================
 */
const display = new Display();
const btnsControl = new BtnsControl();
const chatRoom = new ChatRoom();
const participant = new Participant();
const video = new Video();

const btnsArray = [
  document.querySelector("#audioBtn"),
  document.querySelector("#videoBtn"),
  document.querySelector("#shareBtn"),
  document.querySelector("#leaveBtn"),
  document.querySelector("#infoBtn"),
  document.querySelector("#participantBtn"),
  document.querySelector("#chatBtn"),
  document.querySelector("#sendMsgBtn"),
  document.querySelector("#chatCloseBtn"),
  document.querySelector("#chatCloseBtn"),
  document.querySelector("#chatCloseBtn"),
];

const messageInput = document.querySelector("#messageInput");

/**
 * ============================== Event Listeners ==============================
 */
window.addEventListener("load", display.init);

window.addEventListener("keydown", btnsControl.hotKeysControl);

window.addEventListener("beforeunload", btnsControl.closeWindow);

messageInput.addEventListener("keyup", chatRoom.sendMsgBtnControl);

for (const btn of btnsArray) {
  btn.addEventListener("click", btnsControl.btnControl);
}

/**
 * ============================== Socket IO and Peer JS ==============================
 */

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, USER_NAME);
});

/**
 * Receive other user's stream when first time join room (Listen to one we get call)
 */
peer.on("call", async (call) => {
  const myStream = document.getElementById("selfVideo").srcObject;
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
    const userInfo = await participant.getParticipantInfo(call.peer);
    cnt = await participant.getAllParticipants();
    newDOMElement.stream = userVideoStream;
    newDOMElement.userName = userInfo.data.userName;
    newDOMElement.isMuted = userInfo.data.isMuted;
    newDOMElement.isStoppedVideo = userInfo.data.isStoppedVideo;
    await display.addRoomStream(newDOMElement);
    await display.initMediaControl(newDOMElement);
    display.addRenderCnt();
    console.log(display.addRenderCnt());
  });
});

/**
 * user finish render
 */
socket.on("user-finished-render", (userId) => {
  const myStream = document.getElementById("selfVideo").srcObject;
  if (!myStream.getAudioTracks()[0].enabled) {
    socket.emit("mute");
  }

  if (!myStream.getVideoTracks()[0].enabled) {
    socket.emit("stop-video");
  }
});

/**
 * new user connected
 */
socket.on("user-connected", async (userId, userName) => {
  const myStream = document.getElementById("selfVideo").srcObject;
  await participant.getAllParticipants();
  await connectToNewUser(userId, userName, myStream);
});

/**
 * display other user mute
 */
socket.on("user-mute", async (userId) => {
  const stream = document.getElementById(`${userId}Video`).srcObject;
  const newDOMElement = {
    type: "roomOther",
    stream: stream,
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.mute(newDOMElement);
});

/**
 * display other user unmute
 */
socket.on("user-unmute", async (userId) => {
  const stream = document.getElementById(`${userId}Video`).srcObject;
  const newDOMElement = {
    type: "roomOther",
    stream: stream,
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.unmute(newDOMElement);
});

/**
 * stop other user video
 */
socket.on("user-stop-video", async (userId) => {
  const stream = document.getElementById(`${userId}Video`).srcObject;
  const newDOMElement = {
    type: "roomOther",
    stream: stream,
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.stopVideo(newDOMElement);
});

/**
 * play other user video
 */
socket.on("user-play-video", async (userId) => {
  const stream = document.getElementById(`${userId}Video`).srcObject;
  const newDOMElement = {
    type: "roomOther",
    stream: stream,
    video: document.getElementById(`${userId}Video`),
    avatarContainer: document.getElementById(`${userId}AvatarContainer`),
  };
  await video.playVideo(newDOMElement);
});

/**
 * create message
 */
socket.on("create-message", (message, userId, userName) => {
  chatRoom.displayMessage(message, userId, userName);
  chatRoom.scrollToBottom();
});

/**
 * user disconnected
 */
socket.on("user-disconnected", async (userId) => {
  if (peers[userId]) {
    peers[userId].close();
  }
  const videoItemContainer = document.getElementById(
    `${userId}VideoItemContainer`
  );
  cnt = await participant.getAllParticipants();
  await videoItemContainer.remove();
  display.closeVideoGridStyle();
  display.closeRoomAvatarStyle();
});

/**
 * Make Call
 */
const connectToNewUser = async (userId, userName, stream) => {
  const call = peer.call(userId, stream);

  const videoItemContainer = document.createElement("div");
  const videoItem = document.createElement("div");
  const videoElement = document.createElement("video");
  const avatarContainer = document.createElement("div");
  const avatarContent = document.createElement("div");
  const avatar = document.createElement("div");
  const avatarImg = document.createElement("img");
  const nameTag = document.createElement("div");

  const newDOMElement = {
    type: "roomOther",
    videoItemContainer: videoItemContainer,
    videoItem: videoItem,
    video: videoElement,
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
    cnt = await participant.getAllParticipants();
    const userInfo = await participant.getParticipantInfo(call.peer);
    newDOMElement.stream = userVideoStream;
    newDOMElement.isMuted = userInfo.data.isMuted;
    newDOMElement.isStoppedVideo = userInfo.data.isStoppedVideo;
    await display.addRoomStream(newDOMElement);
    await display.initMediaControl(newDOMElement);
  });

  await call.on("close", async () => {
    videoElement.remove();
  });
};
