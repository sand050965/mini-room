/** @format */

import UserMod from "../models/userMod.js";
import CommonMod from "../models/commonMod.js";
import InputValidator from "../validators/inputValidator.js";

class UserController {
	constructor() {
		this.commonMod = new CommonMod();
		this.userMod = new UserMod();
		this.inputValidator = new InputValidator();

		this.userModal = new bootstrap.Modal(
			document.querySelector("#userModalContainer")
		);

		// dropdown list
		this.avatarImg = document.querySelector("#avatarImg");
		this.userDropdown = document.querySelector("#userDropdown");
		this.userDropdownMenu = document.querySelector("#userDropdown");
		this.userProfileAvatarImg = document.querySelector("#userProfileAvatarImg");
		this.userProfileName = document.querySelector("#userProfileName");
		this.authStatus = document.querySelector("#authStatus");

		// auth result
		this.authSuccess = document.querySelector("#authSuccess");
		this.authSuccessMsg = document.querySelector("#authSuccessMsg");
		this.authFailed = document.querySelector("#authFailed");
		this.authFailedMsg = document.querySelector("#authFailedMsg");

		// sign up avatar
		this.signUpAvatarContainer = document.querySelector(
			"#signUpAvatarContainer"
		);
		this.signUpAvatarImg = document.querySelector("#signUpAvatarImg");
		this.signUpAvatarValid = document.querySelector("#signUpAvatarValid");
		this.signUpAvatarInvalid = document.querySelector("#signUpAvatarInvalid");
		this.signUpAvatarHelp = document.querySelector("#signUpAvatarHelp");
		this.avatarFileUpload = document.querySelector("#avatarFileUpload");

		// user name
		this.usernameContainer = document.querySelector("#usernameContainer");
		this.username = document.querySelector("#username");

		// email
		this.email = document.querySelector("#email");

		// password
		this.password = document.querySelector("#password");

		// change to sign up or log in
		this.signUpContainer = document.querySelector("#signUpContainer");
		this.loginContainer = document.querySelector("#loginContainer");

		// btns
		this.userModalCloseBtn = document.querySelector("#userModalCloseBtn");
		this.logInBtn = document.querySelector("#logInBtn");
		this.signUpBtn = document.querySelector("#signUpBtn");
	}

	initAuth = async () => {
		const checkResult = await this.userMod.checkUserAuth();
		if (checkResult.data !== null) {
			this.avatarImg.src = checkResult.data.avatarImgUrl;
			this.userProfileAvatarImg.src = checkResult.data.avatarImgUrl;
			this.userProfileName.textContent = checkResult.data.username;
			this.userDropdown.setAttribute("data-bs-toggle", "dropdown");
			this.authStatus.textContent = "Log Out";
		} else {
			this.avatarImg.src =
				"https://s3.amazonaws.com/www.miniroom.online/images/avatar.png";
			await this.userDropdown.removeAttribute("data-bs-toggle", "dropdown");
			this.authStatus.textContent = "Log In / Sign Up";
		}
	};

	initLogIn = async () => {
		await this.userMod.reset();
		await this.signUpAvatarContainer.classList.add("none");
		await this.signUpAvatarHelp.classList.add("none");
		await this.usernameContainer.classList.add("none");
		await this.loginContainer.classList.add("none");
		await this.signUpBtn.classList.add("none");
	};

	initSignUp = async () => {
		await this.userMod.reset();
		await this.signUpContainer.classList.add("none");
		await this.logInBtn.classList.add("none");
	};

	getToMemberProfile = () => {
		window.location = "/member";
	};

	doAuth = async () => {
		await this.initAuth();
		if (this.authStatus.textContent === "Log In / Sign Up") {
			await this.userModal.show();
			await this.initLogIn();
		}
	};

	doLogIn = async () => {
		this.commonMod.openPreload("#preloader");
		await this.userMod.setLogInBtn(true);
		this.userMod.resetValidateStyle();

		const data = {
			email: this.email.value,
			password: this.password.value,
		};
		let isInvalid = false;
		if (!this.inputValidator.emailValidator(data)) {
			this.email.classList.add("is-invalid");
			isInvalid = true;
		}
		if (!this.inputValidator.passwordValidator(data)) {
			this.password.classList.add("is-invalid");
			isInvalid = true;
		}
		if (isInvalid) {
			this.userMod.setLogInBtn(false);
			this.commonMod.closePreload("#preloader");
			return;
		}
		const result = await this.userMod.logIn(data);
		const isSuccess = await this.displayAuthResult("login", result);
		await this.userMod.setLogInBtn(false);

		if (isSuccess) {
			this.userMod.resetValue();
			this.logInBtn.classList.add("none");
			this.signUpBtn.classList.add("none");
			this.userModalCloseBtn.classList.remove("none");
			setTimeout(async () => {
				await this.initAuth();
				await this.userModal.hide();
			}, "1000");
		}

		this.commonMod.closePreload("#preloader");
	};

