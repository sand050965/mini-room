/** @format */

import CommonMod from "../models/commonMod.js";
import UserController from "../controllers/userController.js";
const roomCodeInput = document.querySelector("#roomCodeInput");
const startBtn = document.querySelector("#startBtn");
const joinBtn = document.querySelector("#joinBtn");

const commonMod = new CommonMod();
const userController = new UserController();

/**
 * Init App
 */
const init = async () => {
	await commonMod.initAOS(AOS);
	await userController.initAuth();
	setTimeout(() => {
		commonMod.closePreload("#indexPreloader");
	}, 3000);
};

// input button control
const showDisableBtn = () => {
	joinBtn.classList.remove("none");
};

const hideBtn = (e) => {
	if (e.target.value !== "") {
		return;
	}
	joinBtn.classList.add("none");
};

const showBtn = (e) => {
	switch (e.target.value.trim()) {
		case "":
			document.querySelector("#alert").classList.add("none");
			joinBtn.disabled = true;
			joinBtn.classList.add("disable");
			joinBtn.classList.remove("none");
			joinBtn.classList.remove("able");
			break;
		default:
			joinBtn.disabled = false;
			joinBtn.classList.remove("disable");
			joinBtn.classList.remove("none");
			joinBtn.classList.add("able");
			break;
	}
};

// start meeting
const startMeeting = async () => {
	const respone = await fetch(`/api/room/start`);
	const result = await respone.json();
	const roomId = result.roomId;
	window.location = `/${roomId}`;
};

// join meeting
const joinMeeting = async () => {
	let roomId = roomCodeInput.value.trim();

	// localhost
	if (roomId.startsWith("http://")) {
		roomId = roomId.replace("http://", "");
		if (
			!roomId.startsWith("miniroom.online") &&
			!roomId.startsWith("localhost")
		) {
			document.querySelector("#alert").classList.remove("none");
			return;
		}
	}

	if (roomId.startsWith("localhost")) {
		roomId = roomId.replace("localhost:3000/", "");
	}

	// miniroom.online
	if (roomId.startsWith("https://")) {
		roomId = roomId.replace("https://", "");
		if (!roomId.startsWith("miniroom.online")) {
			document.querySelector("#alert").classList.remove("none");
			return;
		}
	}

	if (roomId.startsWith("miniroom.online/")) {
		roomId = roomId.replace("miniroom.online/", "");
	}

	const response = await fetch(`/api/room/join?roomId=${roomId}`);
	const result = await response.json();
	if (result.ok) {
		window.location = `/${roomId}`;
	} else {
		document.querySelector("#alert").classList.remove("none");
	}
};

const hotKeysControl = (e) => {
	if (e.which === 13 && roomCodeInput.value.trim() !== "") {
		joinMeeting();
	}
};

window.addEventListener("load", init);
roomCodeInput.addEventListener("keydown", hotKeysControl);
roomCodeInput.addEventListener("focus", showDisableBtn);
roomCodeInput.addEventListener("blur", hideBtn);
roomCodeInput.addEventListener("keyup", showBtn);
startBtn.addEventListener("click", startMeeting);
joinBtn.addEventListener("click", joinMeeting);
