// IMPORT ALL REQUIRED MODULES AND FILES
import { Cart } from "../models/cartsModel.js";
import { Category } from "../models/categoriesModel.js";
import { Product } from "../models/productsModel.js";
import { User } from "../models/usersModel.js";
import { addtoCart } from "../validators/cartValidators.js";

// ADD TO CART FUCNTION
export const addToCart = async (req, res) => {
  let product_id = parseInt(req.body.product_id);
  let quantity = parseInt(req.body.quantity);

  try {
    const user_id = parseInt(req.user.id);

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const data = await Product.findByPk(product_id);
    if (!data) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (data.stock < quantity) {
      return res.status(409).json({
        message: `Not enough stock available for the selected item: ${data.name}`,
      });
    }

    const itemexists = await Cart.findOne({
      where: { product_id: product_id, user_id: user_id },
    });
    if (!itemexists) {
      await addtoCart.validate({
        user_id,
        product_id,
        quantity,
      });

      await Cart.create({
        user_id: user_id,
        product_id: product_id,
        quantity: quantity,
      });

      return res
        .status(200)
        .json({ message: "Product has been successfully added to the cart" });
    } else {
      return res.status(200).json({ message: "Item is already in the cart" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCart = async (req, res) => {
  let id = parseInt(req.params.id);
  let quantity = parseInt(req.body.quantity);

  try {
    const cartItem = await Cart.findByPk(id, { attributes: ["product_id"] });
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const product_id = cartItem.product_id;

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(409).json({
        message: `Not enough stock available for the selected item: ${product.name}`,
      });
    }

    await Cart.update({ quantity }, { where: { id } });

    return res
      .status(200)
      .json({ message: "Product has been successfully updated in the cart" });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// SHOW CART ITEMS FUNCTION
export const showCart = async (req, res) => {
  try {
    const user_id = parseInt(req.user.id);

    const data = await Cart.findAll({
      where: {
        user_id: user_id,
      },
      attributes: ["id", "product_id", "quantity"],
      include: [
        {
          model: Product,
          attributes: ["name", "description", "price", "stock", "image_url"],
          include: [
            {
              model: Category,
              attributes: ["name"],
            },
          ],
        },
      ],
    });
    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found in cart, Cart is empty" });
    } else {
      return res.status(200).json({
        message: "Product data:",
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE FROM CART FUNCTION
export const deleteFromCart = async (req, res) => {
  try {
    const user_id = parseInt(req.user.id);
    const id = parseInt(req.params.id);
    const cartProduct = await Cart.findOne({
      where: {
        id: id,
        user_id: user_id,
      },
    });
    if (!cartProduct) {
      return res.status(404).json({
        error: `No entry with ID: ${id} has not been found in your cart`,
      });
    }
    await Cart.destroy({
      where: { user_id: user_id, id: id },
    });

    return res.status(200).json({
      message: "Product has been removed from the cart:",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
