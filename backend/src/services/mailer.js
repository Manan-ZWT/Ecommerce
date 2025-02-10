import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  secure: true,
  host: process.env.D8_MAIL_HOST,
  port: process.env.D8_MAIL_PORT,
  auth: {
    user: process.env.D8_MAIL_USER,
    pass: process.env.D8_MAIL_PASS,
  },
});

export const sendMail = (to, sub, msg) => {
  transporter.sendMail({
    to: to,
    sub: sub,
    html: msg,
  });
};
