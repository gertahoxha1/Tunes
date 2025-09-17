// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Repos & Services
const { UserModel, CartModel } = require("./infrastructure/database");
const UserRepository = require("./infrastructure/repositories/UserRepository");
const CartRepository = require("./infrastructure/repositories/CartRepository");
const UserService = require("./application/UserService");
const CartService = require("./application/CartService");

// Controllers
const UserController = require("./interfaces/UserController");
const CartController = require("./interfaces/CartController");

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect("mongodb://127.0.0.1:27017/tunes")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB error:", err));

// Dependency injection
const userRepo = new UserRepository(UserModel);
const userService = new UserService(userRepo, jwt);
app.use("/users", UserController(userService));

const cartRepo = new CartRepository(CartModel);
const cartService = new CartService(cartRepo);
app.use("/cart", CartController(cartService));

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
