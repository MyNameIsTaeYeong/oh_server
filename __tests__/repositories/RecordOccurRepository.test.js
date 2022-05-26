const RecordOccurRepository = require("../../repositories/RecordOccurRepository");

test("RecordOccurRepository의 save()는 서브클래스에서 정의되어야 한다", () => {
  const recordOccurRepo = new RecordOccurRepository();
  expect(() => recordOccurRepo.save()).toThrow(
    "서브클래스에서 정의되어야 합니다."
  );
});

test("RecordOccurRepository의 remove()는 서브클래스에서 정의되어야 한다", () => {
  const recordOccurRepo = new RecordOccurRepository();
  expect(() => recordOccurRepo.remove()).toThrow(
    "서브클래스에서 정의되어야 합니다."
  );
});

test("RecordOccurRepository의 findById()는 서브클래스에서 정의되어야 한다", () => {
  const recordOccurRepo = new RecordOccurRepository();
  expect(() => recordOccurRepo.findById()).toThrow(
    "서브클래스에서 정의되어야 합니다."
  );
});

test("RecordOccurRepository의 findByUserId()는 서브클래스에서 정의되어야 한다", () => {
  const recordOccurRepo = new RecordOccurRepository();
  expect(() => recordOccurRepo.findByUserId()).toThrow(
    "서브클래스에서 정의되어야 합니다."
  );
});

test("RecordOccurRepository의 findByRecordId()는 서브클래스에서 정의되어야 한다", () => {
  const recordOccurRepo = new RecordOccurRepository();
  expect(() => recordOccurRepo.findByRecordId()).toThrow(
    "서브클래스에서 정의되어야 합니다."
  );
});
