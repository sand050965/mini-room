// controller
import RoomController from "../controllers/roomController.js";

// modules
import StreamMod from "../modules/streamMod.js";
import ScreenShareMod from "../modules/screenShareMod.js";
import MainDisplayMod from "../modules/mainDisplayMod.js";
import RoomInfoMod from "../modules/roomInfoMod.js";
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
const roomInfoMod = new RoomInfoMod();
const chatRoomMod = new ChatRoomMod();
const participantMod = new ParticipantMod();

/**
 * ============================== Event Listeners ==============================
 */
// window.addEventListener("load", roomController.init);

window.addEventListener("keydown", roomController.hotKeysControl);

window.addEventListener("beforeunload", roomController.closeWindow);

searchParticipantInput.addEventListener(
  "keyup",
  roomController.searchInputControl
);

messageInput.addEventListener("keyup", chatRoomMod.sendMsgBtnControl);

copyInfoBtn.addEventListener("mouseout", roomInfoMod.hideTooltips);

copyInfoBtn.addEventListener("click", roomInfoMod.showTooltips);

for (const btn of btnsArray) {
  btn.addEventListener("click", roomController.btnControl);
}

/**
 * ============================== Socket IO and Peer JS ==============================
 */
peer.on("open", (id) => {
  roomController.init();
  socket.emit("join-room", ROOM_ID, id, PARTICIPANT_NAME);
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
    participantId: call.peer,
  };

  // Respond to stream that comes in
  await call.on("stream", async (userStream) => {
    if (call.metadata.type === "video") {
      if (!peers[call.peer]) {
        peers[call.peer] = call;
        const userInfo = await participantMod.getParticipantInfo(call.peer);
        cnt = await participantMod.getAllParticipants();
        newDOMElement.stream = userStream;
        newDOMElement.participantName = userInfo.data.participantName;
        newDOMElement.avatarImgUrl = userInfo.data.avatarImgUrl;
        newDOMElement.isMuted = userInfo.data.isMuted;
        newDOMElement.isStoppedVideo = userInfo.data.isStoppedVideo;
        await participantMod.setParticipantMap(newDOMElement);
        await participantMod.addParticipantList(call.peer);
        await mainDisplayMod.addRoomStream(newDOMElement);
        await streamMod.initMediaControl(newDOMElement);
        renderCnt++;
        console.log("renderCnt", renderCnt);
      }
    } else if (call.metadata.type === "screensharing") {
      screenShareMod.checkScreenShare();
      screenShareMap.set("screenSharing", call.peer);
      const screenShareDOMElement = {
        stream: userStream,
        screenShareId: call.peer,
      };
      screenShareMod.doScreenShare(screenShareDOMElement);
    }
  });
});

/**
 * 1. Make call to new connected user
 * 2. send stream to new connected user
 * 3. liset the call we made and get stream from new connected user
 */
