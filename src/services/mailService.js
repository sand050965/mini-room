/** @format */

const nodemailer = require("nodemailer");
const mailer = require("../utils/mailUtil.js");

module.exports = {
	sendEmail: async (data) => {
		const senderName = data.senderName;
		const recipientEmailArray = data.recipientEmailArray;
		const roomId = data.roomId;
		const roomLink = `miniroom.online/${roomId}`;
		const mailContent = {
			from: `Mini Room <${senderName}>`,
			to: recipientEmailArray,
			subject: `Meet Invite from ${senderName}`,
			html: `
        <div style="text-align: center; vertical-align: middle; width: 662px; padding: 20px 20px 40px 20px; background-color: #f1f3f4;">
          <div>
            <div style="vertical-align: middle; margin-bottom: 20px;">
              <span style="color: rgb(20, 55, 101); font-size: 30px; font-weight: 700; padding: 20px 10px;">
                <span style="width: 32px; height: 32px; text-align: center; vertical-align: middle;">
                  <img style="width: 32px; height: 32px" src="https://s3.amazonaws.com/www.miniroom.online/images/favicon.ico" />
                </span>
                Mini Room
              </span>
            </div>
            <a style="font-size: 19px; color: #000; text-decoration: none" href="${roomLink}">
              ${senderName} has invited you to join a video meeting on Mini Room
            </a>
            <div style="text-align: center; vertical-align: middle; background-color: #fff; padding: 20px; margin-top: 30px;">
              <div style="margin-bottom: 10px; text-align: center; vertical-align: middle; ">
                <a style="cursor: pointer; text-align: center; vertical-align: middle; color: #fff; text-decoration: none" href="${roomLink}">
                  <div style="cursor: pointer; text-align: center; vertical-align: middle; width: 100px; height: 20px; background-color: rgb(59, 59, 236); color: #fff; border-radius: 10px; border: 0; padding: 15px; font-size: 16px; font-weight: 700; margin-left: 246px;">
                    Join Meeting
                  </div>
                </a>
              </div>
              <a style="color: #202124; text-decoration: none" href="${roomLink}">
                ${roomLink}
              </a>
            </div>
          </div>
        </div>
      `,
		};
		const info = await mailer.sendMail(mailContent);
		return { success: info.accepted, failed: info.rejected };
	},
};
