// IMPORT ALL REQUIRED MODULES AND FILES
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import { Category } from "./categoriesModel.js";
import { User } from "./usersModel.js";
import { Product } from "./productsModel.js";

// WISHLIST MODEL FOR "wishlist" TABLE
export const Wishlist = sequelize.define(
  "Wishlist",
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: "wishlist",
    timestamps: true,
    updatedAt: false,
  }
);

// RELATIONSHIP
Wishlist.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" });
Product.hasMany(Wishlist, { foreignKey: "product_id", onDelete: "CASCADE" });

User.hasOne(Wishlist, { foreignKey: "user_id", onDelete: "CASCADE" });
Wishlist.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
