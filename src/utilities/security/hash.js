import argon2 from 'argon2';

export const hash = async (password) =>{
    return await argon2.hash(password);
}

export const verify = async (hashedPassword, password) => {
    return await argon2.verify(hashedPassword, password);
};
