// IMPORT ALL REQUIRED MODULES AND FILES
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import bcrypt from "bcryptjs";

// USER MODEL FOR THE "users" TABLE
export const User = sequelize.define(
  "User",
  {
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        if (value) {
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hash);
        }
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "customer"),
      allowNull: false,
      defaultValue: "customer",
      set(value) {
        if (value) {
          this.setDataValue("role", value.toLowerCase());
        }
      },
    },
  },
  {
    tableName: "users",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "unique_email_index",
      },
    ],
  }
);
