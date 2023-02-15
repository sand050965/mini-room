import StreamMod from "../modules/streamMod.js";
import MainDisplayMod from "../modules/mainDisplayMod.js";
import ParticipantMod from "./participantMod.js";

class ScreenShareMod {
  constructor() {
    this.streamMod = new StreamMod();
    this.mainDisplayMod = new MainDisplayMod();
    this.participantMod = new ParticipantMod();
  }

  doMyScreenShare = async () => {
    if (!this.checkScreenShare()) {
      return;
    }

    try {
      myScreenShareStream = await this.streamMod.getDisplayMediaStream();
      screenShareMap.set("screenSharing", PARTICIPANT_ID);
      const screenShareDOMElement = {
        screenShareId: PARTICIPANT_ID,
        stream: myScreenShareStream,
      };
      await this.doScreenShare(screenShareDOMElement);
      isScreenSharing = true;
      await this.screenShareBtnControl();
      await this.makeScreenShareCall();
      await this.mainDisplayMod.setScreenShareAvatarStyle();
      await this.mainDisplayMod.setScreenShareGridStyle();
    } catch (err) {
      console.log(err);
    }
  };

  doScreenShare = async (screenShareDOMElement) => {
    isScreenSharing = true;
    await this.clearCurrentStream();
    const screenShareVideo = document.createElement("video");
    screenShareVideo.muted = true;
    screenShareDOMElement.video = screenShareVideo;
    await this.addScreenShareStream(screenShareDOMElement);
    await this.displayScreenShareAlert(screenShareDOMElement);
    await this.listenOnScreenShare();
    await this.mainDisplayMod.setScreenShareAvatarStyle();
    await this.mainDisplayMod.setScreenShareGridStyle();
  };

  checkScreenShare = () => {
    if (
      isScreenSharing &&
      screenShareMap.get("screenSharing") == PARTICIPANT_ID
    ) {
      myScreenShareStream.getTracks().forEach((track) => track.stop());
      this.stopSelfScreenShareVideo();
      return false;
    }
    return true;
  };

  /**
   * Make call to send screen sharing stream to all the users in room
   */
  makeScreenShareCall = () => {
    for (const key of Object.keys(peers)) {
      if (key === PARTICIPANT_ID) continue;
      peer.call(key, myScreenShareStream, {
        metadata: { type: "screensharing" },
      });
    }
  };

  clearCurrentStream = () => {
    const screenShareVideo = document.querySelector("#screenShareVideo");
    if (screenShareVideo) screenShareVideo.remove();
  };

  addScreenShareStream = async (DOMElement) => {
    const screenShare = document.querySelector("#screenShare");
    const stream = DOMElement.stream;
    const video = DOMElement.video;

    await this.mainDisplayMod.mainContainerGrid();

    video.srcObject = stream;
    video.classList.add("screen-share-video");
    video.setAttribute("id", "screenShareVideo");
    screenShare.appendChild(video);
  };

  displayScreenShareAlert = async (screenShareDOMElement) => {
    const screenShareAlert = document.querySelector("#screenShareAlert");
    const screenShareId = screenShareDOMElement.screenShareId;
    document
      .querySelector("#screenShareAlertContainer")
      .classList.remove("none");
    if (screenShareId === PARTICIPANT_ID) {
      screenShareAlert.textContent = "You are sharing screen!";
    } else {
      const participantInfo = await this.participantMod.getParticipantInfo(
        screenShareId
      );
      screenShareAlert.textContent = `${participantInfo.data.participantName} is sharing his/her screen!`;
    }
  };

  listenOnScreenShare = async () => {
    const screenShareVideo = document.querySelector("#screenShareVideo");
    screenShareVideo.addEventListener(
      "loadedmetadata",
      this.playScreenShareVideo
    );
    if (screenShareMap.get("screenSharing") == PARTICIPANT_ID) {
      screenShareVideo.srcObject
        .getVideoTracks()[0]
        .addEventListener("ended", this.stopSelfScreenShareVideo);
    }
  };

  playScreenShareVideo = async () => {
    const screenShareVideo = document.querySelector("#screenShareVideo");
    await screenShareVideo.play();
    if (screenShareMap.get("screenSharing") === PARTICIPANT_ID) {
      socket.emit("start-screen-share");
    }
  };

  stopSelfScreenShareVideo = () => {
    this.stopSreenShareVideo();
    screenShareMap.clear();
  };

  stopSreenShareVideo = async () => {
    isScreenSharing = false;
    const screenShareVideo = document.querySelector("#screenShareVideo");
    screenShareVideo.remove();
    document.querySelector("#screenShareAlertContainer").classList.add("none");
    if (screenShareMap.get("screenSharing") === PARTICIPANT_ID) {
      myScreenShareStream = null;
      this.screenShareBtnControl();
      socket.emit("stop-screen-share");
    }
    await this.mainDisplayMod.mainContainerGrid();
    const avatarElement = {
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
    await this.mainDisplayMod.setRoomAvatarStyle(avatarElement);

    const videoElement = {
      selfVideoItemContainer: document.querySelector("#selfVideoItemContainer"),
      selfVideoItem: document.querySelector("#selfVideoItem"),
      selfVideo: document.querySelector("#selfVideo"),
      otherVideoItemContainers: document.querySelectorAll(
        '[name="otherVideoItemContainer"]'
      ),
      otherVideoItems: document.querySelectorAll("div[name='otherVideoItem']"),
      otherVideos: document.querySelectorAll('[name="otherVideo"]'),
    };
    await this.mainDisplayMod.setRoomVideoGridStyle(videoElement);
  };

  screenShareBtnControl = () => {
    const screenShareBtn = document.querySelector("#screenShareBtn");
    if (isScreenSharing) {
      screenShareBtn.classList.add("main-btn-clicked");
    } else {
      screenShareBtn.classList.remove("main-btn-clicked");
    }
  };
}

export default ScreenShareMod;
