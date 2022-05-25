const UserRepository = require("../../repositories/UserRepository");

test("UserRepository의 save()는 서브클래스에서 정의되어야 한다.", () => {
  const userRepo = new UserRepository();
  expect(() => userRepo.save()).toThrow("서브클래스에서 정의되어야 합니다.");
});

test("UserRepository의 remove()는 서브클래스에서 정의되어야 한다.", () => {
  const userRepo = new UserRepository();
  expect(() => userRepo.remove()).toThrow("서브클래스에서 정의되어야 합니다.");
});

test("UserRepository의 find()는 서브클래스에서 정의되어야 한다.", () => {
  const userRepo = new UserRepository();
  expect(() => userRepo.findByEmail()).toThrow(
    "서브클래스에서 정의되어야 합니다."
  );
});
