import StreamMod from "../models/streamMod.js";
import OffcanvasMod from "../models/offcanvasMod.js";
import ParticipantMod from "../models/participantMod.js";
import CommonMod from "../models/commonMod.js";
import AvatarController from "../controllers/avatarController.js";

class MainDisplayMod {
	constructor() {
		this.avatarController = new AvatarController();
		this.streamMod = new StreamMod();
		this.offcanvasMod = new OffcanvasMod();
		this.participantMod = new ParticipantMod();
		this.commonMod = new CommonMod();
	}

	addRoomStream = async (DOMElement) => {
		const stream = DOMElement.stream;
		const video = DOMElement.video;
		video.srcObject = stream;

		const avatarDOMElement = await this.setRoomAvatarAttribute(DOMElement);
		await this.setRoomAvatarStyle(avatarDOMElement);

		const videoDOMElement = await this.setRoomVideoAttribute(DOMElement);
		await this.setRoomVideoGridStyle(videoDOMElement);
		await this.listenOnVideoStream(DOMElement);
	};

	setRoomAvatarAttribute = (DOMElement) => {
		const avatarDOMElement = {
			selfAvatarContainer: document.querySelector("#selfAvatarContainer"),
			selfAvatarContent: document.querySelector("#selfAvatarContent"),
			selfAvatar: document.querySelector("#selfAvatar"),
			otherAvatarContainers: [],
			otherAvatarContents: [],
			otherAvatars: [],
		};

		const otherAvatarContainers = document.querySelectorAll(
			'[name="otherAvatarContainer"]'
		);
		const otherAvatarContents = document.querySelectorAll(
			'[name="otherAvatarContent"]'
		);
		const otherAvatars = document.querySelectorAll('[name="otherAvatar"]');

		if (otherAvatarContainers.length !== 0) {
			avatarDOMElement.otherAvatarContainers = Array.from(
				otherAvatarContainers
			);
		}

		if (otherAvatarContents.length !== 0) {
			avatarDOMElement.otherAvatarContents = Array.from(otherAvatarContents);
		}

		if (otherAvatars.length != 0) {
			avatarDOMElement.otherAvatars = Array.from(otherAvatars);
		}

		const avatarContainer = DOMElement.avatarContainer;
		const avatarContent = DOMElement.avatarContent;
		const avatar = DOMElement.avatar;
		const avatarImg = DOMElement.avatarImg;
		const avatarImgUrl = DOMElement.avatarImgUrl;
		const participantId = DOMElement.participantId;

		avatar.classList.add("center");
		avatarContainer.classList.add("center");
		avatar.appendChild(avatarImg);
		avatarContent.appendChild(avatar);
		avatarContent.classList.add("center");
		avatarContainer.appendChild(avatarContent);

		avatarImg.setAttribute("src", avatarImgUrl);
		avatarImg.addEventListener("load", this.avatarController.resizeAvatar);

		if (participantId === PARTICIPANT_ID) {
			avatarContainer.setAttribute("id", "selfAvatarContainer");
			avatarContent.setAttribute("id", "selfAvatarContent");
			avatar.setAttribute("id", "selfAvatar");
			avatarImg.setAttribute("id", "selfAvatarImg");
			avatarImg.setAttribute("name", "avatarImg");
			avatarDOMElement.selfAvatarContainer = avatarContainer;
			avatarDOMElement.selfAvatarContent = avatarContent;
			avatarDOMElement.selfAvatar = avatar;
		} else {
			avatarContainer.setAttribute("id", `${participantId}AvatarContainer`);
			avatarContent.setAttribute("id", `${participantId}AvatarContent`);
			avatar.setAttribute("id", `${participantId}Avatar`);
			avatarImg.setAttribute("id", `${participantId}AvatarImg`);
			avatarImg.setAttribute("name", "avatarImg");
			avatarDOMElement.otherAvatarContainers.push(avatarContainer);
			avatarDOMElement.otherAvatarContents.push(avatarContent);
			avatarDOMElement.otherAvatars.push(avatar);
		}
		return avatarDOMElement;
	};

