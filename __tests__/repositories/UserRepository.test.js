const UserRepository = require("../../repositories/UserRepository");

test("UserRepository의 save()는 서브클래스에서 정의되어야 한다.", () => {
  const userRepo = new UserRepository();
  expect(() => userRepo.save()).toThrowError(
    new Error("서브클래스에서 정의되어야 합니다.")
  );
});

test("UserRepository의 remove()는 서브클래스에서 정의되어야 한다.", () => {
  const userRepo = new UserRepository();
  expect(() => userRepo.remove()).toThrowError(
    new Error("서브클래스에서 정의되어야 합니다.")
  );
});

test("UserRepository의 findByEmail()는 서브클래스에서 정의되어야 한다.", () => {
  const userRepo = new UserRepository();
  expect(() => userRepo.findByEmail()).toThrowError(
    new Error("서브클래스에서 정의되어야 합니다.")
  );
});

test("UserRepository의 findById()는 서브클래스에서 정의되어야 한다.", () => {
  const userRepo = new UserRepository();
  expect(() => userRepo.findById()).toThrowError(
    new Error("서브클래스에서 정의되어야 합니다.")
  );
});

test("UserRepository의 findAll()는 서브클래스에서 정의되어야 한다.", () => {
  const userRepo = new UserRepository();
  expect(() => userRepo.findAll()).toThrowError(
    new Error("서브클래스에서 정의되어야 합니다.")
  );
});
