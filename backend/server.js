const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (local or Atlas)
mongoose.connect("mongodb://127.0.0.1:27017/tunes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const cartSchema = new mongoose.Schema({
  guitarId: Number,
  name: String,
  price: String,
  image: String,
  quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);

// Routes
app.get("/cart", async (req, res) => {
  const items = await Cart.find();
  res.json(items);
});

app.post("/cart", async (req, res) => {
  const { guitarId, name, price, image } = req.body;
  let existing = await Cart.findOne({ guitarId });
  if (existing) {
    existing.quantity += 1;
    await existing.save();
    return res.json(existing);
  }
  const newItem = new Cart({ guitarId, name, price, image, quantity: 1 });
  await newItem.save();
  res.json(newItem);
});

app.delete("/cart/:id", async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
