// IMPORTING REQUIRED MODULES AND FILES
import { Product } from "../models/productsModel.js";
import { Category } from "../models/categoriesModel.js";
import { Op } from "sequelize";
import {
  createNewProductSchema,
  updateProductSchema,
} from "../validators/productValidator.js";
import { validCategory } from "../validators/smallValidators.js";
import fs from "fs";

// ADD NEW PRODUCT FUCNTION
export const addNewProduct = async (req, res) => {
  try {
    const name = String(req.body.name).trim();
    const description = String(req.body.description).trim();
    const price = parseFloat(req.body.price);
    const stock = parseInt(req.body.stock);
    const category_id = parseInt(req.body.category_id);

    try {
      await createNewProductSchema.validate({
        name,
        description,
        price,
        stock,
        category_id,
      });
    } catch (validationError) {
      return res.status(406).json({ error: validationError.message });
    }
    try {
      const categoryExists = await validCategory(category_id);
      if (categoryExists) {
        await Product.create({
          name: name,
          description: description,
          price: price,
          stock: stock,
          category_id: category_id,
          image_url: req.file ? req.file.path : null,
        });
        return res
          .status(201)
          .json({ message: "Product has been added successfully" });
      } else {
        return res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error("Error inserting product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SHOW ALL PRODUCT FUNCTION
export const showAllProducts = async (req, res) => {
  try {
    let min_price = parseInt(req.query.min_price) || 0;
    let max_price = parseInt(req.query.max_price) || Number.MAX_VALUE;
    let category = req.query.category
      ? String(req.query.category).trim()
      : null;

    const conditions = {
      price: { [Op.between]: [min_price, max_price] },
    };

    if (category) {
      const categoryName = await Category.findOne({
        where: { name: category },
      });
      if (categoryName) {
        conditions.category_id = categoryName.id;
      } else {
        return res.status(404).json({
          message: `Category : ${category} does not exists, Please enter a valid Category`,
        });
      }
    }

    const data = await Product.findAll({
      where: conditions,
      attributes: ["id", "name", "description", "price", "stock", "image_url"],
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    if (data.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({ message: "Products:", data: data });
  } catch (error) {
    console.error("Error getting product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SHOW PRODUCT BY ID FUCNTION
export const showProductById = async (req, res) => {
  try {
    if (req.params.id) {
      const id = parseInt(req.params.id);
      if (Number.isInteger(id) || id > 0) {
        const data = await Product.findByPk(id, {
          attributes: [
            "id",
            "name",
            "description",
            "price",
            "stock",
            "image_url",
          ],
          include: [
            {
              model: Category,
              attributes: ["id", "name"],
            },
          ],
        });
        return res.status(200).json({ message: `Products: ${id}`, data: data });
      } else {
        res
          .status(400)
          .json({ error: "Bad request: Must provide a positive integer" });
      }
    } else {
      return res.status(400).json({ error: "Bad requsest: Must provide a Id" });
    }
  } catch (error) {
    console.error("Error getting product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE PRODUCT DETAILS FUCNTION
export const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, stock, category_id } = req.body;

    try {
      await updateProductSchema.validate({
        name,
        description,
        price,
        stock,
        category_id,
      });
    } catch (validationError) {
      return res.status(406).json({ error: validationError.message });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (category_id) {
      const categoryExists = await validCategory(category_id);
      if (!categoryExists) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    const updatedData = {
      ...(name && { name: name }),
      ...(description && { description: description }),
      ...(price && { price: price }),
      ...(stock && { stock: stock }),
      ...(category_id && { category_id: category_id }),
      ...(req.file ? { image_url: req.file.path } : {}),
    };

    if (req.file) {
      try {
        if (product.image_url && fs.existsSync(product.image_url)) {
          fs.unlinkSync(product.image_url);
        }
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    await Product.update(updatedData, {
      where: {
        id: id,
      },
    });

    return res
      .status(200)
      .json({ message: "Product has been updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE A PRODUCT FUCNTION
export const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    try {
      if (product.image_url && fs.existsSync(product.image_url)) {
        fs.unlinkSync(product.image_url);
      }
    } catch (err) {
      console.error("Error deleting old image:", err);
    }

    await Product.destroy({
      where: {
        id: id,
      },
    });

    return res
      .status(200)
      .json({ message: "Product has been deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
