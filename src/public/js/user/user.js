/** @format */

import UserController from "../controllers/userController.js";
import AvatarController from "../controllers/avatarController.js";

const userController = new UserController();
const avatarController = new AvatarController();

const userAuth = document.querySelector("#userAuth");
const userProfileBtn = document.querySelector("#userProfile");
const userModalCloseBtns = document.querySelectorAll(
	"button[name = 'userModalCloseBtn']"
);
const signUp = document.querySelector("#signUp");
const logIn = document.querySelector("#logIn");
const logInBtn = document.querySelector("#logInBtn");
const signUpBtn = document.querySelector("#signUpBtn");
const authStatus = document.querySelector("#authStatus");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const avatarFileUpload = document.querySelector("#avatarFileUpload");
const avatarImgs = document.querySelectorAll("img[name='avatarImg']");

window.addEventListener("load", userController.initAuth);
userAuth.addEventListener("click", userController.doAuth);
userProfileBtn.addEventListener("click", userController.getToMemberProfile);
for (const btn of userModalCloseBtns) {
	btn.addEventListener("click", userController.closeUserModal);
}
signUp.addEventListener("click", userController.initSignUp);
logIn.addEventListener("click", userController.initLogIn);
logInBtn.addEventListener("click", userController.doLogIn);
signUpBtn.addEventListener("click", userController.doSignUp);
authStatus.addEventListener("click", userController.doLogOut);
username.addEventListener("keyup", userController.reValidateUsername);
email.addEventListener("keyup", userController.reValidateEmail);
password.addEventListener("keyup", userController.reValidatePassword);
avatarFileUpload.addEventListener("change", userController.uploadAvatar);
for (const img of avatarImgs) {
	img.addEventListener("load", avatarController.resizeAvatar);
}
