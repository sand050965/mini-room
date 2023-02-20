import RoomInfoMod from "../models/roomInfoMod.js";

class ChatRoomMod {
  constructor() {
    this.roomInfoMod = new RoomInfoMod();
  }

  sendMsgBtnControl = () => {
    const messageInput = document.querySelector("#messageInput");
    const sendMsgBtn = document.querySelector("#sendMsgBtn");
    if (messageInput.value.trim().length === 0) {
      sendMsgBtn.classList.remove("send-msg-btn-able");
    } else {
      sendMsgBtn.classList.add("send-msg-btn-able");
    }
  };

  sendMessage = () => {
    const messageInput = document.querySelector("#messageInput");
    const message = messageInput.value.trim();
    const timeElement = this.roomInfoMod.getTime();
    const time = `${timeElement.h}:${timeElement.m} ${timeElement.session}`;
    if (message.length !== 0) {
      socket.emit("message", message, time, AVATAR_IMG_URL);
      messageInput.value = "";
      this.sendMsgBtnControl();
    }
  };

  displayMessage = (elementObj) => {
    const messageContainer = document.querySelector("#messageContainer");
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
    messageContainer.appendChild(messageContent);
  };

  scrollToBottom = () => {
    const messageContainer = document.querySelector("#messageContainer");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  };
}

export default ChatRoomMod;
