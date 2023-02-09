class ChatRoomMod {
  constructor() {}

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
    if (message.length !== 0) {
      socket.emit("message", message);
      messageInput.value = "";
      this.sendMsgBtnControl();
    }
  };

  displayMessage = (message, participantId, participantName) => {
    const messageContainer = document.querySelector("#messageContainer");
    const messageContent = document.createElement("div");
    const messageSender = document.createElement("b");
    const mainMessage = document.createElement("div");

    if (participantId === PARTICIPANT_ID) {
      participantName = "You";
      mainMessage.classList.add("self-message");
      messageContent.classList.add("self-message-content");
    } else {
      mainMessage.classList.add("other-message");
    }

    messageSender.textContent = participantName;
    mainMessage.textContent = message;
    mainMessage.classList.add("message");
    messageContent.appendChild(messageSender);
    messageContent.appendChild(mainMessage);
    messageContent.classList.add("message-content");
    messageContainer.appendChild(messageContent);
  };

  scrollToBottom = () => {
    const messageContainer = document.querySelector("#messageContainer");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  };
}

export default ChatRoomMod;
