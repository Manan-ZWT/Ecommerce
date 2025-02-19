// IMPORT ALL REQUIRED MODULES AND FILES
import { Cart } from "../models/cartsModel.js";
import { Product } from "../models/productsModel.js";

export const placeOrderCheck = async (req, res, next) => {
  try {
    const user_id = parseInt(req.user.id);

    const cart_items = await Cart.findAll({ where: { user_id: user_id } });

    if (cart_items.length === 0) {
      return res.status(400).json({ message: "No items found in cart" });
    }

    let total_price = 0;
    let order_items_data = [];
    let order_list = [];

    for (let cart_data of cart_items) {
      const product_id = parseInt(cart_data.product_id);
      const product_data = await Product.findByPk(product_id);

      if (!product_data) {
        return res
          .status(404)
          .json({ message: `Product with ID: ${product_id} not found` });
      }

      const product_quantity = parseInt(cart_data.quantity);
      const product_price = parseFloat(product_data.price);
      const item_total_price = product_quantity * product_price;

      if (product_quantity > product_data.stock) {
        return res.status(409).json({
          message: `Not enough stock available for the selected item: ${product_data.name}`,
        });
      }

      total_price += item_total_price;

      order_items_data.push({
        product_id,
        quantity: product_quantity,
        price: product_price,
      });

      order_list.push({
        product_name: product_data.name,
        product_description: product_data.description,
        product_image: product_data.image_url,
        quantity: product_quantity,
        price: product_price,
      });
    }

    req.total_price = total_price;
    req.order_items_data = order_items_data;
    req.order_list = order_list;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
