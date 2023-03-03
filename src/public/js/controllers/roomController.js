/** @format */

import StreamMod from "../models/streamMod.js";
import ScreenShareMod from "../models/screenShareMod.js";
import ScreenRecordMod from "../models/screenRecordMod.js";
import MainDisplayMod from "../models/mainDisplayMod.js";
import OffcanvasMod from "../models/offcanvasMod.js";
import RoomInfoMod from "../models/roomInfoMod.js";
import ChatRoomMod from "../models/chatRoomMod.js";
import ParticipantMod from "../models/participantMod.js";
import MailMod from "../models/mailMod.js";
import CommonMod from "../models/commonMod.js";

class RoomController {
	constructor() {
		this.streamMod = new StreamMod();
		this.screenShareMod = new ScreenShareMod();
		this.screenRecordMod = new ScreenRecordMod();
		this.mainDisplayMod = new MainDisplayMod();
		this.offcanvasMod = new OffcanvasMod();
		this.roomInfoMod = new RoomInfoMod();
		this.chatRoomMod = new ChatRoomMod();
		this.participantMod = new ParticipantMod();
		this.mailMod = new MailMod();
		this.commonMod = new CommonMod();
	}

	init = async () => {
		try {
			this.commonMod.openPreload("#preloader");
			myStream = await this.streamMod.getUserMediaStream();
			const myVideo = document.createElement("video");
			myVideo.muted = true;
			await this.chatRoomMod.loadEmoji();
			// Add Element into DOMElement Object
			const DOMElement = {
				type: "roomSelf",
				videoBtn: document.querySelector("#videoBtn"),
				videoBtnIcon: document.querySelector("#videoBtnIcon"),
				audioBtn: document.querySelector("#audioBtn"),
				audioBtnIcon: document.querySelector("#audioBtnIcon"),
				stream: myStream,
				videoItemContainer: document.createElement("div"),
				videoItem: document.createElement("div"),
				video: myVideo,
				avatarContainer: document.createElement("div"),
				avatarContent: document.createElement("div"),
				avatar: document.createElement("div"),
				avatarImg: document.createElement("img"),
				avatarImgUrl: AVATAR_IMG_URL,
				nameTag: document.createElement("div"),
				micStatus: document.createElement("div"),
				micStatusIcon: document.createElement("i"),
				participantName: PARTICIPANT_NAME,
				participantId: PARTICIPANT_ID,
				isMuted: JSON.parse(IS_MUTED),
				isStoppedVideo: JSON.parse(IS_STOPPED_VIDEO),
				participantContainer: document.createElement("div"),
				participantAvatar: document.createElement("div"),
				participantAvatarImg: document.createElement("img"),
				participantContent: document.createElement("div"),
				participantNameTag: document.createElement("div"),
				participantMediaContainer: document.createElement("div"),
				participantMuteUnmuteContainer: document.createElement("div"),
				participantMuteUnmute: document.createElement("i"),
				participantPlayStopVideoContainer: document.createElement("div"),
				participantPlayStopVideo: document.createElement("i"),
			};
			this.roomInfoMod.initInfo();
			await this.participantMod.setParticipantMap(DOMElement);
			await this.participantMod.addParticipantList(DOMElement);
			DOMElement.participantPlayStopVideo = document.querySelector(
				"#selfParticipantPlayStopVideo"
			);
			DOMElement.participantMuteUnmute = document.querySelector(
				"#selfParticipantMuteUnmute"
			);
			await this.mainDisplayMod.addRoomStream(DOMElement);
			await this.streamMod.initMediaControl(DOMElement);
			this.commonMod.closePreload("#preloader");
		} catch (err) {
			console.log(err);
			this.commonMod.closePreload("#preloader");
		}
		socket.emit(
			"join-room",
			ROOM_ID,
			PARTICIPANT_ID,
			PARTICIPANT_NAME,
			AVATAR_IMG_URL
		);
	};

