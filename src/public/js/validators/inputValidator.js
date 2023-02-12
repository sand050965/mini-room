class InputValidator {
  constructor() {}

  searchParticipantValidator = (data) => {
    const participantName = data.participantName;
    const regex = /\S/;
    if (!regex.test(participantName)) {
      throw "Please type something before search!";
    }
    return true;
  };
}

export default InputValidator;
