import envConfig from "../../../config/env.config.js";
import { transporter } from "../clients/email.client.js";
import {EventEmitter } from 'node:events'

const fromEmail = envConfig.emails.user ;


export const sendEmail = async ({to ,subject , html ,attachments})=>{
    try {
  const info = await transporter.sendMail({
    from: fromEmail, // sender address
    to, // list of recipients
    subject, // subject line
    html,
    attachments:attachments || [] // HTML body
  });

} catch (err) {
  console.error("Error while sending mail:", err);
}
}

export const emailEvents = new EventEmitter();


emailEvents.on('sendemail' , ({to , subject ,html})=>{
  sendEmail({to ,subject , html})
})