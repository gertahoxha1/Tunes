// backend/application/CartService.js
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
      (item) => item.guitarId.toString() === guitarId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ guitarId, quantity });
    }

    return await this.cartRepository.save(cart);
  }

  async removeFromCart(userId, guitarId) {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(
      (item) => item.guitarId !== Number(guitarId)
    );

    return await this.cartRepository.save(cart);
  }

  async checkout(userId) {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) throw new Error("Cart is empty");

    cart.items = [];
    return await this.cartRepository.save(cart);
  }
}

module.exports = CartService;
