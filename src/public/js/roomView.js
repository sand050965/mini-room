class RoomView {
  constructor() {
    this.cnt = 1;
  }

  /**
   * Video Grid Style
   */
  setRoomVideoGridStyle = (DOMElement) => {
    this.commonVideoGridStyle(DOMElement);

    if (this.cnt === 1) {
      this.setOneVideoGridStyle(DOMElement);
    } else if (this.cnt === 2) {
      this.setTwoVideoGridStyle(DOMElement);
    } else {
      this.setMoreVideoGridStyle(DOMElement);
    }
  };

  /**
   * Common Video Grid Style
   */
  commonVideoGridStyle = (DOMElement) => {
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
  };

  /**
   * Set One Video Grid Style
   */
  setOneVideoGridStyle = (DOMElement) => {
    const videoItemContainer = DOMElement.videoItemContainer;
    const videoItem = DOMElement.videoItem;
    const video = DOMElement.video;

    videoItemContainer.classList.add("video-container");
    videoItem.classList.add("one-self-item");
    video.classList.add("one-self-video");
    video.classList.add("video-rotate");
  };

  /**
   * Set Two Video Grid Style
   */
  setTwoVideoGridStyle = (DOMElement) => {
    const videoItemContainer = DOMElement.videoItemContainer;
    const videoItem = DOMElement.videoItem;
    const video = DOMElement.video;

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
  };

  /**
   * Set More Video Grid Style
   */
  setMoreVideoGridStyle = (DOMElement) => {
    const videoItemContainer = DOMElement.videoItemContainer;
    const video = DOMElement.video;

    // videosContainer
    const videosContainer = document.querySelector("#videosContainer");
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
  };
}

export default RoomView;
