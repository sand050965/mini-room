/** @format */

import PremeetingController from "../controllers/premeetingController.js";

const peer = new Peer();
const premeetingController = new PremeetingController();

const btnsArray = [
	document.querySelector("#audioBtn"),
	document.querySelector("#videoBtn"),
];
const participantName = document.querySelector("#participantName");
const nameInput = document.querySelector("#nameInput");
const confirmBtn = document.querySelector("#confirmBtn");

/**
 * Peer JS
 */
peer.on("open", (id) => {
	premeetingController.init(id);
});

// ========================== Event Listeners ==========================

window.addEventListener("keydown", premeetingController.hotKeysControl);

for (const btn of btnsArray) {
	btn.addEventListener("click", premeetingController.btnControl);
}

nameInput.addEventListener("keyup", premeetingController.displayName);

confirmBtn.addEventListener("click", premeetingController.confirmState);
