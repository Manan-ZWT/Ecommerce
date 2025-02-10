// IMPORT ALL REQUIRED MODULES AND FILES
import { Product } from "../models/productsModel.js";
import { User } from "../models/usersModel.js";
import { addToWishlist } from "../validators/wishlistValidator.js";
import { secretKey } from "../config/config.js";
import jwt from "jsonwebtoken";
import { Wishlist } from "../models/wishlist.js";

// ADD TO WISHLIST FUCNTION
export const addtoWishlist = async (req, res) => {
  let { product_id } = req.body;
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

    await addToWishlist.validate({
      product_id,
    });

    await Wishlist.create({
      user_id: user_id,
      product_id: product_id,
    });

    return res
      .status(200)
      .json({ message: "Product has been successfully added to the wishlist" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// SHOW WISHLIST ITEMS FUCNTION
export const showWishlist = async (req, res) => {
  try {
    const id = parseInt(req.user.id);

    const data = await Wishlist.findAll({
      where: {
        user_id: id,
      },
      include: [
        {
          model: Product,
          attributes: [
            "name",
            "description",
            "price",
            "stock",
            "category_id",
            "image_url",
          ],
        },
      ],
    });

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found in wishlist, Wishlist is empty" });
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

// DELETE FROM WISHLIST FUCNTION
export const deleteFromWishlist = async (req, res) => {
  try {
    const id= parseInt(req.params.id);
    const user_id = parseInt(req.user.id);

    const wishlistProduct = await Wishlist.findByPk(id);
    if (!wishlistProduct) {
      return res.status(404).json({
        message: `No entry with ID: ${id} has not been found in your wishlist`,
      });
    }

    await Wishlist.destroy({
      where: { id: id,user_id:user_id },
    });

    return res.status(200).json({
      message: "Product has been removed from the wishlist:",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
