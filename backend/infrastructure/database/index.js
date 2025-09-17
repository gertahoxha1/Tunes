// infrastructure/database/index.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const CartSchema = new mongoose.Schema({
  userId: String,
  guitarId: Number,
  name: String,
  price: String,
  image: String,
  quantity: { type: Number, default: 1 },
});

const UserModel = mongoose.model("User", UserSchema);
const CartModel = mongoose.model("Cart", CartSchema);

module.exports = { UserModel, CartModel };
