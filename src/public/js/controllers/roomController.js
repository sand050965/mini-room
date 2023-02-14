import StreamMod from "../modules/streamMod.js";
import ScreenShareMod from "../modules/screenShareMod.js";
import MainDisplayMod from "../modules/mainDisplayMod.js";
import OffcanvasMod from "../modules/offcanvasMod.js";
import RoomInfoMod from "../modules/roomInfoMod.js";
import ChatRoomMod from "../modules/chatRoomMod.js";
import ParticipantMod from "../modules/participantMod.js";
import MailMod from "../modules/mailMod.js";
import { preload } from "../modules/commonMod.js";

class RoomController {
  constructor() {
    this.streamMod = new StreamMod();
    this.screenShareMod = new ScreenShareMod();
    this.mainDisplayMod = new MainDisplayMod();
    this.offcanvasMod = new OffcanvasMod();
    this.roomInfoMod = new RoomInfoMod();
    this.chatRoomMod = new ChatRoomMod();
    this.participantMod = new ParticipantMod();
    this.mailMod = new MailMod();
  }

  init = async () => {
    try {
      myStream = await this.streamMod.getUserMediaStream();
      const videoItemContainer = document.createElement("div");
      const videoItem = document.createElement("div");
      const myVideo = document.createElement("video");
      myVideo.muted = true;
      const avatarContainer = document.createElement("div");
      const avatarContent = document.createElement("div");
      const avatar = document.createElement("div");
      const avatarImg = document.createElement("img");
      const nameTag = document.createElement("div");

      // Add Element into DOMElement Object
      const DOMElement = {
        type: "roomSelf",
        videoBtn: document.querySelector("#videoBtn"),
        videoBtnIcon: document.querySelector("#videoBtnIcon"),
        audioBtn: document.querySelector("#audioBtn"),
        audioBtnIcon: document.querySelector("#audioBtnIcon"),
        stream: myStream,
        videoItemContainer: videoItemContainer,
        videoItem: videoItem,
        video: myVideo,
        avatarContainer: avatarContainer,
        avatarContent: avatarContent,
        avatar: avatar,
        avatarImg: avatarImg,
        avatarImgUrl: AVATAR_IMG_URL,
        nameTag: nameTag,
        participantName: "You",
        participantId: PARTICIPANT_ID,
        isMuted: JSON.parse(IS_MUTED),
        isStoppedVideo: JSON.parse(IS_STOPPED_VIDEO),
      };
      this.roomInfoMod.initInfo();
      await this.participantMod.setParticipantMap(DOMElement);
      await this.participantMod.addParticipantList(PARTICIPANT_ID);
      DOMElement.participantPlayStopVideo = document.querySelector(
        "#selfParticipantPlayStopVideo"
      );
      DOMElement.participantMuteUnmute = document.querySelector(
        "#selfParticipantMuteUnmute"
      );
      await this.mainDisplayMod.addRoomStream(DOMElement);
      await this.streamMod.initMediaControl(DOMElement);
      cnt = await this.participantMod.getAllParticipants();
      preload();
    } catch (err) {
      console.log(err);
      preload();
    }
  };

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
      participantMuteUnmute: document.querySelector(
        "#selfParticipantMuteUnmute"
      ),
      participantPlayStopVideo: document.querySelector(
        "#selfParticipantPlayStopVideo"
      ),
    };
    if (e.target.id === "inviteModalCloseBtn") {
    } else if (e.target.id === "addInviteList") {
      this.mailMod.addInviteList();
    } else if (e.target.id === "sendEmail") {
    } else if (e.target.id.includes("audioBtn")) {
      // muteUnmute btn is clicked
      const isMuted = await this.streamMod.muteUnmute(DOMElement);
      this.streamMod.selfAudioControl(isMuted);
    } else if (e.target.id.includes("videoBtn")) {
      // playStop video btn is clicked
      const isStoppedVideo = await this.streamMod.playStopVideo(DOMElement);
      this.streamMod.selfVideoControl(isStoppedVideo);
    } else if (e.target.id.includes("screenShareBtn")) {
      // share screen btn is clicked
      this.screenShareMod.doMyScreenShare();
    } else if (e.target.id.includes("leaveBtn")) {
      // leave btn is clicked
      this.leaveRoom();
    } else if (e.target.id.includes("infoBtn")) {
      // info offcanvas btn is clicked
      const offcanvasDOMElement = {
        tagetBsOffcanvas: BsInfoOffcanvas,
        btnId: e.target.id.replace("Icon", ""),
      };
      this.offcanvasMod.toggleOffcanvas(offcanvasDOMElement);
    } else if (e.target.id.includes("participantBtn")) {
      // participant offcanvas btn is clicked
      const offcanvasDOMElement = {
        tagetBsOffcanvas: BsParticipantOffcanvas,
        btnId: e.target.id.replace("Icon", ""),
      };
      this.offcanvasMod.toggleOffcanvas(offcanvasDOMElement);
    } else if (e.target.id.includes("chatBtn")) {
      // chat offcanvas btn is clicked
      const offcanvasDOMElement = {
        tagetBsOffcanvas: BsChatOffcanvas,
        btnId: e.target.id.replace("Icon", ""),
      };
      this.offcanvasMod.toggleOffcanvas(offcanvasDOMElement);
    } else if (e.target.id.includes("CloseBtn")) {
      // offcanvas close btn is clicked
      const offcanvasDOMElement = {
        btnId: e.target.id.replace("Close", ""),
      };
      this.offcanvasMod.offcanvasCloseControl(offcanvasDOMElement);
      this.offcanvasMod.offcanvasCloseGrid();
    } else if (e.target.id.includes("addParticipantBtn")) {
      this.mailMod.initInviteListModal();
    } else if (e.target.id.includes("closeParticpantList")) {
      // cancel search participant
      this.participantMod.cancelSearchParticipant();
    } else if (e.target.id.includes("searchParticipantBtn")) {
      // search participant
      this.participantMod.doSearchParticipant();
    } else if (e.target.id.includes("sendMsgBtn")) {
      // send msg btn is clicked
      this.chatRoomMod.sendMessage();
    }
  };

  hotKeysControl = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      if (
        offcanvasMap.get("isOpen").includes("chat") &&
        messageInput.value.trim() !== ""
      ) {
        this.chatRoomMod.sendMessage();
      } else if (
        offcanvasMap.get("isOpen").includes("participant") &&
        searchParticipantInput.value.trim() !== ""
      ) {
        this.participantMod.searchParticipant();
      }
    }
  };

  searchInputControl = (e) => {
    const searchParticipantBtn = document.querySelector(
      "#searchParticipantBtn"
    );

    if (e.target.value === "") {
      this.participantMod.cancelSearchParticipant();
    }

    if (e.target.value.trim() === "") {
      searchParticipantBtn.classList.add("disabled");
    } else {
      searchParticipantBtn.classList.remove("disabled");
    }
  };

  closeWindow = async (e) => {
    e.preventDefault();
    if (screenShareMap.get("screenSharing") === PARTICIPANT_ID) {
      await this.screenShareMod.stopSreenShareVideo();
    }
    await this.participantMod.removeParticipant(ROOM_ID, PARTICIPANT_ID);
  };

  leaveRoom = async () => {
    if (screenShareMap.get("screenSharing") === PARTICIPANT_ID) {
      await this.screenShareMod.stopSreenShareVideo();
    }
    await this.participantMod.removeParticipant(ROOM_ID, PARTICIPANT_ID);
    window.location = "/leave/thankyou";
  };
}

export default RoomController;
