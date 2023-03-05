import MemberController from "../controllers/memberController.js";

const memberController = new MemberController();

const avatarFileUpload = document.querySelector("#avatarFileUpload");
const memberEmail = document.querySelector("#memberEmail");
const memberUsername = document.querySelector("#memberUsername");
const cancelBtn = document.querySelector("#cancelBtn");
const saveBtn = document.querySelector("#saveBtn");

window.addEventListener("load", memberController.initMember);
avatarFileUpload.addEventListener("change", memberController.uploadAvatar);
cancelBtn.addEventListener("click", memberController.cancelUpdateMemberInfo);
saveBtn.addEventListener("click", memberController.saveUpdataMemberInfo);
memberEmail.addEventListener("keyup", memberController.reValidateEmail);
memberUsername.addEventListener("keyup", memberController.reValidateUsername);
