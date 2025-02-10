// IMPORT ALL REQUIRED MODULES AND FILES
import { User } from "../models/usersModel.js";
import {
  loginUserSchema,
  registerNewUserSchema,
} from "../validators/userValidator.js";
import { validEmail } from "../validators/smallValidators.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { secretKey } from "../config/config.js";

// SIGNUP FUCNTION
export const registerNewUser = async (req, res) => {
  try {
    let first_name = String(req.body.first_name).trim();
    let last_name = String(req.body.last_name).trim();
    let email = String(req.body.email).trim();
    let password = String(req.body.password).trim();
    let role = String(req.body.role).trim();
    try {
      await registerNewUserSchema.validate({
        first_name,
        last_name,
        email,
        password,
        role,
      });
    } catch (validationError) {
      return res.status(406).json({ error: validationError.message });
    }
    const emailExists = await validEmail(email);
    if (emailExists) {
      return res.status(403).json({
        error: `User with the same email: ${email} already exists.`,
      });
    }
    await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      role: role,
    });

    const user = await User.findOne({ where: { email: email } });
    return res.status(201).json({
      message: "You have been succesfully registered",
      data: `First name: ${user.first_name}, Last name: ${user.last_name}, Email: ${user.email}, Role: ${user.role}`,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN FUNCTION
export const userLogin = async (req, res) => {
  try {
    let email = String(req.body.email).trim();
    let password = String(req.body.password).trim();
    
    try {
      await loginUserSchema.validate({
        email,
        password,
      });
    } catch (validationError) {
      return res.status(406).json({ error: validationError.message });
    }
    const emailExists = await validEmail(email);
    if (!emailExists) {
      return res.status(404).json({
        error: `User with the email: ${email} not founded`,
        messsage: `Please register yourself to become a member`,
      });
    } else {
      const user = await User.findOne({ where: { email: email } });
      const passwordverify = bcrypt.compareSync(password, user.password);
      if (passwordverify) {
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          secretKey,
          {
            expiresIn: "4h",
          },
          {
            algorithm: "RS256",
          }
        );
        return res.status(200).json({
          message: "Succesfully login",
          token: token,
          data: `Name: ${user.first_name} ${user.last_name}, Email: ${user.email}, Role: ${user.role}`,
        });
      } else {
        return res.status(401).json({
          error: "Incorrect Password",
        });
      }
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
