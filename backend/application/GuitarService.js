class GuitarService {
  constructor(guitarRepository) {
    this.guitarRepository = guitarRepository;
  }

  async listAll() {
    return await this.guitarRepository.findAll();
  }

  async getById(id) {
    return await this.guitarRepository.findById(id);
  }
}
module.exports = GuitarService;
