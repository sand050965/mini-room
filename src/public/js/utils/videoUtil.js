class Video {
  constructor() {}
  getUserMediaStream = () => {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  };

  muteUnmute = (DOMElement) => {
    const stream = DOMElement.stream;
    const enabled = stream.getAudioTracks()[0].enabled;
    if (enabled) {
      return this.mute(DOMElement);
    } else {
      return this.unmute(DOMElement);
    }
  };

  playStopVideo = (DOMElement) => {
    const stream = DOMElement.stream;
    const enabled = stream.getVideoTracks()[0].enabled;
    if (enabled) {
      return this.stopVideo(DOMElement);
    } else {
      return this.playVideo(DOMElement);
    }
  };

  unmute = (DOMElement) => {
    let audioBtn;
    let audioBtnIcon;

    const stream = DOMElement.stream;
    stream.getAudioTracks()[0].enabled = true;
    switch (DOMElement.type) {
      case "premeeting":
        audioBtn = DOMElement.audioBtn;
        audioBtnIcon = DOMElement.audioBtnIcon;
        audioBtnIcon.classList.add("fa-microphone");
        audioBtnIcon.classList.remove("fa-microphone-slash");
        audioBtn.classList.remove("btn-disable");
        audioBtn.classList.add("btn-able");
        return false;
      case "roomSelf":
        audioBtn = DOMElement.audioBtn;
        audioBtnIcon = DOMElement.audioBtnIcon;
        audioBtnIcon.classList.add("fa-microphone");
        audioBtnIcon.classList.remove("fa-microphone-slash");
        audioBtn.classList.remove("btn-disable");
        audioBtn.classList.add("btn-able");
        return false;
      case "rooOther":
        return false;
    }
  };

  mute = (DOMElement) => {
    let audioBtn;
    let audioBtnIcon;

    const stream = DOMElement.stream;
    stream.getAudioTracks()[0].enabled = false;
    switch (DOMElement.type) {
      case "premeeting":
        audioBtn = DOMElement.audioBtn;
        audioBtnIcon = DOMElement.audioBtnIcon;
        audioBtnIcon.classList.remove("fa-microphone");
        audioBtnIcon.classList.add("fa-microphone-slash");
        audioBtn.classList.remove("btn-able");
        audioBtn.classList.add("btn-disable");
        return true;
      case "roomSelf":
        audioBtn = DOMElement.audioBtn;
        audioBtnIcon = DOMElement.audioBtnIcon;
        audioBtnIcon.classList.remove("fa-microphone");
        audioBtnIcon.classList.add("fa-microphone-slash");
        audioBtn.classList.remove("btn-able");
        audioBtn.classList.add("btn-disable");
        return true;
      case "rooOther":
        return true;
    }
  };

  playVideo = (DOMElement) => {
    let videoBtn;
    let videoBtnIcon;
    const video = DOMElement.video;
    const avatarContainer = DOMElement.avatarContainer;

    const stream = DOMElement.stream;
    stream.getVideoTracks()[0].enabled = true;

    switch (DOMElement.type) {
      case "premeeting":
        const videoContainer = DOMElement.videoContainer;
        videoBtn = DOMElement.videoBtn;
        videoBtnIcon = DOMElement.videoBtnIcon;
        videoContainer.classList.remove("none");
        avatarContainer.classList.add("none");
        videoBtnIcon.classList.remove("fa-video-slash");
        videoBtnIcon.classList.add("fa-video");
        videoBtn.classList.remove("btn-disable");
        videoBtn.classList.add("btn-able");
        return false;
      case "roomSelf":
        videoBtn = DOMElement.videoBtn;
        videoBtnIcon = DOMElement.videoBtnIcon;
        avatarContainer.classList.add("none");
        video.classList.remove("none");
        videoBtnIcon.classList.remove("fa-video-slash");
        videoBtnIcon.classList.add("fa-video");
        videoBtn.classList.remove("btn-disable");
        videoBtn.classList.add("btn-able");
        return false;
      case "roomOther":
        avatarContainer.classList.add("none");
        video.classList.remove("none");
        return false;
    }
  };

  stopVideo = (DOMElement) => {
    let videoBtn;
    let videoBtnIcon;
    const video = DOMElement.video;
    const avatarContainer = DOMElement.avatarContainer;
    const stream = DOMElement.stream;
    stream.getVideoTracks()[0].enabled = false;

    switch (DOMElement.type) {
      case "premeeting":
        const videoContainer = DOMElement.videoContainer;
        videoBtn = DOMElement.videoBtn;
        videoBtnIcon = DOMElement.videoBtnIcon;
        videoContainer.classList.add("none");
        avatarContainer.classList.remove("none");
        videoBtnIcon.classList.remove("fa-video");
        videoBtnIcon.classList.add("fa-video-slash");
        videoBtn.classList.remove("btn-able");
        videoBtn.classList.add("btn-disable");
        return true;
      case "roomSelf":
        videoBtn = DOMElement.videoBtn;
        videoBtnIcon = DOMElement.videoBtnIcon;
        avatarContainer.classList.remove("none");
        video.classList.add("none");
        videoBtnIcon.classList.remove("fa-video");
        videoBtnIcon.classList.add("fa-video-slash");
        videoBtn.classList.remove("btn-able");
        videoBtn.classList.add("btn-disable");
        return true;
      case "roomOther":
        avatarContainer.classList.remove("none");
        video.classList.add("none");
        return true;
    }
  };
}

export default Video;
