// controller
import RoomController from "../controllers/roomController.js";
import AvatarController from "../controllers/avatarController.js";

// modules
import StreamMod from "../models/streamMod.js";
import ScreenShareMod from "../models/screenShareMod.js";
import MainDisplayMod from "../models/mainDisplayMod.js";
import OffcanvasMod from "../models/offcanvasMod.js";
import RoomInfoMod from "../models/roomInfoMod.js";
import ChatRoomMod from "../models/chatRoomMod.js";
import ParticipantMod from "../models/participantMod.js";
import MailMod from "../models/mailMod.js";

const roomController = new RoomController();
const avatarController = new AvatarController();

const streamMod = new StreamMod();
const screenShareMod = new ScreenShareMod();
const mainDisplayMod = new MainDisplayMod();
const offcanvasMod = new OffcanvasMod();
const roomInfoMod = new RoomInfoMod();
const chatRoomMod = new ChatRoomMod();
const participantMod = new ParticipantMod();
const mailMod = new MailMod();

/**
 * ============================== Event Listeners ==============================
 */
const btnsArray = [
	document.querySelector("#audioBtn"),
	document.querySelector("#videoBtn"),
	document.querySelector("#screenShareBtn"),
	document.querySelector("#screenRecordBtn"),
	document.querySelector("#leaveBtn"),
	document.querySelector("#infoOffcanvasBtn"),
	document.querySelector("#infoOffcanvasCloseBtn"),
	document.querySelector("#participantOffcanvasBtn"),
	document.querySelector("#participantOffcanvasCloseBtn"),
	document.querySelector("#addParticipantBtn"),
	document.querySelector("#addInviteList"),
	document.querySelector("#sendEmail"),
	document.querySelector("#inviteModalCloseBtn"),
	document.querySelector("#closeParticpantList"),
	document.querySelector("#searchParticipantBtn"),
	document.querySelector("#chatOffcanvasBtn"),
	document.querySelector("#chatOffcanvasCloseBtn"),
	document.querySelector("#emojiSelectorBtn"),
	document.querySelector("#emojiCloseBtn"),
	document.querySelector("#sendMsgBtn"),
	document.querySelector("#handCanvasOffcanvasBtn"),
	document.querySelector("#handCanvasOffcanvasCloseBtn"),
];

const avatarImgs = document.querySelectorAll("img[name='avatarImg']");

window.addEventListener("load", roomController.init);

window.addEventListener("keydown", roomController.hotKeysControl);

window.addEventListener("beforeunload", roomController.closeWindow);

document
	.querySelector("#searchParticipantInput")
	.addEventListener("keyup", participantMod.searchBtnControl);

document
	.querySelector("#senderName")
	.addEventListener("keyup", mailMod.recheckSenderName);

document
	.querySelector("#recipientEmail")
	.addEventListener("keyup", mailMod.recheckRecipientEmail);

document
	.querySelector("#messageInput")
	.addEventListener("keyup", chatRoomMod.sendMsgBtnControl);

document
	.querySelector("#fileShare")
	.addEventListener("change", chatRoomMod.uploadFile);

document
	.querySelector("#emojiSearch")
	.addEventListener("keyup", chatRoomMod.searchEmoji);

document
	.querySelector("#copyInfoBtn")
	.addEventListener("mouseout", roomInfoMod.hideTooltips);

document
	.querySelector("#copyInfoBtn")
	.addEventListener("click", roomInfoMod.showTooltips);

for (const btn of btnsArray) {
	btn.addEventListener("click", roomController.btnControl);
}

for (const img of avatarImgs) {
	img.addEventListener("load", avatarController.resizeAvatar);
}

/**
 * ============================== Socket IO and Peer JS ==============================
 */
peer.on("error", async (err) => {
	console.log(err);
});

