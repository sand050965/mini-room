import UserController from "../controllers/UserController.js";
const userController = new UserController();

window.addEventListener("load", userController.init);
