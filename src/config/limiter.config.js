import { ipKeyGenerator } from "express-rate-limit"
import { tooManyRequestsException } from "../utilities/Error/exceptions.js"
import { getCountryCodeByIp } from "../utilities/countries.js"
import RedisStore from "rate-limit-redis"
import { redisClient } from "../utilities/common/clients/redis-client.js"

export const limiter = {
    windowMs: 1 * 60000 ,
    limit: 10,
    handler:(req,res,next)=>{
        throw new tooManyRequestsException('too many requests , get the hell out of here')
    },
    legacyHeaders:false,
    keyGenerator: (req) => {
        const ip = req.ip;
        return `${ipKeyGenerator(ip)}_${req.path}`;
    },
    requestPropertyName:"rate-limiter-data" ,
    store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  })
}