class InputValidator {
  constructor() {}

  searchParticipantValidator = (data) => {
    const participantName = data.participantName;
    const regex = /\S/;
    if (!regex.test(participantName)) {
      throw "Search participant input value is empty or invalid!";
    }
    return true;
  };
}

export default InputValidator;