	setRoomVideoAttribute = (DOMElement) => {
		const videoElement = {
			selfVideoItemContainer: document.querySelector("#selfVideoItemContainer"),
			selfVideoItem: document.querySelector("#selfVideoItem"),
			selfVideo: document.querySelector("#selfVideo"),
			otherVideoItemContainers: [],
			otherVideoItems: [],
			otherVideos: [],
		};

		const otherVideoItemContainers = document.querySelectorAll(
			'[name="otherVideoItemContainer"]'
		);
		const otherVideoItems = document.querySelectorAll(
			'[name="otherVideoItem"]'
		);
		const otherVideos = document.querySelectorAll('[name="otherVideo"]');

		if (otherVideoItemContainers.length !== 0) {
			videoElement.otherVideoItemContainers = Array.from(
				otherVideoItemContainers
			);
		}

		if (otherVideoItems.length !== 0) {
			videoElement.otherVideoItems = Array.from(otherVideoItems);
		}

		if (otherVideos.length !== 0) {
			videoElement.otherVideos = Array.from(otherVideos);
		}

		const videosContainer = document.querySelector("#videosContainer");
		const videoItemContainer = DOMElement.videoItemContainer;
		const videoItem = DOMElement.videoItem;
		const video = DOMElement.video;
		const avatarContainer = DOMElement.avatarContainer;
		const nameTag = DOMElement.nameTag;
		const participantId = DOMElement.participantId;
		let participantName = DOMElement.participantName;
		const micStatus = DOMElement.micStatus;
		const micStatusIcon = DOMElement.micStatusIcon;

		if (participantId === PARTICIPANT_ID) {
			participantName = "You";
		}

		videoItem.appendChild(video);
		videoItem.classList.add("center");
		nameTag.textContent = participantName;
		nameTag.classList.add("name-tag");
		micStatusIcon.classList.add("fa-solid");
		micStatusIcon.classList.add("fa-microphone-slash");
		micStatus.classList.add("mic-status");
		micStatus.classList.add("center");
		micStatus.appendChild(micStatusIcon);
		videoItem.appendChild(avatarContainer);
		videoItem.appendChild(nameTag);
		videoItem.appendChild(micStatus);
		videoItemContainer.appendChild(videoItem);
		videoItemContainer.classList.add("center");
		videosContainer.append(videoItemContainer);

		if (participantId === PARTICIPANT_ID) {
			videoItemContainer.setAttribute("id", "selfVideoItemContainer");
			videoItem.setAttribute("id", "selfVideoItem");
			video.setAttribute("id", "selfVideo");
			micStatusIcon.setAttribute("id", "selfMicStatusIcon");
			videoElement.selfVideoItemContainer = videoItemContainer;
			videoElement.selfVideoItem = videoItem;
			videoElement.selfVideo = video;
		} else {
			videoItemContainer.setAttribute(
				"id",
				`${participantId}VideoItemContainer`
			);
			videoItemContainer.setAttribute("name", "otherVideoItemContainer");
			videoItem.setAttribute("id", `${participantId}VideoItem`);
			videoItem.setAttribute("name", "otherVideoItem");
			video.setAttribute("id", `${participantId}Video`);
			video.setAttribute("name", "otherVideo");
			micStatusIcon.setAttribute("id", `${participantId}MicStatusIcon`);
			videoElement.otherVideoItemContainers.push(videoItemContainer);
			videoElement.otherVideoItems.push(videoItem);
			videoElement.otherVideos.push(video);
		}
		return videoElement;
	};

	setRoomAvatarStyle = (DOMElement) => {
		const selfAvatarContainer = DOMElement.selfAvatarContainer;
		const selfAvatarContent = DOMElement.selfAvatarContent;
		const selfAvatar = DOMElement.selfAvatar;

		const otherAvatarContainers = DOMElement.otherAvatarContainers;
		const otherAvatarContents = DOMElement.otherAvatarContents;
		const otherAvatars = DOMElement.otherAvatars;

		this.resetRoomAvatarStyle(DOMElement);

		selfAvatarContent.classList.add("avatar-content");

		if (cnt === 1) {
			selfAvatarContainer.classList.add("one-self-avatar-container");
			selfAvatar.classList.add("avatar");
		} else if (cnt === 2) {
			selfAvatarContainer.classList.add("more-avatar-container");
			selfAvatar.classList.add("two-self-avatar");
		} else {
			selfAvatarContainer.classList.add("more-avatar-container");
			selfAvatar.classList.add("avatar");
		}

		for (const otherAvatarContainer of otherAvatarContainers) {
			otherAvatarContainer.classList.add("more-avatar-container");
		}

		for (const otherAvatarContent of otherAvatarContents) {
			otherAvatarContent.classList.add("avatar-content");
		}

		for (const otherAvatar of otherAvatars) {
			otherAvatar.classList.add("avatar");
		}
	};

