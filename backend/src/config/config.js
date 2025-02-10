// IMPORTING REQUIRED MODULES AND FILES
import dotenv from "dotenv";

// CONFIGURING .ENV VARIABLES AND SETTIGN UP THE DATABASE CONNECTION
dotenv.config();

export const port = process.env.D8_APP_PORT;
export const secretKey = process.env.D8_JWT_SECRET_KEY;
export const config = {
  development: {
    username: process.env.D8_DB_USER,
    password: process.env.D8_DB_PASSWORD,
    database: process.env.D8_DB_NAME,
    host: process.env.D8_DB_HOST,
    dialect: "mysql",
  },
};
