const crypto = require('crypto');


const md5 = (text) => {
    return crypto
        .createHash('md5')
        .update(text)
        .digest();
}

const encrypt = (text, secretKey) => {
    secretKey = md5(secretKey);
    secretKey = Buffer.concat([secretKey, secretKey.slice(0, 8)]);

    const cipher = crypto.createCipheriv('des-ede3', secretKey, '');
    const encrypted = cipher.update(text, 'utf8', 'base64');

    return encrypted + cipher.final('base64');
};

const decrypt = (encryptedBase64, secretKey) => {
    secretKey = md5(secretKey);
    secretKey = Buffer.concat([secretKey, secretKey.slice(0, 8)]); 
    const decipher = crypto.createDecipheriv('des-ede3', secretKey, '');
    let decrypted = decipher.update(encryptedBase64, 'base64');
    decrypted += decipher.final();
    return decrypted;
};
module.exports = {
    md5,
    encrypt,
    decrypt
};

