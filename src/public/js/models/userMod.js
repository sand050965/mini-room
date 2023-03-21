import CommonMod from "../models/commonMod.js";
import InputValidator from "../validators/inputValidator.js";

class UserMod {
	constructor() {
		this.commonMod = new CommonMod();
		this.inputValidator = new InputValidator();

		this.authSuccess = document.querySelector("#authSuccess");
		this.authFailed = document.querySelector("#authFailed");

		this.signUpAvatarContainer = document.querySelector(
			"#signUpAvatarContainer"
		);
		this.signUpAvatarImg = document.querySelector("#signUpAvatarImg");
		this.avatarFileUpload = document.querySelector("#avatarFileUpload");
		this.signUpAvatarValid = document.querySelector("#signUpAvatarValid");
		this.signUpAvatarInvalid = document.querySelector("#signUpAvatarInvalid");

		this.usernameContainer = document.querySelector("#usernameContainer");
		this.username = document.querySelector("#username");

		this.emailContainer = document.querySelector("#emailContainer");
		this.email = document.querySelector("#email");

		this.passwordContainer = document.querySelector("#passwordContainer");
		this.password = document.querySelector("#password");

		this.signUpContainer = document.querySelector("#signUpContainer");
		this.loginContainer = document.querySelector("#loginContainer");

		this.userModalCloseBtn = document.querySelector("#userModalCloseBtn");
		this.logInBtn = document.querySelector("#logInBtn");
		this.logInPreloader = document.querySelector("#logInPreloader");
		this.logInBtnContent = document.querySelector("#logInBtnContent");
		this.signUpBtn = document.querySelector("#signUpBtn");
		this.signUpPreloader = document.querySelector("#signUpPreloader");
		this.signUpBtnContent = document.querySelector("#signUpBtnContent");
	}

	setLogInBtn = (isLoading) => {
		if (isLoading) {
			this.logInBtn.disabled = true;
			this.logInBtnContent.textContent = "Loading...";
			this.logInPreloader.classList.remove("none");
		} else {
			this.logInBtn.disabled = false;
			this.logInBtnContent.textContent = "Log In";
			this.logInPreloader.classList.add("none");
		}
	};

	setSignUpBtn = (isLoading) => {
		if (isLoading) {
			this.signUpBtn.disabled = true;
			this.signUpBtnContent.textContent = "Loading...";
			this.signUpPreloader.classList.remove("none");
		} else {
			this.signUpBtn.disabled = false;
			this.signUpBtnContent.textContent = "Sign Up and Log In";
			this.signUpPreloader.classList.add("none");
		}
	};

	displayAvatarValidateStyle = (isValid, msg) => {
		if (isValid) {
			this.signUpAvatarValid.style.display = "block";
		} else {
			this.signUpAvatarInvalid.style.display = "block";
			this.signUpAvatarInvalid.textContent = msg;
		}
	};

	reset = async () => {
		await this.resetValue();
		await this.resetStyle();
	};

	resetValue = () => {
		this.signUpAvatarImg.src =
			"https://dpd6ot08xcncs.cloudfront.net/images/avatar.png";
		this.avatarFileUpload.value = "";
		this.username.value = "";
		this.email.value = "";
		this.password.value = "";
		this.logInBtn.disabled = false;
		this.logInBtnContent.textContent = "Log In";
		this.logInPreloader.classList.add("none");
		this.signUpBtn.disabled = false;
		this.signUpBtnContent.textContent = "Sign Up and Log In";
		this.signUpPreloader.classList.add("none");
	};

	resetStyle = () => {
		this.signUpAvatarContainer.classList.remove("none");
		this.usernameContainer.classList.remove("none");
		this.emailContainer.classList.remove("none");
		this.passwordContainer.classList.remove("none");
		this.signUpContainer.classList.remove("none");
		this.loginContainer.classList.remove("none");
		this.userModalCloseBtn.classList.add("none");
		this.logInBtn.classList.remove("none");
		this.signUpBtn.classList.remove("none");
		this.resetValidateStyle();
	};

