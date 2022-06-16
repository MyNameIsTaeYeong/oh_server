const ArgumentError = require("../errors/ArgumentError");

class ActivityService {
  #activityRepository;

  constructor(container) {
    this.#activityRepository = container.get("ActivityRepository");
  }

  async createActivity(activity) {
    //activity id, name, userId
    if (!activity.name) throw new ArgumentError("activity name is undefined");
    if (!activity.userId)
      throw new ArgumentError("activity userId is undefined");

    return await this.#activityRepository.save(activity);
  }

  async deleteActivity(activity) {
    //activity id, name, userId
    if (!activity.id) throw new ArgumentError("activity id is undefined");
    if (!activity.name) throw new ArgumentError("activity name is undefined");
    if (!activity.userId)
      throw new ArgumentError("activity userId is undefined");

    await this.#activityRepository.remove(activity);
  }

  async selectActivities(user) {
    // user id, email
    if (!user.id) throw new ArgumentError("user id is undefined");
    if (!user.email) throw new ArgumentError("user email is undefined");
    return await this.#activityRepository.findAll(user);
  }
}

module.exports = ActivityService;
