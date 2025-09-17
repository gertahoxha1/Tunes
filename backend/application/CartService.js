class CartService {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  async getCart(userId) {
    return await this.cartRepository.findByUserId(userId);
  }

  async addToCart(userId, guitarId, quantity) {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) cart = { userId, items: [] };

    const existingItem = cart.items.find(
      (item) => item.guitarId.toString() === guitarId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ guitarId, quantity });
    }

    return await this.cartRepository.save(cart);
  }
}
module.exports = CartService;
