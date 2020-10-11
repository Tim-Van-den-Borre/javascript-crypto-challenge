const libsodium = require('libsodium-wrappers');

module.exports = async() => { // async because awaited.

    await libsodium.ready;
    
    // keypair
    let keyPair = libsodium.crypto_sign_keypair(); // generates a secret key(private key) and a corresponding public key.

    let privateKey = keyPair.privateKey;
    let publicKey = keyPair.publicKey;


    return Object.freeze({
        verifyingKey: publicKey,

        sign: (msg) => {
            return libsodium.crypto_sign(msg, privateKey); // combine message & secret key(private key).
        }
    });
}