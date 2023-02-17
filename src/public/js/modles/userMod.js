import InputValidator from "../validators/inputValidator.js";

class UserMod {
  constructor() {
    this.inputValidator = new InputValidator();
    this.userModal = new bootstrap.Modal(
      document.querySelector("#userModalContainer")
    );
    this.avatarImg = document.querySelector("#avatarImg");
    this.userDropdown = document.querySelector("#userDropdown");
    this.userDropdownMenu = document.querySelector("#userDropdown");
    this.userProfileAvatarImg = document.querySelector("#userProfileAvatarImg");
    this.userProfileName = document.querySelector("#userProfileName");
    this.authStatus = document.querySelector("#authStatus");
    this.signUpAvatarContainer = document.querySelector(
      "#signUpAvatarContainer"
    );
    this.form = document.querySelector(".needs-validation");
    this.usernameContainer = document.querySelector("#usernameContainer");
    this.username = document.querySelector("#username");
    this.emailContainer = document.querySelector("#emailContainer");
    this.email = document.querySelector("#email");
    this.emailHelp = document.querySelector("#emailHelp");
    this.passwordContainer = document.querySelector("#passwordContainer");
    this.password = document.querySelector("#password");
    this.signUpContainer = document.querySelector("#signUpContainer");
    this.loginContainer = document.querySelector("#loginContainer");
    this.userModalCloseBtn = document.querySelector("#userModalCloseBtn");
    this.signUpBtn = document.querySelector("#signUpBtn");
    this.loginBtn = document.querySelector("#loginBtn");
  }

  initSignUp = async () => {
    await this.reset();
    await this.signUpContainer.classList.add("none");
    await this.loginBtn.classList.add("none");
  };

  initLogIn = async () => {
    await this.reset();
    await this.signUpAvatarContainer.classList.add("none");
    await this.usernameContainer.classList.add("none");
    await this.loginContainer.classList.add("none");
    await this.signUpBtn.classList.add("none");
  };

  initAuth = async () => {
    const checkResult = await this.checkUserAuth();
    if (checkResult.data === null) {
      this.avatarImg.src =
        "https://s3.amazonaws.com/www.miniroom.online/images/avatar.png";
      await this.userDropdown.removeAttribute("data-bs-toggle", "dropdown");
      this.authStatus.textContent = "Log In / Sign Up";
    } else {
      this.avatarImg.src = checkResult.data.avatarImgUrl;
      this.userProfileAvatarImg.src = checkResult.data.avatarImgUrl;
      this.userProfileName.textContent = checkResult.data.username;
      console.log(checkResult.data.username);
      this.userDropdown.setAttribute("data-bs-toggle", "dropdown");
      this.authStatus.textContent = "Log Out";
    }
  };

  doAuth = async () => {
    await this.initAuth();
    if (this.authStatus.textContent === "Log In / Sign Up") {
      await this.userModal.show();
      await this.initLogIn();
    }
  };

  doSignUp = async () => {
    const username = document.querySelector("#username");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const avatartImgUrl = document.querySelector("#avatarImg");
    const data = {
      username: username.value,
      email: email.value,
      password: password.value,
      avatarImgUrl: avatartImgUrl.src,
    };
    let isInvalid = false;
    if (!this.inputValidator.nameValidator(data)) {
      username.classList.add("is-invalid");
      isInvalid = true;
    }
    if (!this.inputValidator.emailValidator(data)) {
      email.classList.add("is-invalid");
      isInvalid = true;
    }
    if (!this.inputValidator.passwordValidator(data)) {
      password.classList.add("is-invalid");
      isInvalid = true;
    }
    if (isInvalid) {
      return;
    }
    const result = await this.signUp(data);
    const isSuccess = await this.displayAuthResult("signUp", result);
    if (!isSuccess) {
      return;
    }
    await this.doLogIn();
  };

  doLogIn = async () => {
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const data = {
      email: email.value,
      password: password.value,
    };
    let isInvalid = false;
    if (!this.inputValidator.emailValidator(data)) {
      email.classList.add("is-invalid");
      isInvalid = true;
    }
    if (!this.inputValidator.passwordValidator(data)) {
      password.classList.add("is-invalid");
      isInvalid = true;
    }
    if (isInvalid) {
      return;
    }
    const result = await this.logIn(data);
    const isSuccess = await this.displayAuthResult("login", result);
    if (isSuccess) {
      this.resetValue();
      this.loginBtn.classList.add("none");
      this.signUpBtn.classList.add("none");
      this.userModalCloseBtn.classList.remove("none");
      setTimeout(async () => {
        await this.initAuth();
        await this.userModal.hide();
      }, "1000");
    }
  };