const connectToNewUser = async (DOMElement) => {
  const participantId = DOMElement.participantId;
  const participantName = DOMElement.participantName;
  const videoStream = DOMElement.videoStream;
  const screenShareStream = DOMElement.screenShareStream;

  const call = peer.call(participantId, videoStream, {
    metadata: { type: "video" },
  });

  if (myScreenShareStream) {
    peer.call(participantId, screenShareStream, {
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
    participantName: participantName,
    participantId: participantId,
  };

  // Receive new connected user's stream when they join room (Listen to someone answer our call)
  await call.on("stream", async (userStream) => {
    if (!peers[call.peer]) {
      peers[call.peer] = call;
      cnt = await participantMod.getAllParticipants();
      const userInfo = await participantMod.getParticipantInfo(call.peer);
      newDOMElement.stream = userStream;
      newDOMElement.avatarImgUrl = userInfo.data.avatarImgUrl;
      newDOMElement.isMuted = userInfo.data.isMuted;
      newDOMElement.isStoppedVideo = userInfo.data.isStoppedVideo;
      await participantMod.setParticipantMap(newDOMElement);
      await participantMod.addParticipantList(call.peer);
      await mainDisplayMod.addRoomStream(newDOMElement);
      await streamMod.initMediaControl(newDOMElement);
    }
  });

  await call.on("close", async () => {
    const participantId = call.peer;
    const video = document.getElementById(`${participantId}Video`);
    video.remove();
  });
};

/**
 * user finish render
 */
socket.on("user-finished-render", (participantId) => {
  if (JSON.parse(IS_MUTED) === myStream.getAudioTracks()[0].enabled) {
    if (!myStream.getAudioTracks()[0].enabled) {
      socket.emit("mute");
    } else {
      socket.emit("unmute");
    }
  }

  if (JSON.parse(IS_STOPPED_VIDEO) === myStream.getVideoTracks()[0].enabled) {
    if (!myStream.getVideoTracks()[0].enabled) {
      socket.emit("stop-video");
    } else {
      socket.emit("play-video");
    }
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
socket.on("user-connected", async (participantId, participantName) => {
  // ************** todo... ****************
  // need to improve get participants method
  const DOMElement = {
    participantId: participantId,
    participantName: participantName,
    videoStream: myStream,
    screenShareStream: myScreenShareStream,
  };
  await participantMod.getAllParticipants();
  await connectToNewUser(DOMElement);
});

/**
 * display other user mute
 */
socket.on("user-mute", async (participantId) => {
  const stream = participantMap.get(participantId).stream;
  const newDOMElement = {
    type: "roomOther",
    stream: stream,
    video: document.getElementById(`${participantId}Video`),
    avatarContainer: document.getElementById(`${participantId}AvatarContainer`),
    participantMuteUnmute: document.getElementById(
      `${participantId}ParticipantMuteUnmute`
    ),
    participantPlayStopVideo: document.getElementById(
      `${participantId}ParticipantPlayStopVideo`
    ),
  };
  await streamMod.mute(newDOMElement);
});

/**
 * display other user unmute
 */
socket.on("user-unmute", async (participantId) => {
  const stream = participantMap.get(participantId).stream;
  const newDOMElement = {
    type: "roomOther",
    stream: stream,
    video: document.getElementById(`${participantId}Video`),
    avatarContainer: document.getElementById(`${participantId}AvatarContainer`),
    participantMuteUnmute: document.getElementById(
      `${participantId}ParticipantMuteUnmute`
    ),
    participantPlayStopVideo: document.getElementById(
      `${participantId}ParticipantPlayStopVideo`
    ),
  };
  await streamMod.unmute(newDOMElement);
});

/**
 * stop other user video
 */
socket.on("user-stop-video", async (participantId) => {
  const stream = participantMap.get(participantId).stream;
  const newDOMElement = {
    type: "roomOther",
    stream: stream,
    video: document.getElementById(`${participantId}Video`),
    avatarContainer: document.getElementById(`${participantId}AvatarContainer`),
    participantMuteUnmute: document.getElementById(
      `${participantId}ParticipantMuteUnmute`
    ),
    participantPlayStopVideo: document.getElementById(
      `${participantId}ParticipantPlayStopVideo`
    ),
  };
  await streamMod.stopVideo(newDOMElement);
});

/**
 * play other user video
 */
socket.on("user-play-video", async (participantId) => {
  const stream = participantMap.get(participantId).stream;
  const newDOMElement = {
    type: "roomOther",
    stream: stream,
    video: document.getElementById(`${participantId}Video`),
    avatarContainer: document.getElementById(`${participantId}AvatarContainer`),
    participantMuteUnmute: document.getElementById(
      `${participantId}ParticipantMuteUnmute`
    ),
    participantPlayStopVideo: document.getElementById(
      `${participantId}ParticipantPlayStopVideo`
    ),
  };
  await streamMod.playVideo(newDOMElement);
});

/**
 * stop share other user screen
 */
socket.on("user-stop-screen-share", async (participantId) => {
  if (screenShareMap.get("screenSharing") === participantId) {
    screenShareMod.stopSreenShareVideo();
    screenShareMap.clear();
  }
});

/**
 * create message
 */
socket.on("create-message", (message, participantId, participantName) => {
  chatRoomMod.displayMessage(message, participantId, participantName);
  chatRoomMod.scrollToBottom();
});

/**
 * user disconnected
 */
socket.on("user-disconnected", async (participantId) => {
  if (peers[participantId]) {
    peers[participantId].close();
  }

  cnt = await participantMod.getAllParticipants();

  await participantMod.removeParticipantList(participantId);

  await mainDisplayMod.removeRoomVideoItemContainer(participantId);

  if (screenShareMap.get("screenSharing") === participantId) {
    await screenShareMod.stopSreenShareVideo();
  }

  // set avatar style after participant leave
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

  // set video grid style after participant leave
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
