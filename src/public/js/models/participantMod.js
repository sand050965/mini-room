/** @format */

import AvatarController from "../controllers/avatarController.js";
import InputValidator from "../validators/inputValidator.js";

class ParticipantMod {
	constructor() {
		this.avatarController = new AvatarController();
		this.inputValidator = new InputValidator();
		this.joinRoomTimeout = null;
		this.leaveRoomTimeout = null;
		this.searchParticipantInput = document.querySelector(
			"#searchParticipantInput"
		);
		this.searchParticipantBtn = document.querySelector("#searchParticipantBtn");
		this.searchParticipantInput = document.querySelector(
			"#searchParticipantInput"
		);
		this.closeParticpantList = document.querySelector("#closeParticpantList");
		this.searchMsg = document.querySelector("#searchMsg");
		this.leaveRoomNotify = document.querySelector("#leaveRoomNotify");
		this.joinRoomNotify = document.querySelector("#joinRoomNotify");
		this.joinRoomContent = document.querySelector("#joinRoomContent");
		this.notifyAvatarImg = document.querySelector("#notifyAvatarImg");
	}

	getAllParticipants = async () => {
		const response = await fetch(`/api/participant/all/${ROOM_ID}`);
		const result = await response.json();
		const cnt = await result.data.participantCnt;
		const participantCnt = document.querySelector("#participantCnt");
		if (participantCnt) {
			participantCnt.textContent = cnt;
		}
		return cnt;
	};

	getParticipantInfo = async (participantId) => {
		const response = await fetch(
			`/api/participant/${ROOM_ID}?participantId=${participantId}`
		);
		const result = await response.json();
		return result;
	};

	searchParticipant = async () => {
		const participantName = this.searchParticipantInput.value;
		const data = {
			participantName: participantName,
		};
		this.inputValidator.searchParticipantValidator(data);
		const response = await fetch(
			`/api/participant?roomId=${ROOM_ID}&participantName=${participantName}`
		);
		const result = await response.json();
		return result;
	};

