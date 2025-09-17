// interfaces/UserController.js
const express = require("express");
const router = express.Router();

module.exports = (userService) => {
  router.post("/signup", async (req, res) => {
    try {
      const result = await userService.signup(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const result = await userService.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
