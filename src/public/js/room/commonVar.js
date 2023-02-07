let myStream = null;

let myScreenShareStream = null;

let cnt = 1;

let renderCnt = 0;

let loadedCnt = 0;

let isOffCanvasOpen = false;

let isScreenSharing = false;

const socket = io("/");

const peer = new Peer(USER_ID, {
  host: "triptaipei.online",
  port: 443,
  secure: true,
});

const peers = {};

const screenShareMap = new Map();

const infoOffcanvas = document.querySelector("#infoOffcanvas");
const BsInfoOffcanvas = new bootstrap.Offcanvas(infoOffcanvas);
const participantOffcanvas = document.querySelector("#participantOfcanvas");
const BsParticipantOffcanvas = new bootstrap.Offcanvas(participantOffcanvas);
const chatOffcanvas = document.querySelector("#chatOffcanvas");
const BsChatOffcanvas = new bootstrap.Offcanvas(chatOffcanvas);

const offCanvasArray = [infoOffcanvas, participantOffcanvas, chatOffcanvas];

const bsOffcanvasArray = [
  BsInfoOffcanvas,
  BsParticipantOffcanvas,
  BsChatOffcanvas,
];

const sideBtnIconsArray = [
  document.querySelector("#infoBtnIcon"),
  document.querySelector("#participantBtnIcon"),
  document.querySelector("#chatBtnIcon"),
];

const btnsArray = [
  document.querySelector("#audioBtn"),
  document.querySelector("#videoBtn"),
  document.querySelector("#screenShareBtn"),
  document.querySelector("#leaveBtn"),
  document.querySelector("#infoBtn"),
  document.querySelector("#participantBtn"),
  document.querySelector("#chatBtn"),
  document.querySelector("#sendMsgBtn"),
  document.querySelector("#chatCloseBtn"),
  document.querySelector("#chatCloseBtn"),
  document.querySelector("#chatCloseBtn"),
];

const messageInput = document.querySelector("#messageInput");
