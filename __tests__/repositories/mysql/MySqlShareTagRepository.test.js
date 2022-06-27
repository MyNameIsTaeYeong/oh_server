const ShareTag = require("../../../domains/ShareTag");
const User = require("../../../domains/User");
const ReadError = require("../../../errors/ReadError");
const UnexpectedError = require("../../../errors/UnexpectedError");
const WriteError = require("../../../errors/WriteError");
const MySqlShareTagRepository = require("../../../repositories/mysql/MySqlShareTagRepository");

const Container = require("typedi").Container;

afterEach(() => {
  Container.remove("POOL");
});

describe("MySqlShareTagRepository의 save", () => {
  test("save()는 성공하면 저장된 아이디를 반환한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => Promise.resolve([{ insertId: 1 }]),
    });
    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);

    const shareTag = new ShareTag({});
    shareTag.content = "하하하";
    shareTag.userId = 1;

    expect(await mySqlShareTagRepo.save(shareTag)).toBe(1);
  });

  test("save()는 ER_ACCESS_DENIED_ERROR 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(async () => mySqlShareTagRepo.save()).rejects.toThrowError(
      WriteError
    );
  });

  test("save()는 ECONNREFUSED 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(async () => mySqlShareTagRepo.save()).rejects.toThrowError(
      WriteError
    );
  });

  test("save()는 PROTOCOL_CONNECTION_LOST 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(async () => mySqlShareTagRepo.save()).rejects.toThrowError(
      WriteError
    );
  });

  test("save()는 그 외의 에러시 UnexpectedError 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "그 외" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(async () => mySqlShareTagRepo.save()).rejects.toThrowError(
      UnexpectedError
    );
  });
});

describe("MySqlShareTagRepository의 remove", () => {
  test("remove()는 ER_ACCESS_DENIED_ERROR 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(async () =>
      mySqlShareTagRepo.remove(new ShareTag({}))
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 ECONNREFUSED 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(async () =>
      mySqlShareTagRepo.remove(new ShareTag({}))
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 PROTOCOL_CONNECTION_LOST 에러시 WriteError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(async () =>
      mySqlShareTagRepo.remove(new ShareTag({}))
    ).rejects.toThrowError(WriteError);
  });

  test("remove()는 그 외의 에러시 UnexpectedError 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "그 외" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(async () =>
      mySqlShareTagRepo.remove(new ShareTag({}))
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlShareTagRepository의 findAll", () => {
  test("findAll()은 해당 페이지의 계시글을 반환한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([
          [
            { id: 1, content: "기쁨", userId: 1, likeCnt: 2 },
            { id: 2, content: "슬픔", userId: 1, likeCnt: 0 },
            { id: 3, content: "분노", userId: 1, likeCnt: 1 },
          ],
        ]);
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    const user = new User({});
    const page = 1;
    expect(await mySqlShareTagRepo.findAll({ user, page })).toStrictEqual([
      { id: 1, content: "기쁨", userId: 1, likeCnt: 2 },
      { id: 2, content: "슬픔", userId: 1, likeCnt: 0 },
      { id: 3, content: "분노", userId: 1, likeCnt: 1 },
    ]);
  });

  test("findAll()은 ER_ACCESS_DENIED_ERROR 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(
      async () => await mySqlShareTagRepo.findAll({ user: {}, page: 1 })
    ).rejects.toThrowError(ReadError);
  });

  test("findAll()은 ECONNREFUSED 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(
      async () => await mySqlShareTagRepo.findAll({ user: {}, page: 1 })
    ).rejects.toThrowError(ReadError);
  });

  test("findAll()은 PROTOCOL_CONNECTION_LOST 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(
      async () => await mySqlShareTagRepo.findAll({ user: {}, page: 1 })
    ).rejects.toThrowError(ReadError);
  });

  test("findAll()은 그외 에러시 UnexpectedError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "etc" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(
      async () => await mySqlShareTagRepo.findAll({ user: {}, page: 1 })
    ).rejects.toThrowError(UnexpectedError);
  });
});

describe("MySqlShareTagRepository의 findByUserId", () => {
  test("findByUserId() 유저의 계시글을 반환한다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.resolve([
          [
            { id: 1, content: "기쁨", userId: 1, likeCnt: 2 },
            { id: 2, content: "슬픔", userId: 1, likeCnt: 0 },
            { id: 3, content: "분노", userId: 1, likeCnt: 1 },
          ],
        ]);
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(await mySqlShareTagRepo.findByUserId(new User({}))).toStrictEqual([
      { id: 1, content: "기쁨", userId: 1, likeCnt: 2 },
      { id: 2, content: "슬픔", userId: 1, likeCnt: 0 },
      { id: 3, content: "분노", userId: 1, likeCnt: 1 },
    ]);
  });

  test("findByUserId()은 ER_ACCESS_DENIED_ERROR 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ER_ACCESS_DENIED_ERROR" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(
      async () => await mySqlShareTagRepo.findByUserId(new User({}))
    ).rejects.toThrowError(ReadError);
  });

  test("findByUserId()은 ECONNREFUSED 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "ECONNREFUSED" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(
      async () => await mySqlShareTagRepo.findByUserId(new User({}))
    ).rejects.toThrowError(ReadError);
  });

  test("findByUserId()은 PROTOCOL_CONNECTION_LOST 에러시 ReadError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "PROTOCOL_CONNECTION_LOST" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(
      async () => await mySqlShareTagRepo.findByUserId(new User({}))
    ).rejects.toThrowError(ReadError);
  });

  test("findByUserId()은 그외 에러시 UnexpectedError를 던진다.", async () => {
    Container.set("POOL", {
      execute: (param1, param2) => {
        return Promise.reject({ code: "etc" });
      },
    });

    const mySqlShareTagRepo = new MySqlShareTagRepository(Container);
    expect(
      async () => await mySqlShareTagRepo.findByUserId(new User({}))
    ).rejects.toThrowError(UnexpectedError);
  });
});
//   findAll() {
//     throw new Error("서브클래스에서 정의되어야 합니다.");
//   }
