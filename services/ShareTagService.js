const ArgumentError = require("../errors/ArgumentError");
const UnexpectedError = require("../errors/UnexpectedError");
const WriteError = require("../errors/WriteError");

class ShareTagService {
  #shareTagRepository;
  #cache;

  constructor(container) {
    this.#shareTagRepository = container.get("shareTagRepository");
    this.#cache = container.get("cache");
  }

  // shareTag id, content, userId
  async createShareTag(shareTag = {}) {
    if (!shareTag.content)
      throw new ArgumentError("shareTag content is undefined");
    if (!shareTag.userId)
      throw new ArgumentError("shareTag userId is undefined");

    return await this.#shareTagRepository.save(shareTag);
  }

  async deleteShareTag(shareTag = {}) {
    if (!shareTag.id) throw new ArgumentError("shareTag id is undefined");
    if (!shareTag.content)
      throw new ArgumentError("shareTag content is undefined");
    if (!shareTag.userId)
      throw new ArgumentError("shareTag userId is undefined");

    await this.#shareTagRepository.remove(shareTag);
  }

  async selectShareTags({ user = {}, page }) {
    // user id, email
    if (!user.id) throw new ArgumentError("user id is undefined");
    if (!page) throw new ArgumentError("page is undefined");
    return await this.#shareTagRepository.findAll({ user, page });
  }

  async selectMyShareTags(user = {}) {
    // user id, email
    if (!user.id) throw new ArgumentError("user id is undefined");
    return await this.#shareTagRepository.findByUserId(user);
  }

  async updateLikeCnt({ shareTag = {}, cnt }) {
    if (!shareTag.id) throw new ArgumentError("shareTag id is undefined");
    if (!cnt) throw new ArgumentError("cnt is undefined");

    let nextCnt;
    try {
      Number(cnt) === 1
        ? (nextCnt = await this.#cache.INCR(`shareTag:${shareTag.id}`))
        : (nextCnt = await this.#cache.DECR(`shareTag:${shareTag.id}`));
    } catch (error) {
      console.log(`REDIS ERROR : ${error}`);
      return await this.#shareTagRepository.updateLikeCnt({ shareTag, cnt });
    }

    if (Number(nextCnt) % Number(100) === Number(0)) {
      await this.#shareTagRepository.setLikeCnt({ shareTag, nextCnt });
    }
  }
}

module.exports = ShareTagService;
