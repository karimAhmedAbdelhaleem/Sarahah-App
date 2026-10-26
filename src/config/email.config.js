import envConfig from "./env.config.js";

export const emailConfig = {
    service:envConfig.emails.service,
    auth:{
        user:envConfig.emails.user,
        pass:envConfig.emails.password
    }
}

