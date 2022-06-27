const ShareTag = require("../domains/ShareTag");
const ArgumentError = require("../errors/ArgumentError");
const WriteError = require("../errors/WriteError");

class LikeService {
  #likeRepository;
  #shareTagService;

  constructor(container) {
    this.#likeRepository = container.get("LikeRepository");
    this.#shareTagService = container.get("ShareTagService");
  }

  // like   userId, tagId
  async createLike(like = {}) {
    if (!like.userId) throw new ArgumentError("like.userId is not defined");
    if (!like.tagId) throw new ArgumentError("like.tagId is not defined");

    await this.#likeRepository.save(like);

    try {
      await this.#shareTagService.updateLikeCnt({
        shareTag: new ShareTag({ id: like.tagId }),
        cnt: 1,
      });
    } catch (error) {
      console.log("좋아요 1개 유실");
      throw error;
    }
  }

  async deleteLike(like) {
    if (!like.userId) throw new ArgumentError("like.userId is not defined");
    if (!like.tagId) throw new ArgumentError("like.tagId is not defined");

    await this.#likeRepository.remove(like);

    try {
      await this.#shareTagService.updateLikeCnt({
        shareTag: new ShareTag({ id: like.tagId }),
        cnt: -1,
      });
    } catch (error) {
      console.log("좋아요 -1개 유실");
      throw error;
    }
  }

  async selectLikes(user) {
    if (!user.id) throw new ArgumentError("user.id is not defined");

    await this.#likeRepository.findByUserId(user);
  }
}

module.exports = LikeService;
