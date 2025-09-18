// infrastructure/database/index.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

// infrastructure/database/index.js
const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      guitarId: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const GuitarSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
});

const UserModel = require("../../domain/User");
const CartModel = require("../../domain/Cart");
const GuitarModel = require("../../domain/Guitar");

module.exports = { UserModel, CartModel, GuitarModel };
