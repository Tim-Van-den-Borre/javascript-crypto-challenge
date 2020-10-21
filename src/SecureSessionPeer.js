const nacl = require("libsodium-wrappers");
const Encryptor = require("./Encryptor");
const Decryptor = require("./Decryptor");

module.exports = async (peer = null) => {
  // async because awaited.
  await nacl.ready;

  let keyPair, privateKey, encryptor, decryptor, instance;

  // keypair.
  keyPair = nacl.crypto_kx_keypair();

  // define private key.
  privateKey = keyPair.privateKey;

  clientKeys = function (server, client) {
    return nacl.crypto_kx_client_session_keys(
      client.publicKey,
      privateKey,
      server.publicKey
    );
  };

  serverKeys = function (server, client) {
    return nacl.crypto_kx_server_session_keys(
      server.publicKey,
      privateKey,
      client.publicKey
    );
  };

  class sessionPeer {
    // constructor
    constructor(publicKey, privateKey) {
      this.publicKey = keyPair.publicKey;
      this.privateKey;
    }

    async connectToOtherPeer(currentPeer, otherPeer) {
      if (peer) {
        let key = clientKeys(otherPeer, currentPeer);
        encryptor = await Encryptor(key.sharedTx);
        decryptor = await Decryptor(key.sharedRx);
      }

      if (!peer) {
        let key = serverKeys(currentPeer, otherPeer);
        encryptor = await Encryptor(key.sharedTx);
        decryptor = await Decryptor(key.sharedRx);
      }
    }

    // encrypt
    encrypt(msg) {
      let nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
      let ciphertext = encryptor.encrypt(msg, nonce);
      return { ciphertext, nonce };
    }

    // send
    send(peerMsg) {
      peer.message = encryptor.encrypt(peerMsg);
    }

    // receive
    receive() {
      let result = decryptor.decrypt(
        this.message.ciphertext,
        this.message.nonce
      );
      return result;
    }

    // decrypt
    decrypt(peerCiphertext, nonce) {
      decryptor.decrypt(peerCiphertext, nonce);
    }
  }

  instance = new sessionPeer();

  if (peer) {
    await instance.connectToOtherPeer(instance, peer);
    await peer.connectToOtherPeer(peer, instance);
  }

  return Object.freeze(instance);
};
