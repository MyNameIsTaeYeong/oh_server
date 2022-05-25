class ActivityService {
  #activityRepository;

  constructor(activityRepository) {
    this.#activityRepository = activityRepository;
  }

  async createActivity(activity) {
    return await this.#activityRepository.save(activity);
  }

  async deleteActivity(activity) {
    await this.#activityRepository.remove(activity);
  }
}

module.exports = ActivityService;
