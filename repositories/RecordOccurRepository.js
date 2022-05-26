// ActivityOccur, EmotionOccur 관련 DB 접근 인터페이스
class RecordOccurRepository {
  save() {
    throw new Error("서브클래스에서 정의되어야 합니다.");
  }

  remove() {
    throw new Error("서브클래스에서 정의되어야 합니다.");
  }

  findById() {
    throw new Error("서브클래스에서 정의되어야 합니다.");
  }

  findByUserId() {
    throw new Error("서브클래스에서 정의되어야 합니다.");
  }

  findByRecordId() {
    throw new Error("서브클래스에서 정의되어야 합니다.");
  }
}

module.exports = RecordOccurRepository;
