const socket = io("/");
const videoContainer = document.querySelector("#videoContainer");
const myVideo = document.createElement("video");
myVideo.muted = true;
let myStream;
const peers = {};

const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

const init = async () => {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    addStream(myVideo, myStream);
  } catch (e) {}
};


// Socket IO & Peer JS
// Receive Other User's Stream (Listen to one we get call)
peer.on("call", (call) => {
  // Answer call
  call.answer(myStream);

  // Respond to stream that comes in
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addStream(video, userVideoStream);
  });
});

// New user connected
socket.on("user-connected", (userId) => {
  console.log(userId);
  connectToNewUser(userId, myStream);
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) {
    peers[userId].close();
  }
});

const addStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoContainer.append(video);
};

// // Make Call
const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");

  // Receive Other User's Stream (Listen to someone try to call us)
  call.on("stream", (userVideoStream) => {
    addStream(video, userVideoStream);
  });

  call.on("close", () => {
    video.remove();
  });

  // ********* peers need to go to db and refresh when someone comes in
  peers[userId] = call;
};

window.addEventListener("load", init);
