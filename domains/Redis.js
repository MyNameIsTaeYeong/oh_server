class Redis {
  #cache;
  constructor(container) {
    this.#cache = container.get("REDIS");
  }

  async setCache({ resource, id, duration, values }) {
    try {
      await this.#cache.set(`${resource}:${id}`, JSON.stringify(values), {
        EX: duration,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCache({ resource, id }) {
    try {
      return JSON.parse(await this.#cache.get(`${resource}:${id}`));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = Redis;
