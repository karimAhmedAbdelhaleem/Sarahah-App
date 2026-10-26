import { Router } from 'express';
import { responseFormatter } from '../../middlewares/unified-response.middleware.js';
import * as authServices from './auth.service.js';
import validation from '../../middlewares/validation.js';
import { registerSchema } from '../validators/auth-validator.js';
import { authenticate } from '../../middlewares/authentication.js';
const authController = Router();

authController.post('/register' , validation(registerSchema),  responseFormatter(async (req,res)=>{
    const result = await authServices.registerService(req.body);
    return { message: "user registered successfully", data: result , meta:{statusCode:201}};
}));

authController.post('/login' , responseFormatter(async (req,res)=>{
    const userToken = await authServices.loginService(req.body);
    return { message: "user logged in successfully", data: userToken , meta:{statusCode:200}};
}));        

authController.post("/refreshToken" , responseFormatter(async(req,res)=>{
    const result = await authServices.refreshTokenService(req.headers);
    return { message: "user refreshed successfully", data: result , meta:{statusCode:200}}; 
}));

authController.post("/gmail/register" ,responseFormatter(async (req,res)=>{
    const result = await authServices.gmailRegisterService(req.body);
    return { message: "user registered successfully", data: result , meta:{statusCode:201}}; 
}));
authController.post("/gmail/login" ,responseFormatter(async (req,res)=>{
    const result = await authServices.gmailLoginService(req.body);
    return { message: "user logged in successfully", data: result , meta:{statusCode:200}};
}));

authController.post('/logout' ,authenticate , responseFormatter(
    async (req,res)=>{
        const result = await authServices.logoutService(req.accessTokenData , req.headers.refreshtoken)
        return {message:'user logged out successfully' , data:result , meta:{statusCode:200}}
    }
))

authController.put('/verify' , responseFormatter(
    async (req,res)=>{
        const result = await authServices.verifyOTPService(req.body);
        return {message:'user verified successfully' ,  data:result , meta:{statusCode:200}}
    }
));



export default authController; 