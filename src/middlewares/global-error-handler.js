import envConfig from "../config/env.config.js"

const globalErrorHandler = (err,req,res,next)=>{
    res.status(err?.statusCode || 500).json({message:err.message || "internal server error" , 
        error:{
            code:err.code , 
            details:err.details
        }
    })
}

export default globalErrorHandler;