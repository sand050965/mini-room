import Video from "../utils/videoUtil.js";
import Participant from "../utils/participantUtil.js";
import BtnsControl from "./btnsControl.js";
import { preload } from "../utils/commonUtil.js";

class Display {
  constructor() {
    this.myStream = null;
    this.renderCnt = 0;
    this.loadedCnt = 0;
    this.video = new Video();
    this.participant = new Participant();
    this.btnsControl = new BtnsControl();
  }

  getRenderCnt = () => {
    return this.renderCnt;
  };

  addRenderCnt = () => {
    return this.renderCnt++;
  };

  getLoadedCnt = () => {
    return this.renderCnt;
  };

  addLoadedCnt = () => {
    return this.renderCnt++;
  };

  init = async () => {
    try {
      this.myStream = await this.video.getUserMediaStream();
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
      const DOMElement = {
        type: "roomSelf",
        videoBtn: document.querySelector("#videoBtn"),
        videoBtnIcon: document.querySelector("#videoBtnIcon"),
        audioBtn: document.querySelector("#audioBtn"),
        audioBtnIcon: document.querySelector("#audioBtnIcon"),
        stream: this.myStream,
        videoItemContainer: videoItemContainer,
        videoItem: videoItem,
        video: myVideo,
        avatarContainer: avatarContainer,
        avatarContent: avatarContent,
        avatar: avatar,
        avatarImg: avatarImg,
        nameTag: nameTag,
        userName: "You",
        userId: USER_ID,
        isMuted: JSON.parse(IS_MUTED),
        isStoppedVideo: JSON.parse(IS_STOPPED_VIDEO),
      };

      await this.addRoomStream(DOMElement);
      await this.initMediaControl(DOMElement);
      cnt = await this.participant.getAllParticipants();
      preload();
    } catch (e) {
      console.log(e.message);
      preload();
    }
  };

  addRoomStream = async (DOMElement) => {
    const stream = DOMElement.stream;
    const userId = DOMElement.userId;
    const videoElement = DOMElement.video;
    const isMuted = DOMElement.isMuted;
    const isStoppedVideo = DOMElement.isStoppedVideo;
    videoElement.srcObject = stream;

    // avatar style
    await this.setRoomAvatarStyle(DOMElement);

    // video grid style
    await this.setRoomVideoGridStyle(DOMElement);
    videoElement.addEventListener("loadedmetadata", async () => {
      await videoElement.play();
      this.loadedCnt++;
      if (this.renderCnt === this.loadedCnt) {
        preload();
        socket.emit("finished-render");
      }
    });
  };

  setRoomAvatarStyle = (DOMElement) => {
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
      const selfAvatarContainer = document.querySelector(
        "#selfAvatarContainer"
      );
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
    avatar.appendChild(avatarImg);
    avatarContent.appendChild(avatar);
    avatarContent.classList.add("center");
    avatarContainer.appendChild(avatarContent);
  };

  setRoomVideoGridStyle = (DOMElement) => {
    const videosContainer = document.querySelector("#videosContainer");
    const videoItemContainer = DOMElement.videoItemContainer;
    const videoItem = DOMElement.videoItem;
    const video = DOMElement.video;
    const avatarContainer = DOMElement.avatarContainer;
    const nameTag = DOMElement.nameTag;
    const userName = DOMElement.userName;
    const userId = DOMElement.userId;

    // append and add common class
    video.classList.add("none");
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

      for (const offCanvas of this.btnsControl.offCanvasArray) {
        if (offCanvas.classList.contains("show"))
          selfVideoItemContainer.classList.add("offcanvas-open");
      }

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

  initMediaControl = (DOMElement) => {
    if (!DOMElement.isMuted) {
      this.video.unmute(DOMElement);
    } else {
      this.video.mute(DOMElement);
    }
    if (!DOMElement.isStoppedVideo) {
      this.video.playVideo(DOMElement);
    } else {
      this.video.stopVideo(DOMElement);
    }
  };

  closeRoomAvatarStyle = () => {
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

  closeVideoGridStyle = () => {
    const videosContainer = document.querySelector("#videosContainer");
    const selfVideoItemContainer = document.querySelector(
      "#selfVideoItemContainer"
    );
    const selfVideoItem = document.querySelector("#selfVideoItem");
    const selfVideo = document.querySelector("#selfVideo");
    if (cnt === 1) {
      selfVideoItemContainer.classList.remove("two-self-video-container");
      selfVideoItemContainer.classList.add("video-container");
      selfVideoItemContainer.classList.remove("offcanvas-open");
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

      for (const offCanvas of this.btnsControl.offCanvasArray) {
        if (offCanvas.classList.contains("show"))
          selfVideoItemContainer.classList.add("offcanvas-open");
      }

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
}

export default Display;
