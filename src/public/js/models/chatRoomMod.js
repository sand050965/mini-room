/** @format */

import RoomInfoMod from "../models/roomInfoMod.js";

class ChatRoomMod {
	constructor() {
		this.roomInfoMod = new RoomInfoMod();
		this.chatOffcanvasBody = document.querySelector("#chatOffcanvasBody");
		this.messageContainer = document.querySelector("#messageContainer");
		this.messageInputContainer = document.querySelector(
			"#messageInputContainer"
		);
		this.messageInput = document.querySelector("#messageInput");
		this.sendMsgBtn = document.querySelector("#sendMsgBtn");
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

	sendMessage = () => {
		const message = this.messageInput.value.trim();
		const timeElement = this.roomInfoMod.getTime();
		const time = `${timeElement.h}:${timeElement.m} ${timeElement.session}`;
		if (message.length !== 0) {
			socket.emit("message", message, time, AVATAR_IMG_URL);
			this.messageInput.value = "";
			this.sendMsgBtnControl();
		}
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
