import crypto from 'crypto';
import envConfig from '../../config/env.config.js';

const encKey=Buffer.from(envConfig.encryption.SECRET_KEY, 'hex');
export const encrypt = (plainText)=>{
    const IV = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', encKey, IV);
    let encrypted = cipher.update(plainText , 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return `${IV.toString('hex')}:${encrypted}`;
}

export const decrypt = (cipherText)=>{
    const [IV , encryptedData] = cipherText.split(':');
    const bufferedIV = Buffer.from(IV , 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc' , encKey ,bufferedIV);
    let decrypted = decipher.update(encryptedData , 'hex' , 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted
}