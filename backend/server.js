const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/tunes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Cart schema with userId
const cartSchema = new mongoose.Schema({
  userId: String, // <-- new field
  guitarId: Number,
  name: String,
  price: String,
  image: String,
  quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);

// ----- Middleware to simulate authentication -----
function auth(req, res, next) {
  const userId = req.headers["x-user-id"]; // frontend must send this header
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
}

// Get all cart items for the logged-in user
app.get("/cartpage", auth, async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// Add item to cart for the logged-in user
app.post("/cartpage", auth, async (req, res) => {
  try {
    const { guitarId, name, price, image } = req.body;

    // Check if already in cart for this user
    let existing = await Cart.findOne({ guitarId, userId: req.userId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }

    const newItem = new Cart({ guitarId, name, price, image, userId: req.userId });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Delete item from cart (only for this user)
app.delete("/cartpage/:id", auth, async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// Checkout (clear all items for this user)
app.post("/cartpage/checkout", auth, async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Checkout failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
