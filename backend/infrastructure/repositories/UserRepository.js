const { UserModel } = require("../database");

class UserRepository {
  async create(user) {
    return await UserModel.create(user);
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }
}
module.exports = UserRepository;
