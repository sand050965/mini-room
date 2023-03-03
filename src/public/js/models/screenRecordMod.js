/** @format */

import StreamMod from "../models/streamMod.js";
import RoomInfoMod from "../models/roomInfoMod.js";
import CommonMod from "../models/commonMod.js";

class ScreenRecordMod {
	constructor() {
		this.streamMod = new StreamMod();
		this.roomInfoMod = new RoomInfoMod();
		this.commonMod = new CommonMod();
		this.stream = null;
		this.audio = null;
		this.mixedStream = null;
		this.mediaRecorder = null;
		this.tracks = [];
		this.isRecording = false;
		this.screenRecordNotify = document.querySelector("#screenRecordNotify");
		this.screenRecordBtnIcon = document.querySelector("#screenRecordBtnIcon");
	}

	recordBtnControl = () => {
		if (!this.isRecording) {
			this.startRecording();
		} else {
			this.stopRecording();
		}
	};

	startRecording = async () => {
		try {
			this.stream = await this.streamMod.getDisplayMediaStream({
				video: {
					cursor: "always",
					displaySurface: "monitor",
				},
				surfaceSwitching: "exclude",
			});
			this.audio = await this.streamMod.getUserAudioStream();
			if (this.stream && this.audio) {
				this.mixedStream = new MediaStream([
					...this.stream.getTracks(),
					...this.audio.getTracks(),
				]);
			} else {
				throw "couldn't get media stream right!";
			}

			this.mediaRecorder = new MediaRecorder(this.mixedStream, {
				type: "video",
			});
			this.mediaRecorder.start(1000);
			this.mixedStream
				.getVideoTracks()[0]
				.addEventListener("ended", this.stopRecording);
			this.mediaRecorder.addEventListener(
				"dataavailable",
				this.addStreamToRecorder
			);
			this.isRecording = true;
			this.screenRecordNotify.classList.toggle("screen-record-notify-active");
			this.screenRecordBtnIcon.classList.toggle("is-recording");
		} catch (e) {
			console.log(e);
			this.isRecording = false;
			const DOMElement = {
				page: "room",
				isDisplayModal: true,
				title: "Sorry! Can't record this meeting",
				msg: "Something goes wrong when getting permission of screen or audio stream.",
			};
			this.commonMod.displayModal(DOMElement);
		}
	};

	addStreamToRecorder = async (e) => {
		this.tracks.push(e.data);
	};

	stopRecording = async () => {
		if (this.mediaRecorder.state === "recording") {
			await this.mediaRecorder.removeEventListener("stop", this.stopRecording);
			await this.mediaRecorder.stop();
		}

		for (const track of this.mixedStream.getTracks()) {
			track.stop();
		}
		const blob = new Blob(this.tracks, { type: "video/webm" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		document.body.appendChild(a);
		a.classList.add("none");
		a.href = url;
		const dateElement = await this.roomInfoMod.getDate();
		const timeElement = await this.roomInfoMod.getTime();
		a.download = `${dateElement.y}.${dateElement.m}.${dateElement.d}_${timeElement.h}:${timeElement.m}:${timeElement.s}_${ROOM_ID}.webm`;
		a.click();
		this.isRecording = false;
		this.screenRecordNotify.classList.toggle("screen-record-notify-active");
		this.screenRecordBtnIcon.classList.toggle("is-recording");
	};
}

export default ScreenRecordMod;
