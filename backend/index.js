// IMPORT ALL REQUIRED MODULES AND FILES
import express from "express";
import cors from "cors";
import { sequelize, dbConnect } from "./src/models/index.js";
import { port } from "./src/config/config.js";
import { User } from "./src/models/usersModel.js";
import { Product } from "./src/models/productsModel.js";
import { Category } from "./src/models/categoriesModel.js";
import { Cart } from "./src/models/cartsModel.js";
import { Order } from "./src/models/ordersModel.js";
import { Order_item } from "./src/models/order_itemsModel.js";
import { Wishlist } from "./src/models/wishlist.js";
import authRouter from "./src/routes/userAuthRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import categoryRouter from "./src/routes/categoriesRoutes.js";
import productRouter from "./src/routes/productsRouter.js";
import cartRouter from "./src/routes/cartRouter.js";
import wishlistRouter from "./src/routes/wishlistRouter.js";
import orderRouter from "./src/routes/orderRouter.js";

// CONFIGURING EXPRESS APP
const app = express();

(async () => {
  await sequelize.sync({ alter: true });
})();

// MIDDLEWARES AND ROUTES
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", orderRouter);

// MAIN END POINT
app.get("/", (req, res) => {
  console.log("User connected to the server");
  res.status(200).send(`Welcome to the Ecommerce Application!`);
});

// LISTENING PORT
app.listen(port, (err) => {
  if (err) {
    console.error("Error occurred: Server not started");
  } else {
    console.log(`Server started at port: ${port}`);
    dbConnect();
  }
});
