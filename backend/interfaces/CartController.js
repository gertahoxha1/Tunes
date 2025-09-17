const express = require("express");
const auth = require("../infrastructure/middleware/auth");
const router = express.Router();

module.exports = (cartService) => {
  router.get("/", auth, async (req, res) => {
    try {
      const cart = await cartService.getCart(req.userId);
      res.json(cart || { items: [] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/add", auth, async (req, res) => {
    try {
      const { guitarId, quantity } = req.body;
      const cart = await cartService.addToCart(req.userId, guitarId, quantity);
      res.json(cart);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
