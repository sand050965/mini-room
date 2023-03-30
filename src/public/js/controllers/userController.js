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

		this.validFile = null;

		this.avatarImg = document.querySelector("#avatarImg");
		this.userDropdown = document.querySelector("#userDropdown");
		this.userDropdownMenu = document.querySelector("#userDropdown");
		this.userProfileAvatarImg = document.querySelector("#userProfileAvatarImg");
		this.userProfileName = document.querySelector("#userProfileName");
		this.authStatus = document.querySelector("#authStatus");

		this.authSuccess = document.querySelector("#authSuccess");
		this.authSuccessMsg = document.querySelector("#authSuccessMsg");
		this.authFailed = document.querySelector("#authFailed");
		this.authFailedMsg = document.querySelector("#authFailedMsg");

		this.signUpAvatarContainer = document.querySelector(
			"#signUpAvatarContainer"
		);
		this.signUpAvatarImg = document.querySelector("#signUpAvatarImg");
		this.signUpAvatarValid = document.querySelector("#signUpAvatarValid");
		this.signUpAvatarInvalid = document.querySelector("#signUpAvatarInvalid");
		this.signUpAvatarHelp = document.querySelector("#signUpAvatarHelp");
		this.avatarFileUpload = document.querySelector("#avatarFileUpload");

		this.usernameContainer = document.querySelector("#usernameContainer");
		this.username = document.querySelector("#username");

		this.email = document.querySelector("#email");

		this.password = document.querySelector("#password");

		this.signUpContainer = document.querySelector("#signUpContainer");
		this.loginContainer = document.querySelector("#loginContainer");

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
				"https://dpd6ot08xcncs.cloudfront.net/avatars/avatar.png";
			await this.userDropdown.removeAttribute("data-bs-toggle", "dropdown");
			this.authStatus.textContent = "Log In / Sign Up";
		}
	};

	initLogIn = async () => {
		this.validFile = null;
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

		const emailCheck = this.userMod.validateEmail();
		const passwordCheck = this.userMod.validatePassword();

		if (!emailCheck || !passwordCheck) {
			this.userMod.setLogInBtn(false);
			this.commonMod.closePreload("#preloader");
			return;
		}

		this.userMod.resetValidateStyle();
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

		const data = {
			username: this.username.value,
			email: this.email.value,
			password: this.password.value,
		};

		let avatarCheck = false;
		if (
			this.signUpAvatarImg.src !==
			"https://dpd6ot08xcncs.cloudfront.net/avatars/avatar.png"
		) {
			avatarCheck = this.userMod.validateAvatarImg();
		} else {
			avatarCheck = true;
		}

		const usernameCheck = this.userMod.validateUsername();
		const emailCheck = this.userMod.validateEmail();
		const passwordCheck = this.userMod.validatePassword();

		if (!avatarCheck || !usernameCheck || !emailCheck || !passwordCheck) {
			this.userMod.setSignUpBtn(false);
			this.commonMod.closePreload("#preloader");
			return;
		}

		this.userMod.resetValidateStyle();

		let avatarImgUrl =
			"https://dpd6ot08xcncs.cloudfront.net/avatars/avatar.png";

		if (this.signUpAvatarImg.src !== avatarImgUrl) {
			const s3Result = await this.userMod.storeAvatarToS3({
				file: this.validFile,
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
		const validateResult = await this.userMod.validateAvatarImg();
		if (!validateResult) {
			this.avatarFileUpload.value = "";
			return;
		}
		this.signUpAvatarImg.src = URL.createObjectURL(file);
		this.validFile = file;
	};

	reValidateUsername = () => {
		if (
			!this.username.classList.contains("is-valid") &&
			!this.username.classList.contains("is-invalid")
		) {
			return;
		}
		this.userMod.validateUsername();
	};

	reValidateEmail = () => {
		if (
			!this.email.classList.contains("is-valid") &&
			!this.email.classList.contains("is-invalid")
		) {
			return;
		}
		this.userMod.validateEmail();
	};

	reValidatePassword = () => {
		if (
			!this.password.classList.contains("is-valid") &&
			!this.password.classList.contains("is-invalid")
		) {
			return;
		}

		this.userMod.validatePassword();
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
