/** @format */

import UserController from "../controllers/userController.js";
import UserMod from "../models/userMod.js";
import MemberMod from "../models/memberMod.js";
import CommonMod from "../models/commonMod.js";
import InputValidator from "../validators/inputValidator.js";

class MemberController {
	constructor() {
		this.userController = new UserController();
		this.commonMod = new CommonMod();
		this.userMod = new UserMod();
		this.memberMod = new MemberMod();
		this.inputValidator = new InputValidator();
		this.validFile = null;
		this.initInfo = null;
		this.memberAvatarImg = document.querySelector("#memberAvatarImg");
		this.avatarFileUpload = document.querySelector("#avatarFileUpload");
		this.memberEmail = document.querySelector("#memberEmail");
		this.memberUsername = document.querySelector("#memberUsername");
	}

	initMember = async () => {
		this.commonMod.openPreload("#preloader");
		const checkResult = await this.userMod.checkUserAuth();
		this.initInfo = checkResult.data;
		if (checkResult.data !== null) {
			this.memberAvatarImg.src = checkResult.data.avatarImgUrl;
			this.memberEmail.value = checkResult.data.email;
			this.memberUsername.value = checkResult.data.username;
			setTimeout(() => {
				this.commonMod.closePreload("#preloader");
			}, 1000);
			return;
		} else {
			window.location = "/";
		}
	};

	uploadAvatar = async () => {
		const file = this.avatarFileUpload.files[0];
		// content type check
		const validateResult = await this.memberMod.validateAvatarImg();
		if (!validateResult) {
			this.avatarFileUpload.value = "";
			return;
		}
		this.memberAvatarImg.src = URL.createObjectURL(file);
		this.validFile = file;
	};

	saveUpdataMemberInfo = async () => {
		try {
			this.commonMod.openPreload("#preloader");
			this.memberMod.resetUpdateResult();
			this.memberMod.resetValidate();

			const avatarCheck = this.memberMod.validateAvatarImg();
			const emailCheck = this.memberMod.validateEmail();
			const usernameCheck = this.memberMod.validateUsername();

			if (!this.memberMod.checkIsDifferent(this.initInfo)) {
				this.commonMod.closePreload("#preloader");
				return;
			}

			if (!avatarCheck || !emailCheck || !usernameCheck) {
				this.commonMod.closePreload("#preloader");
				return;
			}

			this.memberMod.resetValidate();

			const data = {
				email: this.memberEmail.value,
				username: this.memberUsername.value,
				avatarImgUrl: this.initInfo.avatarImgUrl,
			};

			if (this.initInfo.avatarImgUrl !== this.memberAvatarImg.src) {
				const s3Result = await this.userMod.storeAvatarToS3({
					file: this.validFile,
				});

				const isS3Success = await this.memberMod.displayUpdateResult(
					true,
					s3Result
				);

				if (isS3Success) {
					data.avatarImgUrl = s3Result.data.url;
					await this.userMod.deleteAvatarFromS3({
						avatarImgUrl: this.initInfo.avatarImgUrl,
					});
				} else {
					this.commonMod.closePreload("#preloader");
					return;
				}
			}

			const updateUserResult = await this.userMod.updateUserInfo(data);

			this.memberMod.resetValidate();

			const isSuccess = this.memberMod.displayUpdateResult(
				false,
				updateUserResult
			);

			if (isSuccess) {
				this.userMod.refreshUserToken({ email: this.memberEmail.value });
				this.initInfo = data;
				await this.userController.initAuth();
			}

			this.commonMod.closePreload("#preloader");
		} catch (e) {
			console.log(e);
			this.commonMod.closePreload("#preloader");
		}
	};

	cancelUpdateMemberInfo = () => {
		this.validFile = null;
		this.memberMod.resetInputs(this.initInfo);
		this.memberMod.resetValidate();
		this.reValidateEmail();
		this.reValidateUsername();
	};

	reValidateEmail = () => {
		this.memberMod.resetUpdateResult();
		if (
			!this.memberEmail.classList.contains("is-valid") &&
			!this.memberEmail.classList.contains("is-invalid")
		) {
			return;
		}
		this.memberMod.validateEmail();
	};

	reValidateUsername = () => {
		this.memberMod.resetUpdateResult();
		if (
			!this.memberUsername.classList.contains("is-valid") &&
			!this.memberUsername.classList.contains("is-invalid")
		) {
			return;
		}
		this.memberMod.validateUsername();
	};
}

export default MemberController;
