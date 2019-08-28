import crypto from 'crypto';
import guid from './guid';

const ivLength = 16;
const algorithm = 'aes-256-cbc';

const GenerateIv = () => {
    return crypto.randomBytes(ivLength);
}

const CreateCipher = key => {
    const iv =  GenerateIv();
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    return {cipher, iv};
}

const CreateDecipher = (key,iv) => {
    const cipher = crypto.createDecipheriv(algorithm, key, iv);
    return cipher;
}

export const encrypt = (data,encryption) => {
    if(!encryption.useEncryption) return data;
    const {cipher,iv} = CreateCipher(encryption.key);
    const enc = Buffer.concat([iv,cipher.update(Buffer.from(data)),cipher.final()]).toString('base64');
    return enc;
}

export const decrypt = (data,encryption) => {
    if(!encryption.useEncryption) return data;
    try{
        const datBuf = Buffer.from(data,'base64');
        const iv = datBuf.slice(0,16);
        const decipher = CreateDecipher(encryption.key,iv);
        const buf = Buffer.concat([decipher.update(datBuf.slice(16)),decipher.final()]);
        return buf.toString('utf8');
    }catch{
        return data;
    }
}

const getHashGUID = () => {
    const _guid = guid();
    return crypto.createHash('sha256').update(_guid).digest();
}

export const getSavedKeys = () => {
    const d = localStorage.getItem('exec_save');
    if(!d){
        return {};
    }
    try{
        const key = getHashGUID();
        const datBuf = Buffer.from(d, 'base64');
        const iv = datBuf.slice(0,16);
        const decipher = CreateDecipher(key,iv);
        const buf = Buffer.concat([decipher.update(datBuf.slice(16)),decipher.final()]);
        return JSON.parse(buf.toString('utf8'));
    }catch{
        localStorage.removeItem('exec_save');
        return {};
    }
}

export const saveKey = (id, value) => {
    const key = getHashGUID();
    const obj = {...getSavedKeys(),[id]:value};
    const str = JSON.stringify(obj);
    const {iv, cipher} = CreateCipher(key);
    const buf = Buffer.concat([iv,cipher.update(Buffer.from(str)),cipher.final()]);
    localStorage.setItem('exec_save',buf.toString('base64'));
}

export const removeKey = id => {
    saveKey(id,undefined);
}
