const libsodium = require("libsodium-wrappers");

module.exports = async (key) => {
  // async because awaited.

  // check if there is a key and key is not null.
  if (key == null) {
    throw "no key";
  }

  await libsodium.ready;

  return Object.freeze({
    // encrypt.
    encrypt: (msg, nonce) => {
      // check for undefined arguments.
      if (msg == null || nonce == null) {
        throw "either of the arguments is undefined";
      } else {
        // encrypt message using key
        return libsodium.crypto_secretbox_easy(msg, nonce, key);
      }
    },
  });
};
