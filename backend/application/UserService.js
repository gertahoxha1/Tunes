// application/UserService.js
class UserService {
  constructor(userRepository, jwt) {
    this.userRepository = userRepository;
    this.jwt = jwt;
  }

  async signup({ name, email, password }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new Error("Email already exists");

    const user = await this.userRepository.create({ name, email, password });
    const token = this.jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret123", { expiresIn: "1d" });
    return { user: { name: user.name, email: user.email }, token };
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    const match = await user.comparePassword(password);
    if (!match) throw new Error("Invalid email or password");

    const token = this.jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret123", { expiresIn: "1d" });
    return { user: { name: user.name, email: user.email }, token };
  }
}
module.exports = UserService;
