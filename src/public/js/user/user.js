/** @format */

import UserController from "../controllers/userController.js";

const userController = new UserController();

const userAuth = document.querySelector("#userAuth");
const userProfileBtn = document.querySelector("#userProfile");
const userCloseBtn = document.querySelector("#userCloseBtn");
const signUp = document.querySelector("#signUp");
const logIn = document.querySelector("#logIn");
const logInBtn = document.querySelector("#logInBtn");
const signUpBtn = document.querySelector("#signUpBtn");
const authStatus = document.querySelector("#authStatus");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const avatarFileUpload = document.querySelector("#avatarFileUpload");

window.addEventListener("load", userController.initAuth);
userAuth.addEventListener("click", userController.doAuth);
userProfileBtn.addEventListener("click", userController.getToMemberProfile);
userCloseBtn.addEventListener("click", userController.closeUserModal);
signUp.addEventListener("click", userController.initSignUp);
logIn.addEventListener("click", userController.initLogIn);
logInBtn.addEventListener("click", userController.doLogIn);
signUpBtn.addEventListener("click", userController.doSignUp);
authStatus.addEventListener("click", userController.doLogOut);
username.addEventListener("keyup", userController.validateUsername);
email.addEventListener("keyup", userController.validateEmail);
password.addEventListener("keyup", userController.validatePassword);
avatarFileUpload.addEventListener("change", userController.uploadAvatar);
