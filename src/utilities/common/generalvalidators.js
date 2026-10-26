import Joi from 'joi'
import { isValidObjectId } from "mongoose";

const objectId = (value , helper)=>{
    return isValidObjectId(value) ? value : helper.message("invalid object id")
}

export const generalvalidators = {
  email: Joi.string()
    .email({ tlds: { allow: ["com", "eg"] } })
    .messages({
      "string.email": "email must be some like that karim@gmail.com",
    }),
  password: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .messages({
      "string.pattern.base":
        "password must contain atleast one capital letter , one small letter , one symbol and must be consisted of atleast 8 chars",
    }),
    id:Joi.custom(objectId)
};
