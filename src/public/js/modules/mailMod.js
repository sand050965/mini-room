class MailMod {
  constructor() {
    this.inviteListArray = [];
  }

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
      const data = {
        senderName: document.querySelector("#senderName"),
        recipientEmail: document.querySelector("#recipientEmail"),
        roomLink: `miniroom.online/${ROOM_ID}`,
      };
      this.inviteListArray.push(data);
      this.displayInviteList();
      this.clearInviteInputs();
    } catch (e) {
      console.log(e);
    }
  };

  displayInviteList = (data) => {
    const inviteContent = `<${data.recipientEmail}>;\n`;
    inviteList.value += inviteContent;
  };

  doInvite = async () => {
    await this.sendMail();
    this.inviteListArray.length = 0;
    this.clearInviteInputsAndList();
  };

  clearInviteInputs = () => {
    document.querySelector("#sender").value = "";
    document.querySelector("#recipientEmail").value = "";
  };

  clearInviteInputsAndList = () => {
    document.querySelector("#sender").value = "";
    document.querySelector("#recipientEmail").value = "";
    document.querySelector("#inviteList").value = "";
  };
}

export default MailMod;
