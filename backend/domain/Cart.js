// domain/Cart.js
const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  guitarId: { type: Number, required: true },
  name: { type: String, required: true },   
  price: { type: Number, required: true },  
  image: { type: String },                  
  quantity: { type: Number, default: 1 },
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [CartItemSchema],
});

module.exports = mongoose.model("Cart", CartSchema);
