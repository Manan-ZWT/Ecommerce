// IMPORT ALL REQUIRED MODULES AND FILES
import { Order } from "../models/ordersModel.js";
import { Order_item } from "../models/order_itemsModel.js";
import { Cart } from "../models/cartsModel.js";
import { Product } from "../models/productsModel.js";
import { sendMail } from "../services/mailer.js";
import { updateStatus } from "../validators/orderValidator.js";

// PLACE ORDER FUNCTION
export const placeOrder = async (req, res) => {
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
        quantity: product_quantity,
        price: product_price,
      });
    }

    const order = await Order.create({
      user_id: user_id,
      total_price: total_price,
      status: "pending",
    });

    await Order_item.bulkCreate(
      order_items_data.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }))
    );

    for (const item of order_items_data) {
      await Product.decrement(
        { stock: item.quantity },
        { where: { id: item.product_id } }
      );
    }

    await Cart.destroy({
      where: { user_id: user_id },
    });

    let orderDetails = "";
    for (let item of order_list) {
      orderDetails += `<li>${item.product_name} (x${item.quantity}) - $${item.price}</li>`;
    }

    const orderSummary = `
      <div>
        <h2>Order Summary</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <ul>
          ${orderDetails}
        </ul>
        <p><strong>Total Price:</strong> ${total_price}</p>
      </div>
    `;

    sendMail(
      // ENTER THE MAIL FROM THE USER , THIS IS FOR TESTING PURPOSE
      `mananpatel1603@gmail.com`,
      `Your Order details`,
      `${orderSummary}`
    );

    return res.status(200).json({
      message: "Order placed successfully",
      order_id: order.id,
      total_price,
      order_list,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET ORDER HISTORY FUNCTION
export const getOrderHistory = async (req, res) => {
  try {
    const user_id = parseInt(req.user.id);

    const [orders] = await Order.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: Order_item,
        },
      ],
    });
    if (orders) {
      return res.status(200).json({ message: "Order details", data: orders });
    } else {
      return res.status(404).json({ error: "No order has been placed yet" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET ORDER DETAILS BY ID FUNCTION
export const getOrderById = async (req, res) => {
  try {
    const user_id = parseInt(req.user.id);

    const id = parseInt(req.params.id);
    const order = await Order.findByPk(id, {
      where: { user_id: user_id },
      include: [
        {
          model: Order_item,
        },
      ],
    });
    if (order) {
      return res.status(200).json({ message: "Order details", data: order });
    } else {
      return res.status(404).json({ error: "No order has been placed yet" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE ORDER STATUS FUNCTION
export const updateOrderStatus = async (req, res) => {
  try {
    const status = req.body.status;
    try {
      await updateStatus.validate({
        status,
      });
    } catch (validationError) {
      return res.status(406).json({ error: validationError.message });
    }
    const id = parseInt(req.params.id);
    if (status) {
      await Order.update(
        {
          status: status,
        },
        { where: { id: id } }
      );

      const order = await Order.findByPk(id);
      return res
        .status(200)
        .json({ message: "Order status updated", data: order });
    } else {
      res
        .status(400)
        .json({ error: "Please provide a appropriate status to update" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
