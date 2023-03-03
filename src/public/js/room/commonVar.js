/** @format */

let myStream = null;

let myScreenShareStream = null;

let cnt = 1;

let isLoseTrack = false;

let isOffcanvasOpen = false;

let isScreenSharing = false;

const socket = io("/");

const peer = new Peer(PARTICIPANT_ID);

const peers = {};

const offcanvasMap = new Map();

const screenShareMap = new Map();

const participantMap = new Map();

const inviteListArray = [];
