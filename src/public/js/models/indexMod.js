/** @format */

import CommonMod from "./commonMod.js";
import InputValidator from "../validators/inputValidator.js";

class IndexMod {
	constructor() {}

	startMeeting = async () => {
		const respone = await fetch(`/api/room/start`);
		const result = await respone.json();
		return result;
	};

	joinMeeting = async (roomId) => {
		const response = await fetch(`/api/room/join?roomId=${roomId}`);
		const result = await response.json();
		return result;
	};
}

export default IndexMod;
