import PremeetingMod from "../models/premeetingMod.js";
import CommonMod from "../models/commonMod.js";
import StreamMod from "../models/streamMod.js";
import ParticipantMod from "../models/participantMod.js";
import UserMod from "../models/userMod.js";
import InputValidator from "../validators/inputValidator.js";

class PremeetingController {
	constructor() {
		this.premeetingMod = new PremeetingMod();
		this.commonMod = new CommonMod();
		this.streamMod = new StreamMod();
		this.participantMod = new ParticipantMod();
		this.userMod = new UserMod();
		this.inputValidator = new InputValidator();

		this.participantId;
		this.isJoining = false;
		this.isPermissionDenied = true;
		this.isMuted = false;
		this.isStoppedVideo = false;
		this.videoContainer = document.querySelector("#videoContainer");
		this.avatarContainer = document.querySelector("#avatarContainer");
		this.avatarImg = document.querySelector("#avatarImg");
		this.participantName = document.querySelector("#participantName");
		this.nameInput = document.querySelector("#nameInput");
		this.audioBtn = document.querySelector("#audioBtn");
		this.audioBtnIcon = document.querySelector("#audioBtnIcon");
		this.videoBtn = document.querySelector("#videoBtn");
		this.videoBtnIcon = document.querySelector("#videoBtnIcon");

		this.DOMElement = {
			type: "premeeting",
			videoContainer: this.videoContainer,
			avatarContainer: this.avatarContainer,
			audioBtn: this.audioBtn,
			audioBtnIcon: this.audioBtnIcon,
			videoBtn: this.videoBtn,
			videoBtnIcon: this.videoBtnIcon,
			isLoseTrack: false,
		};
	}

	init = async (id) => {
		this.participantId = id;
		this.participantName.innerHTML = `${this.participantId}`;
		const myVideo = document.createElement("video");
		myVideo.muted = true;
		this.DOMElement.video = myVideo;

		this.DOMElement = await this.premeetingMod.getStream(this.DOMElement);
		await this.premeetingMod.initAuth();
		this.isPermissionDenied = this.DOMElement.isPermissionDenied;
		this.isMuted = this.DOMElement.isMuted;
		this.isStoppedVideo = this.DOMElement.isStoppedVideo;
	};

	hotKeysControl = (e) => {
		if (e.which === 13) {
			e.preventDefault();
			if (this.isJoining) {
				return;
			}
			this.confirmState();
		}
	};

	btnControl = (e) => {
		const newDOMElement = {
			page: "premeeting",
			isDisplayModal: this.isPermissionDenied,
			title: "Allow Mini Room to use your camera and microphone",
			msg: "Mini Room needs access to your camera and microphone so that other participants can see and hear you. Mini Room will ask you to confirm this decision on each browser and computer you use.",
		};
		if (!this.commonMod.displayModal(newDOMElement)) {
			return;
		}

		if (e.target.id.includes("audioBtn")) {
			this.isMuted = this.streamMod.muteUnmute(this.DOMElement);
		} else if (e.target.id.includes("videoBtn")) {
			this.isStoppedVideo = this.streamMod.playStopVideo(this.DOMElement);
		}
	};

	displayName = () => {
		this.premeetingMod.displayName(this.participantId);
	};

	confirmState = async () => {
		if (this.isJoining) {
			return;
		}

		this.isJoining = true;

		const modalDOMElement = {
			page: "premeeting",
			isDisplayModal: this.isPermissionDenied,
			title: "Allow Mini Room to use your camera and microphone",
			msg: "Mini Room needs access to your camera and microphone so that other participants can see and hear you. Mini Room will ask you to confirm this decision on each browser and computer you use.",
		};

		try {
			const validateData = {
				username: this.nameInput.value.trim(),
			};

			const isName = this.inputValidator.nameValidator(validateData);

			if (!isName) {
				this.nameInput.classList.add("is-invalid");
			}

			if (!this.commonMod.displayModal(modalDOMElement) || !isName) {
				this.commonMod.closePreload("#preloader");
				this.isJoining = false;
				return;
			}

			await this.premeetingMod.setConfirmBtnDisabled();

			const data = {
				participantId: this.participantId,
				participantName: this.participantName.textContent.trim(),
				avatarImgUrl: this.avatarImg.src,
				roomId: ROOM_ID.toString(),
				isMuted: this.isMuted,
				isStoppedVideo: this.isStoppedVideo,
				isReadyState: true,
			};

			const cnt = await this.participantMod.getAllParticipants();

			if (cnt <= 8) {
				const result = await this.premeetingMod.readyToJoin(data);

				if (result.ok) {
					window.location = `/${ROOM_ID}`;
				} else {
					const modalDOMElement = {
						page: "premeeting",
						isDisplayModal: true,
						title: "Somthing Went Wrong",
						msg: "Sorry there are some problems, please try again!",
					};

					if (!this.commonMod.displayModal(modalDOMElement)) {
						this.premeetingMod.setConfirmBtnEnabled();
						this.commonMod.closePreload("#preloader");
						this.isJoining = false;
						return;
					}
				}
			} else {
				const modalDOMElement = {
					page: "premeeting",
					title: "This Room is full",
					isDisplayModal: true,
					msg: "Sorry this room is full, please try another one!",
				};

				this.commonMod.closePreload("#preloader");
				this.commonMod.displayModal(modalDOMElement);
				this.setConfirmBtnEnabled();
				this.isJoining = false;
				return;
			}
		} catch (e) {
			console.log(e);
			this.setConfirmBtnEnabled();
			const modalDOMElement = {
				page: "premeeting",
				isDisplayModal: true,
				title: "Somthing Went Wrong",
				msg: "Sorry there are some problems, please try again!",
			};
			this.commonMod.closePreload("#preloader");
			this.commonMod.displayModal(modalDOMElement);
			this.isJoining = false;
		}
	};
}

export default PremeetingController;
