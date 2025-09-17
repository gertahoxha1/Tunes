const { GuitarModel } = require("../database");

class GuitarRepository {
  async findAll() {
    return await GuitarModel.find();
  }

  async findById(id) {
    return await GuitarModel.findById(id);
  }
}
module.exports = GuitarRepository;
