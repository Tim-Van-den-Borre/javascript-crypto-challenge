const libsodium = require('libsodium-wrappers');

module.exports = async(key) => { // async because awaited.

    // check if there is a key and key is not null.
    if(key == null){
        throw 'no key';
    } 

    await libsodium.ready;

    return Object.freeze({
        // decrypt.
        decrypt: (ciphertext, nonce) => { 
            
            // check for undefined arguments.
            if(ciphertext == null || nonce == null){
                throw 'either of the arguments is undefined';
            } else{
                // verify and decrypt ciphertext
                return libsodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
            }
        }
    });
}