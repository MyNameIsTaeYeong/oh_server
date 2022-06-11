class EmotionService {
  #emotionRepository;

  constructor(container) {
    this.#emotionRepository = container.get("EmotionRepository");
  }

  async createEmotion(emotion) {
    return await this.#emotionRepository.save(emotion);
  }

  async deleteEmotion(emotion) {
    await this.#emotionRepository.remove(emotion);
  }

  async selectEmotions(user) {
    return await this.#emotionRepository.findAll(user);
  }
}

module.exports = EmotionService;
