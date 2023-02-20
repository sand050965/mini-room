import StreamMod from "../models/streamMod.js";

class ScreenRecordMod {
  constructor() {
    this.screenRecordBtnIcon = document.querySelector("#screenRecordBtnIcon");
    this.streamMod = new StreamMod();
    this.mediaRecorder = null;
    this.tracks = [];
    this.isRecording = false;
  }

  recordBtnControl = () => {
    if (!this.isRecording) {
      this.screenRecordBtnIcon.classList.add("is-recording");
      this.startRecording();
      this.isRecording = true;
    } else {
      this.screenRecordBtnIcon.classList.remove("is-recording");
      this.stopRecording();
      this.isRecording = false;
    }
  };

  startRecording = async () => {
    try {
      const stream = await this.streamMod.getDisplayMediaStream();
      this.mediaRecorder = new MediaRecorder(stream, { type: "video" });
      this.mediaRecorder.start(1000);
      this.mediaRecorder.addEventListener(
        "dataavailable",
        this.addStreamToRecorder
      );
    } catch (e) {
      console.log(e);
    }
  };

  addStreamToRecorder = async (e) => {
    this.tracks.push(e.data);
  };

  stopRecording = async () => {
    this.mediaRecorder.stop();
    const blob = new Blob(this.tracks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.classList.add("none");
    a.href = url;
    a.download = "test.webm";
    a.click();
  };
}

export default ScreenRecordMod;