  doLogOut = async () => {
    if (this.authStatus.textContent !== "Log Out") {
      return;
    }
    await this.logOut();
    await this.initAuth();
  };

  validateUsername = () => {
    const username = document.querySelector("#username");
    if (
      !username.classList.contains("is-valid") &&
      !username.classList.contains("is-invalid")
    ) {
      return;
    }
    if (!this.inputValidator.nameValidator({ username: username.value })) {
      username.classList.remove("is-valid");
      username.classList.add("is-invalid");
    } else {
      username.classList.remove("is-invalid");
      username.classList.add("is-valid");
    }
  };

  validateEmail = () => {
    const email = document.querySelector("#email");
    if (
      !email.classList.contains("is-valid") &&
      !email.classList.contains("is-invalid")
    ) {
      return;
    }
    if (!this.inputValidator.emailValidator({ email: email.value })) {
      email.classList.remove("is-valid");
      email.classList.add("is-invalid");
    } else {
      email.classList.remove("is-invalid");
      email.classList.add("is-valid");
    }
  };

  validatePassword = () => {
    const password = document.querySelector("#password");
    if (
      !password.classList.contains("is-valid") &&
      !password.classList.contains("is-invalid")
    ) {
      return;
    }
    if (!this.inputValidator.passwordValidator({ password: password.value })) {
      password.classList.remove("is-valid");
      password.classList.add("is-invalid");
    } else {
      password.classList.remove("is-invalid");
      password.classList.add("is-valid");
    }
  };

  displayAuthResult = (type, result) => {
    let successMsg;
    if (type === "login") {
      successMsg = "Successfully Sign Up!";
    } else {
      successMsg = "Successfully Log In!";
    }
    const authSuccess = document.querySelector("#authSuccess");
    const authSuccessMsg = document.querySelector("#authSuccessMsg");
    const authFailed = document.querySelector("#authFailed");
    const authFailedMsg = document.querySelector("#authFailedMsg");
    if (result.error) {
      authSuccess.classList.add("none");
      authFailed.classList.remove("none");
      authFailedMsg.textContent = result.message;
      return false;
    } else {
      authFailed.classList.add("none");
      authSuccess.classList.remove("none");
      authSuccessMsg.textContent = successMsg;
      return true;
    }
  };

  reset = async () => {
    await this.resetValue();
    await this.resetStyle();
  };

  resetValue = () => {
    this.avatarImg.src =
      "https://s3.amazonaws.com/www.miniroom.online/images/avatar.png";
    this.username.value = "";
    this.email.value = "";
    this.password.value = "";
  };

  resetStyle = () => {
    this.signUpAvatarContainer.classList.remove("none");
    this.username.classList.remove("is-valid");
    this.username.classList.remove("is-invalid");
    this.usernameContainer.classList.remove("none");
    this.email.classList.remove("is-valid");
    this.email.classList.remove("is-invalid");
    this.emailContainer.classList.remove("none");
    this.password.classList.remove("is-valid");
    this.password.classList.remove("is-invalid");
    this.passwordContainer.classList.remove("none");
    this.signUpContainer.classList.remove("none");
    this.loginContainer.classList.remove("none");
    this.userModalCloseBtn.classList.add("none");
    this.signUpBtn.classList.remove("none");
    this.loginBtn.classList.remove("none");
  };

  checkUserAuth = async () => {
    const response = await fetch("api/user/auth");
    const result = await response.json();
    return result;
  };

  logIn = async (data) => {
    const payload = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    };
    const response = await fetch("api/user/auth", payload);
    const result = await response.json();
    return result;
  };

  signUp = async (data) => {
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        username: data.username,
        avatarImgUrl: data.avatarImgUrl,
      }),
    };
    const response = await fetch("api/user/auth", payload);
    const result = await response.json();
    return result;
  };

  logOut = async () => {
    const payload = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("api/user/auth", payload);
    const result = await response.json();
  };

  changeAvatar = () => {};
}

export default UserMod;
