class StreamMod {
  constructor() {}
  getUserMediaStream = () => {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  };

  getDisplayMediaStream = () => {
    return navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
      },
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

  initMediaControl = (DOMElement) => {
    if (!DOMElement.isMuted) {
      this.unmute(DOMElement);
    } else {
      this.mute(DOMElement);
    }
    if (!DOMElement.isStoppedVideo) {
      this.playVideo(DOMElement);
    } else {
      this.stopVideo(DOMElement);
    }
  };

  selfAudioControl = (isMuted) => {
    if (isMuted) {
      socket.emit("mute");
    } else {
      socket.emit("unmute");
    }
  };

  selfVideoControl = (isStoppedVideo) => {
    if (isStoppedVideo) {
      socket.emit("stop-video");
    } else {
      socket.emit("play-video");
    }
  };

  unmute = (DOMElement) => {
    let audioBtn;
    let audioBtnIcon;
    let participantMuteUnmute;
    let micStatusIcon;

    const stream = DOMElement.stream;
    if (stream) {
      stream.getAudioTracks()[0].enabled = true;
    }
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
        participantMuteUnmute = DOMElement.participantMuteUnmute;
        micStatusIcon = DOMElement.micStatusIcon;
        audioBtnIcon.classList.add("fa-microphone");
        audioBtnIcon.classList.remove("fa-microphone-slash");
        audioBtn.classList.remove("btn-disable");
        audioBtn.classList.add("btn-able");
        participantMuteUnmute.classList.remove("fa-microphone-slash");
        participantMuteUnmute.classList.add("fa-microphone");
        micStatusIcon.classList.remove("fa-microphone-slash");
        micStatusIcon.classList.add("fa-microphone");
        return false;
      case "roomOther":
        participantMuteUnmute = DOMElement.participantMuteUnmute;
        micStatusIcon = DOMElement.micStatusIcon;
        participantMuteUnmute.classList.remove("fa-microphone-slash");
        participantMuteUnmute.classList.add("fa-microphone");
        micStatusIcon.classList.remove("fa-microphone-slash");
        micStatusIcon.classList.add("fa-microphone");
        return false;
    }
  };

  mute = (DOMElement) => {
    let audioBtn;
    let audioBtnIcon;
    let participantMuteUnmute;
    let micStatusIcon;

    const stream = DOMElement.stream;
    if (stream) {
      stream.getAudioTracks()[0].enabled = false;
    }
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
        participantMuteUnmute = DOMElement.participantMuteUnmute;
        micStatusIcon = DOMElement.micStatusIcon;
        audioBtnIcon.classList.remove("fa-microphone");
        audioBtnIcon.classList.add("fa-microphone-slash");
        audioBtn.classList.remove("btn-able");
        audioBtn.classList.add("btn-disable");
        participantMuteUnmute.classList.remove("fa-microphone");
        participantMuteUnmute.classList.add("fa-microphone-slash");
        micStatusIcon.classList.remove("fa-microphone");
        micStatusIcon.classList.add("fa-microphone-slash");
        return true;
      case "roomOther":
        participantMuteUnmute = DOMElement.participantMuteUnmute;
        micStatusIcon = DOMElement.micStatusIcon;
        participantMuteUnmute.classList.remove("fa-microphone");
        participantMuteUnmute.classList.add("fa-microphone-slash");
        micStatusIcon.classList.remove("fa-microphone");
        micStatusIcon.classList.add("fa-microphone-slash");
        return true;
    }
  };

  playVideo = (DOMElement) => {
    let videoBtn;
    let videoBtnIcon;
    let participantPlayStopVideo;
    const video = DOMElement.video;
    const avatarContainer = DOMElement.avatarContainer;

    const stream = DOMElement.stream;
    if (stream) {
      stream.getVideoTracks()[0].enabled = true;
    }

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
        participantPlayStopVideo = DOMElement.participantPlayStopVideo;
        avatarContainer.classList.add("none");
        // video.classList.remove("none");
        videoBtnIcon.classList.remove("fa-video-slash");
        videoBtnIcon.classList.add("fa-video");
        videoBtn.classList.remove("btn-disable");
        videoBtn.classList.add("btn-able");
        participantPlayStopVideo.classList.remove("fa-video-slash");
        participantPlayStopVideo.classList.add("fa-video");
        return false;
      case "roomOther":
        participantPlayStopVideo = DOMElement.participantPlayStopVideo;
        avatarContainer.classList.add("none");
        // video.classList.remove("none");
        participantPlayStopVideo.classList.remove("fa-video-slash");
        participantPlayStopVideo.classList.add("fa-video");
        return false;
    }
  };

  stopVideo = (DOMElement) => {
    let videoBtn;
    let videoBtnIcon;
    let participantPlayStopVideo;
    const video = DOMElement.video;
    const avatarContainer = DOMElement.avatarContainer;
    const stream = DOMElement.stream;
    if (stream) {
      stream.getVideoTracks()[0].enabled = false;
    }

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
        participantPlayStopVideo = DOMElement.participantPlayStopVideo;
        avatarContainer.classList.remove("none");
        // video.classList.add("none");
        videoBtnIcon.classList.remove("fa-video");
        videoBtnIcon.classList.add("fa-video-slash");
        videoBtn.classList.remove("btn-able");
        videoBtn.classList.add("btn-disable");
        participantPlayStopVideo.classList.remove("fa-video");
        participantPlayStopVideo.classList.add("fa-video-slash");
        return true;
      case "roomOther":
        participantPlayStopVideo = DOMElement.participantPlayStopVideo;
        avatarContainer.classList.remove("none");
        // video.classList.add("none");
        participantPlayStopVideo.classList.remove("fa-video");
        participantPlayStopVideo.classList.add("fa-video-slash");
        return true;
    }
  };
}

export default StreamMod;
