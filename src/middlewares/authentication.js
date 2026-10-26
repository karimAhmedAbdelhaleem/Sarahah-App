import { TOKEN_TYPES } from "../utilities/constants.js";
import { decodedToken } from "../utilities/security/tokens.js";

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new Error("authorization headers is required ", {
      cause: { status: 400 },
    });
  }
  const [prefix, token] = authorization.split(" ");

  switch (prefix) {
    case "Basic":
      const [userName, password] = Buffer.from(token, "base64")
        .toString("utf-8")
        .split(":");
      break;
    case "Bearer":
      const {user ,decodedData} = await decodedToken({ token  , tokenType:TOKEN_TYPES.ACCESS});
      if (!user) {
        throw new Error("invalid user credentials ,pls register", {
          cause: { status: 404 },
        });
      }
      req.user = user;  
      req.accessTokenData  = decodedData;
      break;      
      default:
        break;
  }

  next();
};

export const authorize = (roles)=>{
    return (req,res,next)=>{
        const userRole = req.user.role
        if(!roles.includes(userRole)){
            throw new Error("you are not authorized to get this data" , {cause:{status:403}})
        }
        next()
    }
}