import InputValidator from "../validators/inputValidator.js";

class ParticipantMod {
  constructor() {
    this.inputValidator = new InputValidator();
    this.inviteListArray = [];
  }

  getAllParticipants = async () => {
    const response = await fetch(`/api/participant/${ROOM_ID}`);
    const result = await response.json();
    const cnt = await result.data.length;
    const participantCnt = document.querySelector("#participantCnt");
    participantCnt.textContent = cnt;
    return cnt;
  };

  getParticipantInfo = async (participantId) => {
    const response = await fetch(
      `/api/participant/${ROOM_ID}/${participantId}`
    );
    const result = await response.json();
    return result;
  };

  searchParticipant = async () => {
    const participantName = document.querySelector(
      "#searchParticipantInput"
    ).value;
    const data = {
      participantName: participantName,
    };
    this.inputValidator.searchParticipantValidator(data);
    const response = await fetch(
      `/api/participant?roomId=${ROOM_ID}&participantName=${participantName}`
    );
    const result = await response.json();
    return result;
  };

  removeParticipant = async (roomId, participantId) => {
    const deleteData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        participantId: participantId,
      }),
    };
    await fetch("/api/participant", deleteData);
    return this.getAllParticipants();
  };

  setParticipantMap = async (DOMElement) => {
    const participantInfo = await this.getParticipantInfo(
      DOMElement.participantId
    );
    await participantMap.set(DOMElement.participantId, {
      stream: DOMElement.stream,
      participantName: participantInfo.data.participantName,
      role: participantInfo.data.role,
      avatarImgUrl: participantInfo.data.avatarImgUrl,
      isMuted: participantInfo.data.isMuted,
      isStoppedVideo: participantInfo.data.isStoppedVideo,
      role: participantInfo.data.role,
    });
  };

  removeParticipantMap = async (participantId) => {
    participantMap.delete(participantId);
  };

  addParticipantList = async (partcipantId) => {
    const DOMElement = {
      participantId: partcipantId,
      participantName: participantMap.get(partcipantId).participantName,
      role: participantMap.get(partcipantId).role,
      avatarImgUrl: participantMap.get(partcipantId).avatarImgUrl,
      isMuted: participantMap.get(partcipantId).isMuted,
      isStoppedVideo: participantMap.get(partcipantId).isStoppedVideo,
      participantContainer: document.createElement("div"),
      participantAvatar: document.createElement("div"),
      participantAvatarImg: document.createElement("img"),
      participantContent: document.createElement("div"),
      participantNameTag: document.createElement("div"),
      participantRoleTag: document.createElement("div"),
      participantMediaContainer: document.createElement("div"),
      muteUnmuteContainer: document.createElement("div"),
      muteUnmute: document.createElement("i"),
      playStopVideoContainer: document.createElement("div"),
      playStopVideo: document.createElement("i"),
    };
    await this.setParticipantListAttribute(DOMElement);
    await this.setParticipantListStyle(DOMElement);
  };

  setParticipantListAttribute = (DOMElement) => {
    const participantList = document.querySelector("#participantList");
    const participantId = DOMElement.participantId;
    let participantName = DOMElement.participantName;
    const role = DOMElement.role;
    const avatarImgUrl = DOMElement.avatarImgUrl;
    const participantContainer = DOMElement.participantContainer;
    const participantAvatar = DOMElement.participantAvatar;
    const participantAvatarImg = DOMElement.participantAvatarImg;
    const participantContent = DOMElement.participantContent;
    const participantNameTag = DOMElement.participantNameTag;
    const participantRoleTag = DOMElement.participantRoleTag;
    const participantMediaContainer = DOMElement.participantMediaContainer;
    const muteUnmuteContainer = DOMElement.muteUnmuteContainer;
    const muteUnmute = DOMElement.muteUnmute;
    const playStopVideoContainer = DOMElement.playStopVideoContainer;
    const playStopVideo = DOMElement.playStopVideo;

    participantContainer.setAttribute(
      "id",
      `${participantId}ParticipantContainer`
    );
    participantContainer.setAttribute("name", "participantContainer");
    participantAvatarImg.src = avatarImgUrl;
    participantAvatar.appendChild(participantAvatarImg);
    participantContainer.appendChild(participantAvatar);
    if (participantName.length > 10) {
      participantName = `${participantName.substring(0, 10)}...`;
    }

    if (participantId === PARTICIPANT_ID) {
      participantNameTag.textContent = `${participantName}(You)`;
    } else {
      participantNameTag.textContent = participantName;
    }

    participantRoleTag.textContent = role;
    participantContent.appendChild(participantNameTag);
    participantContent.appendChild(participantRoleTag);
    participantContainer.appendChild(participantContent);

    if (participantId === PARTICIPANT_ID) {
      muteUnmute.setAttribute("id", "selfParticipantMuteUnmute");
      playStopVideo.setAttribute("id", "selfParticipantPlayStopVideo");
    } else {
      muteUnmute.setAttribute("id", `${participantId}ParticipantMuteUnmute`);
      playStopVideo.setAttribute(
        "id",
        `${participantId}ParticipantPlayStopVideo`
      );
    }
    muteUnmuteContainer.appendChild(muteUnmute);
    playStopVideoContainer.appendChild(playStopVideo);
    participantMediaContainer.appendChild(muteUnmuteContainer);
    participantMediaContainer.appendChild(playStopVideoContainer);
    participantContainer.appendChild(participantMediaContainer);
    participantList.appendChild(participantContainer);
  };

  setParticipantListStyle = (DOMElement) => {
    const isMuted = DOMElement.isMuted;
    const isStoppedVideo = DOMElement.isStoppedVideo;
    const participantContainer = DOMElement.participantContainer;
    const participantAvatar = DOMElement.participantAvatar;
    const participantAvatarImg = DOMElement.participantAvatarImg;
    const participantContent = DOMElement.participantContent;
    const participantNameTag = DOMElement.participantNameTag;
    const participantRoleTag = DOMElement.participantRoleTag;
    const participantMediaContainer = DOMElement.participantMediaContainer;
    const muteUnmuteContainer = DOMElement.muteUnmuteContainer;
    const muteUnmute = DOMElement.muteUnmute;
    const playStopVideoContainer = DOMElement.playStopVideoContainer;
    const playStopVideo = DOMElement.playStopVideo;

    participantContainer.classList.add("participant-container");
    participantAvatar.classList.add("participant-avatar");
    participantAvatarImg.classList.add("participant-avatar-img");
    participantContent.classList.add("participant-content");
    participantNameTag.classList.add("participant-name");
    participantMediaContainer.classList.add("media-container");

    participantNameTag.classList.add("participant-name");
    participantRoleTag.classList.add("participant-role");
    muteUnmuteContainer.classList.add("mute-unmute-container");
    playStopVideoContainer.classList.add("play-stop-video-container");
    muteUnmute.classList.add("fa-solid");
    playStopVideo.classList.add("fa-solid");
    muteUnmute.classList.add("mute-unmute");
    playStopVideo.classList.add("play-stop-video");

    if (isMuted) {
      muteUnmute.classList.add("fa-microphone-slash");
    } else {
      muteUnmute.classList.add("fa-microphone");
    }

    if (isStoppedVideo) {
      playStopVideo.classList.add("fa-video-slash");
    } else {
      playStopVideo.classList.add("fa-video");
    }
  };

  removeParticipantList = (participantId) => {
    const participantContainer = document.getElementById(
      `${participantId}ParticipantContainer`
    );
    participantContainer.remove();
  };

  doSearchParticipant = async () => {
    try {
      const resultData = await this.searchParticipant.data;

      if (resultData.length === 0) {
        throw "No result!";
      }
      this.displaySearchParticipant(resultData);
    } catch (e) {
      console.log(e);
      this.displaySearchNoParticipant(e);
    }
  };

  displaySearchParticipant = async (resultData) => {
    const participantContainers = document.querySelectorAll(
      '[name="participantContainer"]'
    );

    for (const participantContainer of participantContainers) {
      const participantId = participantContainer.id.replace(
        "ParticipantContainer",
        ""
      );
      if (!resultData.includes(participantId)) {
        participantContainer.classList.add("none");
      } else {
        participantContainer.classList.add("participant-list-result");
      }
    }
    document.querySelector("#closeParticpantList").classList.remove("none");
  };

  displaySearchNoParticipant = (msg) => {
    const participantContainers = document.querySelectorAll(
      '[name="participantContainer"]'
    );
    for (const participantContainer of participantContainers) {
      participantContainer.classList.add("none");
    }
    document.querySelector("#closeParticpantList").classList.remove("none");

    this.displaySearchMsg(msg);
  };

  displaySearchMsg = (msg) => {
    const searchMsg = document.querySelector("#searchMsg");
    searchMsg.textContent = msg;
    searchMsg.classList.remove("none");
  };

  cancelSearchParticipant = () => {
    const participantContainers = document.querySelectorAll(
      '[name="participantContainer"]'
    );

    for (const participantContainer of participantContainers) {
      participantContainer.classList.remove("none");
      participantContainer.classList.remove("participant-list-result");
    }

    document.querySelector("#searchMsg").classList.add("none");

    document.querySelector("#searchParticipantInput").value = "";

    document.querySelector("#closeParticpantList").classList.add("none");
  };
}

export default ParticipantMod;
