import { User } from "../models/usersModel.js";
import Chance from "chance";

const chance = new Chance();

const generateUsers = async () => {
  const users = [];

  for (let i = 0; i < 50; i++) {
    const firstName = chance.first();
    const lastName = chance.last();
    const email = chance.email();
    const password = chance.string({
      length: 8,
      pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    });
    const role = i % 2 === 0 ? "admin" : "customer";

    users.push({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role,
    });
  }

  await User.bulkCreate(users);
  console.log("50 users have been seeded!");
};

generateUsers().catch((error) => {
  console.error("Error seeding users:", error);
});
