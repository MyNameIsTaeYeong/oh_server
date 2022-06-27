const ArgumentError = require("../errors/ArgumentError");
const DuplicatedError = require("../errors/DuplicatedError");

class UserService {
  #userRepository;

  constructor(container) {
    this.#userRepository = container.get("UserRepository");
  }

  async join(user) {
    if (!user.email) throw new ArgumentError("user id is not defined");
    const users = await this.#userRepository.findAll();
    if (users.filter((item) => item.email === user.email).length > 0) {
      throw new DuplicatedError("이미 존재하는 회원입니다.");
    }
    return await this.#userRepository.save(user);
  }

  findMembers() {}

  async findUserUsingEmail(user) {
    if (!user.email) throw new ArgumentError("user id is not defined");

    return await this.#userRepository.findByEmail(user);
  }
}

module.exports = UserService;