	setRoomVideoGridStyle = (DOMElement) => {
		const videosContainer = document.querySelector("#videosContainer");

		const selfVideoItemContainer = DOMElement.selfVideoItemContainer;
		const selfVideoItem = DOMElement.selfVideoItem;
		const selfVideo = DOMElement.selfVideo;

		const otherVideoItemContainers = DOMElement.otherVideoItemContainers;
		const otherVideoItems = DOMElement.otherVideoItems;
		const otherVideos = DOMElement.otherVideos;

		this.resetRoomVideoGrid(DOMElement);

		this.mainContainerGrid();

		if (isScreenSharing) {
			this.setScreenShareAvatarStyle();
			this.setScreenShareGridStyle();
			return;
		}

		if (cnt === 1) {
			selfVideoItemContainer.classList.add("video-container");
			selfVideoItem.classList.add("one-self-item");
			selfVideo.classList.add("one-self-video");
			selfVideo.classList.add("video-rotate");
		} else if (cnt === 2) {
			selfVideoItemContainer.classList.add("two-self-video-container");
			selfVideoItem.classList.add("two-self-item");
			selfVideo.classList.add("video");

			for (const otherVideoItemContainer of otherVideoItemContainers) {
				otherVideoItemContainer.classList.add("video-container");
			}
			for (const otherVideoItem of otherVideoItems) {
				otherVideoItem.classList.add("two-other-item");
			}
			for (const otherVideo of otherVideos) {
				otherVideo.classList.add("video");
			}
		} else {
			let columns;
			if (parseInt(Math.sqrt(cnt)) === parseFloat(Math.sqrt(cnt))) {
				columns = Math.sqrt(cnt);
			} else {
				columns = parseInt(cnt / 2) + (cnt % 2);
			}

			videosContainer.classList.add("more-videos-grid");
			videosContainer.style.setProperty(
				"grid-template-columns",
				`repeat(${columns}, 1fr)`
			);

			selfVideoItemContainer.classList.add("video-container");
			selfVideoItem.classList.add("more-item");
			selfVideo.classList.add("video");

			for (const otherVideoItemContainer of otherVideoItemContainers) {
				otherVideoItemContainer.classList.add("video-container");
			}

			for (const otherVideoItem of otherVideoItems) {
				otherVideoItem.classList.add("more-item");
			}

			for (const otherVideo of otherVideos) {
				otherVideo.classList.add("video");
			}
		}
	};

	setScreenShareAvatarStyle = () => {
		const selfAvatarContainer = document.querySelector("#selfAvatarContainer");
		const selfAvatar = document.querySelector("#selfAvatar");

		const avatarDOMElement = {
			selfAvatarContainer: selfAvatarContainer,
			selfAvatar: selfAvatar,
		};

		this.resetRoomAvatarStyle(avatarDOMElement);

		selfAvatarContainer.classList.add("more-avatar-container");
		selfAvatar.classList.add("avatar");
	};

	setScreenShareGridStyle = () => {
		const videosContainer = document.querySelector("#videosContainer");

		const selfVideoItemContainer = document.querySelector(
			"#selfVideoItemContainer"
		);
		const selfVideoItem = document.querySelector("#selfVideoItem");
		const selfVideo = document.querySelector("#selfVideo");

		let otherVideoItemContainers = [];
		let otherVideoItems = [];
		let otherVideos = [];
		if (cnt !== 1) {
			otherVideoItemContainers = document.querySelectorAll(
				'[name="otherVideoItemContainer"]'
			);
			otherVideoItems = document.querySelectorAll('[name="otherVideoItem"]');
			otherVideos = document.querySelectorAll('[name="otherVideo"]');
		}

		const videoDOMElement = {
			selfVideoItemContainer: selfVideoItemContainer,
			selfVideoItem: selfVideoItem,
			selfVideo: selfVideo,
			otherVideoItemContainers: otherVideoItemContainers,
			otherVideoItems: otherVideoItems,
			otherVideos: otherVideos,
		};

		this.resetRoomVideoGrid(videoDOMElement);

		videosContainer.classList.add("screen-share-videos-grid");
		if (cnt > 5) {
			videosContainer.classList.add("screen-share-videos-grid-column");
		}

		selfVideoItemContainer.classList.add("video-container");
		selfVideoItem.classList.add("more-item");
		selfVideo.classList.add("video");

		for (const otherVideoItemContainer of otherVideoItemContainers) {
			otherVideoItemContainer.classList.add("video-container");
		}

		for (const otherVideoItem of otherVideoItems) {
			otherVideoItem.classList.add("more-item");
		}

		for (const otherVideo of otherVideos) {
			otherVideo.classList.add("video");
		}
	};

