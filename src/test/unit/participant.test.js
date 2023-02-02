const { connectToDB } = require("../../utils/DBUtil");
const participantService = require("../../services/participantService");

connectToDB();

test("properly delete participant from mongoDB", () => {
  expect(
    participantService.deleteParticipant({
      roomId: "ae4d53e2-0b38-4bce-badd-25b0fa18c18e",
      userId: "8dd4eb32-436b-4f48-abd0-772bc2084bb8",
    })
  );
});
