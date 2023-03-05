import PremeetingController from "../controllers/premeetingController.js";
import AvatarController from "../controllers/avatarController.js";

const peer = new Peer();
const premeetingController = new PremeetingController();
const avatarController = new AvatarController();

const btnsArray = [
	document.querySelector("#audioBtn"),
	document.querySelector("#videoBtn"),
];
const nameInput = document.querySelector("#nameInput");
const confirmBtn = document.querySelector("#confirmBtn");
const avatarImgs = document.querySelectorAll("img[name='avatarImg']");

/**
 * Peer JS
 */
peer.on("open", (id) => {
	premeetingController.init(id);
});

for (const btn of btnsArray) {
	btn.addEventListener("click", premeetingController.btnControl);
}
for (const img of avatarImgs) {
	img.addEventListener("load", avatarController.resizeAvatar);
}
window.addEventListener("keydown", premeetingController.hotKeysControl);
nameInput.addEventListener("keyup", premeetingController.displayName);
confirmBtn.addEventListener("click", premeetingController.confirmState);
