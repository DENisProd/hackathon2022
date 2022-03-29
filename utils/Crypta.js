const CryptoJS = require("crypto-js");

function aesEncrypt(text, token) {
    return CryptoJS.AES.encrypt(text, token)
}

function aesDecrypt(cipher, token) {
    let valueBytes  = CryptoJS.AES.decrypt(cipher, token)
    return valueBytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
    aesEncrypt,
    aesDecrypt
}