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
}
module.exports = CartRepository;
