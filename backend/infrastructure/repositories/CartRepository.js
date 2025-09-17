// infrastructure/repositories/CartRepository.js
const { CartModel } = require("../database");

class CartRepository {
  async findByUserId(userId) {
    return await CartModel.findOne({ userId });
  }

  async save(cart) {
    return await CartModel.findOneAndUpdate(
      { userId: cart.userId },
      cart,
      { upsert: true, new: true }
    );
  }

  async removeItem(userId, guitarId) {
    return await CartModel.updateOne(
      { userId },
      { $pull: { items: { guitarId } } }
    );
  }
}

module.exports = CartRepository;
