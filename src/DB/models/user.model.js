import mongoose from "mongoose";
import { CHANNELS, GENDER, PROVIDERS, ROLES, STATUS } from "../../utilities/index.js";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String ,
        required:true ,
        trim:true ,
        minLength:[3 ,"must be at least 3 chars"], 
        maxLength:[40,"must be at most 40 chars"]
    },lastName:{
        type:String,
        required:true ,
         minLength:[3 ,"must be at least 3 chars"], 
        maxLength:[40,"must be at most 40 chars"]
    },email:{
        type:String,
        required:true,
        index:{
            name:'email_idx' ,
            unique:true
        }
    },password:{
        type:String,
        required:true
    },gender:{
     type:String,
     enum:Object.values(GENDER)
    },role:{
        type:String,
        enum:Object.values(ROLES),
        default:ROLES.USER
    },status:{
      type:String,
      enum:Object.values(STATUS)
    },phone:String ,
    googleSub:{
        type:String ,
        index:{
            name:'idx_googlesub_unique',
            unique:true
        }
    },provider:{
        type:String,
        enum:Object.values(PROVIDERS),
        default:PROVIDERS.SYSTEM 
    },profilePicture:String,
    isEmailVerified:{
        type:Boolean,
        default:false
    },OTPs:[{
        value:{
            type:String,
            required:true
        },expireAt:{
            type:Date,
            default:Date.now() + 5*60*1000
        },channel:{
            type:String,
            enum:Object.values(CHANNELS)
        }
    }]
} , {
    toJSON:{getters:true},
    toObject:{getters:true},
    timestamps:true
})

userSchema.virtual('fullname').get(function(){
    return `${this.firstName} ${this.lastName}`
})

const User = mongoose.model('User',userSchema)
export default User