const { UserModel } = require("../database");

class UserRepository {
  async create(user) {
    return await UserModel.create(user); // this triggers pre-save hash + methods
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async findById(id) {
    return await UserModel.findById(id);
  }
}

module.exports = UserRepository;
