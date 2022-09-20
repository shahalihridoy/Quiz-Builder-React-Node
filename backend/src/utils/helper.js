// create a function to generate 6 digit alphanumeric code
const alphaNumericCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

exports.generateAlphaNumericId = (idLength = 6) => {
  let result = "";
  const charLength = alphaNumericCharacters.length;

  for (let i = 0; i < idLength; i += 1) {
    result += alphaNumericCharacters.charAt(
      Math.floor(Math.random() * charLength)
    );
  }

  return result;
};
