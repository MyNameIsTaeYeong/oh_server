class UserService {
  #userRepository;

  constructor(container) {
    this.#userRepository = container.get("UserRepository");
  }

  async join(user) {
    await this.duplicateCheck(user);
    return await this.#userRepository.save(user);
  }

  async duplicateCheck(user) {
    if (await this.#userRepository.findByEmail(user)) {
      throw new Error("이미 존재하는 회원입니다.");
    }
  }

  findMembers() {}
}

module.exports = UserService;
