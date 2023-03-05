import CommonMod from "../models/commonMod.js";
import StreamMod from "../models/streamMod.js";
import UserMod from "../models/userMod.js";

class PremeetingMod {
	constructor() {
		this.commonMod = new CommonMod();
		this.streamMod = new StreamMod();
		this.userMod = new UserMod();
		this.avatarImg = document.querySelector("#avatarImg");
		this.participantName = document.querySelector("#participantName");
		this.nameInput = document.querySelector("#nameInput");
		this.confirmBtn = document.querySelector("#confirmBtn");
		this.failedAlert = document.querySelector("#failedAlert");
		this.successAlert = document.querySelector("#successAlert");
	}

	readyToJoin = async (data) => {
		const payload = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};
		const response = await fetch("/api/participant/ready", payload);
		const result = await response.json();
		return result;
	};

	getStream = async (DOMElement) => {
		try {
			const myStream = await this.streamMod.getUserMediaStream();
			DOMElement.stream = myStream;
			this.displayAlert(true);
			DOMElement.isPermissionDenied = false;
			DOMElement = this.addStream(DOMElement);
		} catch (e) {
			console.log(e);
			this.commonMod.closePreload("#preloader");
			this.displayAlert(false);
			DOMElement.isPermissionDenied = true;
			DOMElement.isMuted = this.streamMod.mute(DOMElement);
			DOMElement.isStoppedVideo = this.streamMod.stopVideo(DOMElement);
		}
		return DOMElement;
	};

	addStream = (DOMElement) => {
		const videoContainer = DOMElement.videoContainer;
		const video = DOMElement.video;
		const stream = DOMElement.stream;
		video.srcObject = stream;
		video.addEventListener("loadedmetadata", async () => {
			await video.play();
			this.commonMod.closePreload("#preloader");
		});

		videoContainer.appendChild(video);
		DOMElement.isMuted = this.streamMod.unmute(DOMElement);
		DOMElement.isStoppedVideo = this.streamMod.playVideo(DOMElement);
		return DOMElement;
	};

	initAuth = async () => {
		const checkResult = await this.userMod.checkUserAuth();
		if (checkResult.data !== null) {
			this.avatarImg.src = checkResult.data.avatarImgUrl;
			this.nameInput.value = checkResult.data.username;
			this.displayName();
		} else {
			this.avatarImg.src =
				"https://s3.amazonaws.com/www.miniroom.online/images/avatar.png";
		}
	};

	displayName = (participantId) => {
		this.nameInput.classList.remove("is-invalid");
		if (this.nameInput.value === "") {
			this.participantName.textContent = `${participantId}`;
			this.nameInput.classList.add("is-invalid");
			return true;
		}
		this.participantName.textContent = nameInput.value;
		return false;
	};

	displayAlert = (isSuccess) => {
		if (isSuccess) {
			this.successAlert.classList.remove("none");
			this.successAlert.setAttribute("data-aos", "fade-up");
			this.failedAlert.classList.add("none");
			this.commonMod.initAOS(AOS);
		} else {
			this.failedAlert.classList.remove("none");
			this.failedAlert.setAttribute("data-aos", "fade-up");
			this.successAlert.classList.add("none");
			this.commonMod.initAOS(AOS);
		}
	};

	setConfirmBtnDisabled = () => {
		this.commonMod.openPreload("#preloader");
		this.confirmBtn.disabled = true;
		this.confirmBtn.textContent = "Loading ...";
	};

	setConfirmBtnEnabled = () => {
		this.commonMod.closePreload("#preloader");
		this.confirmBtn.disabled = false;
		this.confirmBtn.textContent = "Enter Your Name";
	};
}

export default PremeetingMod;
