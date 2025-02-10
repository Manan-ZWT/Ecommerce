// IMPORT ALL REQUIRED MODULES AND FILES
import { User } from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import { validEmail } from "../validators/smallValidators.js";
import { secretKey } from "../config/config.js";
import { userUpdateSchema } from "../validators/userValidator.js";

// GET USER DETAILS FUCNTION
export const getUserProfile = async (req, res) => {
  try {
    const id = parseInt(req.user.id);

    const user = await User.findByPk(id);
    return res.status(200).json({
      message: `User data of id: ${id} has been succesfully fetched`,
      data: `Name: ${user.first_name} ${user.last_name}, Email: ${user.email}, Role: ${user.role}`,
    });
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE USER DETAILS FUCNTION
export const updateUserProfile = async (req, res) => {
  try {
    const id = parseInt(req.user.id);
    let first_name = String(req.body.first_name).trim();
    let last_name = String(req.body.last_name).trim();
    let email = String(req.body.email).trim();
    let password = String(req.body.password).trim();
    try {
      await userUpdateSchema.validate({
        first_name,
        last_name,
        email,
        password,
      });
    } catch (validationError) {
      return res.status(406).json({ error: validationError.message });
    }

    if (email) {
      const emailExists = await validEmail(email);
      if (emailExists) {
        return res.status(409).json({
          error: `User with the same email: ${email} already exists`,
          messsage: `Please add your valid email`,
        });
      }
    }
    const update_query = {
      ...(first_name && { first_name: first_name }),
      ...(last_name && { last_name: last_name }),
      ...(email && { email: email }),
      ...(password && { password: password }),
    };

    await User.update(update_query, { where: { id: id } });
    const user = await User.findByPk(id);
    return res.status(200).json({
      message: `User data of id: ${id} has been succesfully updated`,
      data: `Name: ${user.first_name} ${user.last_name}, Email: ${user.email}, Role: ${user.role}`,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL USER DETAILS FUCNTION
export const getAllUserProfile = async (req, res) => {
  try {
    const users = await User.findAll({attributes:["id","first_name","last_name","email","role"]});
    return res.status(200).json({
      message: `User data has been succesfully fetched`,
      data: users,
    });
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
