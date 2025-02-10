// IMPORT ALL REQUIRED MODULES AND FILES
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

// CATEGORY MODEL FOR "categories" TABLE
export const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name"],
        name: "unique_name_index",
      },
    ],
  }
);

// // RELATIONSHIP
// Category.hasMany(Product, { foreignKey: "category_id", onDelete: "CASCADE", hooks: true });
// Product.belongsTo(Category, { foreignKey: "category_id", onDelete: "CASCADE" });