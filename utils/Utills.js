module.exports = function sendMessage(reply, status, message) {
    reply
        .code(status)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(message)
}

/*module.exports = function aesEncode(message) {
    let secret = require('./config').SECRET_KEY.toString()

    const initVector = require('crypto').randomBytes(16);
    const cipher = require('crypto').createCipheriv("aes-256-cbc", secret, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    const iv = base64encode(initVector)

    return {
        encryptedData,
        iv
    }
}*/