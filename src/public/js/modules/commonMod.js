/**
 * Init AOS
 */
export const initAOS = (AOS) => {
  AOS.init({
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });
};

/**
 * Preloader
 */
export const preload = () => {
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    preloader.remove();
  }
};

/**
 * Display Modal
 */
export const displayModal = (DOMElement) => {
  const isDisplayModal = DOMElement.isDisplayModal;
  const modal = new bootstrap.Modal(document.querySelector("#modalContainer"));

  if (isDisplayModal) {
    modal.show();
    document.querySelector("#modalBody").textContent = DOMElement.msg;
    return false;
  }

  return true;
};
