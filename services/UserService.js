const ArgumentError = require("../errors/ArgumentError");

class UserService {
  #userRepository;

  constructor(container) {
    this.#userRepository = container.get("UserRepository");
  }

  async join({ users = [], user = {} }) {
    if (!user.email) throw new ArgumentError("user id is not defined");
    this.duplicateCheck({ users, user });
    return await this.#userRepository.save(user);
  }

  duplicateCheck({ users, user }) {
    if (users.filter((item) => item.email === user.email).length > 0) {
      throw new Error("이미 존재하는 회원입니다.");
    }
  }

  findMembers() {}
}

module.exports = UserService;
