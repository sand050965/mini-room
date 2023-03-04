/** @format */

class RoomInfoMod {
	constructor() {
		new ClipboardJS("#copyInfoBtn");
		this.copyInfoBtnTooltip = new bootstrap.Tooltip(copyInfoBtn, {
			trigger: "manual",
		});
	}

	closeRoom = async (roomId) => {
		const payload = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				roomId: roomId,
			}),
		};
		const response = await fetch("/api/room", payload);
		const result = await response.json();
		return result;
	};

	initInfo = () => {
		this.copyInfoBtnTooltip.hide();
		document.querySelector("#roomPath").value = window.location.href;
		document.querySelector("#meetingRoomId").textContent = ROOM_ID;
		this.displayRoomClock();
	};

	showTooltips = () => {
		this.copyInfoBtnTooltip.show();
	};

	hideTooltips = () => {
		this.copyInfoBtnTooltip.hide();
	};

	getDate = () => {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return {
			y: year,
			m: month,
			d: day,
		};
	};

	getTime = () => {
		const date = new Date();
		let h = date.getHours();
		let m = date.getMinutes();
		let s = date.getSeconds();
		let session = "AM";

		if (h === 0) {
			h = 12;
		}

		if (h > 12) {
			h = h - 12;
			session = "PM";
		}

		h = h < 10 ? "0" + h : h;
		m = m < 10 ? "0" + m : m;
		s = s < 10 ? "0" + s : s;

		return {
			h: h,
			m: m,
			s: s,
			session: session,
		};
	};

	displayRoomClock = async () => {
		const timeElement = await this.getTime();
		const time = `${timeElement.h}:${timeElement.m}:${timeElement.s} ${timeElement.session}`;
		document.querySelector("#clock").textContent = time;

		setTimeout(this.displayRoomClock, 1000);
	};
}

export default RoomInfoMod;
