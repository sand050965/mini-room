let cnt = 1;

const socket = io("/");

const peer = new Peer(USER_ID, {
  host: "triptaipei.online",
  port: 443,
  secure: true,
});

const peers = {};
