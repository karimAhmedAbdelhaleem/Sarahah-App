import envConfig from "./env.config.js"

const whiteListedOrigins = envConfig.cors.whiteListOrigins
export const corsOptions = {
    origin:(origin , callback)=>{
       if(whiteListedOrigins.includes(origin) || !origin){
        callback(null , true)
       }else{
        callback(new Error("not allowed by cors"))
       }
    }
}