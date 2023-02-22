/** @format */

import RoomInfoMod from "../models/roomInfoMod.js";

class ChatRoomMod {
	constructor() {
		this.roomInfoMod = new RoomInfoMod();
		this.timeout = null;
		this.uploading = false;
		this.chatOffcanvasBody = document.querySelector("#chatOffcanvasBody");
		this.messageContainer = document.querySelector("#messageContainer");
		this.messageInputContainer = document.querySelector(
			"#messageInputContainer"
		);
		this.messageInput = document.querySelector("#messageInput");
		this.sendMsgBtn = document.querySelector("#sendMsgBtn");
		this.fileShare = document.querySelector("#fileShare");
		this.fileShareContainer = document.querySelector("#fileShareContainer");
		this.uploadFileIcon = document.querySelector("#uploadFileIcon");
		this.uploadFileName = document.querySelector("#uploadFileName");
		this.uploadFileSize = document.querySelector("#uploadFileSize");
		this.fileShareProgress = document.querySelector("#fileShareProgress");
		this.progressBar = document.querySelector("#progressBar");
		this.fileShareErrMsg = document.querySelector("#fileShareErrMsg");
		this.emojiList = document.querySelector("#emojiList");
		this.emojiSelector = document.querySelector("#emojiSelector");
		this.emojiSearch = document.querySelector("#emojiSearch");
	}

	sendMsgBtnControl = () => {
		if (this.messageInput.value.trim().length === 0) {
			this.sendMsgBtn.classList.remove("send-msg-btn-able");
		} else {
			this.sendMsgBtn.classList.add("send-msg-btn-able");
		}
	};

	uploadFile = async (e) => {
		if (this.uploading) {
			return;
		}
		this.uploading = true;
		const file = document.querySelector("#fileShare").files[0];
		if (!file) {
			this.fileShare.value = "";
			this.uploading = false;
			return;
		}
		clearTimeout(this.timeout);
		this.displayFileUploadProgress(file);
		const formData = new FormData();
		formData.append("file", file);
		const config = {
			onUploadProgress: (progressEvent) => {
				const percentCompleted = Math.round(
					(progressEvent.loaded / progressEvent.total) * 100
				);
				this.progressBar.style.width = `${percentCompleted}%`;
			},
		};
		const s3Result = await axios.post("/api/s3/file", formData, config);

		this.hideFileUploadProgress();
		const timeElement = this.roomInfoMod.getTime();
		const fileObj = {
			fileUrl: s3Result.data.data.url,
			fileName: file.name,
			fileSize: this.uploadFileSize.textContent,
			fileType: file.type,
			time: `${timeElement.h}:${timeElement.m} ${timeElement.session}`,
			avatarImgUrl: AVATAR_IMG_URL,
		};
		this.fileShare.value = "";
		this.uploading = false;
		socket.emit("file-share", fileObj);
	};

	displayFileUploadProgress = (file) => {
		this.progressBar.style.width = "0%";
		this.uploadFileName.textContent = file.name;
		if (file.size / 1024 / 1024 > 1) {
			this.uploadFileSize.textContent = `${(file.size / 1024 / 1024).toFixed(
				2
			)} MB`;
		} else if (file.size / 1024 > 1) {
			this.uploadFileSize.textContent = `${(file.size / 1024).toFixed(2)} KB`;
		} else {
			this.uploadFileSize.textContent = `${Math.round(file.size)} bytes`;
		}

		if (
			file.type.includes("jpg") ||
			file.type.includes("jpeg") ||
			file.type.includes("png")
		) {
			this.uploadFileIcon.classList.remove("fa-file");
			this.uploadFileIcon.classList.add("fa-image");
		} else {
			this.uploadFileIcon.classList.remove("fa-image");
			this.uploadFileIcon.classList.add("fa-file");
		}
		this.fileShareErrMsg.classList.add("none");
		this.progressBar.classList.remove("error-progress-bar");
		this.fileShareContainer.classList.remove("none");
		this.fileShareProgress.classList.remove("none");
	};

	displayFileUploadErrMsg = () => {
		this.progressBar.classList.add("error-progress-bar");
		this.fileShareErrMsg.classList.remove("none");
	};

	hideFileUploadProgress = () => {
		this.fileShareContainer.classList.add("none");
		this.fileShareProgress.classList.add("none");
	};

	hideFileUploadErrMsg = () => {
		this.fileShareContainer.classList.add("none");
		this.fileShareProgress.classList.add("none");
		this.fileShareErrMsg.classList.add("none");
	};

	sendMessage = () => {
		const message = this.messageInput.value.trim();
		const timeElement = this.roomInfoMod.getTime();
		const msgObj = {
			message: message,
			time: `${timeElement.h}:${timeElement.m} ${timeElement.session}`,
			avatarImgUrl: AVATAR_IMG_URL,
		};
		if (message.length !== 0) {
			socket.emit("message", msgObj);
			this.messageInput.value = "";
			this.sendMsgBtnControl();
		}
	};

