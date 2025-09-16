const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/tunes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

const cartSchema = new mongoose.Schema({
  guitarId: Number,
  name: String,
  price: String,
  image: String,
  quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);

// Get all cart items
app.get("/cartpage", async (req, res) => {
  try {
    const items = await Cart.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// Add item to cart
app.post("/cartpage", async (req, res) => {
  try {
    const { guitarId, name, price, image } = req.body;

    // Check if already in cart
    let existing = await Cart.findOne({ guitarId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }

    const newItem = new Cart({ guitarId, name, price, image });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Delete item from cart
app.delete("/cartpage/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// Checkout (clear cart)
app.post("/cartpage/checkout", async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Checkout failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