	removeParticipant = async (roomId, participantId) => {
		const payload = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				roomId: roomId,
				participantId: participantId,
			}),
		};
		await fetch("/api/participant", payload);
		return this.getAllParticipants();
	};

	setParticipantMap = async (DOMElement) => {
		const participantInfo = await this.getParticipantInfo(
			DOMElement.participantId
		);
		await participantMap.set(DOMElement.participantId, {
			stream: DOMElement.stream,
			participantName: participantInfo.data.participantName,
			avatarImgUrl: participantInfo.data.avatarImgUrl,
			isMuted: participantInfo.data.isMuted,
			isStoppedVideo: participantInfo.data.isStoppedVideo,
		});
	};

	removeParticipantMap = async (participantId) => {
		participantMap.delete(participantId);
	};

	addParticipantList = async (DOMElement) => {
		await this.setParticipantListAttribute(DOMElement);
		await this.setParticipantListStyle(DOMElement);
	};

	setParticipantListAttribute = (DOMElement) => {
		const participantList = document.querySelector("#participantList");
		const participantId = DOMElement.participantId;
		let participantName = DOMElement.participantName;
		const avatarImgUrl = DOMElement.avatarImgUrl;
		const participantContainer = DOMElement.participantContainer;
		const participantAvatar = DOMElement.participantAvatar;
		const participantAvatarImg = DOMElement.participantAvatarImg;
		const participantContent = DOMElement.participantContent;
		const participantNameTag = DOMElement.participantNameTag;
		const participantMediaContainer = DOMElement.participantMediaContainer;
		const participantMuteUnmuteContainer =
			DOMElement.participantMuteUnmuteContainer;
		const participantMuteUnmute = DOMElement.participantMuteUnmute;
		const participantPlayStopVideoContainer =
			DOMElement.participantPlayStopVideoContainer;
		const participantPlayStopVideo = DOMElement.participantPlayStopVideo;

		participantContainer.setAttribute(
			"id",
			`${participantId}ParticipantContainer`
		);
		participantContainer.setAttribute("name", "participantContainer");
		participantAvatarImg.src = avatarImgUrl;
		participantAvatarImg.setAttribute("name", "avatarImg");
		participantAvatarImg.addEventListener(
			"load",
			this.avatarController.resizeAvatar
		);
		participantAvatar.appendChild(participantAvatarImg);
		participantContainer.appendChild(participantAvatar);
		if (participantName.length > 10) {
			participantName = `${participantName.substring(0, 10)}...`;
		}

		if (participantId === PARTICIPANT_ID) {
			participantNameTag.textContent = `${participantName}(You)`;
		} else {
			participantNameTag.textContent = participantName;
		}

		participantContent.appendChild(participantNameTag);
		participantContainer.appendChild(participantContent);

		if (participantId === PARTICIPANT_ID) {
			participantMuteUnmute.setAttribute("id", "selfParticipantMuteUnmute");
			participantPlayStopVideo.setAttribute(
				"id",
				"selfParticipantPlayStopVideo"
			);
		} else {
			participantMuteUnmute.setAttribute(
				"id",
				`${participantId}ParticipantMuteUnmute`
			);
			participantPlayStopVideo.setAttribute(
				"id",
				`${participantId}ParticipantPlayStopVideo`
			);
		}
		participantMuteUnmuteContainer.appendChild(participantMuteUnmute);
		participantPlayStopVideoContainer.appendChild(participantPlayStopVideo);
		participantMediaContainer.appendChild(participantMuteUnmuteContainer);
		participantMediaContainer.appendChild(participantPlayStopVideoContainer);
		participantContainer.appendChild(participantMediaContainer);
		participantList.appendChild(participantContainer);
	};

	setParticipantListStyle = (DOMElement) => {
		const isMuted = DOMElement.isMuted;
		const isStoppedVideo = DOMElement.isStoppedVideo;
		const participantContainer = DOMElement.participantContainer;
		const participantAvatar = DOMElement.participantAvatar;
		const participantContent = DOMElement.participantContent;
		const participantNameTag = DOMElement.participantNameTag;
		const participantMediaContainer = DOMElement.participantMediaContainer;
		const participantMuteUnmuteContainer =
			DOMElement.participantMuteUnmuteContainer;
		const participantMuteUnmute = DOMElement.participantMuteUnmute;
		const participantPlayStopVideoContainer =
			DOMElement.participantPlayStopVideoContainer;
		const participantPlayStopVideo = DOMElement.participantPlayStopVideo;

		participantContainer.classList.add("participant-container");
		participantAvatar.classList.add("participant-avatar");
		participantContent.classList.add("participant-content");
		participantNameTag.classList.add("participant-name");
		participantMediaContainer.classList.add("media-container");

		participantNameTag.classList.add("participant-name");
		participantMuteUnmuteContainer.classList.add("mute-unmute-container");
		participantPlayStopVideoContainer.classList.add(
			"play-stop-video-container"
		);
		participantMuteUnmute.classList.add("fa-solid");
		participantPlayStopVideo.classList.add("fa-solid");
		participantMuteUnmute.classList.add("mute-unmute");
		participantPlayStopVideo.classList.add("play-stop-video");

		if (isMuted) {
			participantMuteUnmute.classList.add("fa-microphone-slash");
		} else {
			participantMuteUnmute.classList.add("fa-microphone");
		}

		if (isStoppedVideo) {
			participantPlayStopVideo.classList.add("fa-video-slash");
		} else {
			participantPlayStopVideo.classList.add("fa-video");
		}
	};

	removeParticipantList = (participantId) => {
		const participantContainer = document.getElementById(
			`${participantId}ParticipantContainer`
		);
		if (participantContainer) {
			participantContainer.remove();
		}
	};

	doSearchParticipant = async () => {
		try {
			const result = await this.searchParticipant();
			const resultData = result.data;

			if (resultData.length === 0) {
				throw "No result!";
			}
			this.displaySearchParticipant(resultData);
		} catch (e) {
			console.log(e);
			this.displaySearchNoParticipant(e);
		}
	};

	displaySearchParticipant = async (resultData) => {
		const participantContainers = document.querySelectorAll(
			'[name="participantContainer"]'
		);

		for (const participantContainer of participantContainers) {
			const participantId = participantContainer.id.replace(
				"ParticipantContainer",
				""
			);
			if (!resultData.includes(participantId)) {
				participantContainer.classList.add("none");
			} else {
				participantContainer.classList.add("participant-list-result");
			}
		}
		document.querySelector("#closeParticpantList").classList.remove("none");
	};

	displaySearchNoParticipant = (msg) => {
		const participantContainers = document.querySelectorAll(
			'[name="participantContainer"]'
		);
		for (const participantContainer of participantContainers) {
			participantContainer.classList.add("none");
		}
		document.querySelector("#closeParticpantList").classList.remove("none");

		this.displaySearchMsg(msg);
	};

	displaySearchMsg = (msg) => {
		const searchMsg = document.querySelector("#searchMsg");
		searchMsg.textContent = msg;
		searchMsg.classList.remove("none");
	};

	searchBtnControl = () => {
		const participantName = this.searchParticipantInput.value.trim();
		if (participantName === "") {
			this.cancelSearchParticipant();
		}

		if (participantName === "") {
			this.searchParticipantBtn.classList.add("disabled");
		} else {
			this.searchParticipantBtn.classList.remove("disabled");
		}
	};

	cancelSearchParticipant = () => {
		const participantContainers = document.querySelectorAll(
			'[name="participantContainer"]'
		);

		for (const participantContainer of participantContainers) {
			participantContainer.classList.remove("none");
			participantContainer.classList.remove("participant-list-result");
		}

		this.searchMsg.classList.add("none");
		this.searchParticipantInput.value = "";
		this.closeParticpantList.classList.add("none");
	};

	displayLeaveRoomNotify = (participantName) => {
		clearTimeout(this.leaveRoomTimeout);
		this.leaveRoomNotify.classList.add("leave-room-notify-active");
		this.leaveRoomNotify.textContent = `${participantName} left this meeting`;
		this.leaveRoomTimeout = setTimeout(this.hideLeaveRoomNotify, 5000);
	};

	displayJoinRoomNotify = (participantName, avatarImgUrl) => {
		clearTimeout(this.joinRoomTimeout);
		this.joinRoomNotify.classList.add("join-room-notify-active");
		this.joinRoomContent.textContent = `${participantName} joined this meeting`;
		this.notifyAvatarImg.src = avatarImgUrl;
		this.notifyAvatarImg.addEventListener(
			"load",
			this.avatarController.resizeAvatar
		);
		this.joinRoomTimeout = setTimeout(this.hideJoinRoomNotify, 5000);
	};

	hideLeaveRoomNotify = () => {
		this.leaveRoomNotify.classList.remove("leave-room-notify-active");
	};

	hideJoinRoomNotify = () => {
		this.joinRoomNotify.classList.remove("join-room-notify-active");
	};
}

export default ParticipantMod;