peer.on("call", async (call) => {
	await call.answer(myStream);

	await call.on("stream", async (userStream) => {
		if (call.metadata.type === "video") {
			if (!peers[call.peer]) {
				peers[call.peer] = call;
				cnt = await participantMod.getAllParticipants();
				const userInfo = await participantMod.getParticipantInfo(call.peer);
				if (userInfo === null) {
					return;
				}
				const DOMElement = {
					type: "roomOther",
					videoItemContainer: document.createElement("div"),
					videoItem: document.createElement("div"),
					video: document.createElement("video"),
					avatarContainer: document.createElement("div"),
					avatarContent: document.createElement("div"),
					avatar: document.createElement("div"),
					avatarImg: document.createElement("img"),
					nameTag: document.createElement("div"),
					micStatus: document.createElement("div"),
					micStatusIcon: document.createElement("i"),
					participantId: call.peer,
					stream: userStream,
					participantName: userInfo.data.participantName,
					avatarImgUrl: userInfo.data.avatarImgUrl,
					isMuted: userInfo.data.isMuted,
					isStoppedVideo: userInfo.data.isStoppedVideo,
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
				await participantMod.setParticipantMap(DOMElement);
				await participantMod.addParticipantList(DOMElement);
				await mainDisplayMod.addRoomStream(DOMElement);
				await streamMod.initMediaControl(DOMElement);
				renderCnt++;
				mainDisplayMod.finishRender();
			}
		} else if (call.metadata.type === "screensharing") {
			screenShareMod.checkScreenShare();
			screenShareMap.set("screenSharing", call.peer);
			const screenShareDOMElement = {
				stream: userStream,
				screenShareId: call.peer,
			};
			screenShareMod.doScreenShare(screenShareDOMElement);
		}
	});
});

const connectToNewUser = async (DOMElement) => {
	const participantId = DOMElement.participantId;
	const participantName = DOMElement.participantName;
	const videoStream = DOMElement.videoStream;
	const screenShareStream = DOMElement.screenShareStream;

	const call = peer.call(participantId, videoStream, {
		metadata: { type: "video" },
	});

	if (myScreenShareStream) {
		peer.call(participantId, screenShareStream, {
			metadata: { type: "screensharing" },
		});
	}

	await call.on("stream", async (userStream) => {
		if (!peers[call.peer]) {
			peers[call.peer] = call;
			cnt = await participantMod.getAllParticipants();
			const userInfo = await participantMod.getParticipantInfo(call.peer);

			const DOMElement = {
				type: "roomOther",
				videoItemContainer: document.createElement("div"),
				videoItem: document.createElement("div"),
				video: document.createElement("video"),
				avatarContainer: document.createElement("div"),
				avatarContent: document.createElement("div"),
				avatar: document.createElement("div"),
				avatarImg: document.createElement("img"),
				nameTag: document.createElement("div"),
				micStatus: document.createElement("div"),
				micStatusIcon: document.createElement("i"),
				participantName: participantName,
				participantId: participantId,
				stream: userStream,
				avatarImgUrl: userInfo.data.avatarImgUrl,
				isMuted: userInfo.data.isMuted,
				isStoppedVideo: userInfo.data.isStoppedVideo,
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
			await participantMod.setParticipantMap(DOMElement);
			await participantMod.addParticipantList(DOMElement);
			await mainDisplayMod.addRoomStream(DOMElement);
			await streamMod.initMediaControl(DOMElement);
			renderCnt++;
			mainDisplayMod.finishRender();
		}
	});

	await call.on("close", async () => {
		const participantId = call.peer;
		const video = document.getElementById(`${participantId}Video`);
		video.remove();
	});
};

socket.on(
	"user-connected",
	async (participantId, participantName, avatarImgUrl) => {
		const DOMElement = {
			participantId: participantId,
			participantName: participantName,
			videoStream: myStream,
			screenShareStream: myScreenShareStream,
			avatarImgUrl: avatarImgUrl,
		};
		await connectToNewUser(DOMElement);
		participantMod.displayJoinRoomNotify(participantName, avatarImgUrl);
	}
);

socket.on("user-finished-render", (participantId) => {
	if (JSON.parse(IS_MUTED) === myStream.getAudioTracks()[0].enabled) {
		if (!myStream.getAudioTracks()[0].enabled) {
			socket.emit("mute");
		} else {
			socket.emit("unmute");
		}
	}

	if (JSON.parse(IS_STOPPED_VIDEO) === myStream.getVideoTracks()[0].enabled) {
		if (!myStream.getVideoTracks()[0].enabled) {
			socket.emit("stop-video");
		} else {
			socket.emit("play-video");
		}
	}

	if (
		!document
			.querySelector("#screenShareBtn")
			.classList.contains("main-btn-clicked")
	) {
		socket.emit("stop-screen-share");
	}
});

socket.on("user-mute", async (participantId) => {
	if (!isFinishRender || !peers[participantId]) {
		return;
	}

	let stream = null;
	if (participantMap.get(participantId)) {
		stream = participantMap.get(participantId).stream;
	}
	const DOMElement = {
		type: "roomOther",
		stream: stream,
		video: document.getElementById(`${participantId}Video`),
		avatarContainer: document.getElementById(`${participantId}AvatarContainer`),
		participantMuteUnmute: document.getElementById(
			`${participantId}ParticipantMuteUnmute`
		),
		participantPlayStopVideo: document.getElementById(
			`${participantId}ParticipantPlayStopVideo`
		),
		micStatusIcon: document.getElementById(`${participantId}MicStatusIcon`),
	};
	await streamMod.mute(DOMElement);
});

socket.on("user-unmute", async (participantId) => {
	if (!isFinishRender || !peers[participantId]) {
		return;
	}

	let stream = null;
	if (participantMap.get(participantId)) {
		stream = participantMap.get(participantId).stream;
	}
	const DOMElement = {
		type: "roomOther",
		stream: stream,
		video: document.getElementById(`${participantId}Video`),
		avatarContainer: document.getElementById(`${participantId}AvatarContainer`),
		participantMuteUnmute: document.getElementById(
			`${participantId}ParticipantMuteUnmute`
		),
		participantPlayStopVideo: document.getElementById(
			`${participantId}ParticipantPlayStopVideo`
		),
		micStatusIcon: document.getElementById(`${participantId}MicStatusIcon`),
	};
	await streamMod.unmute(DOMElement);
});

socket.on("user-stop-video", async (participantId) => {
	if (!isFinishRender || !peers[participantId]) {
		return;
	}

	let stream = null;
	if (participantMap.get(participantId)) {
		stream = participantMap.get(participantId).stream;
	}
	const DOMElement = {
		type: "roomOther",
		stream: stream,
		video: document.getElementById(`${participantId}Video`),
		avatarContainer: document.getElementById(`${participantId}AvatarContainer`),
		participantMuteUnmute: document.getElementById(
			`${participantId}ParticipantMuteUnmute`
		),
		participantPlayStopVideo: document.getElementById(
			`${participantId}ParticipantPlayStopVideo`
		),
	};
	await streamMod.stopVideo(DOMElement);
});

socket.on("user-play-video", async (participantId) => {
	if (!isFinishRender || !peers[participantId]) {
		return;
	}

	let stream = null;
	if (participantMap.get(participantId)) {
		stream = participantMap.get(participantId).stream;
	}
	const DOMElement = {
		type: "roomOther",
		stream: stream,
		video: document.getElementById(`${participantId}Video`),
		avatarContainer: document.getElementById(`${participantId}AvatarContainer`),
		participantMuteUnmute: document.getElementById(
			`${participantId}ParticipantMuteUnmute`
		),
		participantPlayStopVideo: document.getElementById(
			`${participantId}ParticipantPlayStopVideo`
		),
	};
	await streamMod.playVideo(DOMElement);
});

socket.on("user-stop-screen-share", async (participantId) => {
	if (screenShareMap.get("screenSharing") === participantId) {
		screenShareMod.stopSreenShareVideo();
		screenShareMap.clear();
	}
});

socket.on("user-denied-media-permission", async (participantId) => {
	let stream = null;
	if (participantMap.get(participantId)) {
		stream = participantMap.get(participantId).stream;
	}
	const DOMElement = {
		type: "roomOther",
		stream: stream,
		video: document.getElementById(`${participantId}Video`),
		avatarContainer: document.getElementById(`${participantId}AvatarContainer`),
		participantMuteUnmute: document.getElementById(
			`${participantId}ParticipantMuteUnmute`
		),
		participantPlayStopVideo: document.getElementById(
			`${participantId}ParticipantPlayStopVideo`
		),
		micStatusIcon: document.getElementById(`${participantId}MicStatusIcon`),
	};
	await streamMod.mute(DOMElement);
	await streamMod.stopVideo(DOMElement);
});

socket.on("user-send-message", (elementObj) => {
	chatRoomMod.displayMessage(elementObj);
	chatRoomMod.scrollToBottom();
	offcanvasMod.displayChatBadage(elementObj);
});

socket.on("user-share-file", (elementObj) => {
	chatRoomMod.displayFileShared(elementObj);
	chatRoomMod.scrollToBottom();
});

socket.on("connect_error", () => {
	setTimeout(() => {
		socket.connect();
	}, 1000);
});

socket.on("user-disconnected", async (participantId, participantName) => {
	if (peers[participantId]) {
		peers[participantId].close();
	}

	await participantMod.removeParticipant(ROOM_ID, participantId);

	cnt = await participantMod.getAllParticipants();

	await participantMod.removeParticipantList(participantId);

	await mainDisplayMod.removeRoomVideoItemContainer(participantId);

	if (screenShareMap.get("screenSharing") === participantId) {
		await screenShareMod.stopSreenShareVideo();
	}

	const avatarDOMElement = {
		selfAvatarContainer: document.querySelector("#selfAvatarContainer"),
		selfAvatarContent: document.querySelector("#selfAvatarContent"),
		selfAvatar: document.querySelector("#selfAvatar"),
		otherAvatarContainers: document.querySelectorAll(
			'[name="otherAvatarContainer"]'
		),
		otherAvatarContents: document.querySelectorAll(
			'[name="otherAvatarContents"]'
		),
		otherAvatars: document.querySelectorAll('[name="otherAvatar"]'),
	};

	await mainDisplayMod.setRoomAvatarStyle(avatarDOMElement);

	const videoDOMElement = {
		selfVideoItemContainer: document.querySelector("#selfVideoItemContainer"),
		selfVideoItem: document.querySelector("#selfVideoItem"),
		selfVideo: document.querySelector("#selfVideo"),
		otherVideoItemContainers: document.querySelectorAll(
			'[name="otherVideoItemContainer"]'
		),
		otherVideoItems: document.querySelectorAll('[name="otherVideoItem"]'),
		otherVideos: document.querySelectorAll('[name="otherVideo"]'),
	};
	await mainDisplayMod.setRoomVideoGridStyle(videoDOMElement);
	participantMod.displayLeaveRoomNotify(participantName);
	delete peers[participantId];
});
