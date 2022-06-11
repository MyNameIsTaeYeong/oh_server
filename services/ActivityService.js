class ActivityService {
  #activityRepository;

  constructor(container) {
    this.#activityRepository = container.get("ActivityRepository");
  }

  async createActivity(activity) {
    return await this.#activityRepository.save(activity);
  }

  async deleteActivity(activity) {
    await this.#activityRepository.remove(activity);
  }

  async selectActivities(user) {
    return await this.#activityRepository.findAll(user);
  }
}

module.exports = ActivityService;
