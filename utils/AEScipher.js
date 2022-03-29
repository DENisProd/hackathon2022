const crypto = require('crypto')

function base64encode(str) {
    // create a buffer
    const buff = Buffer.from(str, 'utf-8');
    // decode buffer as Base64
    const base64 = buff.toString('base64');
    return base64
}

function base64decode(base64) {
    // create a buffer
    const buff = Buffer.from(base64, 'base64');
    // decode buffer as UTF-8
    const str = buff.toString('utf-8');
    return str
}

function aesEncode (message, secret) {

    const initVector = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", secret, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    //const iv = base64encode(initVector)

    return {
        encryptedData,
        initVector
    }
}

function aesDecode(text, secret, iv) {
    //const ivd = base64decode(iv)
    const decipher = crypto.createDecipheriv("aes-256-cbc", secret, iv);
    let decryptedData = decipher.update(text, "hex", "utf-8");
    decryptedData += decipher.final("utf8");

    return decryptedData
}


module.exports = {
    aesEncode,
    aesDecode,
    base64encode,
    base64decode
}