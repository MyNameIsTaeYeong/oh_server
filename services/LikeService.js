const ArgumentError = require("../errors/ArgumentError");

class LikeService {
  #likeRepository;

  constructor(container) {
    this.#likeRepository = container.get("LikeRepository");
  }

  // like   userId, tagId
  async createLike(like = {}) {
    if (!like.userId) throw new ArgumentError("like.userId is not defined");
    if (!like.tagId) throw new ArgumentError("like.tagId is not defined");
    await this.#likeRepository.save(like);
  }

  async deleteLike(like) {
    if (!like.userId) throw new ArgumentError("like.userId is not defined");
    if (!like.tagId) throw new ArgumentError("like.tagId is not defined");
    await this.#likeRepository.remove(like);
  }

  async selectLikes(user) {
    if (!user.id) throw new ArgumentError("user.id is not defined");
    if (!user.email) throw new ArgumentError("user.email is not defined");
    await this.#likeRepository.findByUserId(user);
  }
}

module.exports = LikeService;