	btnControl = async (e) => {
		const DOMElement = {
			page: "room",
			type: "roomSelf",
			isLoseTrack: isLoseTrack,
			video: document.querySelector("#selfVideo"),
			avatarContainer: document.querySelector("#selfAvatarContainer"),
			stream: document.querySelector("#selfVideo").srcObject,
			videoBtn: document.querySelector("#videoBtn"),
			videoBtnIcon: document.querySelector("#videoBtnIcon"),
			audioBtn: document.querySelector("#audioBtn"),
			audioBtnIcon: document.querySelector("#audioBtnIcon"),
			participantMuteUnmute: document.querySelector(
				"#selfParticipantMuteUnmute"
			),
			participantPlayStopVideo: document.querySelector(
				"#selfParticipantPlayStopVideo"
			),
			micStatusIcon: document.querySelector("#selfMicStatusIcon"),
		};

		if (e.target.id.includes("audioBtn")) {
			// muteUnmute btn is clicked
			const isMuted = await this.streamMod.muteUnmute(DOMElement);
			this.streamMod.selfAudioControl(isMuted);
		} else if (e.target.id.includes("videoBtn")) {
			// playStop video btn is clicked
			const isStoppedVideo = await this.streamMod.playStopVideo(DOMElement);
			this.streamMod.selfVideoControl(isStoppedVideo);
		} else if (e.target.id.includes("screenShareBtn")) {
			// share screen btn is clicked
			this.screenShareMod.doMyScreenShare();
		} else if (e.target.id.includes("screenRecordBtn")) {
			// screen record btn is clicked
			this.screenRecordMod.recordBtnControl();
		} else if (e.target.id.includes("leaveBtn")) {
			// leave btn is clicked
			this.leaveRoom();
		} else if (e.target.id.includes("infoOffcanvasBtn")) {
			// info offcanvas btn is clicked
			const offcanvasDOMElement = {
				tagetBsOffcanvas: this.offcanvasMod.BsInfoOffcanvas,
				btnId: e.target.id.replace("Icon", ""),
				target: e.target.id.replace("Icon", "").replace("Btn", ""),
			};
			this.offcanvasMod.toggleOffcanvas(offcanvasDOMElement);
		} else if (e.target.id.includes("participantOffcanvasBtn")) {
			// participant offcanvas btn is clicked
			const offcanvasDOMElement = {
				tagetBsOffcanvas: this.offcanvasMod.BsParticipantOffcanvas,
				btnId: e.target.id.replace("Icon", ""),
				target: e.target.id.replace("Icon", "").replace("Btn", ""),
			};
			this.offcanvasMod.toggleOffcanvas(offcanvasDOMElement);
		} else if (e.target.id.includes("chatOffcanvasBtn")) {
			// chat offcanvas btn is clicked
			const offcanvasDOMElement = {
				tagetBsOffcanvas: this.offcanvasMod.BsChatOffcanvas,
				btnId: e.target.id.replace("Icon", ""),
				target: e.target.id.replace("Icon", "").replace("Btn", ""),
			};
			this.chatRoomMod.closeEmoji();
			this.offcanvasMod.toggleOffcanvas(offcanvasDOMElement);
		} else if (e.target.id.includes("OffcanvasCloseBtn")) {
			// offcanvas close btn is clicked
			const offcanvasDOMElement = {
				target: e.target.id.replace("CloseBtn", ""),
				btnId: e.target.id.replace("Close", ""),
			};
			this.offcanvasMod.offcanvasCloseControl(offcanvasDOMElement);
			this.offcanvasMod.offcanvasCloseGrid();
		} else if (e.target.id.includes("addParticipantBtn")) {
			// add email to invite list
			this.mailMod.initInviteListModal();
		} else if (e.target.id === "addInviteList") {
			this.mailMod.addInviteList();
		} else if (e.target.id.includes("sendEmail")) {
			// send invitation email
			this.mailMod.doInvite();
		} else if (e.target.id.includes("closeParticpantList")) {
			// cancel search participant
			this.participantMod.cancelSearchParticipant();
			this.participantMod.searchBtnControl();
		} else if (e.target.id.includes("searchParticipantBtn")) {
			// search participant
			this.participantMod.doSearchParticipant();
		} else if (
			e.target.id.includes("emojiSelector") ||
			e.target.id.includes("emojiCloseBtn")
		) {
			// toggle emoji selector
			this.chatRoomMod.toggleEmoji();
		} else if (e.target.id.includes("sendMsgBtn")) {
			// send msg btn is clicked
			this.chatRoomMod.sendMessage();
		}
	};

	hotKeysControl = (e) => {
		if (e.which === 13) {
			e.preventDefault();
			if (
				offcanvasMap.get("isOpen").includes("chat") &&
				messageInput.value.trim() !== ""
			) {
				this.chatRoomMod.sendMessage();
			} else if (
				offcanvasMap.get("isOpen").includes("participant") &&
				searchParticipantInput.value.trim() !== ""
			) {
				this.participantMod.doSearchParticipant();
			}
		} else if (e.which === 27) {
			if (offcanvasMap.get("isOpen").includes("chat")) {
				this.chatRoomMod.closeEmoji();
			}
		}
	};

	closeWindow = async () => {
		await socket.disconnect();
		await this.participantMod.removeParticipant(ROOM_ID, PARTICIPANT_ID);
	};
	
	leaveRoom = async () => {
		await this.commonMod.openPreload("#preloader");
		await socket.disconnect();
		await this.participantMod.removeParticipant(ROOM_ID, PARTICIPANT_ID);
		window.location = "/thankyou";
	};
}

export default RoomController;
