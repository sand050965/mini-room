import InputValidator from "../validators/inputValidator.js";

class ParticipantMod {
  constructor() {
    this.inputValidator = new InputValidator();
    this.inviteListArray = [];
  }

  getAllParticipants = async () => {
    const response = await fetch(`/api/participant/all/${ROOM_ID}`);
    const result = await response.json();
    const cnt = await result.data.participantCnt;
    const participantCnt = document.querySelector("#participantCnt");
    if (participantCnt) {
      participantCnt.textContent = cnt;
    }
    return cnt;
  };

  getBeforeParticipants = async () => {
    const response = await fetch(
      `/api/participant/before/${ROOM_ID}?participantId=${PARTICIPANT_ID}`
    );
    const result = await response.json();
    return result.data.beforeParticipantCnt;
  };

  getParticipantInfo = async (participantId) => {
    const response = await fetch(
      `/api/participant/${ROOM_ID}?participantId=${participantId}`
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

  addParticipantList = async (DOMElement) => {
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
    const participantMuteUnmuteContainer =
      DOMElement.participantMuteUnmuteContainer;
    const participantMuteUnmute = DOMElement.participantMuteUnmute;
    const participantPlayStopVideoContainer =
      DOMElement.participantPlayStopVideoContainer;
    const participantPlayStopVideo = DOMElement.participantPlayStopVideo;

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
      participantMuteUnmute.setAttribute("id", "selfParticipantMuteUnmute");
      participantPlayStopVideo.setAttribute(
        "id",
        "selfParticipantPlayStopVideo"
      );
    } else {
      participantMuteUnmute.setAttribute(
        "id",
        `${participantId}ParticipantMuteUnmute`
      );
      participantPlayStopVideo.setAttribute(
        "id",
        `${participantId}ParticipantPlayStopVideo`
      );
    }
    participantMuteUnmuteContainer.appendChild(participantMuteUnmute);
    participantPlayStopVideoContainer.appendChild(participantPlayStopVideo);
    participantMediaContainer.appendChild(participantMuteUnmuteContainer);
    participantMediaContainer.appendChild(participantPlayStopVideoContainer);
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
    const participantMuteUnmuteContainer =
      DOMElement.participantMuteUnmuteContainer;
    const participantMuteUnmute = DOMElement.participantMuteUnmute;
    const participantPlayStopVideoContainer =
      DOMElement.participantPlayStopVideoContainer;
    const participantPlayStopVideo = DOMElement.participantPlayStopVideo;

    participantContainer.classList.add("participant-container");
    participantAvatar.classList.add("participant-avatar");
    participantAvatarImg.classList.add("participant-avatar-img");
    participantContent.classList.add("participant-content");
    participantNameTag.classList.add("participant-name");
    participantMediaContainer.classList.add("media-container");

    participantNameTag.classList.add("participant-name");
    participantRoleTag.classList.add("participant-role");
    participantMuteUnmuteContainer.classList.add("mute-unmute-container");
    participantPlayStopVideoContainer.classList.add(
      "play-stop-video-container"
    );
    participantMuteUnmute.classList.add("fa-solid");
    participantPlayStopVideo.classList.add("fa-solid");
    participantMuteUnmute.classList.add("mute-unmute");
    participantPlayStopVideo.classList.add("play-stop-video");

    if (isMuted) {
      participantMuteUnmute.classList.add("fa-microphone-slash");
    } else {
      participantMuteUnmute.classList.add("fa-microphone");
    }

    if (isStoppedVideo) {
      participantPlayStopVideo.classList.add("fa-video-slash");
    } else {
      participantPlayStopVideo.classList.add("fa-video");
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
      const result = await this.searchParticipant();
      const resultData = result.data;

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