	resetRoomAvatarStyle = (DOMElement) => {
		const selfAvatarContainer = DOMElement.selfAvatarContainer;
		const selfAvatar = DOMElement.selfAvatar;

		selfAvatarContainer.classList.remove("one-self-avatar-container");
		selfAvatarContainer.classList.remove("more-avatar-container");
		selfAvatar.classList.remove("avatar");
		selfAvatar.classList.remove("two-self-avatar");
	};

	resetRoomVideoGrid = (DOMElement) => {
		const videosContainer = document.querySelector("#videosContainer");

		const selfVideoItemContainer = DOMElement.selfVideoItemContainer;
		const selfVideoItem = DOMElement.selfVideoItem;
		const selfVideo = DOMElement.selfVideo;

		const otherVideoItemContainers = DOMElement.otherVideoItemContainers;
		const otherVideoItems = DOMElement.otherVideoItems;
		const otherVideos = DOMElement.otherVideos;

		videosContainer.classList.remove("more-videos-grid");
		videosContainer.classList.remove("screen-share-videos-grid");
		videosContainer.classList.remove("screen-share-videos-grid-column");
		videosContainer.style.removeProperty("grid-template-columns");

		selfVideoItemContainer.classList.remove("video-container");
		selfVideoItemContainer.classList.remove("two-self-video-container");
		selfVideoItemContainer.classList.remove("offcanvas-open");
		selfVideoItem.classList.remove("one-self-item");
		selfVideoItem.classList.remove("two-self-item");
		selfVideoItem.classList.remove("more-item");
		selfVideo.classList.remove("video");
		selfVideo.classList.remove("one-self-video");

		for (const otherVideoItemContainer of otherVideoItemContainers) {
			otherVideoItemContainer.classList.remove("video-container");
		}

		for (const otherVideoItem of otherVideoItems) {
			otherVideoItem.classList.remove("two-other-item");
			otherVideoItem.classList.remove("more-item");
		}

		for (const otherVideo of otherVideos) {
			otherVideo.classList.remove("video");
		}
	};

	removeRoomVideoItemContainer = (participantId) => {
		const videoItemContainer = document.getElementById(
			`${participantId}VideoItemContainer`
		);
		if (videoItemContainer) {
			videoItemContainer.remove();
		}
	};

	mainContainerGrid = () => {
		if (isOffcanvasOpen) {
			this.offcanvasMod.offcanvasOpenGrid();
		} else {
			this.offcanvasMod.offcanvasCloseGrid();
		}
	};

	listenOnVideoStream = (DOMElement) => {
		const participantId = DOMElement.participantId;
		const video = DOMElement.video;
		video.addEventListener("loadedmetadata", this.startPlayStream);
		if (participantId === PARTICIPANT_ID) {
			video.srcObject.getTracks()[0].addEventListener("ended", this.stopStream);
		}
	};

	startPlayStream = async (e) => {
		await e.target.play();
		cnt = await this.participantMod.getAllParticipants();
		this.finishRender();
	};

	stopStream = async (e) => {
		isLoseTrack = true;
		const DOMElement = {
			type: "roomSelf",
			audioBtn: document.querySelector("#audioBtn"),
			audioBtnIcon: document.querySelector("#audioBtnIcon"),
			videoBtn: document.querySelector("#videoBtn"),
			videoBtnIcon: document.querySelector("#videoBtnIcon"),
			participantMuteUnmute: document.querySelector(
				"#selfParticipantMuteUnmute"
			),
			participantPlayStopVideo: document.querySelector(
				"#selfParticipantPlayStopVideo"
			),
			micStatusIcon: document.querySelector("#selfMicStatusIcon"),
			avatarContainer: document.querySelector("#selfAvatarContainer"),
		};
		await this.streamMod.mute(DOMElement);
		await this.streamMod.stopVideo(DOMElement);
		socket.emit("denied-media-permission");
	};

	finishRender = () => {
		if (!isFinishRender && cnt === Object.keys(peers).length + 1) {
			isFinishRender = true;
			this.commonMod.closePreload("#preloader");
			socket.emit("finished-render");
		}
	};
}

export default MainDisplayMod;
