import { Router } from 'express';
import * as messageServices from './message.service.js';
const messageController = Router();

messageController.post('/send' , async (req,res,next)=>{
const result = await messageServices.sendMessageService(req.body);
res.status(201).json({message:"message created successfully" , result})
})

messageController.get('/myMessages/:id' , async (req,res,next)=>{
const result = await messageServices.getMyMessagesService(req.params.id)
res.status(200).json({message:"messages fetched successfully" , result})
})


export default messageController;