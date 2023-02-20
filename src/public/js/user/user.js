import UserController from "../controllers/UserController.js";

const userController = new UserController();

const userAuth = document.querySelector("#userAuth");
const signUp = document.querySelector("#signUp");
const logIn = document.querySelector("#logIn");
const logInBtn = document.querySelector("#logInBtn");
const signUpBtn = document.querySelector("#signUpBtn");
const authStatus = document.querySelector("#authStatus");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const avatarFileUpload = document.querySelector("#avatarFileUpload");

userAuth.addEventListener("click", userController.doAuth);
signUp.addEventListener("click", userController.initSignUp);
logIn.addEventListener("click", userController.initLogIn);
logInBtn.addEventListener("click", userController.doLogIn);
signUpBtn.addEventListener("click", userController.doSignUp);
authStatus.addEventListener("click", userController.doLogOut);
username.addEventListener("keyup", userController.validateUsername);
email.addEventListener("keyup", userController.validateEmail);
password.addEventListener("keyup", userController.validatePassword);
avatarFileUpload.addEventListener("change", userController.uploadAvatar);
