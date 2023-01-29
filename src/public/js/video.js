class Video {
  videoContainer = document.querySelector("#videoContainer");
  avatarContainer = document.querySelector("#avatarContainer");

  constructor() {}

  getMedia = async (constraints) => {
    let stream = null;
    try {
      const myVideo = document.createElement("video");
      myVideo.muted = true;
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.addVideoStream(myVideo, stream);
    } catch (err) {
      this.noVideo();
    }
    return stream;
  };

  // Mute and Unmute
  muteUnmute = (myStream, audioBtn, audioBtnIcon) => {
    const enabled = myStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myStream.getAudioTracks()[0].enabled = false;
      this.mute(audioBtn, audioBtnIcon);
    } else {
      myStream.getAudioTracks()[0].enabled = true;
      this.unmute(audioBtn, audioBtnIcon);
    }
  };

  unmute = (audioBtn, audioBtnIcon) => {
    audioBtnIcon.classList.add("fa-microphone");
    audioBtnIcon.classList.remove("fa-microphone-slash");
    audioBtn.classList.remove("btn-disable");
    audioBtn.classList.add("btn-able");
  };

  mute = (audioBtn, audioBtnIcon) => {
    audioBtnIcon.classList.remove("fa-microphone");
    audioBtnIcon.classList.add("fa-microphone-slash");
    audioBtn.classList.remove("btn-able");
    audioBtn.classList.add("btn-disable");
  };

  // Play and Stop Video
  playStopVideo = (myStream, videoContainer, videoBtn, videoBtnIcon) => {
    const enabled = myStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myStream.getVideoTracks()[0].enabled = false;
      this.stopVideo(videoContainer, videoBtn, videoBtnIcon);
    } else {
      myStream.getVideoTracks()[0].enabled = true;
      this.playVideo(videoContainer, videoBtn, videoBtnIcon);
    }
  };

  playVideo = (videoContainer, videoBtn, videoBtnIcon) => {
    videoContainer.classList.remove("none");
    // avatarContainer.classList.add("none");
    videoBtnIcon.classList.remove("fa-video-slash");
    videoBtnIcon.classList.add("fa-video");
    videoBtn.classList.remove("btn-disable");
    videoBtn.classList.add("btn-able");
  };

  stopVideo = (videoContainer, videoBtn, videoBtnIcon) => {
    videoContainer.classList.add("none");
    // avatarContainer.classList.remove("none");
    videoBtnIcon.classList.remove("fa-video");
    videoBtnIcon.classList.add("fa-video-slash");
    videoBtn.classList.remove("btn-able");
    videoBtn.classList.add("btn-disable");
  };
}

export default Video;
