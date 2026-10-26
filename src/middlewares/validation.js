import { BadRequestException } from "../utilities/Error/exceptions.js";
const validation = (schema) => {
  return (req, res, next) => {
    let validationsErrors = [];
    for (const key in schema) {
      const { error } = schema[key].validate(req[key], { abortEarly: false });
      if (error) {
        validationsErrors.push(error.details.map((err) => err.message));
      }
    }
    if (validationsErrors.length) {
      throw new BadRequestException("validation error", {
        error: validationsErrors.flat(),
      });
    }
    next();
  };
};

export default validation;
