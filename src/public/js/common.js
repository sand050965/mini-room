/**
 * Preloader
 */
export const preload = () => {
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    preloader.remove();
  }
};

/**
 * Get User Media Stream
 */
const getUserMediaStream = () => {
  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
};

export default getUserMediaStream;
