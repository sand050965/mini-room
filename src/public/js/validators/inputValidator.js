/** @format */

class InputValidator {
	constructor() {}

	searchParticipantValidator = (data) => {
		const participantName = data.participantName;
		const regex = /\S/;
		if (!regex.test(participantName)) {
			throw "Please type something before search!";
		}
		return true;
	};

	nameValidator = (data) => {
		const regex = /\S/;
		if (!regex.test(data.username)) {
			return false;
		}
		return true;
	};

	emailValidator = (data) => {
		const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!regex.test(data.email)) {
			return false;
		}
		return true;
	};

	passwordValidator = (data) => {
		const regex = /^([a-zA-Z0-9@#$%^&+=!]{6,30})$/;
		if (!regex.test(data.password)) {
			return false;
		}
		return true;
	};
}

export default InputValidator;
