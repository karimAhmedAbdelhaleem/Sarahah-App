
import mongoose from "mongoose";
import envConfig from "../config/env.config.js";

const DBconnection = async ()=>{
    try {
        const connection = await mongoose.connect(envConfig.DATABASE.URI);
        console.log('database established successfully')
    } catch (error) {
        console.log("error while connecting" , error)
    }
}

export default DBconnection;