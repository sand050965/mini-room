import UserController from "./userController.js";
import IndexMod from "../models/indexMod.js";
import CommonMod from "../models/commonMod.js";

class IndexController {
	constructor() {
		this.userController = new UserController();
		this.indexMod = new IndexMod();
		this.commonMod = new CommonMod();
		this.roomCodeInput = document.querySelector("#roomCodeInput");
		this.joinBtn = document.querySelector("#joinBtn");
		this.alert = document.querySelector("#alert");
	}

	init = async () => {
		await this.commonMod.initAOS(AOS);
		setTimeout(() => {
			this.commonMod.closePreload("#indexPreloader");
		}, 1000);
	};

	showDisableBtn = () => {
		this.joinBtn.classList.remove("none");
	};

	hideBtn = (e) => {
		if (e.target.value !== "") {
			return;
		}
		this.joinBtn.classList.add("none");
	};

	showBtn = (e) => {
		switch (e.target.value.trim()) {
			case "":
				this.alert.classList.add("none");
				this.joinBtn.disabled = true;
				this.joinBtn.classList.add("disable");
				this.joinBtn.classList.remove("none");
				this.joinBtn.classList.remove("able");
				break;
			default:
				this.joinBtn.disabled = false;
				this.joinBtn.classList.remove("disable");
				this.joinBtn.classList.remove("none");
				this.joinBtn.classList.add("able");
				break;
		}
	};

	startMeeting = async () => {
		const result = await this.indexMod.startMeeting();
		window.location = `/${result.roomId}`;
	};

	joinMeeting = async () => {
		try {
			this.commonMod.openPreload("#preloader");

			let roomId = this.roomCodeInput.value.trim();

			if (roomId.startsWith("http://")) {
				roomId = roomId.replace("http://", "");
				if (
					!roomId.startsWith("miniroom.online") &&
					!roomId.startsWith("localhost")
				) {
					this.alert.classList.remove("none");
					this.commonMod.closePreload("#preloader");
					return;
				}
			}

			if (roomId.startsWith("localhost")) {
				roomId = roomId.replace("localhost:3000/", "");
			}

			if (roomId.startsWith("https://")) {
				roomId = roomId.replace("https://", "");
				if (!roomId.startsWith("miniroom.online")) {
					this.alert.classList.remove("none");
					this.commonMod.closePreload("#preloader");
					return;
				}
			}

			if (roomId.startsWith("miniroom.online/")) {
				roomId = roomId.replace("miniroom.online/", "");
			}

			const result = await this.indexMod.joinMeeting(roomId);

			if (result.ok) {
				window.location = `/${roomId}`;
			} else {
				this.alert.classList.remove("none");
				this.commonMod.closePreload("#preloader");
			}
		} catch (e) {
			console.log(e);
			this.commonMod.closePreload("#preloader");
		}
	};

	hotKeysControl = (e) => {
		if (e.which === 13 && this.roomCodeInput.value.trim() !== "") {
			this.joinMeeting();
		}
	};
}

export default IndexController;
