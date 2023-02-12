const nodemailer = require("nodemailer");
const mailer = require("../utils/mailUtil.js");

module.exports = {
  sendEmail: async (data) => {
    const senderName = data.senderName;
    const recipientEmail = data.recipientEmail;
    const roomLink = data.roomLink;
    const roomId = roomLink.replace("miniroom.online/", "");
    const mailContent = {
      from: `Mini Room <${data.senderName}>`,
      to: data.recipientEmail,
      subject: `Meet Invite from ${data.senderName}`,
      html: `<p>${data.senderName} has invited you to join a video meeting on Mini Room</p>
             <a href="${data.roomLink}">${data.roomLink}</a>
             <p>Or open Mini Room and enter this code: ${roomId}</p>`,
    };

    const info = await mailer.sendMail(mailContent);
    console.log(info.accepted);
    console.log(info.rejected);
  },
};
