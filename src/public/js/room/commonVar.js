let myStream = null;

let myScreenShareStream = null;

let cnt = 1;

let beforeCnt = 1;

let loadedCnt = 0;

let isOffcanvasOpen = false;

let isScreenSharing = false;

const socket = io("/");

const peer = new Peer(PARTICIPANT_ID);

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
  document.querySelector("#addInviteList"),
  document.querySelector("#sendEmail"),
  document.querySelector("#inviteModalCloseBtn"),
  document.querySelector("#audioBtn"),
  document.querySelector("#videoBtn"),
  document.querySelector("#screenShareBtn"),
  document.querySelector("#leaveBtn"),
  document.querySelector("#infoBtn"),
  document.querySelector("#infoCloseBtn"),
  document.querySelector("#participantBtn"),
  document.querySelector("#participantCloseBtn"),
  document.querySelector("#addParticipantBtn"),
  document.querySelector("#closeParticpantList"),
  document.querySelector("#searchParticipantBtn"),
  document.querySelector("#chatBtn"),
  document.querySelector("#chatCloseBtn"),
  document.querySelector("#sendMsgBtn"),
];

const messageInput = document.querySelector("#messageInput");

const searchParticipantInput = document.querySelector(
  "#searchParticipantInput"
);
