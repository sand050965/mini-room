class ParticipantMod {
  construcor() {}

  getAllParticipants = async () => {
    const response = await fetch(`/api/room/${ROOM_ID}`);
    const result = await response.json();
    const cnt = await result.data.length;
    const participantCnt = document.querySelector("#participantCnt");
    participantCnt.textContent = cnt;
    return cnt;
  };

  getParticipantInfo = async (participantId) => {
    const response = await fetch(`/api/room/${ROOM_ID}/${participantId}`);
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
    await fetch("/api/room/participant", deleteData);
    return this.getAllParticipants();
  };

  setParticipantMap = async (partcipantId) => {
    const participantInfo = await this.getParticipantInfo(partcipantId);
    await participantMap.set(partcipantId, {
      participantName: participantInfo.data.participantName,
      role: participantInfo.data.role,
      avatarImgURL: participantInfo.data.avatarImgUrl,
      isMuted: participantInfo.data.isMuted,
      isStoppedVideo: participantInfo.data.isStoppedVideo,
      role: participantInfo.data.role,
      avatarImgURL: participantInfo.data.avatarImgUrl,
    });
  };

  addParticipantList = (partcipantId) => {
    const DOMElement = {
      participantId: partcipantId,
      participantName: participantMap.get(partcipantId).participantName,
      role: participantMap.get(partcipantId).role,
      avatarImgURL: participantMap.get(partcipantId).avatarImgURL,
      isMute: participantMap.get(partcipantId).isMute,
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
    this.displayParticipantList(DOMElement);
  };

  displayParticipantList = (DOMElement) => {
    const participantList = document.querySelector("#participantList");
    const participantId = DOMElement.participantId;
    let participantName = DOMElement.participantName;
    const role = DOMElement.role;
    const avatarImgURL = DOMElement.avatarImgURL;
    const isMute = DOMElement.isMute;
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

    participantContainer.setAttribute(
      "id",
      `${participantId}ParticipantContainer`
    );
    participantContainer.classList.add("participant-container");
    participantAvatar.classList.add("participant-avatar");
    participantAvatarImg.classList.add("participant-avatar-img");
    participantAvatarImg.src = avatarImgURL;
    participantContent.classList.add("participant-content");
    participantNameTag.classList.add("participant-name");
    participantMediaContainer.classList.add("media-container");

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
    participantNameTag.classList.add("participant-name");
    participantRoleTag.classList.add("participant-role");
    participantRoleTag.textContent = role;
    participantContent.appendChild(participantNameTag);
    participantContent.appendChild(participantRoleTag);
    participantContainer.appendChild(participantContent);

    if (participantId === PARTICIPANT_ID) {
      muteUnmute.setAttribue("id", "selfParticipantMuteUnmute");
      playStopVideo.setAttribue("id", "selfParticipantPlayStopVideo");
    } else {
      muteUnmute.setAttribue("id", `${participantId}ParticipantMuteUnmute`);
      playStopVideo.setAttribue(
        "id",
        `${participantId}ParticipantPlayStopVideo`
      );
    }
    muteUnmuteContainer.appendChild(muteUnmute);
    playStopVideoContainer.appendChild(playStopVideo);
    muteUnmuteContainer.classList.add("mute-unmute-container");
    playStopVideoContainer.classList.add("play-stop-video-container");
    participantMediaContainer.appendChild(muteUnmuteContainer);
    participantMediaContainer.appendChild(playStopVideoContainer);
    muteUnmute.classList.add("fa-solid");
    playStopVideo.classList.add("fa-solid");
    muteUnmute.classList.add("mute-unmute");
    playStopVideo.classList.add("play-stop-video");

    if (isMute) {
      muteUnmute.classList.add("fa-microphone-slash");
    } else {
      muteUnmute.classList.add("fa-microphone");
    }

    if (isStoppedVideo) {
      playStopVideo.classList.add("fa-video-slash");
    } else {
      playStopVideo.classList.add("fa-video");
    }

    participantContainer.appendChild(participantMediaContainer);
    participantList.appendChild(participantContainer);
  };

  searchParticipant = () => {
    const participantList = document.querySelectorAll('[name="participant"]');
  };
}

export default ParticipantMod;
