let myStream = null;

let myScreenShareStream = null;

let cnt = 1;

let renderCnt = 0;

let loadedCnt = 0;

let isOffcanvasOpen = false;

let isScreenSharing = false;

const socket = io("/");

const peer = new Peer(PARTICIPANT_ID, {
  host: "triptaipei.online",
  port: 443,
  secure: true,
});

const peers = {};

const offcanvasMap = new Map();

const screenShareMap = new Map();

const participantMap = new Map();

const BsInfoOffcanvas = new bootstrap.Offcanvas(
  document.querySelector("#infoOffcanvas")
);
const BsParticipantOffcanvas = new bootstrap.Offcanvas(
  document.querySelector("#participantOffcanvas")
);
const BsChatOffcanvas = new bootstrap.Offcanvas(
  document.querySelector("#chatOffcanvas")
);

const copyInfoBtn = document.querySelector("#copyInfoBtn");

const copyInfoBtnTooltip = new bootstrap.Tooltip(copyInfoBtn, {
  trigger: "manual",
});

new ClipboardJS("#copyInfoBtn");

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
  document.querySelector("#infoCloseBtn"),
  document.querySelector("#participantCloseBtn"),
  document.querySelector("#chatCloseBtn"),
];

const messageInput = document.querySelector("#messageInput");
