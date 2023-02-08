// controller
import RoomController from "../controllers/roomController.js";

// modules
import StreamMod from "../modules/streamMod.js";
import ScreenShareMod from "../modules/screenShareMod.js";
import MainDisplayMod from "../modules/mainDisplayMod.js";
import ChatRoomMod from "../modules/chatRoomMod.js";
import ParticipantMod from "../modules/participantMod.js";

/**
 * ============================== Initiate COntroller ==============================
 */
const roomController = new RoomController();

/**
 * ============================== Initiate Module ==============================
 */
const streamMod = new StreamMod();
const screenShareMod = new ScreenShareMod();
const mainDisplayMod = new MainDisplayMod();
const chatRoomMod = new ChatRoomMod();
const participantMod = new ParticipantMod();

/**
 * ============================== Event Listeners ==============================
 */
window.addEventListener("load", roomController.init);

window.addEventListener("keydown", roomController.hotKeysControl);

window.addEventListener("beforeunload", roomController.closeWindow);

messageInput.addEventListener("keyup", chatRoomMod.sendMsgBtnControl);

for (const btn of btnsArray) {
  btn.addEventListener("click", roomController.btnControl);
}

/**
 * ============================== Socket IO and Peer JS ==============================
 */

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, USER_NAME);
});

/**
 * 1. Receive stream from other users who are already in room
 * 2. Answer call by sending our stream back
 * 3. listen to other users made
 */
peer.on("call", async (call) => {
  // Answer video call
  await call.answer(myStream);

  const newDOMElement = {
    type: "roomOther",
    videoItemContainer: document.createElement("div"),
    videoItem: document.createElement("div"),
    video: document.createElement("video"),
    avatarContainer: document.createElement("div"),
    avatarContent: document.createElement("div"),
    avatar: document.createElement("div"),
    avatarImg: document.createElement("img"),
    nameTag: document.createElement("div"),
    userId: call.peer,
  };

  // Respond to stream that comes in
  await call.on("stream", async (userStream) => {
    if (call.metadata.type === "video") {
      if (!peers[call.peer]) {
        peers[call.peer] = call;
        const userInfo = await participantMod.getParticipantInfo(call.peer);
        cnt = await participantMod.getAllParticipants();
        newDOMElement.stream = userStream;
        newDOMElement.userName = userInfo.data.userName;
        newDOMElement.isMuted = userInfo.data.isMuted;
        newDOMElement.isStoppedVideo = userInfo.data.isStoppedVideo;
        await mainDisplayMod.addRoomStream(newDOMElement);
        await streamMod.initMediaControl(newDOMElement);
        renderCnt++;
        console.log("renderCnt", renderCnt);
      }
    } else if (call.metadata.type === "screensharing") {
      screenShareMap.set("screenSharing", call.peer);
      screenShareMod.doScreenShare(userStream);
    }
  });
});

/**
 * 1. Make call to new connected user
 * 2. send stream to new connected user
 * 3. liset the call we made and get stream from new connected user
 */
const connectToNewUser = async (DOMElement) => {
  const userId = DOMElement.userId;
  const userName = DOMElement.userName;
  const videoStream = DOMElement.videoStream;
  const screenShareStream = DOMElement.screenShareStream;

  const call = peer.call(userId, videoStream, {
    metadata: { type: "video" },
  });

  if (myScreenShareStream) {
    peer.call(userId, screenShareStream, {
      metadata: { type: "screensharing" },
    });
  }

  const newDOMElement = {
    type: "roomOther",
    videoItemContainer: document.createElement("div"),
    videoItem: document.createElement("div"),
    video: document.createElement("video"),
    avatarContainer: document.createElement("div"),
    avatarContent: document.createElement("div"),
    avatar: document.createElement("div"),
    avatarImg: document.createElement("img"),
    nameTag: document.createElement("div"),
    userName: userName,
    userId: userId,
  };

  // Receive new connected user's stream when they join room (Listen to someone answer our call)
  await call.on("stream", async (userVideoStream) => {
    if (!peers[call.peer]) {
      peers[call.peer] = call;
      cnt = await participantMod.getAllParticipants();
      const userInfo = await participantMod.getParticipantInfo(call.peer);
      newDOMElement.stream = userVideoStream;
      newDOMElement.isMuted = userInfo.data.isMuted;
      newDOMElement.isStoppedVideo = userInfo.data.isStoppedVideo;
      await mainDisplayMod.addRoomStream(newDOMElement);
      await streamMod.initMediaControl(newDOMElement);
    }
  });

  await call.on("close", async () => {
    const userId = call.peer;
    const video = document.getElementById(`${userId}Video`);
    video.remove();
  });
};

/**
 * user finish render
 */
socket.on("user-finished-render", (userId) => {
  if (!myStream.getAudioTracks()[0].enabled) {
    socket.emit("mute");
  }

  if (!myStream.getVideoTracks()[0].enabled) {
    socket.emit("stop-video");
  }

  if (
    !document
      .querySelector("#screenShareBtn")
      .classList.contains("main-btn-clicked")
  ) {
    socket.emit("stop-screen-share");
  }
});

/**
 * new user connected
 */
socket.on("user-connected", async (userId, userName) => {
  // ************** todo... ****************
  // need to improve get participants method
  const DOMElement = {
    userId: userId,
    userName: userName,
    videoStream: myStream,
    screenShareStream: myScreenShareStream,
  };
  await participantMod.getAllParticipants();
  await connectToNewUser(DOMElement);
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
  await streamMod.mute(newDOMElement);
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
  await streamMod.unmute(newDOMElement);
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
  await streamMod.stopVideo(newDOMElement);
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
  await streamMod.playVideo(newDOMElement);
});

/**
 * stop share other user screen
 */
socket.on("user-stop-screen-share", async (userId) => {
  if (screenShareMap.get("screenSharing") === userId) {
    screenShareMod.stopSreenShareVideo();
  }
});

/**
 * create message
 */
socket.on("create-message", (message, userId, userName) => {
  chatRoomMod.displayMessage(message, userId, userName);
  chatRoomMod.scrollToBottom();
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
  cnt = await participantMod.getAllParticipants();
  await videoItemContainer.remove();

  if (screenShareMap.get("screenSharing") === userId) {
    await screenShareMod.stopSreenShareVideo();
  }

  const avatarDOMElement = {
    selfAvatarContainer: document.querySelector("#selfAvatarContainer"),
    selfAvatarContent: document.querySelector("#selfAvatarContent"),
    selfAvatar: document.querySelector("#selfAvatar"),
    otherAvatarContainers: document.querySelectorAll(
      '[name="otherAvatarContainer"]'
    ),
    otherAvatarContents: document.querySelectorAll(
      '[name="otherAvatarContents"]'
    ),
    otherAvatars: document.querySelectorAll('[name="otherAvatar"]'),
  };
  await mainDisplayMod.setRoomAvatarStyle(avatarDOMElement);

  const videoDOMElement = {
    selfVideoItemContainer: document.querySelector("#selfVideoItemContainer"),
    selfVideoItem: document.querySelector("#selfVideoItem"),
    selfVideo: document.querySelector("#selfVideo"),
    otherVideoItemContainers: document.querySelectorAll(
      '[name="otherVideoItemContainer"]'
    ),
    otherVideoItems: document.querySelectorAll("div[name='otherVideoItem']"),
    otherVideos: document.querySelectorAll('[name="otherVideo"]'),
  };
  await mainDisplayMod.setRoomVideoGridStyle(videoDOMElement);
});
