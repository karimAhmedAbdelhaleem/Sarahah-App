import multer from 'multer'
import { fileExtentions } from '../utilities/constants.js'
import fs from 'node:fs';
const localMulter = (path)=>{

    const storage = multer.diskStorage({
        destination:function(req , file , cb){
            
            const destination =   `uploads/${path}/${file.mimetype.split('/')[0]}`;
            fs.mkdirSync(destination, { recursive: true });
            cb(null , destination)
        },filename:function(req,file ,cb){
            const suffixunique = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null , suffixunique + '.' + file.originalname)
        }
    })
    const fileFilter = function(req,file,cb){
        const [fileType , fileExtention] = file.mimetype.split('/');
        console.log(fileType , fileExtention);
        const allowedExtentions = fileExtentions[fileType];
        console.log(allowedExtentions);
        if(allowedExtentions.includes(fileExtention)){
            cb(null , true)
        }else{
            cb(new Error('this filetype is not allowed') , false);
        }
    }

    return multer({fileFilter ,storage})
}

export default localMulter;