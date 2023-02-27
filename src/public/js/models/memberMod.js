/** @format */

import CommonMod from "./commonMod.js";
import InputValidator from "../validators/inputValidator.js";

class MemberMod {
	constructor() {
		this.commonMod = new CommonMod();
		this.inputValidator = new InputValidator();
		this.avatarFileUpload = document.querySelector("#avatarFileUpload");
		this.memberAvatarValid = document.querySelector("#memberAvatarValid");
		this.memberAvatarInvalid = document.querySelector("#memberAvatarInvalid");
		this.memberAvatarImg = document.querySelector("#memberAvatarImg");
		this.memberEmail = document.querySelector("#memberEmail");
		this.memberUsername = document.querySelector("#memberUsername");
		this.updateMemberFailed = document.querySelector("#updateMemberFailed");
		this.updateMemberFailedMsg = document.querySelector(
			"#updateMemberFailedMsg"
		);
		this.updataeMemberSuccess = document.querySelector("#updataeMemberSuccess");
		this.updataeMemberSuccessMsg = document.querySelector(
			"#updataeMemberSuccessMsg"
		);
	}

	validateAvatarImg = () => {
		const file = this.avatarFileUpload.files[0];
		if (!file) {
			return true;
		}
		const fileType = file.name.split(".")[1];
		const fileTypeArray = ["jpg", "jpeg", "png"];
		const fileSize = file.size;

		this.memberAvatarValid.removeAttribute("style");
		this.memberAvatarInvalid.removeAttribute("style");

		if (fileSize > 1024 * 1024 * 5) {
			this.displayAvatarValidateStyle(
				false,
				"File size must be less than 1 MB!"
			);
			return false;
		}

		if (!fileTypeArray.includes(fileType)) {
			this.displayAvatarValidateStyle(
				false,
				"File is only allowed to be these file types: [jpeg, jpg, png]!"
			);
			return false;
		}

		this.displayAvatarValidateStyle(true, "");
		return true;
	};

	validateEmail = () => {
		this.updateMemberFailed.classList.add("none");
		if (
			!this.inputValidator.emailValidator({ email: this.memberEmail.value })
		) {
			this.memberEmail.classList.remove("is-valid");
			this.memberEmail.classList.add("is-invalid");
			return false;
		} else {
			if (!this.memberEmail.classList.contains("is-invalid")) {
				return true;
			}
			this.memberEmail.classList.remove("is-invalid");
			this.memberEmail.classList.add("is-valid");
			return true;
		}
	};

	validateUsername = () => {
		this.updateMemberFailed.classList.add("none");
		if (
			!this.inputValidator.nameValidator({
				username: this.memberUsername.value,
			})
		) {
			this.memberUsername.classList.remove("is-valid");
			this.memberUsername.classList.add("is-invalid");
			return false;
		} else {
			if (!this.memberUsername.classList.contains("is-invalid")) {
				return true;
			}
			this.memberUsername.classList.remove("is-invalid");
			this.memberUsername.classList.add("is-valid");
			return true;
		}
	};

	displayAvatarValidateStyle = (isValid, msg) => {
		if (isValid) {
			this.memberAvatarValid.style.display = "block";
		} else {
			this.memberAvatarInvalid.style.display = "block";
			this.memberAvatarInvalid.textContent = msg;
		}
	};

	displayUpdateResult = (isAvatarUpload, result) => {
		if (result.error) {
			this.updataeMemberSuccess.classList.add("none");
			this.updateMemberFailed.classList.remove("none");
			this.updateMemberFailedMsg.textContent = result.message;
			return false;
		} else {
			if (isAvatarUpload) {
				return true;
			}
			this.updateMemberFailed.classList.add("none");
			this.updataeMemberSuccess.classList.remove("none");
			this.updataeMemberSuccessMsg.textContent = "Save successfully!";
			return true;
		}
	};

	checkIsDifferent = (data) => {
		if (
			data.avatarImgUrl === this.memberAvatarImg.src &&
			data.email === this.memberEmail.value &&
			data.username === this.memberUsername.value
		) {
			this.updataeMemberSuccess.classList.remove("none");
			this.updataeMemberSuccessMsg.textContent = "No changes";
			return false;
		}
		return true;
	};

	resetUpdateResult = () => {
		this.updataeMemberSuccess.classList.add("none");
		this.updateMemberFailed.classList.add("none");
	};

	resetInputs = (data) => {
		this.memberAvatarImg.src = data.avatarImgUrl;
		this.memberEmail.value = data.email;
		this.memberUsername.value = data.username;
	};

	resetValidate = () => {
		this.memberAvatarValid.removeAttribute("style");
		this.memberAvatarInvalid.removeAttribute("style");
		this.memberEmail.classList.remove("is-valid");
		this.memberEmail.classList.remove("is-invalid");
		this.memberUsername.classList.remove("is-valid");
		this.memberUsername.classList.remove("is-invalid");
	};
}

export default MemberMod;