	doSignUp = async () => {
		this.commonMod.openPreload("#preloader");
		await this.userMod.setSignUpBtn(true);
		this.userMod.resetValidateStyle();

		let avatarImgUrl =
			"https://s3.amazonaws.com/www.miniroom.online/images/avatar.png";
		let isInvalid = false;

		const data = {
			username: this.username.value,
			email: this.email.value,
			password: this.password.value,
		};

		if (this.signUpAvatarInvalid.style === "block") {
			isInvalid = true;
		}

		if (!this.inputValidator.nameValidator(data)) {
			this.username.classList.add("is-invalid");
			isInvalid = true;
		}

		if (!this.inputValidator.emailValidator(data)) {
			this.email.classList.add("is-invalid");
			isInvalid = true;
		}

		if (!this.inputValidator.passwordValidator(data)) {
			this.password.classList.add("is-invalid");
			isInvalid = true;
		}

		if (isInvalid) {
			this.userMod.setSignUpBtn(false);
			this.commonMod.closePreload("#preloader");
			return;
		}

		if (
			this.signUpAvatarImg.src !==
			"https://s3.amazonaws.com/www.miniroom.online/images/avatar.png"
		) {
			// upload avatar image to s3 first
			const s3Result = await this.userMod.storeAvatarToS3({
				file: this.avatarFileUpload.files[0],
			});

			const isS3Success = await this.displayAuthResult(
				"avatarUpload",
				s3Result
			);

			if (isS3Success) {
				avatarImgUrl = s3Result.data.url;
			} else {
				this.userMod.setSignUpBtn(false);
				this.signUpAvatarInvalid.style.display = "block";
				this.commonMod.closePreload("#preloader");
				return;
			}
		}

		data.avatarImgUrl = avatarImgUrl;

		const result = await this.userMod.signUp(data);
		const isSuccess = await this.displayAuthResult("signUp", result);
		await this.userMod.setSignUpBtn(false);

		if (!isSuccess) {
			this.commonMod.closePreload("#preloader");
			return;
		}
		await this.doLogIn();
	};

	doLogOut = async () => {
		if (this.authStatus.textContent !== "Log Out") {
			return;
		}
		await this.userMod.logOut();
		await this.initAuth();
		window.location = "/";
	};

	uploadAvatar = async () => {
		const file = this.avatarFileUpload.files[0];
		// content type check
		const validateResult = await this.validateAvatarImg();
		if (!validateResult) {
			return;
		}
		this.signUpAvatarImg.src = URL.createObjectURL(file);
	};

	validateAvatarImg = () => {
		const file = this.avatarFileUpload.files[0];
		const fileType = file.name.split(".")[1];
		const fileTypeArray = ["jpg", "jpeg", "png"];
		const fileSize = file.size;

		this.signUpAvatarValid.removeAttribute("style");
		this.signUpAvatarInvalid.removeAttribute("style");

		if (fileSize > 1024 * 1024 * 5) {
			this.signUpAvatarInvalid.style.display = "block";
			this.signUpAvatarInvalid.textContent =
				"File size must be less than 1 MB!";
			return false;
		}

		if (!fileTypeArray.includes(fileType)) {
			this.signUpAvatarInvalid.style.display = "block";
			this.signUpAvatarInvalid.textContent =
				"File is only allowed to be these file types: [jpeg, jpg, png]!";
			return false;
		}

		this.signUpAvatarValid.style.display = "block";
		return true;
	};

	validateUsername = () => {
		if (
			!this.username.classList.contains("is-valid") &&
			!this.username.classList.contains("is-invalid")
		) {
			return;
		}
		this.authFailed.classList.add("none");
		if (!this.inputValidator.nameValidator({ username: this.username.value })) {
			this.username.classList.remove("is-valid");
			this.username.classList.add("is-invalid");
		} else {
			this.username.classList.remove("is-invalid");
			this.username.classList.add("is-valid");
		}
	};

	validateEmail = () => {
		if (
			!this.email.classList.contains("is-valid") &&
			!this.email.classList.contains("is-invalid")
		) {
			return;
		}
		this.authFailed.classList.add("none");
		if (!this.inputValidator.emailValidator({ email: this.email.value })) {
			this.email.classList.remove("is-valid");
			this.email.classList.add("is-invalid");
		} else {
			this.email.classList.remove("is-invalid");
			this.email.classList.add("is-valid");
		}
	};

	validatePassword = () => {
		if (
			!this.password.classList.contains("is-valid") &&
			!this.password.classList.contains("is-invalid")
		) {
			return;
		}

		this.authFailed.classList.add("none");
		if (
			!this.inputValidator.passwordValidator({ password: this.password.value })
		) {
			this.password.classList.remove("is-valid");
			this.password.classList.add("is-invalid");
		} else {
			this.password.classList.remove("is-invalid");
			this.password.classList.add("is-valid");
		}
	};

	displayAuthResult = (type, result) => {
		let successMsg;
		if (type === "login") {
			successMsg = "Successfully Log In!";
		} else {
			successMsg = "Successfully Sign Up!";
		}

		if (result.error) {
			this.authSuccess.classList.add("none");
			this.authFailed.classList.remove("none");
			this.authFailedMsg.textContent = result.message;
			return false;
		} else {
			if (type === "avatarUpload") {
				return true;
			}
			this.authFailed.classList.add("none");
			this.authSuccess.classList.remove("none");
			this.authSuccessMsg.textContent = successMsg;
			return true;
		}
	};

	closeUserModal = () => {
		this.userModal.hide();
	};
}

export default UserController;
