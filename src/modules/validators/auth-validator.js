import Joi from "joi";
import { GENDER } from "../../utilities/constants.js";
import { generalvalidators } from "../../utilities/common/generalvalidators.js";




export const registerSchema = {
    body: Joi.object({
        firstName:Joi.string().alphanum().required(),
        lastName:Joi.string().required(),
        email:generalvalidators.email.required(),
        password:generalvalidators.password.required(),
        confirmPassword:Joi.string().valid(Joi.ref('password')).required().messages({"any.only":"confirm password must be the same as password"}),
        gender:Joi.string().valid(...Object.values(GENDER)).required(),
        phone:Joi.string().length(11).required(),
    }) 

}