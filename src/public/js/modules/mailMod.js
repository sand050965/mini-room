class MailMod {
  constructor() {
    this.inviteListArray = [];
    this.inviteListObj = {};
  }

  initInviteListModal = () => {
    this.clearInviteInputsAndList();
    document.querySelector("#senderName").value = PARTICIPANT_NAME;
  };

  sendMail = async () => {
    const postData = {
      methos: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inviteList: this.inviteListArray,
      }),
    };
    const reponse = await fetch("/api/mail", postData);
    const result = await reponse.json();
    return result;
  };

  addInviteList = async () => {
    try {
      const recipientEmail = document.querySelector("#recipientEmail").value;
      this.inviteListArray.push(recipientEmail);
      this.inviteListObj = {
        senderName: document.querySelector("#senderName").value,
        recipientEmail: this.inviteListArray,
        roomLink: `miniroom.online/${ROOM_ID}`,
      };
      this.displayInviteList(recipientEmail);
      this.clearInviteInputs();
    } catch (e) {
      console.log(e);
    }
  };

  displayInviteList = (recipientEmail) => {
    const inviteListItem = document.createElement("div");
    const inviteListContent = document.createElement("div");
    const inviteListText = document.createElement("div");
    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("id", `${recipientEmail}EmailRemoveBtn`);
    closeBtn.addEventListener("click", this.removeInviteList);
    closeBtn.classList.add("btn-close");
    closeBtn.classList.add("invite-list-close-btn");
    closeBtn.setAttribute("type", "button");
    inviteListText.textContent = `<${recipientEmail}>;\n`;
    inviteListContent.appendChild(inviteListText);
    inviteListContent.appendChild(closeBtn);
    inviteListContent.classList.add("invite-list-content");
    inviteListItem.classList.add("invite-list-item");
    inviteListItem.setAttribute("id", `${recipientEmail}InviteListItem`);
    inviteListItem.appendChild(inviteListContent);
    document.querySelector("#inviteList").appendChild(inviteListItem);
  };

  doInvite = async () => {
    await this.sendMail();
    this.inviteListArray.length = 0;
    this.clearInviteInputsAndList();
  };

  removeInviteList = (e) => {
    const removeEmail = e.target.id.replace("EmailRemoveBtn", "");
    const index = this.inviteListArray.indexOf(removeEmail);
    this.inviteListArray.splice(index, 1);
    document.getElementById(`${removeEmail}InviteListItem`).remove();
  };

  clearInviteInputs = () => {
    document.querySelector("#recipientEmail").value = "";
  };

  clearInviteInputsAndList = () => {
    for (const key in this.inviteListObj) {
      delete this.inviteListObj[key];
    }
    this.inviteListArray.length = 0;
    document.querySelector("#senderName").value = "";
    document.querySelector("#recipientEmail").value = "";
    document.querySelector("#inviteList").innerHTML = "";
  };
}

export default MailMod;
