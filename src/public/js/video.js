class Video {
  videoContainer = document.querySelector("#videoContainer");
  avatarContainer = document.querySelector("#avatarContainer");

  constructor() {}

  /**
   * Get User Media Stream
   */
  getUserMediaStream = () => {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  };

  /**
   * Mute and Unmute
   */
  muteUnmute = (myStream, audioBtn, audioBtnIcon) => {
    const enabled = myStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myStream.getAudioTracks()[0].enabled = false;
      return this.mute(audioBtn, audioBtnIcon);
    } else {
      myStream.getAudioTracks()[0].enabled = true;
      return this.unmute(audioBtn, audioBtnIcon);
    }
  };

  /**
   * Unmute
   */
  unmute = (audioBtn, audioBtnIcon) => {
    audioBtnIcon.classList.add("fa-microphone");
    audioBtnIcon.classList.remove("fa-microphone-slash");
    audioBtn.classList.remove("btn-disable");
    audioBtn.classList.add("btn-able");
    return false;
  };

  /**
   * Mute
   */
  mute = (audioBtn, audioBtnIcon) => {
    audioBtnIcon.classList.remove("fa-microphone");
    audioBtnIcon.classList.add("fa-microphone-slash");
    audioBtn.classList.remove("btn-able");
    audioBtn.classList.add("btn-disable");
    return true;
  };

  /**
   * Play and Stop Video
   */
  playStopVideo = (
    myStream,
    videoContainer,
    avatarContainer,
    videoBtn,
    videoBtnIcon
  ) => {
    const enabled = myStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myStream.getVideoTracks()[0].enabled = false;
      return this.stopVideo(
        videoContainer,
        avatarContainer,
        videoBtn,
        videoBtnIcon
      );
    } else {
      myStream.getVideoTracks()[0].enabled = true;
      return this.playVideo(
        videoContainer,
        avatarContainer,
        videoBtn,
        videoBtnIcon
      );
    }
  };

  /**
   * Play Video
   */
  playVideo = (videoContainer, avatarContainer, videoBtn, videoBtnIcon) => {
    videoContainer.classList.remove("none");
    avatarContainer.classList.add("none");
    videoBtnIcon.classList.remove("fa-video-slash");
    videoBtnIcon.classList.add("fa-video");
    videoBtn.classList.remove("btn-disable");
    videoBtn.classList.add("btn-able");
    return false;
  };

  /**
   * Stop Video
   */
  stopVideo = (videoContainer, avatarContainer, videoBtn, videoBtnIcon) => {
    videoContainer.classList.add("none");
    avatarContainer.classList.remove("none");
    videoBtnIcon.classList.remove("fa-video");
    videoBtnIcon.classList.add("fa-video-slash");
    videoBtn.classList.remove("btn-able");
    videoBtn.classList.add("btn-disable");
    return true;
  };
}

export default Video;
