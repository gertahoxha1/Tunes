// infrastructure/repositories/GuitarRepository.js
const { GuitarModel } = require("../database");

class GuitarRepository {
  async findAll() {
    return await GuitarModel.find();
  }

  async findById(id) {
    return await GuitarModel.findOne({ id: Number(id) });
  }
}

module.exports = GuitarRepository;
