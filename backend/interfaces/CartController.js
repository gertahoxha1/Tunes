// backend/controllers/CartController.js
const express = require("express");
const auth = require("../infrastructure/middleware/auth");

module.exports = (cartService) => {
  const router = express.Router();

  // Get cart
  router.get("/", auth, async (req, res) => {
    try {
      const cart = await cartService.getCart(req.userId);
      res.json(cart || { items: [] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add to cart
  router.post("/add", auth, async (req, res) => {
    try {
      const { guitarId, quantity } = req.body;
      if (!guitarId || !quantity) {
        return res.status(400).json({ error: "Missing guitarId or quantity" });
      }

      const cart = await cartService.addToCart(req.userId, guitarId, quantity);
      res.json(cart);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Remove from cart
  router.delete("/:guitarId", auth, async (req, res) => {
    try {
      const { guitarId } = req.params;
      const cart = await cartService.removeFromCart(req.userId, guitarId);
      res.json(cart);
    } catch (err) {
      console.error("Delete cart error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Checkout
  router.post("/checkout", auth, async (req, res) => {
    try {
      await cartService.checkout(req.userId);
      res.json({ message: "Checkout successful" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
