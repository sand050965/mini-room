import Video from "../utils/videoUtil.js";
import Participant from "../utils/participantUtil.js";
import ChatRoom from "./chatRoom.js";

class BtnsControl {
  constructor() {
    this.video = new Video();
    this.participant = new Participant();
    this.chatRoom = new ChatRoom();
    this.infoOffcanvas = document.querySelector("#infoOffcanvas");
    this.BsInfoOffcanvas = new bootstrap.Offcanvas(this.infoOffcanvas);
    this.participantOffcanvas = document.querySelector("#participantOfcanvas");
    this.BsParticipantOffcanvas = new bootstrap.Offcanvas(
      this.participantOffcanvas
    );
    this.chatOffcanvas = document.querySelector("#chatOffcanvas");
    this.BsChatOffcanvas = new bootstrap.Offcanvas(this.chatOffcanvas);

    this.offCanvasArray = [
      this.infoOffcanvas,
      this.participantOffcanvas,
      this.chatOffcanvas,
    ];

    this.bsOffcanvasArray = [
      this.BsInfoOffcanvas,
      this.BsParticipantOffcanvas,
      this.BsChatOffcanvas,
    ];

    this.sideBtnIconsArray = [
      document.querySelector("#infoBtnIcon"),
      document.querySelector("#participantBtnIcon"),
      document.querySelector("#chatBtnIcon"),
    ];
  }

  btnControl = async (e) => {
    const DOMElement = {
      type: "roomSelf",
      video: document.querySelector("#selfVideo"),
      avatarContainer: document.querySelector("#selfAvatarContainer"),
      stream: document.querySelector("#selfVideo").srcObject,
      videoBtn: document.querySelector("#videoBtn"),
      videoBtnIcon: document.querySelector("#videoBtnIcon"),
      audioBtn: document.querySelector("#audioBtn"),
      audioBtnIcon: document.querySelector("#audioBtnIcon"),
    };

    if (e.target.id.includes("audioBtn")) {
      const isMuted = await this.video.muteUnmute(DOMElement);
      this.selfAudioControl(isMuted);
    } else if (e.target.id.includes("videoBtn")) {
      const isStoppedVideo = await this.video.playStopVideo(DOMElement);
      this.selfVideoControl(isStoppedVideo);
    } else if (e.target.id.includes("shareBtn")) {
    } else if (e.target.id.includes("leaveBtn")) {
      this.leaveRoom();
    } else if (e.target.id.includes("infoBtn")) {
      const offCanvasDOMElement = {
        tagetSideBar: this.infoOffcanvas,
        tagetBsOffcanvas: this.BsInfoOffcanvas,
        btnId: e.target.id,
      };
      this.toggleOffCanvas(offCanvasDOMElement);
    } else if (e.target.id.includes("participantBtn")) {
      const offCanvasDOMElement = {
        tagetSideBar: this.participantOffcanvas,
        tagetBsOffcanvas: this.BsParticipantOffcanvas,
        btnId: e.target.id,
      };
      this.toggleOffCanvas(offCanvasDOMElement);
    } else if (e.target.id.includes("chatBtn")) {
      const offCanvasDOMElement = {
        tagetSideBar: this.chatOffcanvas,
        tagetBsOffcanvas: this.BsChatOffcanvas,
        btnId: e.target.id,
      };
      this.toggleOffCanvas(offCanvasDOMElement);
    } else if (e.target.id.includes("closeBtn")) {
      const mainContainer = document.querySelector("#mainContainer");
      mainContainer.classList.remove("main-container-grid");
    } else if (e.target.id.includes("sendMsgBtn")) {
      this.chatRoom.sendMessage();
    }
  };

  hotKeysControl = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      this.chatRoom.sendMessage();
    }
  };

  closeWindow = async (e) => {
    e.preventDefault();
    await this.participant.removeParticipant(ROOM_ID, USER_ID);
  };

  selfAudioControl = (isMuted) => {
    if (isMuted) {
      socket.emit("mute");
    } else {
      socket.emit("unmute");
    }
  };

  selfVideoControl = (isStoppedVideo) => {
    if (isStoppedVideo) {
      socket.emit("stop-video");
    } else {
      socket.emit("play-video");
    }
  };

  leaveRoom = async () => {
    await this.participant.removeParticipant(ROOM_ID, USER_ID);
    window.location = "/leave/thankyou";
  };

  toggleOffCanvas = (offCanvasDOMElement) => {
    let targetBtn;
    const tagetSideBar = offCanvasDOMElement.tagetSideBar;
    const tagetBsOffcanvas = offCanvasDOMElement.tagetBsOffcanvas;
    const btnId = offCanvasDOMElement.btnId;
    const selfVideoItemContainer = document.querySelector(
      "#selfVideoItemContainer"
    );

    if (btnId.includes("Icon")) {
      targetBtn = document.querySelector(`#${btnId}`);
    } else {
      targetBtn = document.querySelector(`#${btnId}Icon`);
    }

    const mainContainer = document.querySelector("#mainContainer");

    for (const bsOffcanvas of this.bsOffcanvasArray) {
      if (bsOffcanvas === tagetBsOffcanvas) {
        continue;
      }
      bsOffcanvas.hide();
    }

    for (const sideBtnIcon of this.sideBtnIconsArray) {
      sideBtnIcon.classList.remove("side-btn-clicked");
    }

    if (tagetSideBar.classList.contains("show")) {
      tagetBsOffcanvas.hide();
      mainContainer.classList.remove("main-container-grid");
      targetBtn.classList.remove("side-btn-clicked");
      selfVideoItemContainer.classList.remove("offcanvas-open");
    } else {
      tagetBsOffcanvas.show();
      mainContainer.classList.add("main-container-grid");
      targetBtn.classList.add("side-btn-clicked");
      if (cnt === 2) selfVideoItemContainer.classList.add("offcanvas-open");
    }
  };
}

export default BtnsControl;
