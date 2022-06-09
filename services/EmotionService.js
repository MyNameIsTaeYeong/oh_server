class EmotionService {
  #emotionRepository;

  constructor(emotionRepository) {
    this.#emotionRepository = emotionRepository;
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
