const ArgumentError = require("../errors/ArgumentError");

class ShareTagService {
  #shareTagRepository;

  constructor(container) {
    this.#shareTagRepository = container.get("shareTagRepository");
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
    if (!user.email) throw new ArgumentError("user email is undefined");
    if (!page) throw new ArgumentError("page is undefined");
    return await this.#shareTagRepository.findAll({ user, page });
  }

  async selectMyShareTags(user = {}) {
    // user id, email
    if (!user.id) throw new ArgumentError("user id is undefined");
    if (!user.email) throw new ArgumentError("user email is undefined");
    return await this.#shareTagRepository.findByUserId(user);
  }

  async updateLikeCnt({ shareTag = {}, cnt }) {
    if (!shareTag.id) throw new ArgumentError("shareTag id is undefined");
    if (!shareTag.content)
      throw new ArgumentError("shareTag content is undefined");
    if (!shareTag.userId)
      throw new ArgumentError("shareTag userId is undefined");
    if (!cnt) throw new ArgumentError("cnt is undefined");

    await this.#shareTagRepository.updateLikeCnt({ shareTag, cnt });
  }
}

module.exports = ShareTagService;
