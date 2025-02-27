// IMPORT ALL REQUIRED MODULES AND FILES
import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/ordersModel.js";
import { Order_item } from "../models/order_itemsModel.js";
import { Cart } from "../models/cartsModel.js";
import { Product } from "../models/productsModel.js";
import { sendMail } from "../services/mailer.js";
import { updateStatus } from "../validators/orderValidator.js";
import { razorpayKey, razorpaySecret } from "../config/config.js";

export const payOrder = async (req, res, next) => {
  try {
    const razorpay = new Razorpay({
      key_id: razorpayKey,
      key_secret: razorpaySecret,
    });

    const razor_order = await razorpay.orders.create({
      amount: req.total_price * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    });
    res.status(200).json({
      razor_order,
      user_id: req.user.id,
      total_price: req.total_price,
      order_items_data: req.order_items_data,
      order_list: req.order_list,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const sha = crypto.createHmac("sha256", razorpaySecret);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res
      .status(400)
      .json({ error: "Transaction failed, please try again!!" });
  }
  res.status(200).json({
    message: "Success",
    order_id: razorpay_order_id,
    payment_id: razorpay_payment_id,
  });
};

//  PLACE ORDER FUNCTION
export const placeOrder = async (req, res) => {
  const {
    user_id,
    total_price,
    order_items_data,
    order_list,
    razorpay_order_id,
    razorpay_payment_id,
  } = req.body;
  try {
    const order = await Order.create({
      user_id: user_id,
      total_price: total_price,
      status: "pending",
      razor_order_id: razorpay_order_id,
      razor_payment_id: razorpay_payment_id,
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
      orderDetails += `<li>${item.product_name} (x${item.quantity}) - ₹${item.price}</li>`;
    }

    const orderSummary = `
      <div>
        <h2>Order Summary</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <ul>
          ${orderDetails}
        </ul>
        <p><strong>Total Price:</strong> ${req.total_price}</p>
      </div>
    `;

    sendMail(
      `mananpatel1603@gmail.com`,
      `Your Order details`,
      `${orderSummary}`
    );
    console.log(req.razor_order);
    return res.status(200).json({
      message: "Order placed successfully",
      order_id: order.id,
      total_price: total_price,
      order_list: order_list,
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

    const orders = await Order.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: Order_item,
          include: [
            {
              model: Product,
            },
          ],
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

// GET ALL ORDERS FOR ADMIN
export const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Order_item,
          include: [
            {
              model: Product,
            },
          ],
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
