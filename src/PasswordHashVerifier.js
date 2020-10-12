const libsodium = require('libsodium-wrappers');

module.exports = async () => { // async because awaited
    await libsodium.ready;

    return Object.freeze({
        verify: (hashedPw, pw) => {
            // store & verify password, 'crypto_pwhash_str()' does not verify the password.
            return libsodium.crypto_pwhash_str_verify(hashedPw, pw);
        }
    });
};