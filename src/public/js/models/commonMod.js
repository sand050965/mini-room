class CommonMod {
	constructor() {}

	initAOS = (AOS) => {
		AOS.init({
			easing: "ease-in-out",
			once: true,
			mirror: false,
		});
	};

	closePreload = (preloaderId) => {
		const preloader = document.querySelector(preloaderId);
		preloader.classList.add("none");
	};

	openPreload = (preloaderId) => {
		const preloader = document.querySelector(preloaderId);
		preloader.classList.remove("none");
	};

	displayModal = (DOMElement) => {
		const page = DOMElement.page;
		const isDisplayModal = DOMElement.isDisplayModal;
		const modal = new bootstrap.Modal(
			document.querySelector("#modalContainer")
		);

		if (isDisplayModal) {
			modal.show();
			document.getElementById(`${page}ModalLabel`).textContent =
				DOMElement.title;
			document.getElementById(`${page}ModalBody`).textContent = DOMElement.msg;
			return false;
		}

		return true;
	};

	closeModal = (id) => {
		const modal = new bootstrap.Modal(document.querySelector(id));

		modal.hide();
	};
}

export default CommonMod;
