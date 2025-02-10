// IMPORT ALL REQUIRED MODULES AND FILES
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import { Order } from "./ordersModel.js";
import { Product } from "./productsModel.js";

// ORDER_ITEM MODEL FOR "order_items" TABLE
export const Order_item = sequelize.define(
  "Order_item",
  {
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Order,
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    timestamps: true,
  }
);

// RELATIONSHIP
Order.hasMany(Order_item, { foreignKey: "order_id", onDelete: "CASCADE" });
Order_item.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });

Product.hasMany(Order_item, { foreignKey: "product_id", onDelete: "CASCADE" });
Order_item.belongsTo(Product, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
