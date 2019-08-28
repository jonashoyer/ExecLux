const crypto = require('crypto')
, argon = require('argon2');

const ivLength = 16;
const projectKeyLength = 256;
const algorithm = 'aes-256-cbc';

const keySalt = "83zpN8nxTXGRWZ6r";
const hashSalt = "SD2Mt7wWxXuQucEg";

const GenrateRndBytes = length => {
    return crypto.randomBytes(length)
}

const CreateCipher = (phrase) => {
    const iv =  GenrateRndBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, phrase, iv);
    return {cipher, iv};
}

const CreateDecipher = (phrase,iv) => {
    const cipher = crypto.createDecipheriv(algorithm, phrase, iv);
    return cipher;
}

const CreateProjectCipher = (phrase) => {
    const key = GenrateRndBytes(projectKeyLength);
    const {cipher, iv} = CreateCipher(phrase);
    const buf = Buffer.concat([iv, cipher.update(key), cipher.final()]);
    return buf;
}

const DecryptProjectCipher = (cipher, phrase) => {
    const iv = cipher.slice(0,16);
    const decipher = CreateDecipher(phrase,iv);
    const buf = Buffer.concat([decipher.update(cipher.slice(16)), decipher.final()]);
    return buf;
}

const ArgonHash = key => {
    const hex = crypto.createHash('sha256').update(hashSalt+key).digest('hex');
    return argon.hash(hex);
}

const ValidateHash = (hash,argonHash) => {
    return argon.verify(argonHash,hash);
}

const _export = {
    CreateProjectCipher,
    ArgonHash,
    ValidateHash
}

module.exports = _export;