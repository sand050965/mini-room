class AvatarController {
	constructor() {}

	resizeAvatar = (e) => {
		const width = e.target.width;
		const height = e.target.height;
		if (width > height) {
			e.target.classList.remove("avatar-img-width");
			e.target.classList.add("avatar-img-height");
		} else {
			e.target.classList.remove("avatar-img-height");
			e.target.classList.add("avatar-img-width");
		}
	};
}

export default AvatarController;
