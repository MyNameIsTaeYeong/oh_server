const RecordRepository = require("../../repositories/RecordRepository");

test("RecordRepository의 save()는 서브클래스에서 정의되어야 한다.", () => {
  const recordRepo = new RecordRepository();
  expect(() => recordRepo.save()).toThrow("서브클래스에서 정의되어야 합니다.");
});

test("RecordRepository의 remove()는 서브클래스에서 정의되어야 한다.", () => {
  const recordRepo = new RecordRepository();
  expect(() => recordRepo.remove()).toThrow(
    "서브클래스에서 정의되어야 합니다."
  );
});

test("RecordRepository의 findAll()는 서브클래스에서 정의되어야 한다.", () => {
  const recordRepo = new RecordRepository();
  expect(() => recordRepo.findAll()).toThrow(
    "서브클래스에서 정의되어야 합니다."
  );
});
