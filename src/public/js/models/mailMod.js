/** @format */

import CommonMod from "../models/commonMod.js";
import InputValidator from "../validators/inputValidator.js";

class MailMod {
	constructor() {
		this.commonMod = new CommonMod();
		this.inputValidator = new InputValidator();
		this.timeout = null;
		this.inviteListObj = {};
		this.inviteModalCloseBtn = document.querySelector("#inviteModalCloseBtn");
		this.inviteFailedMsg = document.querySelector("#inviteFailedMsg");
		this.recipientEmail = document.querySelector("#recipientEmail");
		this.recipientEmailInvalidMsg = document.querySelector(
			"#recipientEmailInvalidMsg"
		);
		this.senderName = document.querySelector("#senderName");
		this.inviteList = document.querySelector("#inviteList");
		this.sendEmail = document.querySelector("#sendEmail");
		this.inviteNotify = document.querySelector("#inviteNotify");
	}

	initInviteListModal = () => {
		this.clearInputValidate();
		this.clearInviteInputsAndList();
		this.senderName.value = PARTICIPANT_NAME;
	};

	sendMail = async () => {
		const payload = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				senderName: this.senderName.value.trim(),
				recipientEmailArray: inviteListArray,
				roomId: ROOM_ID,
			}),
		};
		const reponse = await fetch("/api/mail", payload);
		const result = await reponse.json();
		return result;
	};

	addInviteList = async () => {
		this.inviteFailedMsg.classList.add("none");
		const email = this.recipientEmail.value.trim();
		if (
			!this.checkRecipientEmail() ||
			!this.checkSenderName() ||
			!this.checkDuplicateRecipientEmail()
		) {
			return;
		}
		inviteListArray.push(email);
		this.inviteListObj = {
			senderName: this.senderName.value,
			recipientEmail: inviteListArray,
			roomLink: `miniroom.online/${ROOM_ID}`,
		};
		this.displayInviteList(email);
		this.clearInputValidate();
		this.clearInviteInputs();
		this.sendEmailBtnControl();
	};

	checkSenderName = () => {
		const nameCheck = this.inputValidator.nameValidator({
			username: this.senderName.value.trim(),
		});
		if (!nameCheck) {
			this.senderName.classList.remove("is-valid");
			this.senderName.classList.add("is-invalid");
			return false;
		} else {
			this.senderName.classList.remove("is-invalid");
			this.senderName.classList.add("is-valid");
			return true;
		}
	};

	recheckSenderName = () => {
		this.inviteFailedMsg.classList.add("none");
		if (
			!this.senderName.classList.contains("is-valid") &&
			!this.senderName.classList.contains("is-invalid")
		) {
			return;
		}
		this.checkSenderName();
	};

	checkRecipientEmail = () => {
		const emailCheck = this.inputValidator.emailValidator({
			email: this.recipientEmail.value,
		});
		if (!emailCheck) {
			this.recipientEmail.classList.remove("is-valid");
			this.recipientEmail.classList.add("is-invalid");
			this.recipientEmailInvalidMsg.textContent = "Please enter a valid email.";
			return false;
		}
		return true;
	};

	checkDuplicateRecipientEmail = () => {
		if (inviteListArray.includes(this.recipientEmail.value.trim())) {
			this.recipientEmail.classList.remove("is-valid");
			this.recipientEmail.classList.add("is-invalid");
			this.recipientEmailInvalidMsg.textContent =
				"This email is already on the invite list.";
			return false;
		}
		return true;
	};

	recheckRecipientEmail = () => {
		this.inviteFailedMsg.classList.add("none");
		if (
			!this.recipientEmail.classList.contains("is-valid") &&
			!this.recipientEmail.classList.contains("is-invalid")
		) {
			return;
		}

		if (!this.checkRecipientEmail()) {
			return;
		} else if (
			this.inputValidator.emailValidator({
				email: this.recipientEmail.value,
			})
		) {
			this.recipientEmail.classList.remove("is-invalid");
			this.recipientEmail.classList.add("is-valid");
		}

		if (!this.checkDuplicateRecipientEmail()) {
			return;
		} else if (!inviteListArray.includes(this.recipientEmail.value.trim())) {
			this.recipientEmail.classList.remove("is-invalid");
			this.recipientEmail.classList.add("is-valid");
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
		this.inviteList.appendChild(inviteListItem);
	};

	doInvite = async () => {
		this.commonMod.openPreload("#preloader");
		this.inviteFailedMsg.classList.add("none");
		if (inviteListArray.length === 0) {
			this.displayInviteFailedMsg("There are no email address!");
			return;
		}
		clearTimeout(this.timeout);
		const result = await this.sendMail();
		if (result.error) {
			this.displayInviteFailedMsg(result.message);
			return;
		}
		inviteListArray.length = 0;
		this.inviteNotify.classList.add("invite-notify-active");
		this.clearInviteInputsAndList();
		this.sendEmailBtnControl();
		this.inviteModalCloseBtn.click();
		this.commonMod.closePreload("#preloader");
		this.timer = setTimeout(this.clearInviteNotify, 10000);
	};

	sendEmailBtnControl = () => {
		if (inviteListArray.length !== 0) {
			this.sendEmail.disabled = false;
		} else {
			this.sendEmail.disabled = true;
		}
	};

	displayInviteFailedMsg = (msg) => {
		this.inviteFailedMsg.textContent = msg;
		this.inviteFailedMsg.classList.remove("none");
	};

	removeInviteList = (e) => {
		const removeEmail = e.target.id.replace("EmailRemoveBtn", "");
		const index = inviteListArray.indexOf(removeEmail);
		inviteListArray.splice(index, 1);
		document.getElementById(`${removeEmail}InviteListItem`).remove();
		this.recheckRecipientEmail();
		this.sendEmailBtnControl();
		this.inviteFailedMsg.classList.add("none");
	};

	clearInviteInputs = () => {
		document.querySelector("#recipientEmail").value = "";
	};

	clearInputValidate = () => {
		this.recipientEmail.classList.remove("is-invalid");
		this.recipientEmail.classList.remove("is-valid");
		this.senderName.classList.remove("is-invalid");
		this.senderName.classList.remove("is-valid");
	};

	clearInviteInputsAndList = () => {
		for (const key in this.inviteListObj) {
			delete this.inviteListObj[key];
		}
		inviteListArray.length = 0;
		this.recipientEmail.value = "";
		this.inviteList.innerHTML = "";
		this.inviteFailedMsg.classList.add("none");
	};

	clearInviteNotify = () => {
		this.inviteNotify.classList.remove("invite-notify-active");
	};
}

export default MailMod;
