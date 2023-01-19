const socket = io("/");
const videoContainer = document.querySelector("#videoContainer");
const myVideo = document.createElement("video");
myVideo.muted = true;
let myStream;

const peer = new Peer(USER_ID, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

// const init = async () => {
//   try {
//     myStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     addStream(myVideo, myStream);
//   } catch (e) {}
// };

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myStream = stream;
    addVideoStream(myVideo, myStream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoContainer.append(video);
};

// window.addEventListener("load", init);
