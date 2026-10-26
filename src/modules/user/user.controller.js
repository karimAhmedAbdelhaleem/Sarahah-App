import { Router } from 'express';
import * as userServices from './user.service.js';
import { authenticate, authorize } from '../../middlewares/authentication.js';
import { ROLES } from '../../utilities/constants.js';
import localMulter from '../../middlewares/multer.middleware.js';
const userController = Router();

userController.get('/profile',authenticate , async (req,res,next)=>{
const result = await userServices.getProfile(req)
res.status(200).json({message:"user profile fetched successfully" , result})
})

userController.put('/updateUser' , authenticate , async (req,res,next)=>{
    const result = await userServices.updateService(req.user , req.body)
    res.status(200).json({message:"user updated successfully" , result})
})

userController.get("/getAllUsers" , authenticate , authorize(ROLES.ADMIN) , async (req,res,next)=>{
    const result = await userServices.getAllUsers()
    res.status(200).json({message:"user got successfully" , result})
})

userController.patch('/upload/profile' , authenticate ,localMulter('profile').single("profilePicture") ,  async(req,res,next)=>{
   
    const result = await userServices.uploadProfileService(req.user , req.file) 
    res.status(200).json({message:'picture updated sucessfully' , result})
})
 
userController.delete('/deleteAccount' , authenticate , async(req,res,next)=>{
    const result = await userServices.deleteAccountService(req.user)
    res.status(200).json({message:'account deleted successfully' , result})
})

export default userController;