// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Models
const { UserModel, CartModel, GuitarModel } = require("./infrastructure/database");

// Repositories
const UserRepository = require("./infrastructure/repositories/UserRepository");
const CartRepository = require("./infrastructure/repositories/CartRepository");
const GuitarRepository = require("./infrastructure/repositories/GuitarRepository");

// Services
const UserService = require("./application/UserService");
const CartService = require("./application/CartService");
const GuitarService = require("./application/GuitarService");

// Controllers
const UserController = require("./interfaces/UserController");
const CartController = require("./interfaces/CartController");
const GuitarController = require("./interfaces/GuitarController");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect DB
mongoose
  .connect("mongodb://127.0.0.1:27017/tunes")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB error:", err));

// ✅ Dependency injection
const userRepo = new UserRepository(UserModel);
const userService = new UserService(userRepo, jwt);

const cartRepo = new CartRepository(CartModel);
const cartService = new CartService(cartRepo);

const guitarRepo = new GuitarRepository(GuitarModel);
const guitarService = new GuitarService(guitarRepo);

// ✅ Mount routes
app.use("/users", UserController(userService));
app.use("/cart", CartController(cartService));
app.use("/guitars", GuitarController(guitarService));

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
