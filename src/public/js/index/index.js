/** @format */

import IndexController from "../controllers/indexController.js";

const indexController = new IndexController();

const roomCodeInput = document.querySelector("#roomCodeInput");
const startBtn = document.querySelector("#startBtn");
const joinBtn = document.querySelector("#joinBtn");

window.addEventListener("load", indexController.init);
roomCodeInput.addEventListener("keydown", indexController.hotKeysControl);
roomCodeInput.addEventListener("focus", indexController.showDisableBtn);
roomCodeInput.addEventListener("blur", indexController.hideBtn);
roomCodeInput.addEventListener("keyup", indexController.showBtn);
startBtn.addEventListener("click", indexController.startMeeting);
joinBtn.addEventListener("click", indexController.joinMeeting);
