import CommonMod from "../modules/commonMod.js";

class UserController {
  constructor() {
    this.commonMod = new CommonMod();
  }

  init = () => {
    this.commonMod.initAOS(AOS);
  };
}

export default UserController;
