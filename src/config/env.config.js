import dotenv from "dotenv";
dotenv.config({ path: [`.${process.env.NODE_ENV}.env`, ".env"] });

const envConfig = {
  DATABASE: {
    URI: process.env.MONGO_DB_CLOUD,
  },
  APP: {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
  },
  encryption: {
    SECRET_KEY: process.env.SECRET_KEY,
    IV: process.env.IV,
  },
  jwt: {
    user: {
      accessSignature: process.env.JWT_ACCESS_SECRET_USER,
      accessExpiration: process.env.JWT_ACCESS_EXP_USER,
      refreshSignature: process.env.JWT_REFRESH_SECRET_USER,
      refreshExpiration: process.env.JWT_REFRESH_EXP_USER,
    },
    admin: {
      accessSignature: process.env.JWT_ACCESS_SECRET_ADMIN,
      accessExpiration: process.env.JWT_ACCESS_EXP_ADMIN,
      refreshSignature: process.env.JWT_REFRESH_SECRET_ADMIN,
      refreshExpiration: process.env.JWT_REFRESH_EXP_ADMIN,
    },
  },cors:{
    whiteListOrigins:process.env.WHITE_LIST_ORIGINS?.split(',')
  } ,gcp:{
    webClientId:process.env.GCP_CLIENT_ID
  },redis:{
    url:process.env.REDIS_URL ||'redis://localhost:6379'
  },emails:{
    service:process.env.EMAIL_SERVICE,
    user:process.env.EMAIL_USER,
    password:process.env.EMAIL_PASS
  }
};

export default envConfig;
