// User 관련 DB 접근 인터페이스
class UserRepository {
  save() {
    throw new Error("서브클래스에서 정의되어야 합니다.");
  }

  remove() {
    throw new Error("서브클래스에서 정의되어야 합니다.");
  }

  findByEmail() {
    throw new Error("서브클래스에서 정의되어야 합니다.");
  }

  findById() {
    throw new Error("서브클래스에서 정의되어야 합니다.");
  }

  findAll() {
    throw new Error("서브클래스에서 정의되어야 합니다.");
  }
}

module.exports = UserRepository;