	resetAvatarValidateStyle = () => {
		this.signUpAvatarInvalid.removeAttribute("style");
		this.signUpAvatarValid.removeAttribute("style");
	};

	resetValidateStyle = () => {
		this.authSuccess.classList.add("none");
		this.authFailed.classList.add("none");
		this.resetAvatarValidateStyle();
		this.username.classList.remove("is-valid");
		this.username.classList.remove("is-invalid");
		this.email.classList.remove("is-valid");
		this.email.classList.remove("is-invalid");
		this.password.classList.remove("is-valid");
		this.password.classList.remove("is-invalid");
	};

	checkUserAuth = async () => {
		const response = await fetch("api/user/auth");
		const result = await response.json();
		return result;
	};

	storeAvatarToS3 = async (data) => {
		const file = data.file;
		const formData = new FormData();
		formData.append("avatar", file);
		const response = await fetch("/api/s3/avatar", {
			method: "POST",
			body: formData,
		});

		const s3Result = await response.json();
		return s3Result;
	};

	deleteAvatarFromS3 = async (data) => {
		const response = await fetch("/api/s3/avatar", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ avatarImgUrl: data.avatarImgUrl }),
		});

		const s3Result = await response.json();
		return s3Result;
	};

	logIn = async (data) => {
		const payload = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: data.email,
				password: data.password,
			}),
		};
		const response = await fetch("api/user/auth", payload);
		const result = await response.json();
		return result;
	};

	signUp = async (data) => {
		const payload = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: data.email,
				password: data.password,
				username: data.username,
				avatarImgUrl: data.avatarImgUrl,
			}),
		};
		const response = await fetch("api/user/auth", payload);
		const result = await response.json();
		return result;
	};

	logOut = async () => {
		const payload = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		};
		const response = await fetch("api/user/auth", payload);
		const result = await response.json();
	};

	updateUserInfo = async (data) => {
		const payload = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: data.email,
				username: data.username,
				avatarImgUrl: data.avatarImgUrl,
			}),
		};
		const response = await fetch("/api/user/info", payload);
		const result = await response.json();
		return result;
	};

	refreshUserToken = async (data) => {
		const payload = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: data.email,
			}),
		};
		const response = await fetch("/api/user/token", payload);
		const result = await response.json();
		return result;
	};

	validateAvatarImg = () => {
		const file = this.avatarFileUpload.files[0];
		const fileType = file.name.split(".")[1];
		const fileTypeArray = ["jpg", "jpeg", "png"];
		const fileSize = file.size;

		this.resetAvatarValidateStyle();

		if (fileSize > 1024 * 1024 * 5) {
			("File size must be less than 1 MB!");
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

	validateUsername = () => {
		this.authFailed.classList.add("none");
		if (!this.inputValidator.nameValidator({ username: this.username.value })) {
			this.username.classList.remove("is-valid");
			this.username.classList.add("is-invalid");
			return false;
		} else {
			this.username.classList.remove("is-invalid");
			this.username.classList.add("is-valid");
			return true;
		}
	};

	validateEmail = () => {
		this.authFailed.classList.add("none");
		if (!this.inputValidator.emailValidator({ email: this.email.value })) {
			this.email.classList.remove("is-valid");
			this.email.classList.add("is-invalid");
			return false;
		} else {
			this.email.classList.remove("is-invalid");
			this.email.classList.add("is-valid");
			return true;
		}
	};

	validatePassword = () => {
		this.authFailed.classList.add("none");
		if (
			!this.inputValidator.passwordValidator({ password: this.password.value })
		) {
			this.password.classList.remove("is-valid");
			this.password.classList.add("is-invalid");
			return false;
		} else {
			this.password.classList.remove("is-invalid");
			this.password.classList.add("is-valid");
			return true;
		}
	};
}

export default UserMod;
