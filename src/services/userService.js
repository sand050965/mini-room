const User = require("../models/User");

module.exports = {
  getUser: async (data) => {
    return await User.findOne({
      email: data.email,
    }).select("_id email name avatarImgUrl");
  },

  putUser: async (data) => {
    return await User.findOne({
      email: data.email,
    }).select("email");
  },

  postUser: async (data) => {
    const user = new User({
      email: data.email,
      password: data.password,
      username: data.username,
      avatarImgUrl: data.avatarImgUrl,
    });
    return await user.save();
  },

  updateUserAvatar: async (data) => {
    return await User.updateOne(
      { email: data.email },
      { avatarImgUrl: data.avatarImgUrl }
    );
  },

  updateUsername: async (data) => {
    return await User.updateOne(
      { email: data.email },
      { username: data.username }
    );
  },
};
