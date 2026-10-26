import { redisClient } from "../clients/redis-client.js";

export const set = ({ key, value ,options }) => {
  return redisClient.SET(key, value , options);
};
export const get = ({ key }) => {
  return redisClient.GET(key);
};
export const expire = ({ key, seconds }) => {
  return redisClient.EXPIRE(key, seconds);
};
export const ttl = ({ key }) => {
  return redisClient.TTL(key);
};
export const keys = ({ pattern = "*" }) => {
  return redisClient.KEYS(pattern);
};
export const hset = ({ key, field, value }) => {
  return redisClient.HSET(key, field, value);
};
export const hget = ({ key, field, value }) => {
  return redisClient.HGET(key, field, value);
};

export const incr = ({ key }) => {
  return redisClient.INCR(key);
};

export const calculateTokenTTL = (time) => {
  const currentTime = Math.floor(Date.now() / 1000);
  return time - currentTime;
};

export const blackListToken = ({ key, exp }) => {
  let ttlSeconds;
  if (exp) {
    ttlSeconds = calculateTokenTTL(exp);
  }
  if (ttlSeconds <= 0) {
    console.log("this token is expired");
    return;
  }
  return set({key , value:true , options:{EX:ttlSeconds} })
};
