const express = require("express");
const AWS = require("aws-sdk");
const crypto = require("crypto");
const util = require("util");
const { response } = require("../app");
const randomBytes = util.promisify(crypto.randomBytes);
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: process.env.AWS_S3_REGION,
});

module.exports = {
  uploadAvatarImg: async (req, res) => {
    try {
      const rawBytes = await randomBytes(16);
      const imgName = rawBytes.toString("hex");
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `images/${imgName}`,
        Body: req.file.buffer,
        ACL: "public-read",
        ContentType: req.file.mimetype,
      };
      await s3.upload(params, (err, data) => {
        if (err) {
          return res
            .status(400)
            .json({
              error: true,
              message: "there are some error while uploading!",
            });
        } else {
          return res
            .status(200)
            .json({ data: { url: data.Location } });
        }
      });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      return res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  deleteAvatarImg: async (req, res) => {
    try {
      return res.status(200).json({ ok: true });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      return res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  uploadVideo: async (req, res) => {
    try {
      const rawBytes = await randomBytes(16);
      const videoName = rawBytes.toString("hex");
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `videos/${videoName}`,
        Expires: 60,
      };
      const uploadUrl = await s3.getSignedUrlPromise("postObject", params);
      return res.status(200).json({ data: uploadUrl });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      return res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },
};
