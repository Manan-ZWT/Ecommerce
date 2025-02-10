// IMPORTING REQUIRED MODULES AND FILES
import { Sequelize } from "sequelize";
import { config } from "../config/config.js";

// CONFIGURING .ENV VARIABLES AND SETTIGN UP THE DATABASE CONNECTION
export const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: "mysql",
  }
);

export const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
