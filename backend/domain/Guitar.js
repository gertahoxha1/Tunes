const mongoose = require("mongoose");

const GuitarSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // keep numeric id
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("Guitar", GuitarSchema);
