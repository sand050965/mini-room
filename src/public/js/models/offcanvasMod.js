/** @format */

class OffcanvasMod {
	constructor() {
		this.chatBadage = document.querySelector("#chatBadage");
		this.sideBtnIconsArray = [
			document.querySelector("#infoOffcanvasBtnIcon"),
			document.querySelector("#participantOffcanvasBtnIcon"),
			document.querySelector("#chatOffcanvasBtnIcon"),
		];
		this.BsInfoOffcanvas = new bootstrap.Offcanvas(
			document.querySelector("#infoOffcanvas")
		);
		this.BsParticipantOffcanvas = new bootstrap.Offcanvas(
			document.querySelector("#participantOffcanvas")
		);
		this.BsChatOffcanvas = new bootstrap.Offcanvas(
			document.querySelector("#chatOffcanvas")
		);
		this.bsOffcanvasArray = [
			this.BsInfoOffcanvas,
			this.BsParticipantOffcanvas,
			this.BsChatOffcanvas,
		];
		this.bsOffcanvasObj = {
			infoOffcanvas: this.BsInfoOffcanvas,
			participantOffcanvas: this.BsParticipantOffcanvas,
			chatOffcanvas: this.BsChatOffcanvas,
		};
	}

	toggleOffcanvas = async (offcanvasDOMElement) => {
		const btnId = offcanvasDOMElement.btnId;
		const tagetBsOffcanvas = offcanvasDOMElement.tagetBsOffcanvas;

		for (const bsOffcanvas of this.bsOffcanvasArray) {
			if (bsOffcanvas === tagetBsOffcanvas) {
				continue;
			}
			bsOffcanvas.hide();
		}
		if (offcanvasMap.get("isOpen") !== btnId) {
			isOffcanvasOpen = false;
		}

		for (const sideBtnIcon of this.sideBtnIconsArray) {
			sideBtnIcon.classList.remove("side-btn-clicked");
		}

		if (isOffcanvasOpen) {
			tagetBsOffcanvas.hide();
			await this.offcanvasCloseControl(offcanvasDOMElement);
			await this.offcanvasCloseGrid();
			isOffcanvasOpen = false;
			offcanvasMap.clear();
		} else {
			tagetBsOffcanvas.show();
			await this.offcanvasOpenControl(offcanvasDOMElement);
			await this.offcanvasOpenGrid();
			if (offcanvasDOMElement.target === "chatOffcanvas") {
				this.chatBadage.classList.add("none");
			}
			isOffcanvasOpen = true;
			offcanvasMap.set("isOpen", btnId);
		}
	};

	offcanvasCloseControl = (offcanvasDOMElement) => {
		const target = this.bsOffcanvasObj[offcanvasDOMElement.target];
		const targetBtn = document.querySelector(
			`#${offcanvasDOMElement.btnId}Icon`
		);
		const selfVideoItemContainer = document.querySelector(
			"#selfVideoItemContainer"
		);
		target.hide();
		targetBtn.classList.remove("side-btn-clicked");
		selfVideoItemContainer.classList.remove("offcanvas-open");
	};

	offcanvasOpenControl = (offcanvasDOMElement) => {
		const targetBtn = document.querySelector(
			`#${offcanvasDOMElement.btnId}Icon`
		);
		targetBtn.classList.add("side-btn-clicked");
	};

	offcanvasOpenGrid = () => {
		const mainContainer = document.querySelector("#mainContainer");
		const mainLeftContainer = document.querySelector("#mainLeftContainer");
		mainContainer.classList.remove("main-left");
		mainContainer.classList.add("main-left-right");

		if (isScreenSharing) {
			mainLeftContainer.classList.remove("main-left-videos");
			mainLeftContainer.classList.add("main-left-screen-share");
		} else {
			if (cnt === 2) {
				selfVideoItemContainer.classList.add("offcanvas-open");
			}
			mainLeftContainer.classList.remove("main-left-screen-share");
			mainLeftContainer.classList.add("main-left-videos");
		}
	};

	offcanvasCloseGrid = () => {
		const mainContainer = document.querySelector("#mainContainer");
		const mainLeftContainer = document.querySelector("#mainLeftContainer");
		mainContainer.classList.remove("main-left-right");
		mainContainer.classList.add("main-left");

		if (isScreenSharing) {
			mainLeftContainer.classList.remove("main-left-videos");
			mainLeftContainer.classList.add("main-left-screen-share");
		} else {
			mainLeftContainer.classList.remove("main-left-screen-share");
			mainLeftContainer.classList.add("main-left-videos");
		}
	};

	displayChatBadage = (elementObj) => {
		if (elementObj.participantId === PARTICIPANT_ID) {
			return;
		}

		if (offcanvasMap.get("isOpen") === "chatOffcanvasBtn") {
			this.chatBadage.classList.add("none");
		} else {
			this.chatBadage.classList.remove("none");
		}
	};
}

export default OffcanvasMod;
