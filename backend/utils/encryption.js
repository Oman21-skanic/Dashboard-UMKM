const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-secret-key-must-be-32bytes-long'; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // Untuk AES, panjang iv harus 16

function encryptData(text) {
    if (!text) return text;
    // Pastikan kunci persis 32 bytes (256-bit) -> dengan cara di hash/substr
    const keyBuffer = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptData(text) {
    if (!text) return text;
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');

    const keyBuffer = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    let decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encryptData, decryptData };
