import StreamMod from "../modules/streamMod.js";
import ScreenShareMod from "../modules/screenShareMod.js";
import OffcanvasMod from "../modules/offcanvasMod.js";
import ParticipantMod from "../modules/participantMod.js";
import { preload } from "../modules/commonMod.js";

class MainDisplayMod {
  constructor() {
    this.streamMod = new StreamMod();
    this.offcanvasMod = new OffcanvasMod();
    this.participantMod = new ParticipantMod();
  }

  addRoomStream = async (DOMElement) => {
    const stream = DOMElement.stream;
    const userId = DOMElement.userId;
    const video = DOMElement.video;
    const isMuted = DOMElement.isMuted;
    const isStoppedVideo = DOMElement.isStoppedVideo;
    video.srcObject = stream;

    // avatar style
    await this.setRoomAvatarStyle(DOMElement);

    // video grid style
    await this.setRoomVideoGridStyle(DOMElement);
    this.listenOnVideoStream(DOMElement);
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

      // check if any offcanvas open or anyone is sharing screen
      this.mainContainerGrid();

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

  mainContainerGrid = () => {
    if (isOffCanvasOpen) {
      this.offcanvasMod.offCanvasOpenGrid();
    } else {
      this.offcanvasMod.offCanvasCloseGrid();
    }
  };

  listenOnVideoStream = (DOMElement) => {
    const video = DOMElement.video;
    video.addEventListener("loadedmetadata", this.startPlayVideo);
  };

  startPlayVideo = async (e) => {
    await e.target.play();
    loadedCnt++;
    if (renderCnt === loadedCnt) {
      preload();
      socket.emit("finished-render");
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

      // check if any offcanvas open or anyone is sharing screen
      this.mainContainerGrid();

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

export default MainDisplayMod;
