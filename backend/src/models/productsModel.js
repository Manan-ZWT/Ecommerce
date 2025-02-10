// IMPORT ALL REQUIRED MODULES AND FILES
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import { Category } from "./categoriesModel.js";

// PRODUCT MODEL FOR "products" TABLE
export const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

// RELATIONSHIP
Category.hasMany(Product, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
  hooks: true,
});
Product.belongsTo(Category, { foreignKey: "category_id", onDelete: "CASCADE" });
