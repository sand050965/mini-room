import StreamMod from "../modules/streamMod.js";
import MainDisplayMod from "../modules/mainDisplayMod.js";

class ScreenShareMod {
  constructor() {
    this.streamMod = new StreamMod();
    this.mainDisplayMod = new MainDisplayMod();
  }

  doMyScreenShare = async () => {
    if (isScreenSharing && screenShareMap.get("screenSharing") == USER_ID) {
      myScreenShareStream.getTracks().forEach((track) => track.stop());
      this.stopSreenShareVideo();
      return;
    }

    try {
      myScreenShareStream = await this.streamMod.getDisplayMediaStream();
      screenShareMap.set("screenSharing", USER_ID);
      await this.doScreenShare(myScreenShareStream);
      isScreenSharing = true;
      await this.screenShareBtnControl();
      await this.makeScreenShareCall();
      await this.mainDisplayMod.screenShareOpenVideoGrid();
    } catch (e) {
      console.log(e);
    }
  };

  doScreenShare = async (stream) => {
    isScreenSharing = true;
    await this.clearCurrentStream();
    const screenShareVideo = document.createElement("video");
    screenShareVideo.muted = true;
    const DOMElement = {
      stream: stream,
      video: screenShareVideo,
    };
    await this.addScreenShareStream(DOMElement);
    await this.listenOnScreenShare();
    await this.mainDisplayMod.screenShareOpenVideoGrid();
  };

  /**
   * Make call to send screen sharing stream to all the users in room
   */
  makeScreenShareCall = () => {
    for (const key of Object.keys(peers)) {
      if (key === USER_ID) continue;
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

  listenOnScreenShare = async () => {
    const screenShareVideo = document.querySelector("#screenShareVideo");
    screenShareVideo.addEventListener(
      "loadedmetadata",
      this.playScreenShareVideo
    );
    if (screenShareMap.get("screenSharing") == USER_ID) {
      screenShareVideo.srcObject
        .getVideoTracks()[0]
        .addEventListener("ended", this.stopSreenShareVideo);
    }
  };

  playScreenShareVideo = async () => {
    const screenShareVideo = document.querySelector("#screenShareVideo");
    await screenShareVideo.play();
    if (screenShareMap.get("screenSharing") === USER_ID) {
      socket.emit("start-screen-share");
    }
  };

  stopSreenShareVideo = async () => {
    isScreenSharing = false;
    const screenShareVideo = document.querySelector("#screenShareVideo");
    screenShareVideo.remove();
    await this.mainDisplayMod.mainContainerGrid();
    if (screenShareMap.get("screenSharing") === USER_ID) {
      myScreenShareStream = null;
      this.screenShareBtnControl();
      socket.emit("stop-screen-share");
    }
    screenShareMap.clear();
  };

  screenShareBtnControl = () => {
    const screenShareBtn = document.querySelector("#screenShareBtn");
    const screenShareBtnIcon = document.querySelector("#screenShareBtnIcon");
    if (isScreenSharing) {
      screenShareBtn.classList.add("main-btn-clicked");
      screenShareBtnIcon.classList.add("main-btn-icon-clicked");
    } else {
      screenShareBtn.classList.add("main-btn-clicked");
      screenShareBtnIcon.classList.remove("main-btn-icon-clicked");
    }
  };
}

export default ScreenShareMod;
