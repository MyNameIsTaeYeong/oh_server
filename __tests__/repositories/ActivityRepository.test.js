const ActivityRepository = require("../../repositories/ActivityRepository");

test("ActivityRepository의 save()는 서브클래스에서 정의되어야 한다.", () => {
  const actRepo = new ActivityRepository();
  expect(() => actRepo.save()).toThrow("서브클래스에서 정의되어야 합니다.");
});

test("ActivityRepository의 remove()는 서브클래스에서 정의되어야 한다.", () => {
  const actRepo = new ActivityRepository();
  expect(() => actRepo.remove()).toThrow("서브클래스에서 정의되어야 합니다.");
});

test("ActivityRepository의 findAll()는 서브클래스에서 정의되어야 한다.", () => {
  const actRepo = new ActivityRepository();
  expect(() => actRepo.findAll()).toThrow("서브클래스에서 정의되어야 합니다.");
});
