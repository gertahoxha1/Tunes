// interfaces/UserController.js
const express = require("express");

function UserController(userService) {
  const router = express.Router();

  // POST /users/signup
  router.post("/signup", async (req, res) => {
    try {
      const user = await userService.signup(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // POST /users/login
  router.post("/login", async (req, res) => {
    try {
      const result = await userService.login(req.body); // pass the whole body
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });

  return router;
}

module.exports = UserController;
