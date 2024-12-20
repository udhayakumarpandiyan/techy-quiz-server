const crypto = require("crypto");

const passphrase = "#S@f3&SecreT$P@ss"; // Use a passphrase or secret phrase
const secretKey = crypto.randomBytes(32).toString('hex');
const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16); // Initialization Vector (IV)

function encryptData(data) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
    encrypted += cipher.final("hex");
    return {
        iv: iv.toString("hex"),
        encryptedData: encrypted
    };
}

module.exports = encryptData;