	displayFileShared = (elementObj) => {
		const messageContent = document.createElement("div");
		const messageHeader = document.createElement("div");
		const messageSenderAvatar = document.createElement("div");
		const messageSenderAvatarImg = document.createElement("img");
		const messageSender = document.createElement("b");
		const messageTime = document.createElement("div");
		const mainMessage = document.createElement("div");
		const a = document.createElement("a");
		const fileContainer = document.createElement("div");
		const fileIconContainer = document.createElement("div");
		const fileIcon = document.createElement("i");
		const fileInfo = document.createElement("div");
		const fileName = document.createElement("div");
		const fileSize = document.createElement("div");

		if (elementObj.participantId === PARTICIPANT_ID) {
			elementObj.participantName = "You";
			mainMessage.classList.add("self-message");
			messageContent.classList.add("self-message-content");
			messageHeader.appendChild(messageSender);
			messageHeader.appendChild(messageSenderAvatar);
			messageHeader.classList.add("self-message-header");
		} else {
			mainMessage.classList.add("other-message");
			messageHeader.appendChild(messageSenderAvatar);
			messageHeader.appendChild(messageSender);
			messageHeader.classList.add("message-header");
		}

		messageSender.textContent = elementObj.participantName;
		messageTime.textContent = elementObj.time;
		messageSenderAvatarImg.src = elementObj.avatarImgUrl;
		messageSenderAvatarImg.classList.add("message-avatar-img");
		messageSenderAvatar.classList.add("message-avatar");
		messageSenderAvatar.appendChild(messageSenderAvatarImg);

		a.href = elementObj.fileUrl;
		fileName.textContent = elementObj.fileName;
		fileSize.textContent = elementObj.fileSize;
		fileIcon.classList.add("fa-solid");

		if (
			elementObj.fileType.includes("jpg") ||
			elementObj.fileType.includes("jpeg") ||
			elementObj.fileType.includes("png")
		) {
			fileIcon.classList.add("fa-image");
		} else {
			fileIcon.classList.add("fa-file");
		}

		fileContainer.classList.add("file-share-container");
		fileIconContainer.classList.add("center");
		fileIcon.classList.add("message-file-icon");
		fileInfo.classList.add("file-share-info");
		fileName.classList.add("message-file-name");
		fileSize.classList.add("message-file-size");

		fileIconContainer.appendChild(fileIcon);
		fileInfo.appendChild(fileName);
		fileInfo.appendChild(fileSize);
		fileContainer.appendChild(fileIconContainer);
		fileContainer.appendChild(fileInfo);
		a.appendChild(fileContainer);

		mainMessage.classList.add("message");
		mainMessage.classList.add("file-message");
		mainMessage.appendChild(a);
		messageContent.appendChild(messageHeader);
		messageContent.appendChild(mainMessage);
		messageContent.appendChild(messageTime);
		messageContent.classList.add("message-content");
		this.messageContainer.appendChild(messageContent);
	};

	displayMessage = (elementObj) => {
		const messageContent = document.createElement("div");
		const messageHeader = document.createElement("div");
		const messageSenderAvatar = document.createElement("div");
		const messageSenderAvatarImg = document.createElement("img");
		const messageSender = document.createElement("b");
		const messageTime = document.createElement("div");
		const mainMessage = document.createElement("div");

		if (elementObj.participantId === PARTICIPANT_ID) {
			elementObj.participantName = "You";
			mainMessage.classList.add("self-message");
			messageContent.classList.add("self-message-content");
			messageHeader.appendChild(messageSender);
			messageHeader.appendChild(messageSenderAvatar);
			messageHeader.classList.add("self-message-header");
		} else {
			mainMessage.classList.add("other-message");
			messageHeader.appendChild(messageSenderAvatar);
			messageHeader.appendChild(messageSender);
			messageHeader.classList.add("message-header");
		}

		messageSender.textContent = elementObj.participantName;
		messageTime.textContent = elementObj.time;
		messageSenderAvatarImg.src = elementObj.avatarImgUrl;
		messageSenderAvatarImg.classList.add("message-avatar-img");
		messageSenderAvatar.classList.add("message-avatar");
		messageSenderAvatar.appendChild(messageSenderAvatarImg);
		mainMessage.textContent = elementObj.message;
		mainMessage.classList.add("message");
		messageContent.appendChild(messageHeader);
		messageContent.appendChild(mainMessage);
		messageContent.appendChild(messageTime);
		messageContent.classList.add("message-content");
		this.messageContainer.appendChild(messageContent);
	};

	scrollToBottom = () => {
		this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
	};

	toggleEmoji = () => {
		if (!this.emojiSelector.classList.contains("active")) {
			this.emojiSearch.value = "";
			this.searchEmoji();
			this.emojiList.scrollTo({ top: 0 });
		}
		this.chatOffcanvasBody.classList.toggle("offcanvas-body-emoji-active");
		this.messageInputContainer.classList.toggle(
			"message-input-container-emoji-active"
		);
		this.emojiSelector.classList.toggle("active");
		this.scrollToBottom();
	};

	loadEmoji = async () => {
		const response = await fetch(
			"https://emoji-api.com/emojis?access_key=680901c4b9044eda66059b909eb9b9ee064f061f"
		);
		const data = await response.json();
		for (const emoji of data) {
			const li = document.createElement("li");
			li.setAttribute("id", emoji.slug);
			li.textContent = emoji.character;
			li.addEventListener("click", this.selectEmoji);
			this.emojiList.appendChild(li);
		}
	};

	searchEmoji = () => {
		const emojis = document.querySelectorAll("#emojiList li");
		for (const emoji of emojis) {
			if (
				!emoji.getAttribute("id").toLowerCase().includes(this.emojiSearch.value)
			) {
				emoji.classList.add("none");
			} else {
				emoji.classList.remove("none");
			}
		}
	};

	selectEmoji = (e) => {
		this.messageInput.value += e.target.textContent;
		this.sendMsgBtnControl();
	};
}

export default ChatRoomMod;
