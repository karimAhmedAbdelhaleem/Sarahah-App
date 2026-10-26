
import {createClient} from 'redis'
import { redisConfig } from '../../../config/redis.config.js'

export const redisClient = createClient(redisConfig)
export const redisConnection = async ()=>{
    try {
      await redisClient.connect();
      console.log('redis connected successfully');
        
    } catch (error) {
        console.log("redis connection failed" , error)
    }
}