class CommonMod {
  constructor() {}

  /**
   * Init AOS
   */
  initAOS = (AOS) => {
    AOS.init({
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  };

  /**
   * Close Preloader
   */
  closePreload = () => {
    const preloader = document.querySelector("#preloader");
    preloader.classList.add("none");
  };

  /**
   * Open Preloader
   */
  openPreload = () => {
    const preloader = document.querySelector("#preloader");
    preloader.classList.remove("none");
  };

  /**
   * Display Modal
   */
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
}

export default CommonMod;
