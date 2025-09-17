const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const auth = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/tunes")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Cart Schema
const cartSchema = new mongoose.Schema({
  userId: String,
  guitarId: Number,
  name: String,
  price: String,
  image: String,
  quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);

// ✅ Signup endpoint
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, "secret123", { expiresIn: "1d" });
    res.json({ user: { name, email }, token });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// ✅ Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "1d" });
    res.json({ user: { name: user.name, email }, token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Cart routes (protected with JWT middleware)
app.get("/cartpage", auth, async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.userId });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

app.post("/cartpage", auth, async (req, res) => {
  try {
    const { guitarId, name, price, image } = req.body;

    let existing = await Cart.findOne({ guitarId, userId: req.userId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }

    const newItem = new Cart({ guitarId, name, price, image, userId: req.userId });
    await newItem.save();
    res.json(newItem);
  } catch {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

app.delete("/cartpage/:id", auth, async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

app.post("/cartpage/checkout", auth, async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.userId });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Checkout failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




