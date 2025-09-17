const express = require("express");
const router = express.Router();

module.exports = (guitarService) => {
  router.get("/", async (req, res) => {
    try {
      const guitars = await guitarService.listAll();
      res.json(guitars);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const guitar = await guitarService.getById(req.params.id);
      if (!guitar) return res.status(404).json({ error: "Not found" });
      res.json(guitar);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
