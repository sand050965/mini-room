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

  getParticipantInfo = async (userId) => {
    const response = await fetch(`/api/room/${ROOM_ID}/${userId}`);
    const result = await response.json();
    return result;
  };

  removeParticipant = async (roomId, userId) => {
    const deleteData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        userId: userId,
      }),
    };
    await fetch("/api/room/participant", deleteData);
    return this.getAllParticipants();
  };
}

export default ParticipantMod;
