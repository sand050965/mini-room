import Video from "./video.js";
const video = new Video();
const confirmBtn = document.querySelector("#confirmBtn");

const meeting = () => {};

const premeeting = () => {};

const myStream = video.getMedia({
  video: true,
  audio: true,
});

const confirmState = () => {
  const data = {
    
  };
  // window.location = `/${ROOM_ID}`;
};

confirmBtn.addEventListener("click", confirmState);
