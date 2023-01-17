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

  addVideoStream = (video, stream) => {
    videoContainer.classList.remove("none");
    avatarContainer.classList.add("none");
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", (metadata) => {
      video.play();
    });
    videoContainer.append(video);
  };

  noVideo = () => {
    avatarContainer.classList.remove("none");
    videoContainer.classList.add("none");
  };
}

export default Video;
